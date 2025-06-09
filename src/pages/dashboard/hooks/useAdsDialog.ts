
import { useState } from 'react';
import { useDeleteListing } from '@/hooks/use-api';
import { toast } from 'sonner';

export function useAdsDialog() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [promoteDialogOpen, setPromoteDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState<any>(null);

  const deleteListingMutation = useDeleteListing();

  const handleDelete = async (adId: number) => {
    try {
      await deleteListingMutation.mutateAsync(adId);
      toast.success('تم حذف الإعلان بنجاح');
      setDeleteDialogOpen(false);
      setSelectedAd(null);
    } catch (error) {
      console.error('خطأ في حذف الإعلان:', error);
      toast.error('حدث خطأ أثناء حذف الإعلان');
    }
  };

  return {
    deleteDialogOpen,
    setDeleteDialogOpen,
    promoteDialogOpen,
    setPromoteDialogOpen,
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    selectedAd,
    setSelectedAd,
    handleDelete,
    isDeleting: deleteListingMutation.isPending,
  };
}
