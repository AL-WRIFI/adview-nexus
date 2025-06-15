
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Eye, MessageCircle, TrendingUp, Package } from 'lucide-react';
import { useUserListings } from '@/hooks/use-api';
import { DeleteConfirmDialog } from '../../dialogs/DeleteConfirmDialog';
import { PromoteDialog } from '../../dialogs/PromoteDialog';
import { useAdsDialog } from '../../hooks/useAdsDialog';
import { useIsMobile } from '@/hooks/use-mobile';

export function AdsTab() {
  const [selectedAd, setSelectedAd] = useState<number | null>(null);
  const [promoteDialogOpen, setPromoteDialogOpen] = useState(false);
  const isMobile = useIsMobile();
  
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
        <CardContent className="p-0 md:p-6">
          <ScrollArea className="w-full">
            <div className="min-w-[800px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right w-20">الصورة</TableHead>
                    <TableHead className="text-right min-w-[200px]">العنوان</TableHead>
                    <TableHead className="text-right w-24">السعر</TableHead>
                    <TableHead className="text-right w-20">الحالة</TableHead>
                    <TableHead className="text-right w-20">المشاهدات</TableHead>
                    <TableHead className="text-right w-20">التعليقات</TableHead>
                    <TableHead className="text-right w-32">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userListings.map((ad: any) => (
                    <TableRow key={ad.id}>
                      <TableCell className="p-2">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                          {ad.main_image_url ? (
                            <img 
                              src={ad.main_image_url} 
                              alt={ad.title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Package className="h-4 w-4 md:h-6 md:w-6 text-muted-foreground" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="p-2">
                        <div className="space-y-1 min-w-0">
                          <h3 className="font-semibold text-xs md:text-sm truncate" title={ad.title}>
                            {ad.title}
                          </h3>
                          <p className="text-xs text-muted-foreground line-clamp-2 hidden md:block">
                            {ad.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="p-2">
                        <div className="text-xs md:text-sm font-bold text-brand whitespace-nowrap">
                          {ad.price} ريال
                        </div>
                      </TableCell>
                      <TableCell className="p-2">
                        <Badge 
                          variant={ad.status === 'active' ? 'default' : 'secondary'}
                          className="text-xs whitespace-nowrap"
                        >
                          {ad.status === 'active' ? 'نشط' : 'غير نشط'}
                        </Badge>
                      </TableCell>
                      <TableCell className="p-2">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                          <Eye className="h-3 w-3 md:h-4 md:w-4" />
                          <span>{ad.views_count || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell className="p-2">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                          <MessageCircle className="h-3 w-3 md:h-4 md:w-4" />
                          <span>{ad.comments_count || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell className="p-2">
                        <div className="flex gap-1 flex-nowrap">
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0 flex-shrink-0">
                            <Edit className="h-3 w-3 md:h-4 md:w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="h-8 w-8 p-0 flex-shrink-0"
                            onClick={() => handlePromoteClick(ad.id)}
                          >
                            <TrendingUp className="h-3 w-3 md:h-4 md:w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="h-8 w-8 p-0 flex-shrink-0"
                            onClick={() => handleDeleteClick(ad.id)}
                          >
                            <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
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
