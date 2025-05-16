
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
  
  // Auth context
  const { isAuthenticated, user } = useAuth();
  
  // Convert ID to number
  const numId = id ? parseInt(id, 10) : 0;
  
  // Fetch ad details from API
  const { data: adResponse, isLoading, error } = useAd(numId);
  const { data: isFavoriteResponse } = useIsFavorite(numId);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Fetch related ads
  const { data: relatedAdsResponse } = useRelatedAds(numId);
  
  // Update favorite state when response changes
  useEffect(() => {
    if (isFavoriteResponse !== undefined) {
      setIsFavorite(isFavoriteResponse);
    }
  }, [isFavoriteResponse]);
  
  // Comment submission
  const addCommentMutation = useAddComment(numId);
  
  // Favorite toggle
  const addToFavorites = useAddToFavorites();
  const removeFromFavorites = useRemoveFromFavorites();
  
  // Get the ad data if available
  const ad = adResponse?.data;
  const relatedAds = relatedAdsResponse?.data || [];
  const comments = ad?.comments || [];
  
  // Handle previous/next image navigation
  const handlePrevImage = () => {
    if (!ad || !ad.images || !ad.images.length) return;
    
    setCurrentImageIndex((prev) => 
      prev === 0 ? ad.images.length - 1 : prev - 1
    );
  };
  
  const handleNextImage = () => {
    if (!ad || !ad.images || !ad.images.length) return;
    
    setCurrentImageIndex((prev) => 
      prev === ad.images.length - 1 ? 0 : prev + 1
    );
  };
  
  // Handle comment submission
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
  
  // Handle favorite toggle
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
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin" />
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
        <main className="flex-1 py-10">
          <div className="container mx-auto px-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-red-800 mb-4">عذراً، لم يتم العثور على هذا الإعلان</h2>
              <p className="mb-6">قد يكون الإعلان تم حذفه أو انتهاء صلاحيته</p>
              <Button asChild>
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
  
  // return (
  //   <div className="min-h-screen flex flex-col">
  //     <Header />
      
  //     <main className="flex-1 pb-20 md:pb-0">
  //       <div className="container px-4 mx-auto py-6">
  //         <div className="text-sm mb-4 text-muted-foreground">
  //           <Link to="/" className="hover:text-brand">الرئيسية</Link>
  //           {' > '}
  //           <Link to={`/category/${ad.category_id}`} className="hover:text-brand">
  //             {ad.category_name || 'تصنيف'}
  //           </Link>
  //           {' > '}
  //           <span>{ad.title}</span>
  //         </div>
          
  //         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  //           <div className="md:col-span-2">
  //             <div className="rounded-lg overflow-hidden border border-border mb-4">
  //               <div className="relative h-64 md:h-96 bg-gray-100">
  //                 {allImages && allImages.length > 0 ? (
  //                   <img 
  //                     src={allImages[currentImageIndex]} 
  //                     alt={ad.title} 
  //                     className="w-full h-full object-contain"
  //                   />
  //                 ) : (
  //                   <div className="w-full h-full flex items-center justify-center text-muted-foreground">
  //                     لا توجد صورة
  //                   </div>
  //                 )}
                  
  //                 {allImages && allImages.length > 1 && (
  //                   <>
  //                     <Button 
  //                       variant="ghost" 
  //                       size="icon" 
  //                       className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/70 hover:bg-white"
  //                       onClick={handlePrevImage}
  //                     >
  //                       <ChevronRight className="h-5 w-5" />
  //                     </Button>
  //                     <Button 
  //                       variant="ghost" 
  //                       size="icon" 
  //                       className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/70 hover:bg-white"
  //                       onClick={handleNextImage}
  //                     >
  //                       <ChevronLeft className="h-5 w-5" />
  //                     </Button>
  //                   </>
  //                 )}
  //               </div>
                
  //               {/* Thumbnails */}
  //               {allImages && allImages.length > 1 && (
  //                 <div className="flex p-2 gap-2 overflow-x-auto">
  //                   {allImages.map((image, index) => (
  //                     <button
  //                       key={index}
  //                       onClick={() => setCurrentImageIndex(index)}
  //                       className={`w-16 h-16 flex-shrink-0 rounded overflow-hidden border-2 ${
  //                         index === currentImageIndex ? 'border-brand' : 'border-transparent'
  //                       }`}
  //                     >
  //                       <img 
  //                         src={image} 
  //                         alt={`صورة ${index + 1}`} 
  //                         className="w-full h-full object-cover"
  //                       />
  //                     </button>
  //                   ))}
  //                 </div>
  //               )}
  //             </div>
              
  //             <Tabs value={activeTab} onValueChange={setActiveTab}>
  //               <TabsList className="w-full">
  //                 <TabsTrigger value="details" className="flex-1">التفاصيل</TabsTrigger>
  //                 <TabsTrigger value="comments" className="flex-1">
  //                   التعليقات ({comments?.length || 0})
  //                 </TabsTrigger>
  //               </TabsList>
                
  //               <TabsContent value="details" className="pt-4">
  //                 <div className="space-y-6">
  //                   <div>
  //                     <h1 className="text-2xl font-bold">{ad.title}</h1>
  //                     <div className="flex items-center justify-between mt-1">
  //                       <div className="flex items-center text-sm text-muted-foreground">
  //                         <Clock className="h-4 w-4 ml-1" />
  //                         <span className="mx-2">{timeAgo}</span>
  //                         <span className="mx-2">•</span>
  //                         <MapPin className="h-4 w-4 ml-1" />
  //                         <span className="mx-2">{ad.city_name}</span>
  //                         <span className="mx-2">•</span>
  //                         <Eye className="h-4 w-4 ml-1" />
  //                         <span className="mx-2">{ad.views_count || 0} مشاهدة</span>
  //                       </div>
  //                       <div className="font-bold text-2xl text-brand">
  //                         {ad.price?.toLocaleString()} ريال
  //                         {ad.is_negotiable && <span className="text-sm font-normal mr-1">(قابل للتفاوض)</span>}
  //                       </div>
  //                     </div>
  //                   </div>
                    
  //                   <div className="bg-gray-50 p-4 rounded-lg">
  //                     <h2 className="font-bold mb-2">الوصف</h2>
  //                     <p className="whitespace-pre-line">{ad.description}</p>
  //                   </div>
                    
  //                   <div className="bg-gray-50 p-4 rounded-lg">
  //                     <h2 className="font-bold mb-2">معلومات إضافية</h2>
  //                     <div className="grid grid-cols-2 gap-4">
  //                       <div className="flex items-center">
  //                         <span className="text-muted-foreground ml-2"> التصنيف : </span>
  //                         <span>{ad.category_name}</span>
  //                       </div>
  //                       {ad.subcategory_name && (
  //                         <div className="flex items-center">
  //                           <span className="text-muted-foreground ml-2"> التصنيف الفرعي : </span>
  //                           <span>{ad.subcategory_name}</span>
  //                         </div>
  //                       )}
  //                       <div className="flex items-center">
  //                         <span className="text-muted-foreground ml-2"> المدينة : </span>
  //                         <span>{ad.city_name}</span>
  //                       </div>
  //                       {ad.district_name && (
  //                         <div className="flex items-center">
  //                           <span className="text-muted-foreground ml-2"> الحي : </span>
  //                           <span>{ad.district_name}</span>
  //                         </div>
  //                       )}
  //                       <div className="flex items-center">
  //                         <span className="text-muted-foreground ml-2">نوع الإعلان  :  </span>
  //                         <span>
  //                           {
  //                             ad.listing_type === 'sell' ? ' بيع' : 
  //                             ad.listing_type === 'buy' ? ' شراء' : 
  //                             ad.listing_type === 'exchange' ? ' تبادل' : ' خدمة'
  //                           }
  //                         </span>
  //                       </div>
  //                       <div className="flex items-center">
  //                         <span className="text-muted-foreground ml-2">تاريخ النشر : </span>
  //                         <span>{new Date(ad.created_at).toLocaleDateString('ar-SA')}</span>
  //                       </div>
  //                     </div>
  //                   </div>
  //                 </div>
  //               </TabsContent>
                
  //               <TabsContent value="comments" className="pt-4">
  //                 <div className="space-y-4">
  //                   {/* Comment form */}
  //                   <form onSubmit={handleSubmitComment} className="space-y-3">
  //                     <Textarea
  //                       placeholder="اكتب تعليقك هنا..."
  //                       value={commentText}
  //                       onChange={(e) => setCommentText(e.target.value)}
  //                       className="resize-none"
  //                     />
  //                     <Button type="submit" disabled={!commentText.trim() || addCommentMutation.isPending}>
  //                       {addCommentMutation.isPending ? (
  //                         <>
  //                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  //                           جاري الإضافة...
  //                         </>
  //                       ) : 'إضافة تعليق'}
  //                     </Button>
  //                   </form>
                    
  //                   {/* Comments list */}
  //                   <div className="space-y-4 mt-6">
  //                     {comments.length === 0 ? (
  //                       <div className="text-center py-6 text-muted-foreground">
  //                         لا توجد تعليقات حتى الآن. كن أول من يعلق!
  //                       </div>
  //                     ) : (
  //                       comments.map((comment) => (
  //                         <div key={comment.id} className="border border-border rounded-lg overflow-hidden">
  //                           <div className="p-3 bg-gray-50 flex items-center">
  //                             <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden ml-2">
  //                               {comment.user.image ? (
  //                                 <img src={comment.user.image} alt={`${comment.user.first_name} ${comment.user.last_name}`} className="w-full h-full object-cover" />
  //                               ) : (
  //                                 <User className="w-full h-full p-1" />
  //                               )}
  //                             </div>
  //                             <div>
  //                               <div className="font-medium">{`${comment.user.first_name} ${comment.user.last_name}`}</div>
  //                               <div className="text-xs text-muted-foreground">
  //                                 {formatDistanceToNow(new Date(comment.created_at), { 
  //                                   addSuffix: true, 
  //                                   locale: ar
  //                                 })}
  //                               </div>
  //                             </div>
  //                           </div>
  //                           <div className="p-3">
  //                             <p>{comment.content}</p>
  //                           </div>
                            
  //                           {/* Replies */}
  //                           {comment.replies && comment.replies.length > 0 && (
  //                             <div className="border-t border-border">
  //                               {comment.replies.map((reply) => (
  //                                 <div key={reply.id} className="p-3 pr-6 border-b last:border-b-0 border-border bg-gray-50">
  //                                   <div className="flex items-center">
  //                                     <div className="w-6 h-6 rounded-full bg-gray-300 overflow-hidden ml-2">
  //                                       {reply.user.image ? (
  //                                         <img src={reply.user.image} alt={`${reply.user.first_name} ${reply.user.last_name}`} className="w-full h-full object-cover" />
  //                                       ) : (
  //                                         <User className="w-full h-full p-1" />
  //                                       )}
  //                                     </div>
  //                                     <div>
  //                                       <div className="font-medium text-sm">{`${reply.user.first_name} ${reply.user.last_name}`}</div>
  //                                       <div className="text-xs text-muted-foreground">
  //                                         {formatDistanceToNow(new Date(reply.created_at), { 
  //                                           addSuffix: true,
  //                                           locale: ar
  //                                         })}
  //                                       </div>
  //                                     </div>
  //                                   </div>
  //                                   <p className="mt-1 text-sm">{reply.content}</p>
  //                                 </div>
  //                               ))}
  //                             </div>
  //                           )}
                            
  //                           <div className="p-2 bg-gray-50 border-t border-border">
  //                             <Button 
  //                               variant="ghost" 
  //                               size="sm"
  //                               onClick={() => {
  //                                 if (!isAuthenticated) {
  //                                   toast({
  //                                     title: "تسجيل الدخول مطلوب",
  //                                     description: "يجب عليك تسجيل الدخول للرد على التعليقات",
  //                                     variant: "destructive"
  //                                   });
  //                                   navigate('/auth/login', { state: { from: `/ad/${id}` } });
  //                                   return;
  //                                 }
  //                                 // Reply functionality would go here
  //                               }}
  //                             >
  //                               <MessageSquare className="h-4 w-4 ml-2" />
  //                               الرد
  //                             </Button>
  //                           </div>
  //                         </div>
  //                       ))
  //                     )}
  //                   </div>
  //                 </div>
  //               </TabsContent>
  //             </Tabs>
  //           </div>
            
  //           {/* Sidebar */}
  //           <div className="md:col-span-1">
  //             {/* Seller info */}
  //             <div className="border border-border rounded-lg overflow-hidden mb-6">
  //               <div className="p-4 bg-gray-50 border-b border-border">
  //                 <h2 className="font-bold text-lg">معلومات المعلن</h2>
  //               </div>
  //               <div className="p-4">
  //                 {ad.user && (
  //                   <div className="flex items-center mb-4">
  //                     <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden ml-3">
  //                       {ad.user.image ? (
  //                         <img src={ad.user.image} alt={`${ad.user.first_name} ${ad.user.last_name}`} className="w-full h-full object-cover" />
  //                       ) : (
  //                         <User className="w-full h-full p-2" />
  //                       )}
  //                     </div>
  //                     <div>
  //                       <div className="font-bold">{`${ad.user.first_name} ${ad.user.last_name}`}</div>
  //                       <div className="text-sm text-muted-foreground">
  //                         عضو منذ {new Date(ad.user.created_at || '').toLocaleDateString('ar-SA')}
  //                       </div>
  //                     </div>
  //                     {ad.user.is_verified && (
  //                       <div className="mr-auto">
  //                         <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full flex items-center">
  //                           <Star className="h-3 w-3 ml-1 fill-green-700" />
  //                           موثق
  //                         </div>
  //                       </div>
  //                     )}
  //                   </div>
  //                 )}
                  
  //                 <div className="space-y-3">
  //                   {ad.user?.phone && (
  //                     <Button className="w-full flex items-center justify-center" size="lg">
  //                       <Phone className="ml-2 h-5 w-5" />
  //                       {ad.user.phone}
  //                     </Button>
  //                   )}
  //                   <Button 
  //                     variant="outline" 
  //                     className="w-full" 
  //                     size="lg" 
  //                     onClick={() => {
  //                       if (!isAuthenticated) {
  //                         toast({
  //                           title: "تسجيل الدخول مطلوب",
  //                           description: "يجب عليك تسجيل الدخول لإرسال رسالة",
  //                           variant: "destructive"
  //                         });
  //                         navigate('/auth/login', { state: { from: `/ad/${id}` } });
  //                         return;
  //                       }
  //                       navigate('/messages', { state: { userId: ad.user_id } });
  //                     }}
  //                   >
  //                     <MessageSquare className="ml-2 h-5 w-5" />
  //                     مراسلة
  //                   </Button>
  //                   <Button 
  //                     variant="ghost" 
  //                     className={`w-full border ${isFavorite ? 'text-red-500 border-red-200 bg-red-50' : ''}`} 
  //                     size="lg"
  //                     onClick={handleFavoriteToggle}
  //                   >
  //                     <Heart className={`ml-2 h-5 w-5 ${isFavorite ? 'fill-red-500' : ''}`} />
  //                     {isFavorite ? 'تمت الإضافة للمفضلة' : 'أضف للمفضلة'}
  //                   </Button>
  //                   <div className="flex justify-between pt-2">
  //                     <Button variant="ghost" size="sm">
  //                       <Share className="ml-1 h-4 w-4" />
  //                       مشاركة
  //                     </Button>
  //                     <Button 
  //                       variant="ghost" 
  //                       size="sm" 
  //                       className="text-red-500"
  //                       onClick={() => {
  //                         if (!isAuthenticated) {
  //                           toast({
  //                             title: "تسجيل الدخول مطلوب",
  //                             description: "يجب عليك تسجيل الدخول للإبلاغ عن الإعلان",
  //                             variant: "destructive"
  //                           });
  //                           navigate('/auth/login', { state: { from: `/ad/${id}` } });
  //                           return;
  //                         }
  //                         // Report functionality would go here
  //                         toast({
  //                           title: "تم الإبلاغ",
  //                           description: "شكراً لإبلاغك عن هذا الإعلان، سيتم مراجعته قريباً",
  //                         });
  //                       }}
  //                     >
  //                       <Flag className="ml-1 h-4 w-4" />
  //                       إبلاغ
  //                     </Button>
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>
              
  //             {/* Safety tips */}
  //             <div className="border border-border rounded-lg overflow-hidden mb-6">
  //               <div className="p-4 bg-gray-50 border-b border-border">
  //                 <h2 className="font-bold">نصائح للسلامة</h2>
  //               </div>
  //               <div className="p-4">
  //                 <ul className="text-sm space-y-2 list-disc pr-5">
  //                   <li>تأكد من مقابلة البائع في مكان عام</li>
  //                   <li>تحقق من المنتج قبل شرائه</li>
  //                   <li>استخدم طرق دفع آمنة</li>
  //                   <li>لا ترسل أموالاً مقدماً</li>
  //                   <li>كن حذراً من العروض المغرية جداً</li>
  //                 </ul>
  //               </div>
  //             </div>
              
  //             {/* Related ads */}
  //             {relatedAds.length > 0 && (
  //               <div className="border border-border rounded-lg overflow-hidden">
  //                 <div className="p-4 bg-gray-50 border-b border-border">
  //                   <h2 className="font-bold">إعلانات مشابهة</h2>
  //                 </div>
  //                 <div className="p-4 space-y-4">
  //                   {relatedAds.slice(0, 5).map((relatedAd) => (
  //                     <AdCard key={relatedAd.id} ad={relatedAd} layout="list" />
  //                   ))}
  //                 </div>
  //               </div>
  //             )}
  //           </div>
  //         </div>
  //       </div>
  //     </main>
      
  //     <Footer />
  //     <MobileNav />
  //   </div>
  // );

  return (
  <div className="min-h-screen flex flex-col bg-[#121212] text-gray-300">
    <Header />

    <main className="flex-1 pb-20 md:pb-0">
      <div className="container px-4 mx-auto py-6">
        <div className="text-sm mb-4 text-gray-500">
          <Link to="/" className="hover:text-brand">
            الرئيسية
          </Link>
          {' > '}
          <Link to={`/category/${ad.category_id}`} className="hover:text-brand">
            {ad.category_name || 'تصنيف'}
          </Link>
          {' > '}
          <span>{ad.title}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="rounded-lg overflow-hidden border border-gray-700 mb-4" style={{ borderColor: '#2c2c2c' }}>
              <div className="relative h-64 md:h-96" style={{ backgroundColor: '#1a1a1a' }}>
                {allImages && allImages.length > 0 ? (
                  <img
                    src={allImages[currentImageIndex]}
                    alt={ad.title}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">
                    لا توجد صورة
                  </div>
                )}

                {allImages && allImages.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-[#2c2c2c] hover:bg-[#3a3a3a]"
                      onClick={handlePrevImage}
                    >
                      <ChevronRight className="h-5 w-5 text-gray-300" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-[#2c2c2c] hover:bg-[#3a3a3a]"
                      onClick={handleNextImage}
                    >
                      <ChevronLeft className="h-5 w-5 text-gray-300" />
                    </Button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {allImages && allImages.length > 1 && (
                <div className="flex p-2 gap-2 overflow-x-auto" style={{ backgroundColor: '#121212' }}>
                  {allImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-16 h-16 flex-shrink-0 rounded overflow-hidden border-2 ${
                        index === currentImageIndex ? 'border-brand' : 'border-transparent'
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
              <TabsList className="w-full border-b" style={{ borderColor: '#2c2c2c', backgroundColor: '#1a1a1a' }}>
                <TabsTrigger
                  value="details"
                  className="flex-1 text-gray-300"
                >
                  التفاصيل
                </TabsTrigger>
                <TabsTrigger
                  value="comments"
                  className="flex-1 text-gray-300"
                >
                  التعليقات ({comments?.length || 0})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="pt-4">
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-100">
                      {ad.title}
                    </h1>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 ml-1 text-gray-500" />
                        <span className="mx-2">{timeAgo}</span>
                        <span className="mx-2">•</span>
                        <MapPin className="h-4 w-4 ml-1 text-gray-500" />
                        <span className="mx-2">{ad.city_name}</span>
                        <span className="mx-2">•</span>
                        <Eye className="h-4 w-4 ml-1 text-gray-500" />
                        <span className="mx-2">{ad.views_count || 0} مشاهدة</span>
                      </div>
                      <div className="font-bold text-2xl text-brand">
                        {ad.price?.toLocaleString()} ريال
                        {ad.is_negotiable && (
                          <span className="text-sm font-normal mr-1">
                            (قابل للتفاوض)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg" style={{ backgroundColor: '#1a1a1a' }}>
                    <h2 className="font-bold mb-2 text-gray-100">الوصف</h2>
                    <p className="whitespace-pre-line text-gray-400">{ad.description}</p>
                  </div>

                  <div className="p-4 rounded-lg" style={{ backgroundColor: '#1a1a1a' }}>
                    <h2 className="font-bold mb-2 text-gray-100">معلومات إضافية</h2>
                    <div className="grid grid-cols-2 gap-4 text-gray-400">
                      <div className="flex items-center">
                        <span className="ml-2">التصنيف :</span>
                        <span>{ad.category_name}</span>
                      </div>
                      {ad.subcategory_name && (
                        <div className="flex items-center">
                          <span className="ml-2">التصنيف الفرعي :</span>
                          <span>{ad.subcategory_name}</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <span className="ml-2">المدينة :</span>
                        <span>{ad.city_name}</span>
                      </div>
                      {ad.district_name && (
                        <div className="flex items-center">
                          <span className="ml-2">الحي :</span>
                          <span>{ad.district_name}</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <span className="ml-2">نوع الإعلان :</span>
                        <span>
                          {ad.listing_type === 'sell'
                            ? ' بيع'
                            : ad.listing_type === 'buy'
                            ? ' شراء'
                            : ad.listing_type === 'exchange'
                            ? ' تبادل'
                            : ' خدمة'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="ml-2">تاريخ النشر :</span>
                        <span>
                          {new Date(ad.created_at).toLocaleDateString('ar-SA')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="comments" className="pt-4">
                <div className="space-y-4">
                  {/* Comment form */}
                  <form onSubmit={handleSubmitComment} className="space-y-3">
                    <Textarea
                      placeholder="اكتب تعليقك هنا..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="resize-none border border-gray-600 bg-[#1a1a1a] text-gray-300 focus:border-brand"
                    />
                    <Button
                      type="submit"
                      disabled={!commentText.trim() || addCommentMutation.isPending}
                    >
                      {addCommentMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          جاري الإضافة...
                        </>
                      ) : (
                        'إضافة تعليق'
                      )}
                    </Button>
                  </form>

                  {/* Comments list */}
                  <div className="space-y-4 mt-6">
                    {comments.length === 0 ? (
                      <div className="text-center py-6 text-gray-600">
                        لا توجد تعليقات حتى الآن. كن أول من يعلق!
                      </div>
                    ) : (
                      comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="rounded-lg overflow-hidden border border-gray-700"
                          style={{ borderColor: '#2c2c2c' }}
                        >
                          <div className="p-3 bg-[#1a1a1a] flex items-center">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-[#2c2c2c] ml-2">
                              {comment.user.image ? (
                                <img
                                  src={comment.user.image}
                                  alt={`${comment.user.first_name} ${comment.user.last_name}`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <User className="w-full h-full p-1 text-gray-600" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-gray-300">{`${comment.user.first_name} ${comment.user.last_name}`}</div>
                              <div className="text-xs text-gray-500">
                                {formatDistanceToNow(new Date(comment.created_at), {
                                  addSuffix: true,
                                  locale: ar,
                                })}
                              </div>
                            </div>
                          </div>
                          <div className="p-4 text-gray-400">{comment.comment}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="md:col-span-1 space-y-4">
            {/* Seller Info */}
            <div className="p-4 rounded-lg border" style={{ borderColor: '#2c2c2c', backgroundColor: '#1a1a1a' }}>
              <h3 className="font-bold text-lg mb-2 text-gray-300">معلومات البائع</h3>
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-[#2c2c2c] ml-2">
                  {ad.user.image ? (
                    <img
                      src={ad.user.image}
                      alt={`${ad.user.first_name} ${ad.user.last_name}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-full h-full p-2 text-gray-600" />
                  )}
                </div>
                <div>
                  <div className="font-semibold text-gray-300">{`${ad.user.first_name} ${ad.user.last_name}`}</div>
                  <div className="text-xs text-gray-500">{ad.user.phone}</div>
                </div>
              </div>
              <Button
                as="a"
                href={`tel:${ad.user.phone}`}
                className="w-full justify-center"
              >
                الاتصال بالبائع
              </Button>
            </div>

            {/* Ad Summary */}
            <div className="p-4 rounded-lg text-gray-400" style={{ backgroundColor: '#1a1a1a', borderColor: '#2c2c2c', borderStyle: 'solid', borderWidth: 1 }}>
              <div className="mb-3">
                <span className="font-semibold">رقم الإعلان:</span> {ad.id}
              </div>
              <div className="mb-3">
                <span className="font-semibold">تاريخ النشر:</span>{' '}
                {new Date(ad.created_at).toLocaleDateString('ar-SA')}
              </div>
              <div>
                <span className="font-semibold">عدد المشاهدات:</span> {ad.views_count || 0}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
);

}
