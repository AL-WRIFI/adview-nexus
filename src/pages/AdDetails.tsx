
import { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  Clock, MapPin, Eye, MessageSquare, Phone, Heart, Share, Flag, 
  ChevronLeft, ChevronRight, User, Star, Loader2, 
  Maximize, ZoomIn, ZoomOut, Send, ArrowLeft, ArrowRight
} from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { AdCard } from '@/components/ads/ad-card';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useAd, useRelatedAds, useAddComment, useIsFavorite, useAddToFavorites, useRemoveFromFavorites, useAddReply } from '@/hooks/use-api';
import { useAuth } from '@/context/auth-context';
import { toast } from '@/hooks/use-toast';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AdDetails() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('details');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [activeImageUrl, setActiveImageUrl] = useState<string | null>(null);
  const [imageZoom, setImageZoom] = useState(1);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const navigate = useNavigate();
  const imageRef = useRef<HTMLImageElement>(null);
  
  const { isAuthenticated, user } = useAuth();
  
  const numId = id ? parseInt(id, 10) : 0;
  
  const { data: adResponse, isLoading, error } = useAd(numId);
  const { data: isFavoriteResponse } = useIsFavorite(numId);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const { data: relatedAdsResponse } = useRelatedAds(numId);
  
  useEffect(() => {
    if (isFavoriteResponse !== undefined) {
      setIsFavorite(isFavoriteResponse);
    }
  }, [isFavoriteResponse]);
  
  const addCommentMutation = useAddComment(numId);
  const addReplyMutation = useAddReply();
  const addToFavorites = useAddToFavorites();
  const removeFromFavorites = useRemoveFromFavorites();
  
  const ad = adResponse?.data;
  const relatedAds = adResponse?.data?.related || [];
  const comments = ad?.comments || [];
  
  const handleZoomIn = () => {
    setImageZoom(prev => Math.min(prev + 0.1, 3));
  };
  
  const handleZoomOut = () => {
    setImageZoom(prev => Math.max(prev - 0.1, 1));
  };
  
  const handleResetZoom = () => {
    setImageZoom(1);
  };
  
  const handlePrevImage = () => {
    if (!allImages || !allImages.length) return;
    setCurrentImageIndex((prev) => prev === 0 ? allImages.length - 1 : prev - 1);
    setImageZoom(1);
  };
  
  const handleNextImage = () => {
    if (!allImages || !allImages.length) return;
    setCurrentImageIndex((prev) => prev === allImages.length - 1 ? 0 : prev + 1);
    setImageZoom(1);
  };
  
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: "تسجيل الدخول مطلوب",
        description: "يجب عليك تسجيل الدخول لإضافة تعليق",
        variant: "destructive"
      });
      navigate('/auth/login', { state: { from: `/ad/${id}` } });
      return;
    }
    
    if (commentText.trim() && numId) {
      addCommentMutation.mutate(commentText);
      setCommentText('');
    }
  };
  
  const handleSubmitReply = (commentId: number) => {
    if (!isAuthenticated) {
      toast({
        title: "تسجيل الدخول مطلوب",
        description: "يجب عليك تسجيل الدخول للرد على التعليق",
        variant: "destructive"
      });
      navigate('/auth/login', { state: { from: `/ad/${id}` } });
      return;
    }
    
    if (replyText.trim()) {
      addReplyMutation.mutate(
        { commentId, content: replyText },
        {
          onSuccess: () => {
            setReplyText('');
            setReplyingTo(null);
          }
        }
      );
    }
  };
  
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-900">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-neutral-600 dark:text-neutral-400" />
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
  const mainImageUrl = ad.image?.image_url || '';
  const galleryImages = Array.isArray(ad.images) ? ad.images.map((img) => img.url || '') : [];
  const allImages = mainImageUrl ? [mainImageUrl, ...galleryImages] : galleryImages;

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
            {/* الصور والتفاصيل الرئيسية */}
            <div className="md:col-span-2">
              <div className="rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 mb-4">
                {/* Enhanced Image Gallery */}
                <div className="relative bg-neutral-100 dark:bg-neutral-800">
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="cursor-zoom-in relative h-64 md:h-96">
                        {allImages.length > 0 ? (
                          <img 
                            ref={imageRef}
                            src={allImages[currentImageIndex]} 
                            alt={ad.title} 
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-500 dark:text-neutral-400">
                            لا توجد صورة
                          </div>
                        )}
                        
                        <div className="absolute top-2 right-2 bg-black/30 text-white p-2 rounded-full">
                          <Maximize className="h-5 w-5" />
                        </div>
                      </div>
                    </DialogTrigger>
                    
                    <DialogContent className="max-w-5xl w-[90vw] h-[90vh] p-0 bg-black/95">
                      <div className="relative w-full h-full flex items-center justify-center p-4">
                        <div className="absolute top-4 right-4 flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="bg-black/50 hover:bg-black/70 text-white rounded-full"
                            onClick={handleZoomIn}
                          >
                            <ZoomIn className="h-5 w-5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="bg-black/50 hover:bg-black/70 text-white rounded-full"
                            onClick={handleZoomOut}
                          >
                            <ZoomOut className="h-5 w-5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="bg-black/50 hover:bg-black/70 text-white rounded-full"
                            onClick={handleResetZoom}
                          >
                            <Maximize className="h-5 w-5" />
                          </Button>
                        </div>
                        
                        <img 
                          src={allImages[currentImageIndex]} 
                          alt={ad.title} 
                          className="max-w-full max-h-full object-contain transition-transform duration-200"
                          style={{ transform: `scale(${imageZoom})` }}
                        />
                        
                        {allImages.length > 1 && (
                          <>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full"
                              onClick={handlePrevImage}
                            >
                              <ArrowRight className="h-6 w-6" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full"
                              onClick={handleNextImage}
                            >
                              <ArrowLeft className="h-6 w-6" />
                            </Button>
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1">
                              {allImages.map((_, index) => (
                                <button 
                                  key={index}
                                  className={`w-2 h-2 rounded-full ${currentImageIndex === index ? 'bg-white' : 'bg-white/50'}`}
                                  onClick={() => {
                                    setCurrentImageIndex(index);
                                    setImageZoom(1);
                                  }}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  {allImages.length > 1 && (
                    <>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/70 dark:bg-neutral-700/80 hover:bg-white dark:hover:bg-neutral-600 rounded-full"
                        onClick={handlePrevImage}
                      >
                        <ChevronRight className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/70 dark:bg-neutral-700/80 hover:bg-white dark:hover:bg-neutral-600 rounded-full"
                        onClick={handleNextImage}
                      >
                        <ChevronLeft className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
                      </Button>
                      
                      {/* Pagination dots */}
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                        {allImages.map((_, index) => (
                          <button 
                            key={index}
                            className={`w-1.5 h-1.5 rounded-full ${currentImageIndex === index ? 'bg-brand' : 'bg-gray-300 dark:bg-gray-600'}`}
                            onClick={() => setCurrentImageIndex(index)}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
                
                {allImages.length > 1 && (
                  <div className="flex p-2 gap-2 overflow-x-auto bg-neutral-50 dark:bg-neutral-800 scroll-container no-scrollbar">
                    {allImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-16 h-16 flex-shrink-0 rounded overflow-hidden border-2 transition-all ${
                          index === currentImageIndex 
                            ? 'border-brand' 
                            : 'border-transparent hover:border-neutral-300 dark:hover:border-neutral-600'
                        }`}
                      >
                        <img 
                          src={image} 
                          alt={`صورة ${index + 1}`} 
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab}>
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
                
                <TabsContent value="details" className="pt-4">
                  <div className="space-y-6">
                    <div>
                      <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{ad.title}</h1>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400">
                          <Clock className="h-4 w-4 ml-1" />
                          <span className="mx-2">{timeAgo}</span>
                          <span className="mx-2">•</span>
                          <MapPin className="h-4 w-4 ml-1" />
                          <span className="mx-2">{ad.city || ad.address || 'غير محدد'}</span>
                          <span className="mx-2">•</span>
                          <Eye className="h-4 w-4 ml-1" />
                          <span className="mx-2">{ad.views_count || 0} مشاهدة</span>
                        </div>
                        <div className="font-bold text-2xl text-neutral-900 dark:text-neutral-200">
                          {ad.price?.toLocaleString()} ريال
                          {ad.is_negotiable && <span className="text-sm font-normal mr-1 dark:text-neutral-300">(قابل للتفاوض)</span>}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg">
                      <h2 className="font-bold mb-2 dark:text-neutral-100">الوصف</h2>
                      <p className="whitespace-pre-line text-neutral-700 dark:text-neutral-300">{ad.description}</p>
                    </div>
                    
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
                  </div>
                </TabsContent>

                {/* التعليقات - Enhanced UI */}
                <TabsContent value="comments" className="pt-4">
                  <div className="space-y-4">
                    <form onSubmit={handleSubmitComment} className="space-y-3">
                      <div className="flex gap-3">
                        <Avatar className="w-10 h-10 border">
                          {user?.image ? (
                            <AvatarImage src={user.image} alt={user.first_name} />
                          ) : (
                            <AvatarFallback className="bg-brand/10 text-brand">
                              {user?.first_name?.charAt(0) || 'U'}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <Textarea
                            placeholder="اكتب تعليقك هنا..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            className="resize-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 min-h-[80px]"
                          />
                          <div className="flex justify-end">
                            <Button 
                              type="submit" 
                              disabled={!commentText.trim() || addCommentMutation.isPending}
                              className="bg-brand hover:bg-brand/90 text-white dark:bg-brand dark:hover:bg-brand/90 dark:text-white"
                            >
                              {addCommentMutation.isPending ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  جاري الإضافة...
                                </>
                              ) : 'إضافة تعليق'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </form>
                    
                    <div className="space-y-4 mt-6">
                      {comments.length === 0 ? (
                        <div className="text-center py-6 text-neutral-500 dark:text-neutral-400">
                          لا توجد تعليقات حتى الآن. كن أول من يعلق!
                        </div>
                      ) : (
                        comments.map((comment) => (
                          <div 
                            key={comment.id} 
                            className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden bg-white dark:bg-neutral-800 shadow-sm"
                          >
                            <div className="p-4 border-b border-neutral-100 dark:border-neutral-700">
                              <div className="flex items-start gap-3">
                                <Avatar className="w-10 h-10 border">
                                  {comment.user.image ? (
                                    <AvatarImage src={comment.user.image} alt={`${comment.user.first_name} ${comment.user.last_name}`} />
                                  ) : (
                                    <AvatarFallback className="bg-neutral-200 dark:bg-neutral-700">
                                      {comment.user.first_name?.charAt(0) || 'U'}
                                    </AvatarFallback>
                                  )}
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <div className="font-medium dark:text-neutral-100">
                                        {`${comment.user.first_name} ${comment.user.last_name}`}
                                      </div>
                                      <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                        {formatDistanceToNow(new Date(comment.created_at), { 
                                          addSuffix: true, 
                                          locale: ar
                                        })}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="mt-2 text-neutral-700 dark:text-neutral-300">
                                    {comment.content}
                                  </div>
                                  {isAuthenticated && (
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="mt-2 text-brand hover:text-brand hover:bg-brand/10 px-2 text-xs"
                                      onClick={() => replyingTo === comment.id 
                                        ? setReplyingTo(null) 
                                        : setReplyingTo(comment.id)
                                      }
                                    >
                                      <MessageSquare className="h-3 w-3 ml-1" />
                                      رد
                                    </Button>
                                  )}
                                </div>
                              </div>
                              
                              {replyingTo === comment.id && (
                                <div className="mr-10 mt-3 border-r-2 border-brand pr-3">
                                  <div className="flex gap-2">
                                    <Avatar className="w-8 h-8 border">
                                      {user?.image ? (
                                        <AvatarImage src={user.image} alt={user.first_name} />
                                      ) : (
                                        <AvatarFallback className="bg-brand/10 text-brand">
                                          {user?.first_name?.charAt(0) || 'U'}
                                        </AvatarFallback>
                                      )}
                                    </Avatar>
                                    <div className="flex-1 flex gap-2 items-end">
                                      <Textarea
                                        placeholder="اكتب ردك هنا..."
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        className="resize-none dark:bg-neutral-800 dark:border-neutral-700 min-h-[60px] text-sm flex-1"
                                      />
                                      <Button
                                        size="sm"
                                        disabled={!replyText.trim() || addReplyMutation.isPending}
                                        className="bg-brand hover:bg-brand/90 text-white"
                                        onClick={() => handleSubmitReply(comment.id)}
                                      >
                                        {addReplyMutation.isPending ? (
                                          <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                          <Send className="h-4 w-4" />
                                        )}
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            {comment.replies && comment.replies.length > 0 && (
                              <div className="bg-neutral-50 dark:bg-neutral-700/50">
                                {comment.replies.map((reply) => (
                                  <div 
                                    key={reply.id} 
                                    className="p-3 border-b last:border-b-0 border-neutral-100 dark:border-neutral-700/50"
                                  >
                                    <div className="flex gap-2">
                                      <Avatar className="w-8 h-8 border">
                                        {reply.user.image ? (
                                          <AvatarImage src={reply.user.image} alt={`${reply.user.first_name} ${reply.user.last_name}`} />
                                        ) : (
                                          <AvatarFallback className="bg-neutral-200 dark:bg-neutral-700">
                                            {reply.user.first_name?.charAt(0) || 'U'}
                                          </AvatarFallback>
                                        )}
                                      </Avatar>
                                      <div>
                                        <div className="flex flex-wrap gap-2 items-baseline">
                                          <div className="font-medium text-sm dark:text-neutral-100">
                                            {`${reply.user.first_name} ${reply.user.last_name}`}
                                          </div>
                                          <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                            {formatDistanceToNow(new Date(reply.created_at), { 
                                              addSuffix: true,
                                              locale: ar
                                            })}
                                          </div>
                                        </div>
                                        <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
                                          {reply.content}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* الشريط الجانبي */}
            <div className="md:col-span-1">
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
                            {ad.user.first_name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <div className="font-bold dark:text-neutral-100">{`${ad.user.first_name} ${ad.user.last_name}`}</div>
                        <div className="text-sm text-neutral-500 dark:text-neutral-400">
                          عضو منذ {new Date(ad.user.created_at || '').toLocaleDateString('ar-SA')}
                        </div>
                      </div>
                      {ad.user.verified_status && (
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
          {relatedAds.length > 0 && (
            <div className="mt-12 border-t border-neutral-200 dark:border-neutral-700 pt-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">إعلانات مشابهة</h2>
                <Button variant="ghost" className="text-brand hover:text-brand hover:bg-brand/10" asChild>
                  <Link to={`/search?category=${ad.category_id}`}>
                    عرض المزيد
                    <ChevronLeft className="mr-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {relatedAds.map((relatedAd) => (
                    <CarouselItem key={relatedAd.id} className="pl-2 md:pl-4 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                      <AdCard ad={relatedAd} layout="grid" className="h-full" />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-end gap-2 mt-4">
                  <CarouselPrevious className="relative inset-auto transform-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700" />
                  <CarouselNext className="relative inset-auto transform-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700" />
                </div>
              </Carousel>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
      <MobileNav />
    </div>
  );
}
