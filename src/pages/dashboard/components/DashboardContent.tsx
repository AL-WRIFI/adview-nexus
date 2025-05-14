
import React from 'react';
import AdsTab from './tabs/AdsTab';
import FavoritesTab from './tabs/FavoritesTab';
import MessagesTab from './tabs/MessagesTab';
import NotificationsTab from './tabs/NotificationsTab';
import ProfileTab from './tabs/ProfileTab';
import StatisticsTab from './tabs/StatisticsTab';
import PromoteTab from './tabs/PromoteTab';
import PlaceholderTab from './tabs/PlaceholderTab';
import { PromoteDialog } from '../dialogs/PromoteDialog';
import { DeleteConfirmDialog } from '../dialogs/DeleteConfirmDialog';
import { Ad } from '@/types';
import { useState } from 'react';
import { useDeleteListing } from '@/hooks/use-api';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface DashboardContentProps {
  activePage: string;
  selectedAd?: Ad | null;
  setSelectedAd: (ad: Ad | null) => void;
  promoteDialogOpen: boolean;
  setPromoteDialogOpen: (open: boolean) => void;
  deleteConfirmOpen: boolean;
  setDeleteConfirmOpen: (open: boolean) => void;
}

function DashboardContent({ 
  activePage, 
  selectedAd, 
  setSelectedAd,
  promoteDialogOpen,
  setPromoteDialogOpen,
  deleteConfirmOpen,
  setDeleteConfirmOpen
}: DashboardContentProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteListing = useDeleteListing();
  
  const handlePromoteAd = (ad: Ad | null) => {
    if (ad) {
      setSelectedAd(ad);
      setPromoteDialogOpen(true);
    }
  };
  
  const handleDeleteAd = (ad: Ad | null) => {
    if (ad) {
      setSelectedAd(ad);
      setDeleteConfirmOpen(true);
    }
  };
  
  const confirmDelete = async () => {
    if (!selectedAd) return;
    
    try {
      setIsDeleting(true);
      await deleteListing.mutateAsync(selectedAd.id);
      
      toast({
        title: "تم حذف الإعلان بنجاح",
        description: "تم حذف الإعلان من قائمة إعلاناتك",
      });
      
      setSelectedAd(null);
      setDeleteConfirmOpen(false);
    } catch (error) {
      console.error('Error deleting ad:', error);
      toast({
        title: "فشل حذف الإعلان",
        description: "حدث خطأ أثناء محاولة حذف الإعلان، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  const renderActiveTab = () => {
    switch (activePage) {
      case 'ads':
        return <AdsTab onPromote={handlePromoteAd} onDelete={handleDeleteAd} />;
      case 'favorites':
        return <FavoritesTab />;
      case 'messages':
        return <MessagesTab />;
      case 'notifications':
        return <NotificationsTab />;
      case 'profile':
        return <ProfileTab />;
      case 'statistics':
        return <StatisticsTab />;
      case 'promote':
        return <PromoteTab />;
      default:
        return <PlaceholderTab title={activePage} />;
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-border dark:bg-gray-800 dark:border-gray-700">
      {renderActiveTab()}
      
      <PromoteDialog
        open={promoteDialogOpen}
        onOpenChange={setPromoteDialogOpen}
        ad={selectedAd}
      />
      
      <DeleteConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={confirmDelete}
        title="حذف الإعلان"
        description="هل أنت متأكد من رغبتك في حذف هذا الإعلان؟ لا يمكن التراجع عن هذا الإجراء."
        confirmText={isDeleting ? <><Loader2 className="w-4 h-4 ml-2 animate-spin" /> جاري الحذف...</> : "نعم، احذف الإعلان"}
        cancelText="إلغاء"
        isLoading={isDeleting}
      />
    </div>
  );
}

export default DashboardContent;
