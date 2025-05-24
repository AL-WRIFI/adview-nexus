
import { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Heart, 
  MapPin, 
  Calendar, 
  Eye, 
  Share2, 
  MessageCircle, 
  Phone, 
  User,
  ChevronLeft,
  ChevronRight,
  X,
  Edit,
  Trash2,
  Reply,
  MoreHorizontal
} from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { 
  useListing, 
  useRelatedListings, 
  useAddToFavorites,
  useRemoveFromFavorites,
  useIsFavorite,
  useAddComment,
  useDeleteComment,
  useEditComment,
  useAddReply,
  useDeleteReply,
  useEditReply,
  useCurrentUser
} from '@/hooks/use-api';
import { useAuth } from '@/context/auth-context';
import { AdCard } from '@/components/ads/ad-card';
import { RelatedAdsCarousel } from '@/components/ads/related-ads-carousel';

export default function AdDetails() {
  const { id } = useParams<{ id: string }>();
  const adId = parseInt(id || '0');
  const { user } = useAuth();
  const { data: currentUser } = useCurrentUser();
  
  const { data: ad, isLoading, error } = useListing(adId);
  const { data: relatedAds } = useRelatedListings(adId, 6);
  const { data: isFavorite } = useIsFavorite(adId);
  
  const addToFavoritesMutation = useAddToFavorites();
  const removeFromFavoritesMutation = useRemoveFromFavorites();
  const addCommentMutation = useAddComment(adId);
  const deleteCommentMutation = useDeleteComment(adId);
  const editCommentMutation = useEditComment(adId, 0);
  const addReplyMutation = useAddReply(adId, 0);
  const deleteReplyMutation = useDeleteReply(adId, 0);
  const editReplyMutation = useEditReply(adId, 0);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  // Comment states
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [editingReply, setEditingReply] = useState<number | null>(null);
  const [editReplyText, setEditReplyText] = useState('');

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
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
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">الإعلان غير موجود</h1>
            <Link to="/" className="text-blue-600 hover:underline">
              العودة للصفحة الرئيسية
            </Link>
          </div>
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  const handleFavoriteToggle = async () => {
    try {
      if (isFavorite) {
        await removeFromFavoritesMutation.mutateAsync(adId);
      } else {
        await addToFavoritesMutation.mutateAsync(adId);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await addCommentMutation.mutateAsync(newComment);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleEditComment = async (commentId: number) => {
    if (!editCommentText.trim()) return;
    try {
      await editCommentMutation.mutateAsync(editCommentText);
      setEditingComment(null);
      setEditCommentText('');
    } catch (error) {
      console.error('Error editing comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await deleteCommentMutation.mutateAsync(commentId);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleAddReply = async (commentId: number) => {
    if (!replyText.trim()) return;
    try {
      await addReplyMutation.mutateAsync(replyText);
      setReplyingTo(null);
      setReplyText('');
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  // Get images safely
  const getImages = () => {
    const images = [];
    
    // Add main image if exists
    if (ad.image && typeof ad.image === 'object' && 'url' in ad.image) {
      images.push(ad.image.url);
    }
    
    // Add gallery images if exist
    if (ad.images && Array.isArray(ad.images)) {
      const galleryUrls = ad.images
        .map(img => typeof img === 'object' && 'url' in img ? img.url : null)
        .filter(Boolean);
      images.push(...galleryUrls);
    }
    
    return images.length > 0 ? images : ['/placeholder.svg'];
  };

  const images = getImages();

  // Image zoom and pan handlers
  const handleImageClick = (e: React.MouseEvent) => {
    if (zoomLevel === 1) {
      setZoomLevel(2);
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setDragPosition({
        x: -(x - rect.width / 2),
        y: -(y - rect.height / 2)
      });
    } else {
      setZoomLevel(1);
      setDragPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - dragPosition.x,
        y: e.clientY - dragPosition.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      setDragPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SY', {
      style: 'currency',
      currency: 'SYP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <Header />
      
      <main className="flex-1 pb-20 md:pb-0">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          {/* Ad Title and Description */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                  {ad.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 ml-1" />
                    <span>{new Date(ad.created_at).toLocaleDateString('ar-SY')}</span>
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 ml-1" />
                    <span>{ad.views || 0} مشاهدة</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 ml-1" />
                    <span>{ad.city?.name || 'غير محدد'}</span>
                  </div>
                </div>
              </div>
              
              {ad.featured && (
                <Badge className="bg-yellow-500 text-black">
                  إعلان مميز
                </Badge>
              )}
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {ad.description}
              </p>
              
              <div className="flex items-center justify-between mt-6 pt-6 border-t">
                <div className="text-3xl font-bold text-primary">
                  {formatPrice(ad.price)}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleFavoriteToggle}
                    className={isFavorite ? 'text-red-500 border-red-500' : ''}
                  >
                    <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </Button>
                  
                  <Button variant="outline" size="icon">
                    <Share2 className="h-5 w-5" />
                  </Button>
                  
                  <Button>
                    <Phone className="h-4 w-4 ml-2" />
                    اتصل الآن
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="mb-8">
            <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-sm">
              <div className="relative">
                <div 
                  className="aspect-video bg-gray-100 dark:bg-gray-800 overflow-hidden cursor-zoom-in"
                  onClick={handleImageClick}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  <img
                    ref={imageRef}
                    src={images[currentImageIndex]}
                    alt={ad.title}
                    className="w-full h-full object-contain transition-transform duration-200"
                    style={{
                      transform: `scale(${zoomLevel}) translate(${dragPosition.x / zoomLevel}px, ${dragPosition.y / zoomLevel}px)`,
                      transformOrigin: 'center center'
                    }}
                    draggable={false}
                  />
                </div>
                
                {images.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                      onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                      onClick={() => setCurrentImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>
              
              {images.length > 1 && (
                <div className="p-4 border-t">
                  <div className="flex gap-2 overflow-x-auto">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                          currentImageIndex === index 
                            ? 'border-primary' 
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${ad.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Comments Section */}
          <div className="mb-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <MessageCircle className="h-5 w-5 ml-2" />
                  التعليقات ({ad.comments?.length || 0})
                </h3>

                {/* Add Comment */}
                {user && (
                  <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>
                          {user.first_name?.[0]}{user.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Textarea
                          placeholder="اكتب تعليقك هنا..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="mb-3"
                        />
                        <Button 
                          onClick={handleAddComment}
                          disabled={!newComment.trim() || addCommentMutation.isPending}
                          size="sm"
                        >
                          إضافة تعليق
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Comments List */}
                <div className="space-y-4">
                  {ad.comments?.map((comment) => (
                    <div key={comment.id} className="border-b last:border-b-0 pb-4 last:pb-0">
                      <div className="flex gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={comment.user?.avatar} />
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <span className="font-medium text-sm">
                                {comment.user?.first_name} {comment.user?.last_name}
                              </span>
                              <span className="text-xs text-muted-foreground mr-2">
                                {new Date(comment.created_at).toLocaleDateString('ar-SY')}
                              </span>
                            </div>
                            
                            {user && user.id === comment.user_id && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem 
                                    onClick={() => {
                                      setEditingComment(comment.id);
                                      setEditCommentText(comment.content);
                                    }}
                                  >
                                    <Edit className="h-4 w-4 ml-2" />
                                    تعديل
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleDeleteComment(comment.id)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4 ml-2" />
                                    حذف
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                          
                          {editingComment === comment.id ? (
                            <div className="space-y-2">
                              <Textarea
                                value={editCommentText}
                                onChange={(e) => setEditCommentText(e.target.value)}
                              />
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  onClick={() => handleEditComment(comment.id)}
                                >
                                  حفظ
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => {
                                    setEditingComment(null);
                                    setEditCommentText('');
                                  }}
                                >
                                  إلغاء
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                                {comment.content}
                              </p>
                              
                              {user && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setReplyingTo(comment.id);
                                    setReplyText('');
                                  }}
                                >
                                  <Reply className="h-3 w-3 ml-1" />
                                  رد
                                </Button>
                              )}
                            </>
                          )}
                          
                          {/* Reply Form */}
                          {replyingTo === comment.id && (
                            <div className="mt-3 mr-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <Textarea
                                placeholder="اكتب ردك هنا..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                className="mb-2"
                              />
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  onClick={() => handleAddReply(comment.id)}
                                  disabled={!replyText.trim()}
                                >
                                  إضافة رد
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => {
                                    setReplyingTo(null);
                                    setReplyText('');
                                  }}
                                >
                                  إلغاء
                                </Button>
                              </div>
                            </div>
                          )}
                          
                          {/* Replies */}
                          {comment.replies?.map((reply) => (
                            <div key={reply.id} className="mt-3 mr-4 flex gap-2">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={reply.user?.avatar} />
                                <AvatarFallback>
                                  <User className="h-3 w-3" />
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-medium text-xs">
                                    {reply.user?.first_name} {reply.user?.last_name}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(reply.created_at).toLocaleDateString('ar-SY')}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                  {reply.content}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Related Ads */}
          {relatedAds && relatedAds.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-6">إعلانات مشابهة</h3>
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
