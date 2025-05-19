
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, PlusCircle, Heart, User } from 'lucide-react';
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
      label: 'البحث',
      icon: Search,
      href: '/search'
    },
    {
      label: 'إضافة إعلان',
      icon: PlusCircle,
      href: '/add-ad'
    },
    {
      label: 'المفضلة',
      icon: Heart,
      href: '/favorites'
    },
    {
      label: 'حسابي',
      icon: User,
      href: '/profile'
    }
  ];

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white dark:bg-dark-card border-t border-border dark:border-dark-border">
      <div className="grid grid-cols-5 h-16">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          const isAddAd = item.href === '/add-ad';

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center text-xs font-medium transition-colors",
                isActive
                  ? "text-brand dark:text-brand"
                  : "text-gray-600 dark:text-gray-400",
                isAddAd && "text-brand dark:text-brand"
              )}
            >
              <Icon 
                className={cn(
                  "h-6 w-6 mb-1", 
                  isAddAd && "text-brand dark:text-brand",
                  isActive && "text-brand dark:text-brand"
                )} 
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
