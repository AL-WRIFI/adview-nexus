
import { useState } from 'react';
import { useDeleteListing } from '@/hooks/use-api';
import { useToast } from '@/hooks/use-toast';

export function useAdsDialog() {
  const [selectedAd, setSelectedAd] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [promoteDialogOpen, setPromoteDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  
  const { toast } = useToast();
  const deleteMutation = useDeleteListing();

  const handleDelete = async (adId: number) => {
    try {
      await deleteMutation.mutateAsync(adId);
      toast({
        title: "تم حذف الإعلان",
        description: "تم حذف الإعلان بنجاح"
      });
      setDeleteDialogOpen(false);
      setSelectedAd(null);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في حذف الإعلان",
        variant: "destructive"
      });
    }
  };

  return {
    selectedAd,
    setSelectedAd,
    deleteDialogOpen,
    setDeleteDialogOpen,
    promoteDialogOpen,
    setPromoteDialogOpen,
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    handleDelete,
    isDeleting: deleteMutation.isPending
  };
}
