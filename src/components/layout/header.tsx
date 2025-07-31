import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Menu,
  Plus,
  User,
  Heart,
  Bell,
  MessageCircle,
  Settings,
  LogOut,
  LogIn,
  Home,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logo } from "@/components/ui/logo";
import { useAuth } from "@/context/auth-context";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Input } from "../ui/input";
import { useFilterStore } from "@/store/filter-store";

export function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const isMobile = useIsMobile();
  const [isScrolled, setIsScrolled] = useState(false);
  const { filters, setFilters } = useFilterStore();
  const searchQuery = filters.search || '';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getNameInitial = () => {
    if (!user || !user.name) return "?";
    return user.name.charAt(0).toUpperCase();
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-white dark:bg-dark-background transition-shadow duration-300 ${
        isScrolled ? "shadow-md dark:bg-neutral-900 border-b border-border dark:border-neutral-800" : ""
      }`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {isMobile ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="القائمة" className="dark:text-white">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[80%] max-w-md p-0 dark:bg-dark-background dark:border-dark-border">
                  <div className="flex flex-col h-full">
                    <div className="bg-brand p-6">
                      {isAuthenticated ? (
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user?.avatar || ""} alt={user?.name || ""} />
                            <AvatarFallback className="bg-white/20 text-white">{getNameInitial()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-white font-bold">{user?.name || "مستخدم"}</h3>
                            <p className="text-white/80 text-sm">{user?.email || ""}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <h3 className="text-white font-bold text-lg">مرحباً بك</h3>
                          <p className="text-white/80 text-sm">سجل الدخول للوصول إلى حسابك</p>
                          <div className="flex gap-2 mt-2">
                            <Button asChild size="sm" variant="outline" className="bg-white text-brand hover:bg-white/90">
                              <Link to="/auth/login">تسجيل الدخول</Link>
                            </Button>
                            <Button asChild size="sm" className="bg-white text-brand hover:bg-white/90">
                              <Link to="/auth/register">إنشاء حساب</Link>
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col p-2">
                      <Link to="/" className="flex items-center gap-2 p-3 hover:bg-gray-100 dark:hover:bg-dark-surface rounded-md">
                        <Home className="h-5 w-5 text-brand" /><span>الرئيسية</span>
                      </Link>
                      <Link to="/add-ad" className="flex items-center gap-2 p-3 hover:bg-gray-100 dark:hover:bg-dark-surface rounded-md">
                        <Plus className="h-5 w-5 text-brand" /><span>إضافة إعلان</span>
                      </Link>
                      <Separator className="my-2 dark:bg-dark-border" />
                      {isAuthenticated ? (
                        <>
                          <Link to="/dashboard" className="flex items-center gap-2 p-3 hover:bg-gray-100 dark:hover:bg-dark-surface rounded-md">
                            <LayoutDashboard className="h-5 w-5 text-brand" /><span>لوحة التحكم</span>
                          </Link>
                          <Link to="/favorites" className="flex items-center gap-2 p-3 hover:bg-gray-100 dark:hover:bg-dark-surface rounded-md">
                            <Heart className="h-5 w-5 text-brand" /><span>المفضلة</span>
                          </Link>
                          <Link to="/messages" className="flex items-center gap-2 p-3 hover:bg-gray-100 dark:hover:bg-dark-surface rounded-md">
                            <MessageCircle className="h-5 w-5 text-brand" /><span>الرسائل</span>
                          </Link>
                          <Link to="/notifications" className="flex items-center gap-2 p-3 hover:bg-gray-100 dark:hover:bg-dark-surface rounded-md">
                            <Bell className="h-5 w-5 text-brand" /><span>الإشعارات</span>
                          </Link>
                          <Separator className="my-2 dark:bg-dark-border" />
                          <Link to="/settings" className="flex items-center gap-2 p-3 hover:bg-gray-100 dark:hover:bg-dark-surface rounded-md">
                            <Settings className="h-5 w-5 text-brand" /><span>الإعدادات</span>
                          </Link>
                          <div className="flex items-center justify-between mt-auto p-3">
                            <ThemeToggle />
                            <Button variant="secondary" className="text-destructive" onClick={logout}>
                              <LogOut className="h-5 w-5 ml-2" />تسجيل الخروج
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center justify-between mt-auto p-3">
                          <ThemeToggle />
                          <Button variant="default" asChild>
                            <Link to="/auth/login"><LogIn className="h-5 w-5 ml-2" />تسجيل الدخول</Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            <Link to="/" className="flex items-center"><Logo /></Link>
            <div className="flex items-center gap-2">
              <ThemeToggle size="sm" />
              {isAuthenticated ? (
                <Link to="/add-ad">
                  <Button variant="ghost" size="icon" className="text-brand" aria-label="إضافة إعلان">
                    <Plus className="h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <Link to="/auth/login">
                  <Button variant="ghost" size="icon" className="text-brand" aria-label="تسجيل الدخول">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center"><Logo /></Link>
            </div>
            <div className="hidden md:flex flex-1 mx-4">
              <div className="relative w-full">
                <Input
                  type="text"
                  placeholder="ابحث عن منتجات، خدمات، وظائف..."
                  className="w-full h-10 pr-10 rounded-lg border border-input bg-background"
                  value={searchQuery}
                  onChange={(e) => setFilters({ search: e.target.value })}
                />
                <Search className="absolute top-1/2 right-3 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              {isAuthenticated ? (
                <>
                  <Link to="/messages"><Button variant="ghost" size="icon" className="relative" aria-label="الرسائل"><MessageCircle className="h-5 w-5" /></Button></Link>
                  <Link to="/notifications"><Button variant="ghost" size="icon" className="relative" aria-label="الإشعارات"><Bell className="h-5 w-5" /></Button></Link>
                  <Link to="/favorites"><Button variant="ghost" size="icon" aria-label="المفضلة"><Heart className="h-5 w-5" /></Button></Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <span>{user.first_name}</span><ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 dark:bg-neutral-800  border-t border-border dark:border-neutral-700">
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{`${user.first_name} ${user.last_name}`}</p>
                          <p className="text-xs leading-none text-muted-foreground">{user.phone}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/dashboard" className="w-full flex items-center"><Settings className="mr-2 h-4 w-4" /><span>لوحة التحكم</span></Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="w-full flex items-center"><User className="mr-2 h-4 w-4" /><span>الملف الشخصي</span></Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout} className="flex items-center"><LogOut className="mr-2 h-4 w-4" /><span>تسجيل الخروج</span></DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/auth/login" className="flex items-center gap-2"><LogIn className="h-4 w-4" /><span>تسجيل الدخول</span></Link>
                  </Button>
                </div>
              )}
              <Button asChild>
                <Link to="/add-ad">إضافة إعلان</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}