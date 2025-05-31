
import { AdsTab } from './tabs/AdsTab';
import { PromoteTab } from './tabs/PromoteTab';
import { PlaceholderTab } from './tabs/PlaceholderTab';
import { PromoteDialog } from '../dialogs/PromoteDialog';
import { DeleteConfirmDialog } from '../dialogs/DeleteConfirmDialog';

interface DashboardContentProps {
  activePage: string;
  selectedAd: string | null;
  setSelectedAd: (id: string | null) => void;
  promoteDialogOpen: boolean;
  setPromoteDialogOpen: (open: boolean) => void;
  deleteConfirmOpen: boolean;
  setDeleteConfirmOpen: (open: boolean) => void;
}

export default function DashboardContent({
  activePage,
  selectedAd,
  setSelectedAd,
  promoteDialogOpen,
  setPromoteDialogOpen,
  deleteConfirmOpen,
  setDeleteConfirmOpen
}: DashboardContentProps) {
  
  return (
    <>
      {activePage === 'ads' && (
        <AdsTab 
          setSelectedAd={setSelectedAd}
          setDeleteConfirmOpen={setDeleteConfirmOpen}
          setPromoteDialogOpen={setPromoteDialogOpen}
        />
      )}
      
      {activePage === 'promote' && (
        <PromoteTab setPromoteDialogOpen={setPromoteDialogOpen} />
      )}
      
      {(activePage === 'favorites' || activePage === 'messages' || 
        activePage === 'notifications' || activePage === 'settings') && (
        <PlaceholderTab tabName={activePage} />
      )}
      
      {/* Dialogs */}
      <PromoteDialog 
        open={promoteDialogOpen} 
        setOpen={setPromoteDialogOpen} 
      />
      
      <DeleteConfirmDialog 
        open={deleteConfirmOpen} 
        setOpen={setDeleteConfirmOpen} 
      />
    </>
  );
}
