
import { useState } from 'react';
import { Ad } from '@/types';

export const useAdsDialog = () => {
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [promoteDialogOpen, setPromoteDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  
  return {
    selectedAd,
    setSelectedAd,
    promoteDialogOpen,
    setPromoteDialogOpen,
    deleteConfirmOpen,
    setDeleteConfirmOpen
  };
};
