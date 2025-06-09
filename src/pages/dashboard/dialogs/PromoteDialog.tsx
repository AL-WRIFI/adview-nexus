
import { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useUserListings } from '@/hooks/use-api';
import { usePromotionPackages } from '@/hooks/use-promotions';
import { PromoteListingDialog } from '@/components/promotions/PromoteListingDialog';
import { Listing } from '@/types';

interface PromoteDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function PromoteDialog({ open, setOpen }: PromoteDialogProps) {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [promoteDialogOpen, setPromoteDialogOpen] = useState(false);

  const { data: userListingsResponse } = useUserListings();
  const { data: packages } = usePromotionPackages();

  // Handle both array and paginated response structures
  const userListings = Array.isArray(userListingsResponse) 
    ? userListingsResponse 
    : userListingsResponse?.data || [];

  const handleSelectListing = (listing: Listing) => {
    setSelectedListing(listing);
    setOpen(false);
    setPromoteDialogOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ترقية الإعلان</DialogTitle>
            <DialogDescription>
              اختر الإعلان الذي تريد ترقيته
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="rounded-lg border overflow-hidden">
              <div className="bg-gray-50 p-3 border-b">
                <h3 className="font-medium">اختر الإعلان المراد ترقيته</h3>
              </div>
              <div className="p-3 max-h-60 overflow-y-auto">
                {userListings && userListings.length > 0 ? (
                  <div className="space-y-2">
                    {userListings.map((listing) => (
                      <div 
                        key={listing.id} 
                        className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleSelectListing(listing)}
                      >
                        <div className="flex items-center gap-3">
                          {typeof listing.image === 'string' ? (
                            <img 
                              src={listing.image} 
                              alt={listing.title}
                              className="w-12 h-12 object-cover rounded"
                            />
                          ) : (
                            <img 
                              src={listing.image?.image_url || '/placeholder.svg'} 
                              alt={listing.title}
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                          <div>
                            <div className="font-medium">{listing.title}</div>
                            <div className="text-sm text-muted-foreground">{listing.price} ريال</div>
                          </div>
                        </div>
                        <Button size="sm">اختر</Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    لا توجد إعلانات متاحة
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <PromoteListingDialog
        open={promoteDialogOpen}
        onOpenChange={setPromoteDialogOpen}
        listing={selectedListing}
      />
    </>
  );
}
