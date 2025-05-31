import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserCircle, LogOut, PlusCircle, Menu, X } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Button } from '@/components/ui/button';
import DashboardSidebar from './components/DashboardSidebar';
import DashboardContent from './components/DashboardContent';
import { useAuth } from '@/context/auth-context';
import { useAdsDialog } from './hooks/useAdsDialog';

export default function UserDashboard() {
  const [activePage, setActivePage] = useState('ads');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { selectedAd, setSelectedAd, promoteDialogOpen, setPromoteDialogOpen, deleteConfirmOpen, setDeleteConfirmOpen } = useAdsDialog();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen flex flex-col dark:bg-neutral-900 border-t border-border dark:border-neutral-900">
      <Header />
      
      <main className="flex-1 pb-20 md:pb-0 ">
        <div className="bg-gray-50 border-b border-border dark:bg-neutral-900 border-t border-border dark:border-neutral-900">
          <div className="container px-4 mx-auto py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden ml-4 dark:bg-gray-900">
                  <UserCircle className="w-full h-full text-gray-400 dark:text-gray-300" />
                </div>
                <div>
                  <h1 className="text-xl font-bold dark:text-gray-100">
                    أهلاً، {user?.first_name} {user?.last_name}
                  </h1>
                  <p className="text-muted-foreground dark:text-gray-300">مرحباً بك في لوحة التحكم</p>
                </div>
              </div>
              
              <div className="hidden md:block">
                <Button variant="outline" className="ml-2 dark:border-gray-600 dark:text-gray-100" onClick={handleLogout}>
                  <LogOut className="ml-2 h-4 w-4" />
                  تسجيل الخروج
                </Button>
                <Button asChild className="dark:bg-gray-700 dark:hover:bg-gray-600">
                  <Link to="/add-ad">
                    <PlusCircle className="ml-2 h-4 w-4" />
                    إضافة إعلان جديد
                  </Link>
                </Button>
              </div>
              
              <Button 
                variant="outline" 
                size="icon" 
                className="md:hidden dark:border-gray-600 dark:text-gray-100"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
        
        <div className="container px-4 mx-auto py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Desktop Sidebar */}
            <div className="hidden md:block">
              <DashboardSidebar 
                activePage={activePage} 
                setActivePage={setActivePage} 
                className="dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
            
            {/* Mobile Sidebar */}
            {sidebarOpen && (
              <div className="fixed inset-0 z-40 md:hidden">
                <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
                <div className="fixed inset-y-0 right-0 max-w-[16rem] w-full bg-white shadow-lg dark:bg-gray-800 dark:border-gray-700">
                  <div className="p-4 border-b dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <h2 className="font-bold dark:text-gray-100">القائمة</h2>
                      <Button variant="ghost" size="icon" className="dark:text-gray-100" onClick={() => setSidebarOpen(false)}>
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                  
                  <DashboardSidebar 
                    activePage={activePage} 
                    setActivePage={(page) => {
                      setActivePage(page);
                      setSidebarOpen(false);
                    }}
                    isMobile={true}
                    className="dark:bg-gray-800"
                  />
                </div>
              </div>
            )}
            
            {/* Main Content */}
            <div className="md:col-span-3">
              <DashboardContent 
                activePage={activePage} 
                selectedAd={selectedAd}
                setSelectedAd={setSelectedAd}
                promoteDialogOpen={promoteDialogOpen}
                setPromoteDialogOpen={setPromoteDialogOpen}
                deleteConfirmOpen={deleteConfirmOpen}
                setDeleteConfirmOpen={setDeleteConfirmOpen}
                className="dark:bg-neutral-900 border-t border-border dark:border-neutral-900"
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <MobileNav />
    </div>
  );
}