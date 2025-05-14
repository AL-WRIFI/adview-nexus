
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Plus, Menu, LogOut, Search, Bell, Heart, MessageCircle } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/auth-context';
import { isAuthenticated as checkAuth } from '@/services/api';
import { DarkModeToggle } from '@/components/theme/dark-mode-toggle';

interface HeaderProps {
  isLoggedIn?: boolean;
}

export function Header({ isLoggedIn: propIsLoggedIn }: HeaderProps = {}) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isLoggedIn = propIsLoggedIn !== undefined ? propIsLoggedIn : checkAuth();
  
  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:bg-gray-900 dark:border-gray-800">
      <div className="container flex h-16 md:h-20 items-center justify-between">
        <div className="hidden md:flex items-center gap-6 mr-4">
          <Link to="/" className="inline-flex">
            <Logo />
          </Link>
          <form className="w-64">
            <div className="relative">
              <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="بحث..." className="pr-8 rounded-full" />
            </div>
          </form>
        </div>
        <Link to="/" className="md:hidden inline-flex">
          <Logo />
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <DarkModeToggle />
          </div>
          
          {isLoggedIn ? (
            <>
              <div className="hidden md:flex items-center gap-4">
                <Link to="/notifications" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Bell className="h-5 w-5" />
                </Link>
                <Link to="/favorites" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Heart className="h-5 w-5" />
                </Link>
                <Link to="/messages" className="text-muted-foreground hover:text-foreground transition-colors">
                  <MessageCircle className="h-5 w-5" />
                </Link>
                <Link to="/add-ad">
                  <Button size="sm">
                    <Plus className="h-4 w-4 ml-2" />
                    إضافة إعلان
                  </Button>
                </Link>
              </div>
            
              <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                        {user?.image ? (
                          <img
                            src={user.image}
                            alt={user.first_name}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                      {user ? `${user.first_name} ${user.last_name}` : 'حسابي'}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard">لوحة التحكم</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile">الملف الشخصي</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="ml-2 h-4 w-4" /> تسجيل الخروج
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/auth/login">
                <Button variant="ghost">تسجيل الدخول</Button>
              </Link>
              <Link to="/auth/register">
                <Button>إنشاء حساب</Button>
              </Link>
            </div>
          )}
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">فتح القائمة</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="dark:bg-gray-900 dark:border-gray-800">
              <div className="grid gap-6 py-6 text-right">
                <Logo />
                <div className="relative">
                  <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="بحث..." className="pr-8 rounded-full" />
                </div>
                <div className="mt-4 grid gap-2">
                  {isLoggedIn ? (
                    <>
                      <Link to="/dashboard" className="flex items-center gap-2 text-sm">
                        <User className="ml-2 h-4 w-4" />
                        لوحة التحكم
                      </Link>
                      <Link to="/notifications" className="flex items-center gap-2 text-sm">
                        <Bell className="ml-2 h-4 w-4" />
                        الإشعارات
                      </Link>
                      <Link to="/favorites" className="flex items-center gap-2 text-sm">
                        <Heart className="ml-2 h-4 w-4" />
                        المفضلة
                      </Link>
                      <Link to="/messages" className="flex items-center gap-2 text-sm">
                        <MessageCircle className="ml-2 h-4 w-4" />
                        الرسائل
                      </Link>
                      <Link to="/add-ad">
                        <Button className="w-full mt-2">
                          <Plus className="h-4 w-4 ml-2" />
                          إضافة إعلان
                        </Button>
                      </Link>
                      <Button variant="outline" onClick={handleLogout} className="mt-4 w-full dark:border-gray-700">
                        <LogOut className="ml-2 h-4 w-4" />
                        تسجيل الخروج
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link to="/auth/login">
                        <Button variant="outline" className="w-full dark:border-gray-700">تسجيل الدخول</Button>
                      </Link>
                      <Link to="/auth/register">
                        <Button className="w-full">إنشاء حساب</Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
