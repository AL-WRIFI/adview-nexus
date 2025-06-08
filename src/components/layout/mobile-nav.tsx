
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, PlusCircle, Heart, User, Grid3X3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { MobileCategorySheet } from './category/MobileCategorySheet';

export function MobileNav() {
  const location = useLocation();
  const [categorySheetOpen, setCategorySheetOpen] = useState(false);

  const items = [
    {
      label: 'الرئيسية',
      icon: Home,
      href: '/'
    },
    {
      label: 'التصنيفات',
      icon: Grid3X3,
      href: '#',
      onClick: () => setCategorySheetOpen(true)
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
    <>
      <div className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-background dark:bg-background border-t border-border shadow-lg">
        <div className="grid grid-cols-5 h-16">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            const isAddAd = item.href === '/add-ad';
            const isCategory = item.label === 'التصنيفات';

            if (isCategory) {
              return (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className={cn(
                    "flex flex-col items-center justify-center text-xs font-medium transition-colors",
                    "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-6 w-6 mb-1" />
                  <span>{item.label}</span>
                </button>
              );
            }

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex flex-col items-center justify-center text-xs font-medium transition-colors",
                  isActive
                    ? "text-brand"
                    : "text-muted-foreground hover:text-foreground",
                  isAddAd && "text-brand"
                )}
              >
                <Icon className={cn("h-6 w-6 mb-1", isAddAd && "text-brand")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <MobileCategorySheet
        open={categorySheetOpen}
        onOpenChange={setCategorySheetOpen}
      />
    </>
  );
}
