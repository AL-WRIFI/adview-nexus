
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
    handleDeleteCancel,
    isDeleting
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
      const responseData = (userListingsResponse as any).data;
      return Array.isArray(responseData) ? responseData : [];
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
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الصورة</TableHead>
                  <TableHead className="text-right">العنوان</TableHead>
                  <TableHead className="text-right">السعر</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">المشاهدات</TableHead>
                  <TableHead className="text-right">التعليقات</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userListings.map((ad: any) => (
                  <TableRow key={ad.id}>
                    <TableCell>
                      <div className="w-16 h-16 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                        {ad.main_image_url ? (
                          <img 
                            src={ad.main_image_url} 
                            alt={ad.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Package className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <h3 className="font-semibold text-sm max-w-[200px] truncate" title={ad.title}>
                          {ad.title}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 max-w-[200px]">
                          {ad.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-bold text-brand">
                        {ad.price} ريال
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={ad.status === 'active' ? 'default' : 'secondary'}>
                        {ad.status === 'active' ? 'نشط' : 'غير نشط'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Eye className="h-4 w-4" />
                        <span>{ad.views_count || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MessageCircle className="h-4 w-4" />
                        <span>{ad.comments_count || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => !open && handleDeleteCancel()}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        title="حذف الإعلان"
        description="هل أنت متأكد من أنك تريد حذف هذا الإعلان؟ لا يمكن التراجع عن هذا الإجراء."
      />

      <PromoteDialog
        open={promoteDialogOpen}
        onOpenChange={setPromoteDialogOpen}
        adId={selectedAd}
      />
    </div>
  );
}
