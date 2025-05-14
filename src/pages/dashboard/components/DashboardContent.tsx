
import { AdsTab } from './tabs/AdsTab';
import { MessagesTab } from './tabs/MessagesTab';
import { ProfileTab } from './tabs/ProfileTab';
import { NotificationsTab } from './tabs/NotificationsTab';
import { FavoritesTab } from './tabs/FavoritesTab';
import { StatisticsTab } from './tabs/StatisticsTab';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useDeleteListing } from '@/hooks/use-api';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface DashboardContentProps {
  activePage: string;
  selectedAd: number | null;
  setSelectedAd: (id: number | null) => void;
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
  setDeleteConfirmOpen,
}: DashboardContentProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteMutation = useDeleteListing();
  
  const renderTab = () => {
    switch (activePage) {
      case 'ads':
        return <AdsTab 
          setSelectedAd={setSelectedAd} 
          setDeleteConfirmOpen={setDeleteConfirmOpen}
          setPromoteDialogOpen={setPromoteDialogOpen}
        />;
      case 'messages':
        return <MessagesTab />;
      case 'profile':
        return <ProfileTab />;
      case 'notifications':
        return <NotificationsTab />;
      case 'favorites':
        return <FavoritesTab />;
      case 'statistics':
        return <StatisticsTab />;
      default:
        return <AdsTab 
          setSelectedAd={setSelectedAd} 
          setDeleteConfirmOpen={setDeleteConfirmOpen} 
          setPromoteDialogOpen={setPromoteDialogOpen}
        />;
    }
  };
  
  const handleDeleteAd = async () => {
    if (!selectedAd) return;
    
    setIsDeleting(true);
    try {
      await deleteMutation.mutateAsync(selectedAd);
      toast({
        title: "تم حذف الإعلان بنجاح",
        description: "تم حذف الإعلان من قائمة إعلاناتك"
      });
      setDeleteConfirmOpen(false);
      setSelectedAd(null);
    } catch (error) {
      toast({
        title: "فشل حذف الإعلان",
        description: "حدث خطأ أثناء محاولة حذف الإعلان. الرجاء المحاولة مرة أخرى.",
        variant: "destructive"
      });
      console.error("Error deleting listing:", error);
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handlePromoteAd = () => {
    // Promote ad functionality would go here
    setPromoteDialogOpen(false);
    setSelectedAd(null);
  };
  
  return (
    <>
      {renderTab()}
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="dark:bg-gray-900 dark:border-gray-800">
          <DialogHeader>
            <DialogTitle>حذف الإعلان</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من رغبتك في حذف هذا الإعلان؟ لا يمكن التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between space-x-2 space-x-reverse">
            <Button 
              variant="outline" 
              onClick={() => setDeleteConfirmOpen(false)}
              disabled={isDeleting}
            >
              إلغاء
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteAd}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري الحذف...
                </>
              ) : (
                "حذف الإعلان"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Promote Dialog */}
      <Dialog open={promoteDialogOpen} onOpenChange={setPromoteDialogOpen}>
        <DialogContent className="dark:bg-gray-900 dark:border-gray-800">
          <DialogHeader>
            <DialogTitle>ترقية الإعلان</DialogTitle>
            <DialogDescription>
              ترقية إعلانك لزيادة ظهوره وجذب المزيد من المشاهدات.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-md p-4 hover:border-brand dark:border-gray-700 dark:hover:border-brand">
                <h4 className="font-bold text-lg">باقة أساسية</h4>
                <p className="text-2xl font-bold my-2">50 ريال</p>
                <ul className="text-sm my-4 space-y-2">
                  <li>• ظهور مميز لمدة 7 أيام</li>
                  <li>• أولوية في نتائج البحث</li>
                  <li>• شارة مميزة على الإعلان</li>
                </ul>
                <Button variant="outline" onClick={handlePromoteAd} className="w-full">اختيار</Button>
              </div>
              <div className="border rounded-md p-4 border-brand bg-brand/5 dark:bg-brand/10 dark:border-brand/30">
                <h4 className="font-bold text-lg">باقة احترافية</h4>
                <p className="text-2xl font-bold my-2">100 ريال</p>
                <ul className="text-sm my-4 space-y-2">
                  <li>• ظهور مميز لمدة 30 يوم</li>
                  <li>• أولوية قصوى في نتائج البحث</li>
                  <li>• شارة مميزة على الإعلان</li>
                  <li>• ظهور في قسم الإعلانات المميزة</li>
                </ul>
                <Button onClick={handlePromoteAd} className="w-full">اختيار</Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPromoteDialogOpen(false)}>
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
