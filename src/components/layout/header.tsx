
import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
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
  Moon,
  Sun,
  ChevronDown,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logo } from "@/components/ui/logo";
import { useAuth } from "@/context/auth-context";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "../ui/input";
import { useTheme } from "next-themes";

interface HeaderProps {
  isLoggedIn?: boolean;
}

export function Header({ isLoggedIn }: HeaderProps = {}) {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  // Handle scrolling effect for header background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Get user initial for avatar fallback
  const getNameInitial = () => {
    if (!user) return "؟";
    if (user.first_name && user.last_name) {
      return user.first_name.charAt(0) + user.last_name.charAt(0);
    }
    if (user.name) {
      return user.name.charAt(0).toUpperCase();
    }
    if (user.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return "؟";
  };

  const getUserDisplayName = () => {
    if (!user) return "مستخدم";
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    if (user.name) {
      return user.name;
    }
    if (user.username) {
      return user.username;
    }
    return "مستخدم";
  };

  return (
    <header
      className={` top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm transition-all duration-300 border-b border-border ${
        isScrolled ? "shadow-lg" : "shadow-sm"
      }`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {isMobile ? (
          <div className="flex items-center justify-between w-full">
            {/* Mobile Header */}
            <div className="flex items-center gap-3">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="القائمة">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[80%] max-w-md p-0">
                  <div className="flex flex-col h-full">
                    <div className="bg-brand p-6">
                      {isAuthenticated ? (
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={user?.avatar || user?.avatar_url || user?.image || ""}
                              alt={getUserDisplayName()}
                            />
                            <AvatarFallback className="bg-white/20 text-white text-lg">
                              {getNameInitial()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-white font-bold text-lg">
                              {getUserDisplayName()}
                            </h3>
                            <p className="text-white/80 text-sm">
                              {user?.email || ""}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <h3 className="text-white font-bold text-lg">
                            مرحباً بك
                          </h3>
                          <p className="text-white/80 text-sm">
                            سجل الدخول للوصول إلى حسابك
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Button
                              asChild
                              size="sm"
                              variant="outline"
                              className="border-white/30 text-white hover:text-white hover:bg-white/20"
                            >
                              <Link to="/auth/login">تسجيل الدخول</Link>
                            </Button>
                            <Button
                              asChild
                              size="sm"
                              className="bg-white text-brand hover:bg-white/90"
                            >
                              <Link to="/auth/register">إنشاء حساب</Link>
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col p-2 flex-1">
                      <Link
                        to="/"
                        className="flex items-center gap-2 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                      >
                        <Home className="h-5 w-5 text-brand" />
                        <span>الرئيسية</span>
                      </Link>
                      <Link
                        to="/add-ad"
                        className="flex items-center gap-2 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                      >
                        <Plus className="h-5 w-5 text-brand" />
                        <span>إضافة إعلان</span>
                      </Link>
                      <Link
                        to="/search"
                        className="flex items-center gap-2 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                      >
                        <Search className="h-5 w-5 text-brand" />
                        <span>البحث</span>
                      </Link>

                      <Separator className="my-2" />

                      {isAuthenticated ? (
                        <>
                          <Link
                            to="/dashboard"
                            className="flex items-center gap-2 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                          >
                            <LayoutDashboard className="h-5 w-5 text-brand" />
                            <span>لوحة التحكم</span>
                          </Link>
                          <Link
                            to="/favorites"
                            className="flex items-center gap-2 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                          >
                            <Heart className="h-5 w-5 text-brand" />
                            <span>المفضلة</span>
                          </Link>
                          <Link
                            to="/messages"
                            className="flex items-center gap-2 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                          >
                            <MessageCircle className="h-5 w-5 text-brand" />
                            <span>الرسائل</span>
                          </Link>
                          <Link
                            to="/notifications"
                            className="flex items-center gap-2 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                          >
                            <Bell className="h-5 w-5 text-brand" />
                            <span>الإشعارات</span>
                          </Link>

                          <Separator className="my-2" />

                          <Link
                            to="/settings"
                            className="flex items-center gap-2 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                          >
                            <Settings className="h-5 w-5 text-brand" />
                            <span>الإعدادات</span>
                          </Link>

                          <div className="flex items-center justify-between mt-auto p-3">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={toggleTheme}
                              className="h-8 w-8"
                            >
                              {theme === 'dark' ? (
                                <Sun className="h-4 w-4" />
                              ) : (
                                <Moon className="h-4 w-4" />
                              )}
                            </Button>
                            
                            <Button
                              variant="ghost"
                              onClick={() => logout()}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <LogOut className="h-4 w-4 ml-2" />
                              تسجيل الخروج
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div className="mt-auto p-3">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleTheme}
                            className="h-8 w-8"
                          >
                            {theme === 'dark' ? (
                              <Sun className="h-4 w-4" />
                            ) : (
                              <Moon className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              
              <Logo />
            </div>

            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="h-8 w-8"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>

              {/* Notifications */}
              {isAuthenticated && (
                <Button variant="ghost" size="icon" className="h-8 w-8 relative">
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
                </Button>
              )}

              {/* User Avatar/Login */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user?.avatar || user?.avatar_url || ""}
                          alt={getUserDisplayName()}
                        />
                        <AvatarFallback>
                          {getNameInitial()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel>{getUserDisplayName()}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link to="/dashboard">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          لوحة التحكم
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/favorites">
                          <Heart className="mr-2 h-4 w-4" />
                          المفضلة
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/settings">
                          <Settings className="mr-2 h-4 w-4" />
                          الإعدادات
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => logout()}>
                      <LogOut className="mr-2 h-4 w-4" />
                      تسجيل الخروج
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button size="sm" asChild>
                  <Link to="/auth/login">دخول</Link>
                </Button>
              )}
            </div>
          </div>
        ) : (
          // Desktop Header
          <>
            <div className="flex items-center gap-6">
              <Logo />
              
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
                <Input
                  type="text"
                  placeholder="ابحث عن أي شيء..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              </form>
            </div>

            <div className="flex items-center gap-4">
              {/* Add Ad Button */}
              <Button asChild>
                <Link to="/add-ad">
                  <Plus className="h-4 w-4 mr-2" />
                  إضافة إعلان
                </Link>
              </Button>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>

              {/* Notifications */}
              {isAuthenticated && (
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
                </Button>
              )}

              {/* User Menu */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user?.avatar || user?.avatar_url || ""}
                          alt={getUserDisplayName()}
                        />
                        <AvatarFallback>
                          {getNameInitial()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{getUserDisplayName()}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel>حسابي</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link to="/dashboard">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          لوحة التحكم
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/favorites">
                          <Heart className="mr-2 h-4 w-4" />
                          المفضلة
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/messages">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          الرسائل
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/settings">
                          <Settings className="mr-2 h-4 w-4" />
                          الإعدادات
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => logout()}>
                      <LogOut className="mr-2 h-4 w-4" />
                      تسجيل الخروج
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="outline" asChild>
                    <Link to="/auth/login">
                      <LogIn className="h-4 w-4 mr-2" />
                      تسجيل الدخول
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link to="/auth/register">إنشاء حساب</Link>
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
}
