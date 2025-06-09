
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  TrendingUp,
  AlertCircle,
  Package,
  MoreHorizontal
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserListings, useDeleteListing } from '@/hooks/use-api';
import { Listing } from '@/types';
import { PromoteListingDialog } from '@/components/promotions/PromoteListingDialog';
import { toast } from 'sonner';

export function AdsTab() {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [promoteDialogOpen, setPromoteDialogOpen] = useState(false);
  
  const { data: userListingsResponse, isLoading } = useUserListings();
  const deleteListingMutation = useDeleteListing();

  const handlePromote = (listing: Listing) => {
    setSelectedListing(listing);
    setPromoteDialogOpen(true);
  };

  const handleDelete = async (listingId: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الإعلان؟')) {
      try {
        await deleteListingMutation.mutateAsync(listingId);
        toast.success('تم حذف الإعلان بنجاح');
      } catch (error) {
        console.error('خطأ في حذف الإعلان:', error);
        toast.error('حدث خطأ أثناء حذف الإعلان');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  // Handle both array and paginated response structures
  let listings: Listing[] = [];
  if (Array.isArray(userListingsResponse)) {
    listings = userListingsResponse;
  } else if (userListingsResponse && typeof userListingsResponse === 'object' && 'data' in userListingsResponse) {
    listings = Array.isArray(userListingsResponse.data) ? userListingsResponse.data : [];
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            إعلاناتي ({listings.length})
          </CardTitle>
          <Button asChild>
            <Link to="/add-ad">
              <Plus className="h-4 w-4 mr-2" />
              إضافة إعلان جديد
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {listings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {listings.map((listing: Listing) => (
                <Card key={listing.id} className="relative overflow-hidden">
                  <div className="aspect-video bg-gray-100 relative">
                    {listing.main_image_url ? (
                      <img 
                        src={listing.main_image_url} 
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <Package className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    
                    {listing.featured && (
                      <Badge className="absolute top-2 right-2 bg-brand text-white">
                        مميز
                      </Badge>
                    )}
                    
                    <div className="absolute top-2 left-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="secondary" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/ad/${listing.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              عرض الإعلان
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/edit-ad/${listing.id}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              تعديل
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handlePromote(listing)}>
                            <TrendingUp className="mr-2 h-4 w-4" />
                            ترقية الإعلان
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-500 focus:text-red-500"
                            onClick={() => handleDelete(listing.id)}
                            disabled={deleteListingMutation.isPending}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            حذف
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">{listing.title}</h3>
                    <p className="text-brand font-bold mb-2">{listing.price} ريال</p>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{listing.views_count || 0}</span>
                      </div>
                      
                      <Badge 
                        variant={listing.status === 'active' ? 'default' : 
                                listing.status === 'inactive' ? 'secondary' : 'destructive'}
                      >
                        {listing.status === 'active' ? 'نشط' :
                         listing.status === 'inactive' ? 'متوقف' : 'مباع'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">لا توجد إعلانات</h3>
              <p className="text-muted-foreground mb-4">
                لم تقم بإنشاء أي إعلان حتى الآن
              </p>
              <Button asChild>
                <Link to="/add-ad">
                  <Plus className="h-4 w-4 mr-2" />
                  إضافة إعلان جديد
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <PromoteListingDialog
        open={promoteDialogOpen}
        onOpenChange={setPromoteDialogOpen}
        listing={selectedListing}
      />
    </>
  );
}
