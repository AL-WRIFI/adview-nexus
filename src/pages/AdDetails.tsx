import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { AdImageGallery } from '@/components/image-gallery/AdImageGallery';
import { RelatedAdsCarousel } from '@/components/ads/related-ads-carousel';
import { CommentsList } from '@/components/comments/CommentsList';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import {
  Heart,
  Share2,
  MessageCircle,
  Phone,
  MapPin,
  Calendar,
  Eye,
  Flag,
  Star,
  Verified
} from 'lucide-react';
import {
  useAd,
  useRelatedAds,
  useComments,
  useIsFavorite,
  useAddToFavorites,
  useRemoveFromFavorites,
  useAddComment,
  useEditComment,
  useDeleteComment,
  useAddReply,
  useEditReply,
  useDeleteReply
} from '@/hooks/use-api';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

export default function AdDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const adId = parseInt(id || '0');
  
  // API hooks
  const { data: ad, isLoading: adLoading } = useAd(adId);
  const { data: relatedAds } = useRelatedAds(ad?.category_id || 0, adId);
  const { data: comments, isLoading: commentsLoading } = useComments(adId);
  const { data: isFavorited } = useIsFavorite(adId);
  const addToFavoritesMutation = useAddToFavorites();
  const removeFromFavoritesMutation = useRemoveFromFavorites();
  const addCommentMutation = useAddComment();
  const editCommentMutation = useEditComment();
  const deleteCommentMutation = useDeleteComment();
  const addReplyMutation = useAddReply();
  const editReplyMutation = useEditReply();
  const deleteReplyMutation = useDeleteReply();
  
  // Local state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (isFavorited !== undefined) {
      setIsLiked(isFavorited);
    }
  }, [isFavorited]);

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "تسجيل الدخول مطلوب",
        description: "يجب تسجيل الدخول لإضافة الإعلان للمفضلة",
        variant: "destructive"
      });
      return;
    }

    try {
      if (isLiked) {
        await removeFromFavoritesMutation.mutateAsync(adId);
        setIsLiked(false);
        toast({
          title: "تم الحذف من المفضلة",
          description: "تم حذف الإعلان من قائمة المفضلة بنجاح"
        });
      } else {
        await addToFavoritesMutation.mutateAsync(adId);
        setIsLiked(true);
        toast({
          title: "تم الإضافة للمفضلة",
          description: "تم إضافة الإعلان لقائمة المفضلة بنجاح"
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث المفضلة",
        variant: "destructive"
      });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: ad?.title || '',
        text: ad?.description || '',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "تم النسخ",
        description: "تم نسخ رابط الإعلان للحافظة"
      });
    }
  };

  const handleAddComment = async (content: string) => {
    if (!user) {
      toast({
        title: "تسجيل الدخول مطلوب",
        description: "يجب تسجيل الدخول لإضافة تعليق",
        variant: "destructive"
      });
      return;
    }

    try {
      await addCommentMutation.mutateAsync({ listingId: adId, content });
      toast({
        title: "تم إضافة التعليق",
        description: "تم إضافة تعليقك بنجاح"
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إضافة التعليق",
        variant: "destructive"
      });
    }
  };

  const handleEditComment = async (commentId: number, content: string) => {
    try {
      await editCommentMutation.mutateAsync({ listingId: adId, commentId, content });
      toast({
        title: "تم تحديث التعليق",
        description: "تم تحديث تعليقك بنجاح"
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث التعليق",
        variant: "destructive"
      });
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await deleteCommentMutation.mutateAsync({ listingId: adId, commentId });
      toast({
        title: "تم حذف التعليق",
        description: "تم حذف التعليق بنجاح"
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف التعليق",
        variant: "destructive"
      });
    }
  };

  const handleAddReply = async (commentId: number, content: string) => {
    if (!user) {
      toast({
        title: "تسجيل الدخول مطلوب",
        description: "يجب تسجيل الدخول للرد على التعليق",
        variant: "destructive"
      });
      return;
    }

    try {
      await addReplyMutation.mutateAsync({ listingId: adId, commentId, content });
      toast({
        title: "تم إضافة الرد",
        description: "تم إضافة ردك بنجاح"
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إضافة الرد",
        variant: "destructive"
      });
    }
  };

  const handleEditReply = async (commentId: number, replyId: number, content: string) => {
    try {
      await editReplyMutation.mutateAsync({ listingId: adId, commentId, replyId, content });
      toast({
        title: "تم تحديث الرد",
        description: "تم تحديث ردك بنجاح"
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث الرد",
        variant: "destructive"
      });
    }
  };

  const handleDeleteReply = async (commentId: number, replyId: number) => {
    try {
      await deleteReplyMutation.mutateAsync({ listingId: adId, commentId, replyId });
      toast({
        title: "تم حذف الرد",
        description: "تم حذف الرد بنجاح"
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف الرد",
        variant: "destructive"
      });
    }
  };

  if (adLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-48 mx-auto mb-4"></div>
              <div className="h-4 bg-muted rounded w-32 mx-auto"></div>
            </div>
          </div>
        </div>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  if (!ad) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">الإعلان غير موجود</h2>
            <Button onClick={() => navigate('/')}>
              العودة للرئيسية
            </Button>
          </div>
        </div>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  const adImages = Array.isArray(ad.images) 
    ? ad.images.map(img => typeof img === 'string' ? img : img.url || '')
    : ad.image 
      ? [typeof ad.image === 'string' ? ad.image : ad.image.image_url]
      : ['https://placehold.co/600x400'];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pb-20 md:pb-0">
        {/* Ad Images */}
        <div className="container px-4 mx-auto py-6">
          <AdImageGallery images={adImages} title={ad?.title} />
        </div>

        {/* Ad Details */}
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg p-6 border border-border">
                {/* Title and Price */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h1 className="text-2xl lg:text-3xl font-bold mb-2">{ad.title}</h1>
                    <div className="flex items-center gap-2 text-2xl font-bold text-brand">
                      {ad.price.toLocaleString()} ريال
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleLike}
                      className={isLiked ? 'text-red-500 border-red-500' : ''}
                    >
                      <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                    </Button>
                    
                    <Button variant="outline" size="icon" onClick={handleShare}>
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex gap-2 mb-6">
                  {ad.featured && (
                    <Badge variant="default" className="bg-yellow-500">
                      <Star className="w-3 h-3 ml-1" />
                      مميز
                    </Badge>
                  )}
                  {ad.condition && (
                    <Badge variant="secondary">
                      {ad.condition === 'new' ? 'جديد' : 'مستعمل'}
                    </Badge>
                  )}
                  <Badge variant="outline">{ad.category}</Badge>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">الوصف</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {ad.description}
                  </p>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{ad.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {formatDistanceToNow(new Date(ad.created_at), { 
                        addSuffix: true, 
                        locale: ar 
                      })}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span>{ad.views || 0} مشاهدة</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Heart className="h-4 w-4 text-muted-foreground" />
                    <span>{ad.favorites_count || 0} إعجاب</span>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <div className="mt-8">
                <CommentsList 
                  comments={comments || []}
                  listingId={adId}
                  isLoading={commentsLoading}
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Seller Info */}
              <div className="bg-card rounded-lg p-6 border border-border mb-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-xl font-bold">
                      {ad.user?.first_name?.[0]}{ad.user?.last_name?.[0]}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold mb-1">
                    {ad.user?.first_name} {ad.user?.last_name}
                  </h3>
                  
                  <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-4">
                    <Verified className="h-4 w-4 text-green-500" />
                    <span>عضو موثق</span>
                  </div>

                  <div className="space-y-3">
                    {!showContactInfo ? (
                      <Button 
                        className="w-full" 
                        onClick={() => setShowContactInfo(true)}
                      >
                        <Phone className="ml-2 h-4 w-4" />
                        إظهار رقم الهاتف
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2 p-3 bg-muted rounded-lg">
                          <Phone className="h-4 w-4" />
                          <span className="font-mono">{ad.phone || ad.user?.phone || '966501234567'}</span>
                        </div>
                        <Button variant="outline" className="w-full">
                          <MessageCircle className="ml-2 h-4 w-4" />
                          إرسال رسالة
                        </Button>
                      </div>
                    )}

                    <Button variant="outline" size="sm" className="w-full">
                      <Flag className="ml-2 h-4 w-4" />
                      الإبلاغ عن الإعلان
                    </Button>
                  </div>
                </div>
              </div>

              {/* Safety Tips */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="font-semibold text-amber-800 mb-2">نصائح للأمان</h4>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• قابل البائع في مكان عام</li>
                  <li>• تأكد من المنتج قبل الدفع</li>
                  <li>• لا تشارك معلوماتك المالية</li>
                  <li>• احذر من العروض المشبوهة</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Related Ads */}
          {relatedAds && relatedAds.length > 0 && (
            <div className="mt-12">
              <RelatedAdsCarousel ads={relatedAds} />
            </div>
          )}
        </div>
      </main>
      
      <Footer />
      <MobileNav />
    </div>
  );
}
