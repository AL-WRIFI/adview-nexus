
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Edit2, Eye, Trash2, TrendingUp, MessageSquare, Heart, Plus } from 'lucide-react';
import { useUserListings } from '@/hooks/use-api';
import { DeleteConfirmDialog } from '@/pages/dashboard/dialogs/DeleteConfirmDialog';
import { useAdsDialog } from '@/pages/dashboard/hooks/useAdsDialog';
import { Link } from 'react-router-dom';

export function AdsTab() {
  const [selectedAdId, setSelectedAdId] = useState<number | null>(null);
  const { data: userListings, isLoading: loadingListings, refetch } = useUserListings();
  const {
    deleteDialogOpen,
    setDeleteDialogOpen,
    selectedAd,
    handleDelete,
    isDeleting
  } = useAdsDialog();

  const handleDeleteClick = (ad: any) => {
    setSelectedAdId(ad.id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedAdId) {
      await handleDelete(selectedAdId);
      setSelectedAdId(null);
      refetch();
    }
  };

  if (loadingListings) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  // Handle both array and paginated response structures
  const listings = Array.isArray(userListings) ? userListings : userListings?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">إعلاناتي</h2>
          <p className="text-muted-foreground">إدارة إعلاناتك المنشورة</p>
        </div>
        <Button asChild>
          <Link to="/add-ad">
            <Plus className="h-4 w-4 mr-2" />
            إضافة إعلان جديد
          </Link>
        </Button>
      </div>

      {listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map((ad) => (
            <Card key={ad.id} className="overflow-hidden">
              <div className="aspect-video relative bg-gray-100">
                {typeof ad.image === 'string' ? (
                  <img 
                    src={ad.image} 
                    alt={ad.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img 
                    src={ad.image?.image_url || '/placeholder.svg'} 
                    alt={ad.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute top-2 right-2">
                  <Badge variant={ad.status === 'active' ? 'default' : 'secondary'}>
                    {ad.status === 'active' ? 'نشط' : 'غير نشط'}
                  </Badge>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="line-clamp-2">{ad.title}</CardTitle>
                <div className="text-lg font-bold text-brand">{ad.price} ريال</div>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{ad.views_count || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{ad.comments_count || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    <span>{ad.favorites_count || 0}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" asChild className="flex-1">
                    <Link to={`/edit-ad/${ad.id}`}>
                      <Edit2 className="h-4 w-4 mr-1" />
                      تعديل
                    </Link>
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleDeleteClick(ad)}
                    className="flex-1 hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    حذف
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>لا توجد إعلانات منشورة بعد</p>
              <p className="text-sm">ابدأ بإضافة إعلانك الأول</p>
            </div>
            <Button asChild>
              <Link to="/add-ad">
                <Plus className="h-4 w-4 mr-2" />
                إضافة إعلان جديد
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        title="حذف الإعلان"
        description="هل أنت متأكد من حذف هذا الإعلان؟ لا يمكن التراجع عن هذا الإجراء."
      />
    </div>
  );
}
