import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, MapPin, Clock, Edit, Trash2, MoreVertical, Image as ImageIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/auth-context';
import { useAds, useDeleteListing } from '@/hooks/use-api';
import { Listing } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

export function MobileOptimizedAdsTab() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [adToDelete, setAdToDelete] = useState<Listing | null>(null);
  
  const { data: adsResponse, isLoading, refetch } = useAds({
    page: currentPage,
    per_page: 10,
    user_id: user?.id?.toString() || ''
  });

  const deleteListingMutation = useDeleteListing();

  const ads = adsResponse?.data?.data || adsResponse?.data || [];

  const handleDeleteClick = (ad: Listing) => {
    setAdToDelete(ad);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!adToDelete) return;
    
    try {
      await deleteListingMutation.mutateAsync(adToDelete.id);
      toast({
        title: "تم حذف الإعلان",
        description: "تم حذف الإعلان بنجاح",
      });
      refetch();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف الإعلان",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setAdToDelete(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: { label: 'نشط', variant: 'default' as const },
      sold: { label: 'تم البيع', variant: 'secondary' as const },
      expired: { label: 'منتهي الصلاحية', variant: 'destructive' as const },
      draft: { label: 'مسودة', variant: 'outline' as const },
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.active;
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  // Get image URL helper function
  const getImageUrl = (ad: Listing) => {
    if (ad.main_image_url) {
      return ad.main_image_url;
    }
    
    if (ad.images && Array.isArray(ad.images) && ad.images.length > 0) {
      const firstImage = ad.images[0];
      if (typeof firstImage === 'string') {
        return firstImage;
      } else if (typeof firstImage === 'object' && firstImage !== null && 'url' in firstImage) {
        return (firstImage as any).url;
      } else if (typeof firstImage === 'object' && firstImage !== null && 'image_url' in firstImage) {
        return (firstImage as any).image_url;
      }
    }
    
    return null;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <div className="w-20 h-20 bg-gray-200 rounded-md flex-shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {Array.isArray(ads) && ads.length > 0 ? (
          ads.map((ad) => {
            const imageUrl = getImageUrl(ad);
            const timeAgo = formatDistanceToNow(new Date(ad.created_at), { 
              addSuffix: true,
              locale: ar
            });

            return (
              <Card key={ad.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    {/* Image */}
                    <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                      {imageUrl ? (
                        <img 
                          src={imageUrl} 
                          alt={ad.title} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <ImageIcon className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-sm truncate">{ad.title}</h3>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/ad/${ad.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                عرض
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to={`/edit-ad/${ad.id}`}>
                                <Edit className="h-4 w-4 mr-2" />
                                تعديل
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteClick(ad)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              حذف
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        {getStatusBadge(ad.status)}
                        {ad.price > 0 && (
                          <span className="text-sm font-medium text-green-600">
                            {ad.price.toLocaleString()} ريال
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          <span>{ad.views_count || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{timeAgo}</span>
                        </div>
                        {(ad.city_name || ad.city) && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{ad.city_name || ad.city}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <ImageIcon className="h-16 w-16 mx-auto mb-4" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد إعلانات</h3>
            <p className="text-gray-500 mb-6">لم تقم بإنشاء أي إعلانات بعد</p>
            <Button asChild>
              <Link to="/create-ad">إنشاء إعلان جديد</Link>
            </Button>
          </div>
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من رغبتك في حذف الإعلان "{adToDelete?.title}"؟ 
              لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
