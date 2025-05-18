import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  Clock, MapPin, Eye, MessageSquare, Phone, Heart, Share, Flag, 
  ChevronLeft, ChevronRight, User, Star, Loader2
} from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { AdCard } from '@/components/ads/ad-card';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useAd, useRelatedAds, useAddComment, useIsFavorite, useAddToFavorites, useRemoveFromFavorites } from '@/hooks/use-api';
import { useAuth } from '@/context/auth-context';
import { toast } from '@/hooks/use-toast';

export default function AdDetails() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('details');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [commentText, setCommentText] = useState('');
  const navigate = useNavigate();
  
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
  const addToFavorites = useAddToFavorites();
  const removeFromFavorites = useRemoveFromFavorites();
  
  const ad = adResponse?.data;
  const relatedAds = adResponse?.data?.related || [];
  const comments = ad?.comments || [];
  
  const handlePrevImage = () => {
    if (!ad || !ad.images || !ad.images.length) return;
    setCurrentImageIndex((prev) => prev === 0 ? ad.images.length - 1 : prev - 1);
  };
  
  const handleNextImage = () => {
    if (!ad || !ad.images || !ad.images.length) return;
    setCurrentImageIndex((prev) => prev === ad.images.length - 1 ? 0 : prev + 1);
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

  const images = ad.images || [];
  const adImage = ad.image ? [ad.image] : [];
  const allImages = images.length > 0 ? images : adImage.length > 0 ? adImage : [];

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
                <div className="relative h-64 md:h-96 bg-neutral-100 dark:bg-neutral-800">
                  {allImages.length > 0 ? (
                    <img 
                      src={allImages[currentImageIndex]} 
                      alt={ad.title} 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-500 dark:text-neutral-400">
                      لا توجد صورة
                    </div>
                  )}
                  
                  {allImages.length > 1 && (
                    <>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/70 dark:bg-neutral-700/80 hover:bg-white dark:hover:bg-neutral-600"
                        onClick={handlePrevImage}
                      >
                        <ChevronRight className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/70 dark:bg-neutral-700/80 hover:bg-white dark:hover:bg-neutral-600"
                        onClick={handleNextImage}
                      >
                        <ChevronLeft className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
                      </Button>
                    </>
                  )}
                </div>
                
                {allImages.length > 1 && (
                  <div className="flex p-2 gap-2 overflow-x-auto bg-neutral-50 dark:bg-neutral-800">
                    {allImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-16 h-16 flex-shrink-0 rounded overflow-hidden border-2 transition-all ${
                          index === currentImageIndex 
                            ? 'border-black dark:border-neutral-400' 
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
                          <span className="mx-2">{ad.city}</span>
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
                          <span>{ad.category}</span>
                        </div>
                        {ad.sub_category_name && (
                          <div className="flex items-center">
                            <span className="text-neutral-500 dark:text-neutral-400 ml-2"> التصنيف الفرعي : </span>
                            <span>{ad.sub_category_name}</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <span className="text-neutral-500 dark:text-neutral-400 ml-2"> المدينة : </span>
                          <span>{ad.city}</span>
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
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* التعليقات */}
                <TabsContent value="comments" className="pt-4">
                  <div className="space-y-4">
                    <form onSubmit={handleSubmitComment} className="space-y-3">
                      <Textarea
                        placeholder="اكتب تعليقك هنا..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="resize-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300"
                      />
                      <Button 
                        type="submit" 
                        disabled={!commentText.trim() || addCommentMutation.isPending}
                        className="dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-300"
                      >
                        {addCommentMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            جاري الإضافة...
                          </>
                        ) : 'إضافة تعليق'}
                      </Button>
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
                            className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden bg-white dark:bg-neutral-800"
                          >
                            <div className="p-3 bg-neutral-50 dark:bg-neutral-700 flex items-center">
                              <div className="w-8 h-8 rounded-full bg-neutral-300 overflow-hidden ml-2">
                                {comment.user.image ? (
                                  <img 
                                    src={comment.user.image} 
                                    alt={`${comment.user.first_name} ${comment.user.last_name}`} 
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <User className="w-full h-full p-1 text-neutral-700 dark:text-neutral-300" />
                                )}
                              </div>
                              <div>
                                <div className="font-medium dark:text-neutral-100">{`${comment.user.first_name} ${comment.user.last_name}`}</div>
                                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                  {formatDistanceToNow(new Date(comment.created_at), { 
                                    addSuffix: true, 
                                    locale: ar
                                  })}
                                </div>
                              </div>
                            </div>
                            <div className="p-3">
                              <p className="text-neutral-700 dark:text-neutral-300">{comment.content}</p>
                            </div>
                            
                            {comment.replies && comment.replies.length > 0 && (
                              <div className="border-t border-neutral-200 dark:border-neutral-700">
                                {comment.replies.map((reply) => (
                                  <div 
                                    key={reply.id} 
                                    className="p-3 pr-6 border-b last:border-b-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-700"
                                  >
                                    <div className="flex items-center">
                                      <div className="w-6 h-6 rounded-full bg-neutral-300 overflow-hidden ml-2">
                                        {reply.user.image ? (
                                          <img 
                                            src={reply.user.image} 
                                            alt={`${reply.user.first_name} ${reply.user.last_name}`} 
                                            className="w-full h-full object-cover"
                                          />
                                        ) : (
                                          <User className="w-full h-full p-1 text-neutral-700 dark:text-neutral-300" />
                                        )}
                                      </div>
                                      <div>
                                        <div className="font-medium text-sm dark:text-neutral-100">{`${reply.user.first_name} ${reply.user.last_name}`}</div>
                                        <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                          {formatDistanceToNow(new Date(reply.created_at), { 
                                            addSuffix: true,
                                            locale: ar
                                          })}
                                        </div>
                                      </div>
                                    </div>
                                    <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">{reply.content}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            <div className="p-2 bg-neutral-50 dark:bg-neutral-700 border-t border-neutral-200 dark:border-neutral-700">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="dark:text-neutral-300 dark:hover:bg-neutral-600"
                                onClick={() => {
                                  if (!isAuthenticated) {
                                    toast({
                                      title: "تسجيل الدخول مطلوب",
                                      description: "يجب عليك تسجيل الدخول للرد على التعليقات",
                                      variant: "destructive"
                                    });
                                    navigate('/auth/login', { state: { from: `/ad/${id}` } });
                                  }
                                }}
                              >
                                <MessageSquare className="h-4 w-4 ml-2" />
                                الرد
                              </Button>
                            </div>
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
                      <div className="w-12 h-12 rounded-full bg-neutral-200 overflow-hidden ml-3">
                        {ad.user.image ? (
                          <img 
                            src={ad.user.image} 
                            alt={`${ad.user.first_name} ${ad.user.last_name}`} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-full h-full p-2 text-neutral-700 dark:text-neutral-300" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold dark:text-neutral-100">{`${ad.user.first_name} ${ad.user.last_name}`}</div>
                        <div className="text-sm text-neutral-500 dark:text-neutral-400">
                          عضو منذ {new Date(ad.user.created_at || '').toLocaleDateString('ar-SA')}
                        </div>
                      </div>
                      {ad.user.is_verified && (
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
                    {ad.user?.phone && (
                      <Button className="w-full flex items-center justify-center dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-200" size="lg">
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
              
              {relatedAds.length > 0 && (
                <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden bg-white dark:bg-neutral-800">
                  <div className="p-4 bg-neutral-50 dark:bg-neutral-700 border-b border-neutral-200 dark:border-neutral-700">
                    <h2 className="font-bold dark:text-neutral-100">إعلانات مشابهة</h2>
                  </div>
                  <div className="p-4 space-y-4">
                    {relatedAds.slice(0, 5).map((relatedAd) => (
                      <AdCard 
                        key={relatedAd.id} 
                        ad={relatedAd} 
                        layout="list" 
                        className="dark:bg-neutral-800 dark:border-neutral-700"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <MobileNav />
    </div>
  );
}