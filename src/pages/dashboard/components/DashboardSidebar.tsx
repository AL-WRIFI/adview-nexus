
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { UserCircle, LogOut, Bell, MessageSquare, Heart, Settings, Clipboard, Gift, PlusCircle } from 'lucide-react';

interface DashboardSidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  isMobile?: boolean;
}

export default function DashboardSidebar({ 
  activePage, 
  setActivePage, 
  isMobile = false 
}: DashboardSidebarProps) {
  const userSidebarItems = [
    { id: 'ads', label: 'إعلاناتي', icon: Clipboard },
    { id: 'favorites', label: 'المفضلة', icon: Heart },
    { id: 'messages', label: 'الرسائل', icon: MessageSquare, badge: 3 },
    { id: 'notifications', label: 'الإشعارات', icon: Bell, badge: 5 },
    { id: 'promote', label: 'ترقية الإعلانات', icon: Gift },
    { id: 'settings', label: 'الإعدادات', icon: Settings },
  ];
  
  return (
    <>
      <Card className={isMobile ? 'border-0 shadow-none' : ''}>
        <CardContent className="p-0">
          <nav className="space-y-1 p-1">
            {userSidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-brand text-white' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center">
                    <Icon className={`ml-3 h-5 w-5 ${isActive ? 'text-white' : 'text-muted-foreground'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <Badge className={isActive ? 'bg-white text-brand' : 'bg-brand text-white'}>
                      {item.badge}
                    </Badge>
                  )}
                </button>
              );
            })}
          </nav>
        </CardContent>
      </Card>
      
      {isMobile && (
        <div className="p-2 pt-2 mt-2 border-t">
          <Button variant="outline" className="w-full mb-2">
            <LogOut className="ml-2 h-4 w-4" />
            تسجيل الخروج
          </Button>
          <Button className="w-full" asChild>
            <Link to="/add-ad">
              <PlusCircle className="ml-2 h-4 w-4" />
              إضافة إعلان
            </Link>
          </Button>
        </div>
      )}
    </>
  );
}
