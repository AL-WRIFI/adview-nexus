
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Edit, Trash2, Eye, MessageCircle, TrendingUp, Package } from 'lucide-react';
import { useUserListings } from '@/hooks/use-api';
import { DeleteConfirmDialog } from '../../dialogs/DeleteConfirmDialog';
import { PromoteDialog } from '../../dialogs/PromoteDialog';
import { useAdsDialog } from '../../hooks/useAdsDialog';

export function AdsTab() {
  const [selectedAd, setSelectedAd] = useState<number | null>(null);
  const [promoteDialogOpen, setPromoteDialogOpen] = useState(false);
  
  const { data: userListingsResponse, isLoading } = useUserListings();
  const {
    deleteDialogOpen,
    adToDelete,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel
  } = useAdsDialog();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  // Handle different response formats from the API
  const userListings = React.useMemo(() => {
    if (!userListingsResponse) return [];
    
    // If it's a direct array
    if (Array.isArray(userListingsResponse)) {
      return userListingsResponse;
    }
    
    // If it's an object with data property
    if (userListingsResponse && typeof userListingsResponse === 'object' && 'data' in userListingsResponse) {
      return Array.isArray(userListingsResponse.data) ? userListingsResponse.data : [];
    }
    
    return [];
  }, [userListingsResponse]);

  const handlePromoteClick = (adId: number) => {
    setSelectedAd(adId);
    setPromoteDialogOpen(true);
  };

  if (!userListings || userListings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>إعلاناتي</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">لا توجد إعلانات</h3>
            <p className="text-muted-foreground">لم تقم بإضافة أي إعلان بعد</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>إعلاناتي ({userListings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userListings.map((ad: any) => (
              <Card key={ad.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                        {ad.main_image_url ? (
                          <img 
                            src={ad.main_image_url} 
                            alt={ad.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Package className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold mb-2">{ad.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {ad.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{ad.views_count || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            <span>{ad.comments_count || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-lg font-bold text-brand">
                        {ad.price} ريال
                      </div>
                      <Badge variant={ad.status === 'active' ? 'default' : 'secondary'}>
                        {ad.status === 'active' ? 'نشط' : 'غير نشط'}
                      </Badge>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handlePromoteClick(ad.id)}
                        >
                          <TrendingUp className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeleteClick(ad.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      <PromoteDialog
        open={promoteDialogOpen}
        onOpenChange={setPromoteDialogOpen}
        adId={selectedAd}
      />
    </div>
  );
}
