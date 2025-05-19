
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, User, Menu, X, Heart, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur dark:bg-dark-background/95 dark:border-dark-border">
      <div className="container flex h-16 items-center px-4">
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            className="dark:text-gray-300 dark:hover:bg-dark-surface"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">القائمة</span>
          </Button>
        </div>
        
        <div className="flex-1 flex justify-start">
          <Link to="/" className="flex items-center">
            <ShoppingBag className="h-6 w-6 text-primary dark:text-brand" />
            <span className="font-bold text-xl mr-2">حراج</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-4 space-x-reverse mr-4">
          <nav className="flex items-center space-x-4 space-x-reverse text-sm font-medium">
            <Link to="/" className="nav-link">الرئيسية</Link>
            <Link to="/category" className="nav-link">التصنيفات</Link>
            <Link to="/dashboard" className="nav-link">لوحة التحكم</Link>
            <Link to="/add-ad" className="nav-link">
              إضافة إعلان
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-2 space-x-reverse">
          <ThemeToggle variant="ghost" />
          
          <Link to="/search">
            <Button 
              variant="ghost" 
              size="icon"
              className="dark:text-gray-300 dark:hover:bg-dark-surface"
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">البحث</span>
            </Button>
          </Link>

          <Link to="/notifications">
            <Button 
              variant="ghost" 
              size="icon"
              className="hidden md:flex dark:text-gray-300 dark:hover:bg-dark-surface"
            >
              <Bell className="h-5 w-5" />
              <span className="sr-only">الإشعارات</span>
            </Button>
          </Link>

          <Link to="/favorites">
            <Button 
              variant="ghost" 
              size="icon"
              className="hidden md:flex dark:text-gray-300 dark:hover:bg-dark-surface"
            >
              <Heart className="h-5 w-5" />
              <span className="sr-only">المفضلة</span>
            </Button>
          </Link>

          <Link to="/profile">
            <Button 
              variant="ghost" 
              size="icon"
              className="hidden md:flex dark:text-gray-300 dark:hover:bg-dark-surface"
            >
              <User className="h-5 w-5" />
              <span className="sr-only">الملف الشخصي</span>
            </Button>
          </Link>

          <div className="hidden md:block">
            <Button 
              variant="default" 
              size="sm" 
              onClick={() => navigate('/add-ad')}
              className="dark:bg-brand dark:hover:bg-brand-hover"
            >
              إضافة إعلان جديد
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md bg-white dark:bg-dark-background md:hidden",
          {
            hidden: !isMenuOpen,
          }
        )}
      >
        <div className="relative z-20 grid gap-6 rounded-md bg-white dark:bg-dark-background p-4 shadow-xl">
          <Link to="/" className="flex items-center space-x-2 space-x-reverse" onClick={() => setIsMenuOpen(false)}>
            <ShoppingBag className="h-5 w-5 text-primary dark:text-brand" />
            <span className="font-bold dark:text-gray-100">حراج</span>
          </Link>
          <nav className="grid grid-flow-row auto-rows-max text-sm">
            <Link
              to="/"
              className="flex w-full items-center rounded-md p-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-dark-surface dark:text-gray-200"
              onClick={() => setIsMenuOpen(false)}
            >
              الرئيسية
            </Link>
            <Link
              to="/category"
              className="flex w-full items-center rounded-md p-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-dark-surface dark:text-gray-200"
              onClick={() => setIsMenuOpen(false)}
            >
              التصنيفات
            </Link>
            <Link
              to="/search"
              className="flex w-full items-center rounded-md p-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-dark-surface dark:text-gray-200"
              onClick={() => setIsMenuOpen(false)}
            >
              البحث
            </Link>
            <Link
              to="/dashboard"
              className="flex w-full items-center rounded-md p-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-dark-surface dark:text-gray-200"
              onClick={() => setIsMenuOpen(false)}
            >
              لوحة التحكم
            </Link>
            <Link
              to="/add-ad"
              className="flex w-full items-center rounded-md p-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-dark-surface dark:text-gray-200"
              onClick={() => setIsMenuOpen(false)}
            >
              إضافة إعلان
            </Link>
            <Link
              to="/favorites"
              className="flex w-full items-center rounded-md p-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-dark-surface dark:text-gray-200"
              onClick={() => setIsMenuOpen(false)}
            >
              المفضلة
            </Link>
            <Link
              to="/profile"
              className="flex w-full items-center rounded-md p-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-dark-surface dark:text-gray-200"
              onClick={() => setIsMenuOpen(false)}
            >
              الملف الشخصي
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
