
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, MessageSquare, ChevronDown, User, LogIn, LogOut, Menu, X, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/ui/logo';
import { DarkModeToggle } from '@/components/theme/dark-mode-toggle';
import { useAuth } from '@/context/auth-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const { isAuthenticated, user, logout, refreshUser } = useAuth();

  // Only force refresh user data once when component first mounts
  useEffect(() => {
    // Only refresh if we have token but user isn't loaded yet
    if (!user && localStorage.getItem('authToken')) {
      refreshUser();
    }
  }, []);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };
  
  const notificationCount = 0; // This would come from notifications API
  const messageCount = 0; // This would come from messages API

  // Get user from cache if not in context
  const cachedUserData = localStorage.getItem('cachedUser');
  let cachedUser = null;
  if (cachedUserData && !user) {
    try {
      cachedUser = JSON.parse(cachedUserData);
    } catch (e) {
      console.error('Failed to parse cached user data');
    }
  }
  
  // Use either context user or cached user
  const displayUser = user || cachedUser;
  const userIsAuthenticated = isAuthenticated || !!displayUser;
  
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-border shadow-sm dark:bg-gray-900 dark:border-gray-800">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo className="mr-4" />
          
          {/* Search */}
          <div className="hidden md:flex flex-1 mx-4">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative w-full">
                <Input
                  type="text"
                  placeholder="ابحث عن منتجات، خدمات، وظائف..."
                  className="w-full h-10 pr-10 rounded-lg border border-input bg-background cursor-text dark:bg-gray-800 dark:border-gray-700"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="absolute top-0 right-0 h-full px-3 flex items-center">
                  <Search className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
            </form>
          </div>
          
          {/* Right side nav - Desktop */}
          <div className="hidden md:flex items-center space-x-4 space-x-reverse">
            {/* Dark mode toggle */}
            <DarkModeToggle />
            
            {userIsAuthenticated && displayUser ? (
              <>
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/notifications" className="relative">
                    <Bell className="h-5 w-5" />
                    {notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {notificationCount}
                      </span>
                    )}
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/messages" className="relative">
                    <MessageSquare className="h-5 w-5" />
                    {messageCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {messageCount}
                      </span>
                    )}
                  </Link>
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <span>{displayUser.first_name || displayUser.name}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{`${displayUser.first_name || ''} ${displayUser.last_name || ''}`}</p>
                        <p className="text-xs leading-none text-muted-foreground">{displayUser.phone}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="w-full flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>لوحة التحكم</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="w-full flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>الملف الشخصي</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="flex items-center">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>تسجيل الخروج</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button variant="outline" size="sm" asChild>
                <Link to="/auth/login" className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  <span>تسجيل الدخول</span>
                </Link>
              </Button>
            )}
            <Button asChild>
              <Link to="/add-ad">إضافة إعلان</Link>
            </Button>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <DarkModeToggle />
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile search and menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-border dark:border-gray-800">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="ابحث عن منتجات، خدمات، وظائف..."
                  className="w-full h-10 pr-10 rounded-lg border border-input bg-background cursor-text dark:bg-gray-800 dark:border-gray-700"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="absolute top-0 right-0 h-full px-3 flex items-center">
                  <Search className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
            </form>
            <div className="flex flex-col space-y-3">
              {userIsAuthenticated && displayUser ? (
                <>
                  <div className="p-3 bg-gray-50 rounded-lg dark:bg-gray-800">
                    <div className="font-medium dark:text-white">{`${displayUser.first_name || ''} ${displayUser.last_name || ''}`}</div>
                    <div className="text-sm text-muted-foreground">{displayUser.phone}</div>
                  </div>
                  <Link to="/notifications" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted dark:hover:bg-gray-800">
                    <Bell className="h-5 w-5" />
                    <span className="dark:text-white">الإشعارات</span>
                    {notificationCount > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full h-5 px-2 flex items-center">
                        {notificationCount}
                      </span>
                    )}
                  </Link>
                  <Link to="/messages" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted dark:hover:bg-gray-800">
                    <MessageSquare className="h-5 w-5" />
                    <span className="dark:text-white">الرسائل</span>
                    {messageCount > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full h-5 px-2 flex items-center">
                        {messageCount}
                      </span>
                    )}
                  </Link>
                  <Link to="/dashboard" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted dark:hover:bg-gray-800">
                    <Settings className="h-5 w-5" />
                    <span className="dark:text-white">لوحة التحكم</span>
                  </Link>
                  <Link to="/profile" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted dark:hover:bg-gray-800">
                    <User className="h-5 w-5" />
                    <span className="dark:text-white">الملف الشخصي</span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-muted text-red-500 dark:hover:bg-gray-800"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>تسجيل الخروج</span>
                  </button>
                </>
              ) : (
                <Link to="/auth/login" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted dark:hover:bg-gray-800">
                  <LogIn className="h-5 w-5" />
                  <span className="dark:text-white">تسجيل الدخول</span>
                </Link>
              )}
              <Button asChild className="w-full mt-2">
                <Link to="/add-ad">إضافة إعلان</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
