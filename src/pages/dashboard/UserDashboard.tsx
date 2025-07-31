import { useState } from 'react';
import { DashboardSidebar } from './components/DashboardSidebar';
import { DashboardContent } from './components/DashboardContent';
import { PromoteDialog } from './dialogs/PromoteDialog';
import { DeleteConfirmDialog } from './dialogs/DeleteConfirmDialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { useAuth } from '@/context/auth-context';
import { useDeleteListing } from '@/hooks/use-api';

export default function UserDashboard() {
  const [activePage, setActivePage] = useState('overview');
  const [selectedAd, setSelectedAd] = useState<string | null>(null);
  const [promoteDialogOpen, setPromoteDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const isMobile = useIsMobile();
  const { isAuthenticated } = useAuth();
  const deleteListingMutation = useDeleteListing();

  const handleDeleteConfirm = () => {
    if (selectedAd) {
      deleteListingMutation.mutate(parseInt(selectedAd, 10));
      setDeleteConfirmOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pb-20 md:pb-0">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Desktop Sidebar */}
            {!isMobile && (
              <div className="lg:col-span-1">
                <DashboardSidebar 
                  activePage={activePage} 
                  setActivePage={setActivePage}
                />
              </div>
            )}
            
            {/* Mobile Navigation */}
            {isMobile && (
              <div className="lg:hidden">
                <DashboardSidebar 
                  activePage={activePage} 
                  setActivePage={setActivePage}
                  isMobile={true}
                />
              </div>
            )}
            
            {/* Main Content */}
            <div className="lg:col-span-3">
              <DashboardContent 
                activePage={activePage}
                selectedAd={selectedAd}
                setSelectedAd={setSelectedAd}
                promoteDialogOpen={promoteDialogOpen}
                setPromoteDialogOpen={setPromoteDialogOpen}
                deleteConfirmOpen={deleteConfirmOpen}
                setDeleteConfirmOpen={setDeleteConfirmOpen}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <MobileNav />
      
      {/* Dialogs */}
      <PromoteDialog 
        open={promoteDialogOpen}
        onOpenChange={setPromoteDialogOpen}
        adId={selectedAd ? parseInt(selectedAd) : null}
      />
      
      <DeleteConfirmDialog 
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        adId={selectedAd}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
