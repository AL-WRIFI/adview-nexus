import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth-context';
import { useTheme } from '@/context/theme-provider';
import { Moon, Sun, Menu, Settings, User, Bell, CreditCard, HelpCircle, Exit, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useIsMobile } from '@/hooks/use-mobile';
import { useCategories } from '@/hooks/use-api';
import { Category } from '@/types';

export function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { data: categories } = useCategories();
  const [searchQuery, setSearchQuery] = useState('');

  const handleThemeToggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?search=${searchQuery}`);
    }
  };

  return (
    <header className="bg-white dark:bg-dark-card border-b border-border dark:border-dark-border sticky top-0 z-50">
      <div className="container px-4 mx-auto py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-foreground">
          مكس سوريا
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-grow mx-4">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="ابحث عن أي شيء..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-4 pr-12 h-10"
            />
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </form>

        {/* Theme Toggle */}
        <Button variant="ghost" size="icon" onClick={handleThemeToggle}>
          {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* User Menu */}
        {isAuthenticated && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage 
                    src={user.avatar || user.avatar_url || user.image || ''} 
                    alt={user.first_name + ' ' + user.last_name}
                  />
                  <AvatarFallback>
                    {user.first_name?.[0]}{user.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium text-sm">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="w-[200px] truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>
                  {user.wallet_balance !== undefined && (
                    <p className="text-xs text-green-600">
                      الرصيد: {user.wallet_balance} ر.س
                    </p>
                  )}
                </div>
              </div>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem asChild>
                <Link to="/dashboard" className="cursor-pointer">
                  <User className="ml-2 h-4 w-4" />
                  <span>لوحة التحكم</span>
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer">
                  <Settings className="ml-2 h-4 w-4" />
                  <span>الملف الشخصي</span>
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link to="/statistics" className="cursor-pointer">
                  <CreditCard className="ml-2 h-4 w-4" />
                  <span>إحصائيات</span>
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link to="/messages" className="cursor-pointer">
                  <Bell className="ml-2 h-4 w-4" />
                  <span>الرسائل</span>
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem asChild>
                <Button variant="ghost" onClick={() => logout()} className="w-full justify-start">
                  <Exit className="ml-2 h-4 w-4" />
                  <span>تسجيل الخروج</span>
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center space-x-2">
            <Button asChild variant="outline">
              <Link to="/auth/login">تسجيل الدخول</Link>
            </Button>
            <Button asChild>
              <Link to="/auth/register">إنشاء حساب</Link>
            </Button>
          </div>
        )}

        {/* Mobile Menu */}
        {isMobile && (
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle>القائمة</SheetTitle>
                <SheetDescription>
                  تصفح الخيارات المتاحة
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                {/* Mobile Search Bar */}
                <form onSubmit={handleSearch} className="w-full">
                  <div className="relative">
                    <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <Input
                      type="text"
                      placeholder="ابحث عن أي شيء..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-4 pr-12 h-10"
                    />
                    <Button
                      type="submit"
                      variant="ghost"
                      size="icon"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </form>

                {/* Categories List */}
                {categories && categories.length > 0 ? (
                  categories.map((category) => (
                    <Button key={category.id} variant="ghost" className="w-full justify-start">
                      <Link to={`/category/${category.id}`}>{category.name}</Link>
                    </Button>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">لا توجد تصنيفات</p>
                )}

                {/* Auth Links */}
                {!isAuthenticated && (
                  <>
                    <Button variant="ghost" className="w-full justify-start">
                      <Link to="/auth/login">تسجيل الدخول</Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Link to="/auth/register">إنشاء حساب</Link>
                    </Button>
                  </>
                )}

                {/* User Links */}
                {isAuthenticated && user && (
                  <>
                    <Button variant="ghost" className="w-full justify-start">
                      <Link to="/dashboard">لوحة التحكم</Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Link to="/profile">الملف الشخصي</Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Link to="/messages">الرسائل</Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" onClick={() => logout()}>
                      تسجيل الخروج
                    </Button>
                  </>
                )}

                {/* Theme Toggle */}
                <Button variant="ghost" className="w-full justify-start" onClick={handleThemeToggle}>
                  {theme === "light" ? "الوضع الداكن" : "الوضع الفاتح"}
                </Button>

                {/* Help */}
                <Button variant="ghost" className="w-full justify-start">
                  <Link to="/help">
                    <HelpCircle className="ml-2 h-4 w-4" />
                    المساعدة
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </header>
  );
}
