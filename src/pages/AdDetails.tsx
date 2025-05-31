
import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, Eye, MessageSquare, Phone, Heart, Share, Flag, 
  Star, Loader2, User
} from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdImageGallery } from '@/components/image-gallery/AdImageGallery';
import { CommentsList } from '@/components/comments/CommentsList';
import { RelatedAdsCarousel } from '@/components/ads/related-ads-carousel';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { 
  useListing, 
  useRelatedListings, 
  useAddComment, 
  useIsFavorite, 
  useAddToFavorites, 
  useRemoveFromFavorites, 
  useAddReply,
  useDeleteComment,
  useEditComment,
  useDeleteReply,
  useEditReply
} from '@/hooks/use-api';
import { useAuth } from '@/context/auth-context';
import { toast } from '@/hooks/use-toast';
import { Comment } from '@/types';

export default function AdDetails() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('comments');
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();
  
  const { isAuthenticated, user } = useAuth();
  
  const numId = id ? parseInt(id, 10) : 0;
  
  // API hooks
  const { data: ad, isLoading, error } = useListing(numId);
  const { data: isFavoriteResponse } = useIsFavorite(numId);
  const { data: relatedAdsResponse } = useRelatedListings(numId);
  
  const addCommentMutation = useAddComment(numId);
  const addReplyMutation = useAddReply(numId, 0);
  const deleteCommentMutation = useDeleteComment(numId, 0);
  const editCommentMutation = useEditComment(numId);
  const deleteReplyMutation = useDeleteReply(numId);
  const editReplyMutation = useEditReply(numId);
  const addToFavorites = useAddToFavorites();
  const removeFromFavorites = useRemoveFromFavorites();
  
  useEffect(() => {
    if (isFavoriteResponse !== undefined) {
      setIsFavorite(isFavoriteResponse);
    }
  }, [isFavoriteResponse]);

  const handleFavoriteToggle = () => {
    if (!isAuthenticated) {
      toast({
        title: "تسجيل الدخول مطلوب",
        description: "يجب عليك تسجيل الدخول لإضافة للمفضلة",
        variant: "destructive"
      });
      navigate('/auth/login', { state: { from: `/ad/${id}` } });
      return;
    }
    
    if (isFavorite) {
      removeFromFavorites.mutate(numId);
    } else {
      addToFavorites.mutate(numId);
    }
    setIsFavorite(!isFavorite);
  };

  // Comment handlers
  const handleAddComment = (text: string) => {
    if (!isAuthenticated) {
      toast({
        title: "تسجيل الدخول مطلوب",
        description: "يجب عليك تسجيل الدخول لإضافة تعليق",
        variant: "destructive"
      });
      navigate('/auth/login', { state: { from: `/ad/${id}` } });
      return;
    }
    
    if (text.trim() && numId) {
      addCommentMutation.mutate(text);
    }
  };
  
  const handleAddReply = (commentId: number, text: string) => {
    if (!isAuthenticated) {
      toast({
        title: "تسجيل الدخول مطلوب",
        description: "يجب عليك تسجيل الدخول للرد على التعليق",
        variant: "destructive"
      });
      navigate('/auth/login', { state: { from: `/ad/${id}` } });
      return;
    }
    
    if (text.trim()) {
      addReplyMutation.mutate(text);
    }
  };
  
  const handleDeleteComment = (commentId: number) => {
    deleteCommentMutation.mutate();
  };
  
  const handleEditComment = (commentId: number, text: string) => {
    editCommentMutation.mutate({ commentId, content: text });
  };
  
  const handleDeleteReply = (commentId: number, replyId: number) => {
    deleteReplyMutation.mutate({ commentId, replyId });
  };
  
  const handleEditReply = (commentId: number, replyId: number, text: string) => {
    editReplyMutation.mutate({ commentId, replyId, content: text });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pb-20 md:pb-0">
          <div className="container px-4 mx-auto py-6">
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          </div>
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  if (error || !ad) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pb-20 md:pb-0">
          <div className="container px-4 mx-auto py-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">الإعلان غير موجود</h1>
              <p className="text-muted-foreground mb-4">الإعلان الذي تبحث عنه غير متوفر</p>
              <Button asChild>
                <Link to="/">العودة للرئيسية</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  const timeAgo = formatDistanceToNow(new Date(ad.created_at), { 
    addSuffix: true,
    locale: ar
  });

  // Handle image URL extraction
  const getImageUrl = (image: any) => {
    if (image && typeof image === 'object' && 'image_url' in image) {
      return image.image_url;
    }
    return typeof image === 'string' ? image : null;
  };

  const imageUrl = getImageUrl(ad.image);
  const images = ad.images?.map(img => 
    typeof img === 'object' && 'url' in img ? img.url : 
    typeof img === 'string' ? img : null
  ).filter(Boolean) || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pb-20 md:pb-0">
        <div className="container px-4 mx-auto py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2">
              {/* Image gallery */}
              <div className="mb-6">
                <AdImageGallery 
                  images={images.length > 0 ? images : (imageUrl ? [imageUrl] : [])}
                  alt={ad.title}
                />
              </div>

              {/* Ad details */}
              <div className="bg-white dark:bg-dark-card rounded-lg border border-border dark:border-dark-border p-6 mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold mb-2">{ad.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 ml-1" />
                        <span>{ad.city || ad.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 ml-1" />
                        <span>{ad.views_count || ad.viewCount || ad.views || 0} مشاهدة</span>
                      </div>
                      <span>{timeAgo}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleFavoriteToggle}
                      className={isFavorite ? 'text-red-500 border-red-200' : ''}
                    >
                      <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Flag className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {ad.featured && (
                  <div className="flex items-center gap-2 mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">إعلان مميز</span>
                  </div>
                )}

                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-bold text-brand">
                    {ad.price.toLocaleString()} ريال
                  </span>
                  {ad.condition && (
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                      {ad.condition === 'new' ? 'جديد' : 'مستعمل'}
                    </span>
                  )}
                </div>

                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold mb-3">وصف الإعلان</h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {ad.description}
                  </p>
                </div>
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="comments">التعليقات</TabsTrigger>
                  <TabsTrigger value="details">تفاصيل إضافية</TabsTrigger>
                </TabsList>
                
                <TabsContent value="comments" className="mt-6">
                  <CommentsList 
                    comments={[]}
                    isLoading={false}
                  />
                </TabsContent>
                
                <TabsContent value="details" className="mt-6">
                  <div className="bg-white dark:bg-dark-card rounded-lg border border-border dark:border-dark-border p-6">
                    <h3 className="text-lg font-semibold mb-4">تفاصيل الإعلان</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-muted-foreground">التصنيف</span>
                        <p className="font-medium">{ad.category}</p>
                      </div>
                      {ad.subcategory && (
                        <div>
                          <span className="text-sm text-muted-foreground">التصنيف الفرعي</span>
                          <p className="font-medium">{ad.subcategory}</p>
                        </div>
                      )}
                      <div>
                        <span className="text-sm text-muted-foreground">تاريخ النشر</span>
                        <p className="font-medium">{new Date(ad.created_at).toLocaleDateString('ar-SA')}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">رقم الإعلان</span>
                        <p className="font-medium">{ad.id}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Seller info */}
              <div className="bg-white dark:bg-dark-card rounded-lg border border-border dark:border-dark-border p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">معلومات البائع</h3>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar>
                    <AvatarImage src={ad.user?.image || ad.user?.avatar} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {ad.user?.name || `${ad.user?.first_name} ${ad.user?.last_name}` || 'مستخدم'}
                    </p>
                    {ad.user?.verified && (
                      <span className="text-sm text-green-600">موثق ✓</span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3">
                  {ad.phone && (
                    <Button className="w-full" asChild>
                      <a href={`tel:${ad.phone}`}>
                        <Phone className="h-4 w-4 ml-2" />
                        اتصل الآن
                      </a>
                    </Button>
                  )}
                  
                  <Button variant="outline" className="w-full">
                    <MessageSquare className="h-4 w-4 ml-2" />
                    أرسل رسالة
                  </Button>
                  
                  {ad.whatsapp && (
                    <Button variant="outline" className="w-full" asChild>
                      <a href={`https://wa.me/${ad.whatsapp}`} target="_blank" rel="noopener noreferrer">
                        واتساب
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              {/* Location */}
              {(ad.latitude && ad.longitude) && (
                <div className="bg-white dark:bg-dark-card rounded-lg border border-border dark:border-dark-border p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4">الموقع</h3>
                  <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    <MapPin className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {ad.address || ad.city || ad.location}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Related ads */}
          {relatedAdsResponse && relatedAdsResponse.length > 0 && (
            <div className="mt-12">
              <RelatedAdsCarousel ads={relatedAdsResponse} />
            </div>
          )}
        </div>
      </main>
      
      <Footer />
      <MobileNav />
    </div>
  );
}
