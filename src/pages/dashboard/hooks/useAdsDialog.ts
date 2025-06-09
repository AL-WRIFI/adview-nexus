
import { useState } from 'react';
import { useDeleteListing } from '@/hooks/use-api';

export function useAdsDialog() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState<any>(null);

  const deleteListing = useDeleteListing();

  const handleDelete = async (adId: number) => {
    try {
      await deleteListing.mutateAsync(adId);
      setDeleteDialogOpen(false);
      setSelectedAd(null);
    } catch (error) {
      console.error('Error deleting listing:', error);
    }
  };

  return {
    deleteDialogOpen,
    setDeleteDialogOpen,
    selectedAd,
    setSelectedAd,
    handleDelete,
    isDeleting: deleteListing.isPending
  };
}
