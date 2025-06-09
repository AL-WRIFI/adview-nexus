
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { AdImageGallery } from '@/components/image-gallery/AdImageGallery';
import { RelatedAndSuggestedAds } from '@/components/ads/RelatedAndSuggestedAds';
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
  const { data: ad, isLoading: adLoading, error: adError } = useAd(id || '');
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

  // Show loading skeleton while data is being fetched
  if (adLoading) {
    return (
      <PageLayout showSkeleton={true} isLoading={true}>
        <div className="container mx-auto px-4 py-6">
          <div className="animate-pulse space-y-6">
            {/* Image Skeleton */}
            <div className="aspect-video bg-muted rounded-lg"></div>
            
            {/* Title and Price Skeleton */}
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded w-2/3"></div>
              <div className="h-6 bg-muted rounded w-1/4"></div>
            </div>
            
            {/* Details Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-32 bg-muted rounded"></div>
                <div className="h-20 bg-muted rounded"></div>
              </div>
              <div className="space-y-4">
                <div className="h-40 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (adError || !ad) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">الإعلان غير موجود</h2>
            <Button onClick={() => navigate('/')}>
              العودة للرئيسية
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  const adImages = Array.isArray(ad.images) 
    ? ad.images.map(img => typeof img === 'string' ? img : img.url || '')
    : ad.image 
      ? [typeof ad.image === 'string' ? ad.image : ad.image.image_url]
      : ['https://placehold.co/600x400'];

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Ad Images */}
        <AdImageGallery images={adImages} title={ad?.title} />

        {/* Ad Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
              {/* Title and Price */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <h1 className="text-2xl lg:text-3xl font-bold mb-3 text-foreground">{ad.title}</h1>
                  <div className="flex items-center gap-2 text-3xl font-bold text-brand">
                    {ad.price.toLocaleString()} ريال
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleLike}
                    className={`${isLiked ? 'text-red-500 border-red-500 bg-red-50' : ''} hover:scale-105 transition-transform`}
                  >
                    <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handleShare}
                    className="hover:scale-105 transition-transform"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Badges */}
              <div className="flex gap-2 mb-6 flex-wrap">
                {ad.featured && (
                  <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600">
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
                <h3 className="text-lg font-semibold mb-3 text-foreground">الوصف</h3>
                <p className="text-muted-foreground leading-relaxed text-base">
                  {ad.description}
                </p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{ad.location}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">
                    {formatDistanceToNow(new Date(ad.created_at), { 
                      addSuffix: true, 
                      locale: ar 
                    })}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{ad.views || ad.views_count || ad.viewCount || 0} مشاهدة</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Heart className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{ad.favorites_count || 0} إعجاب</span>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <CommentsList 
              comments={comments || []}
              listingId={adId}
              isLoading={commentsLoading}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Seller Info */}
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm mb-6 sticky top-24">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-brand to-brand/80 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-white">
                    {ad.user?.first_name?.[0]}{ad.user?.last_name?.[0]}
                  </span>
                </div>
                
                <h3 className="font-bold text-lg mb-1 text-foreground">
                  {ad.user?.first_name} {ad.user?.last_name}
                </h3>
                
                <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-6">
                  <Verified className="h-4 w-4 text-green-500" />
                  <span>عضو موثق</span>
                </div>

                <div className="space-y-3">
                  {!showContactInfo ? (
                    <Button 
                      className="w-full bg-gradient-to-r from-brand to-brand/90 hover:from-brand/90 hover:to-brand shadow-lg" 
                      onClick={() => setShowContactInfo(true)}
                    >
                      <Phone className="ml-2 h-4 w-4" />
                      إظهار رقم الهاتف
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-2 p-3 bg-muted rounded-lg border">
                        <Phone className="h-4 w-4 text-brand" />
                        <span className="font-mono font-semibold">{ad.phone || ad.user?.phone || '966501234567'}</span>
                      </div>
                      <Button variant="outline" className="w-full border-brand text-brand hover:bg-brand hover:text-white">
                        <MessageCircle className="ml-2 h-4 w-4" />
                        إرسال رسالة
                      </Button>
                    </div>
                  )}

                  <Button variant="outline" size="sm" className="w-full text-muted-foreground hover:text-red-600 hover:border-red-600">
                    <Flag className="ml-2 h-4 w-4" />
                    الإبلاغ عن الإعلان
                  </Button>
                </div>
              </div>
            </div>

            {/* Safety Tips */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
              <h4 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                <Flag className="h-4 w-4" />
                نصائح للأمان
              </h4>
              <ul className="text-sm text-amber-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600">•</span>
                  <span>قابل البائع في مكان عام</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600">•</span>
                  <span>تأكد من المنتج قبل الدفع</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600">•</span>
                  <span>لا تشارك معلوماتك المالية</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600">•</span>
                  <span>احذر من العروض المشبوهة</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related and Suggested Ads */}
        <RelatedAndSuggestedAds 
          categoryId={ad.category_id} 
          excludeId={ad.id}
          currentAd={ad}
        />
      </div>
    </PageLayout>
  );
}
