import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, Eye, MessageSquare, Phone, Heart, Share, Flag, 
  Star, Loader2, User,
  Clock
} from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdImageGallery } from '@/components/image-gallery/AdImageGallery';
import { CommentsList } from '@/components/comments/CommentsList';
import { AdDetailsSkeleton } from '@/components/ui/ad-details-skeleton';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { 
  useAd, 
  useRelatedAds, 
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
import { RelatedAndSuggestedAds } from '@/components/ads/RelatedAndSuggestedAds';

export default function AdDetails() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('comments');
  const [isFavorite, setIsFavorite] = useState(false);
  const [commandId, setCommandId] = useState(null);
  const navigate = useNavigate();
  
  const { isAuthenticated, user } = useAuth();
  
  const numId = id ? parseInt(id, 10) : 0;
  
  // API hooks
  const { data: ad, isLoading, error } = useAd(numId);
  const { data: isFavoriteResponse } = useIsFavorite(numId);
  const { data: relatedAdsResponse } = useRelatedAds(numId);
  
  const addCommentMutation = useAddComment(numId);
  const addReplyMutation = useAddReply(numId, commandId);
  const deleteCommentMutation = useDeleteComment(numId);
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
    setCommandId(commentId);
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
    deleteCommentMutation.mutate(commentId);
  };

  const handleEditComment = (commentId: number, text: string) => {
    if (!isAuthenticated) {
      toast({
        title: "تسجيل الدخول مطلوب",
        description: "يجب عليك تسجيل الدخول ",
        variant: "destructive"
      });
      navigate('/auth/login', { state: { from: `/ad/${id}` } });
      return;
    }
    
    if (text.trim()) {
        editCommentMutation.mutate({ commentId, content: text });
    }
  };
  
  const handleDeleteReply = (commentId: number, replyId: number) => {
    deleteReplyMutation.mutate({ commentId, replyId });
  };
  
  const handleEditReply = (commentId: number, replyId: number, text: string) => {
    editReplyMutation.mutate({ commentId, replyId, content: text });
  };

  // Show loading skeleton while data is being fetched
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-900">
        <Header />
        <main className="flex-1">
          <AdDetailsSkeleton />
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  if (error || !ad) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-900">
        <Header />
        <main className="flex-1 py-10">
          <div className="container mx-auto px-4">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-red-800 dark:text-red-400 mb-4">عذراً، لم يتم العثور على هذا الإعلان</h2>
              <p className="mb-6 text-neutral-600 dark:text-neutral-300">قد يكون الإعلان تم حذفه أو انتهاء صلاحيته</p>
              <Button asChild className="dark:bg-neutral-800 dark:hover:bg-neutral-700">
                <Link to="/">العودة إلى الصفحة الرئيسية</Link>
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
  
  // Process images according to the new format
  const processImages = () => {
    const images: string[] = [];
    
    // Add main image if available
    if (ad.image && typeof ad.image === 'object' && ad.image.image_url) {
      images.push(ad.image.image_url);
    } else if (typeof ad.image === 'string' && ad.image) {
      images.push(ad.image);
    }
    
    // Add gallery images
    if (ad.images && Array.isArray(ad.images)) {
      ad.images.forEach(img => {
        if (typeof img === 'object' && img.url) {
          images.push(img.url);
        } else if (typeof img === 'string') {
          images.push(img);
        }
      });
    }
    
    return images;
  };

  // Get all images
  const allImages = processImages();
  
  // Prepare related ads - convert ListingDetails to Listing format if needed
  const relatedAds = ad.related || [];
  
  // Process comments
  const comments: Comment[] = ad.comments || [];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-900 transition-colors">
      <Header />
      
      <main className="flex-1 pb-20 md:pb-0">
        <div className="container px-4 mx-auto py-6">
          <div className="text-sm mb-4 text-neutral-600 dark:text-neutral-400">
            <Link to="/" className="hover:text-black dark:hover:text-neutral-200">الرئيسية</Link>
            {' > '}
            <Link to={`/category/${ad.category_id}`} className="hover:text-black dark:hover:text-neutral-200">
              {ad.category_name || 'تصنيف'}
            </Link>
            {' > '}
            <span className="dark:text-neutral-300">{ad.title}</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main content column */}
            <div className="md:col-span-2">
              {/* Title and price */}
              <div className="mb-6">
              <h1 className="text-xl md:text-2xl font-bold text-neutral-800 dark:text-white mb-2">{ad.title}</h1>
              <div className="flex items-center text-neutral-600 dark:text-neutral-400 text-sm gap-4">
                <div className="flex items-center gap-1"><Eye className="w-4 h-4" /> {ad.viewCount} مشاهدة</div>
                <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /> <span className="truncate max-w-[80px]">{ad.city ?? "غير معروف"}</span></div>
                <div className="flex items-center gap-1"><Clock className="w-4 h-4" /> {timeAgo}</div>
              </div>
            </div>

            <div className="mb-6 text-neutral-800 dark:text-neutral-100 whitespace-pre-line leading-relaxed">
              {ad.description}
            </div>
              
              {/* Gallery */}
              <div className="mb-6">
                <AdImageGallery images={allImages} title={ad.title} />
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                <TabsList className="w-full bg-neutral-50 dark:bg-neutral-800">
                  <TabsTrigger 
                    value="details" 
                    className="flex-1 data-[state=active]:bg-white data-[state=active]:dark:bg-neutral-700 data-[state=active]:dark:text-neutral-100"
                  >
                    التفاصيل
                  </TabsTrigger>
                  <TabsTrigger 
                    value="comments" 
                    className="flex-1 data-[state=active]:bg-white data-[state=active]:dark:bg-neutral-700 data-[state=active]:dark:text-neutral-100"
                  >
                    التعليقات ({comments.length || 0})
                  </TabsTrigger>
                </TabsList>
                
                {/* Details tab */}
                <TabsContent value="details" className="pt-4">
                  <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg">
                    <h2 className="font-bold mb-2 dark:text-neutral-100">معلومات إضافية</h2>
                    <div className="grid grid-cols-2 gap-4 text-neutral-700 dark:text-neutral-300">
                      <div className="flex items-center">
                        <span className="text-neutral-500 dark:text-neutral-400 ml-2"> التصنيف : </span>
                        <span>{ad.category_name || "غير محدد"}</span>
                      </div>
                      {ad.sub_category_name && (
                        <div className="flex items-center">
                          <span className="text-neutral-500 dark:text-neutral-400 ml-2"> التصنيف الفرعي : </span>
                          <span>{ad.sub_category_name}</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <span className="text-neutral-500 dark:text-neutral-400 ml-2"> المدينة : </span>
                        <span>{ad.city || ad.address || "غير محدد"}</span>
                      </div>
                      {ad.state && (
                        <div className="flex items-center">
                          <span className="text-neutral-500 dark:text-neutral-400 ml-2"> الحي : </span>
                          <span>{ad.state}</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <span className="text-neutral-500 dark:text-neutral-400 ml-2">نوع الإعلان  :  </span>
                        <span>
                          {ad.listing_type === 'sell' ? ' بيع' : 
                           ad.listing_type === 'buy' ? ' شراء' : 
                           ad.listing_type === 'exchange' ? ' تبادل' : ' خدمة'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-neutral-500 dark:text-neutral-400 ml-2">تاريخ النشر : </span>
                        <span>{new Date(ad.created_at).toLocaleDateString('ar-SA')}</span>
                      </div>
                      {ad.condition && (
                        <div className="flex items-center">
                          <span className="text-neutral-500 dark:text-neutral-400 ml-2">الحالة : </span>
                          <span>{ad.condition === 'new' ? 'جديد' : 'مستعمل'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                {/* Comments tab */}
                <TabsContent value="comments" className="pt-4">
                  <CommentsList 
                    comments={comments}
                    onAddComment={handleAddComment}
                    onAddReply={handleAddReply}
                    onDeleteComment={handleDeleteComment}
                    onEditComment={handleEditComment}
                    onDeleteReply={handleDeleteReply}
                    onEditReply={handleEditReply}
                    isLoading={
                      addCommentMutation.isPending ||
                      addReplyMutation.isPending ||
                      deleteCommentMutation.isPending ||
                      editCommentMutation.isPending ||
                      deleteReplyMutation.isPending ||
                      editReplyMutation.isPending
                    }
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="md:col-span-1">
              {/* Seller info */}
              <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden mb-6 bg-white dark:bg-neutral-800">
                <div className="p-4 bg-neutral-50 dark:bg-neutral-700 border-b border-neutral-200 dark:border-neutral-700">
                  <h2 className="font-bold text-lg dark:text-neutral-100">معلومات المعلن</h2>
                </div>
                <div className="p-4">
                  {ad.user && (
                    <div className="flex items-center mb-4">
                      <Avatar className="w-12 h-12 ml-3 border">
                        {ad.user.image ? (
                          <AvatarImage src={ad.user.image} alt={`${ad.user.first_name} ${ad.user.last_name}`} />
                        ) : (
                          <AvatarFallback className="bg-neutral-200 dark:bg-neutral-700">
                            <User className="h-6 w-6 text-neutral-500" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <div className="font-bold dark:text-neutral-100">{`${ad.user.first_name} ${ad.user.last_name}`}</div>
                        <div className="text-sm text-neutral-500 dark:text-neutral-400">
                          عضو منذ {new Date(ad.user.created_at || '').toLocaleDateString('ar-SA')}
                        </div>
                      </div>
                      {ad.user.verified && (
                        <div className="mr-auto">
                          <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs px-2 py-1 rounded-full flex items-center">
                            <Star className="h-3 w-3 ml-1 fill-green-700 dark:fill-green-400" />
                            موثق
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    {ad.user?.phone && !ad.phone_hidden && (
                      <Button className="w-full flex items-center justify-center bg-brand hover:bg-brand/90 text-white" size="lg">
                        <Phone className="ml-2 h-5 w-5" />
                        {ad.user.phone}
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      className="w-full dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-700" 
                      size="lg" 
                      onClick={() => {
                        if (!isAuthenticated) {
                          toast({
                            title: "تسجيل الدخول مطلوب",
                            description: "يجب عليك تسجيل الدخول لإرسال رسالة",
                            variant: "destructive"
                          });
                          navigate('/auth/login', { state: { from: `/ad/${id}` } });
                          return;
                        }
                        navigate('/messages', { state: { userId: ad.user_id } });
                      }}
                    >
                      <MessageSquare className="ml-2 h-5 w-5" />
                      مراسلة
                    </Button>
                    <Button 
                      variant="ghost" 
                      className={`w-full border dark:border-neutral-700 ${
                        isFavorite 
                          ? 'text-red-500 dark:text-red-400 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20' 
                          : 'dark:text-neutral-300 dark:hover:bg-neutral-700'
                      }`} 
                      size="lg"
                      onClick={handleFavoriteToggle}
                    >
                      <Heart className={`ml-2 h-5 w-5 ${isFavorite ? 'fill-red-500 dark:fill-red-400' : ''}`} />
                      {isFavorite ? 'تمت الإضافة للمفضلة' : 'أضف للمفضلة'}
                    </Button>
                    <div className="flex justify-between pt-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="dark:text-neutral-300 dark:hover:bg-neutral-700"
                      >
                        <Share className="ml-1 h-4 w-4" />
                        مشاركة
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 dark:text-red-400 dark:hover:bg-red-900/20"
                        onClick={() => {
                          if (!isAuthenticated) {
                            toast({
                              title: "تسجيل الدخول مطلوب",
                              description: "يجب عليك تسجيل الدخول للإبلاغ عن الإعلان",
                              variant: "destructive"
                            });
                            navigate('/auth/login', { state: { from: `/ad/${id}` } });
                            return;
                          }
                          toast({
                            title: "تم الإبلاغ",
                            description: "شكراً لإبلاغك عن هذا الإعلان، سيتم مراجعته قريباً",
                          });
                        }}
                      >
                        <Flag className="ml-1 h-4 w-4" />
                        إبلاغ
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Safety tips */}
              <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden mb-6 bg-white dark:bg-neutral-800">
                <div className="p-4 bg-neutral-50 dark:bg-neutral-700 border-b border-neutral-200 dark:border-neutral-700">
                  <h2 className="font-bold dark:text-neutral-100">نصائح للسلامة</h2>
                </div>
                <div className="p-4">
                  <ul className="text-sm space-y-2 list-disc pr-5 text-neutral-700 dark:text-neutral-300">
                    <li>تأكد من مقابلة البائع في مكان عام</li>
                    <li>تحقق من المنتج قبل شرائه</li>
                    <li>استخدم طرق دفع آمنة</li>
                    <li>لا ترسل أموالاً مقدماً</li>
                    <li>كن حذراً من العروض المغرية جداً</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Related ads carousel */}
           <RelatedAndSuggestedAds
              categoryId={ad.category_id} 
              excludeId={ad.id}
            />
        </div>
      </main>
      
      <Footer />
      <MobileNav />
    </div>
  );
}
