
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/ui/logo';
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
  const [currentLanguage, setCurrentLanguage] = useState('ar');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const { isAuthenticated, user, logout, refreshUser } = useAuth();

  // Effect to initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
    
    const savedLanguage = localStorage.getItem('language') || 'ar';
    setCurrentLanguage(savedLanguage);
    document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
  }, []);

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

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'ar' ? 'en' : 'ar';
    setCurrentLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
  };
  
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
    <header className="sticky top-0 z-50 w-full bg-blue-600 dark:bg-blue-900 text-white">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-14 px-4">
          {/* User Avatar / Login */}
          <div className="flex-shrink-0">
            {userIsAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-6 w-6 text-white" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{`${displayUser.first_name || ''} ${displayUser.last_name || ''}`}</p>
                      <p className="text-xs leading-none text-muted-foreground">{displayUser.phone}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    تسجيل الخروج
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="icon" asChild className="rounded-full">
                <Link to="/auth/login">
                  <User className="h-6 w-6 text-white" />
                </Link>
              </Button>
            )}
          </div>
          
          {/* Language Toggle */}
          <Button 
            variant="ghost" 
            className="h-9 w-9 px-0 mr-2 text-white font-bold" 
            onClick={toggleLanguage}
          >
            {currentLanguage === 'ar' ? 'En' : 'عر'}
          </Button>
          
          {/* Search */}
          <div className="flex-1 mx-2">
            <form onSubmit={handleSearch} className="relative w-full">
              <Input
                type="text"
                placeholder={currentLanguage === 'ar' ? "ابحث عن سلعة..." : "Search for items..."}
                className="w-full h-9 pr-10 rounded-lg border-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute top-0 right-0 h-full px-3 flex items-center">
                <Search className="h-4 w-4 text-muted-foreground" />
              </button>
            </form>
          </div>
          
          {/* Logo */}
          <Logo className="ml-2" withText={false} />
        </div>
      </div>
    </header>
  );
}
