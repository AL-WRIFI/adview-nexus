
import { useState } from 'react';
import { useDeleteListing } from '@/hooks/use-api';
import { useToast } from '@/hooks/use-toast';

export function useAdsDialog() {
  const [selectedAd, setSelectedAd] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [promoteDialogOpen, setPromoteDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [adToDelete, setAdToDelete] = useState<number | null>(null);
  
  const { toast } = useToast();
  const deleteMutation = useDeleteListing();

  const handleDeleteClick = (adId: number) => {
    setAdToDelete(adId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!adToDelete) return;
    
    try {
      await deleteMutation.mutateAsync(adToDelete);
      toast({
        title: "تم حذف الإعلان",
        description: "تم حذف الإعلان بنجاح"
      });
      setDeleteDialogOpen(false);
      setAdToDelete(null);
      setSelectedAd(null);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في حذف الإعلان",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setAdToDelete(null);
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
    adToDelete,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    isDeleting: deleteMutation.isPending
  };
}
