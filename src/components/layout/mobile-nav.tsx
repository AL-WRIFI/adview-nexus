
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, PlusCircle, Bell, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileNav() {
  const location = useLocation();
  
  const items = [
    {
      label: 'الرئيسية',
      icon: Home,
      href: '/'
    },
    {
      label: 'الأقسام',
      icon: Search,
      href: '/categories'
    },
    {
      label: 'إضافة عرض',
      icon: PlusCircle,
      href: '/add-ad',
      primary: true
    },
    {
      label: 'الإشعارات',
      icon: Bell,
      href: '/notifications'
    },
    {
      label: 'الرسائل',
      icon: Mail,
      href: '/messages'
    }
  ];
  
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-border">
      <div className="grid grid-cols-5 h-16">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center",
                isActive ? "text-brand" : "text-gray-600"
              )}
            >
              {item.primary ? (
                <div className="flex items-center justify-center bg-blue-600 text-white rounded-md w-12 h-12 -mt-6 mb-1">
                  <Icon className="h-6 w-6" />
                </div>
              ) : (
                <Icon className={cn("h-6 w-6 mb-1", isActive && "text-blue-600")} />
              )}
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
