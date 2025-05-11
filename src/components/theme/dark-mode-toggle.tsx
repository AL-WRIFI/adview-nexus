
import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export function DarkModeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { toast } = useToast();

  // Check system preference or user's saved preference on mount
  useEffect(() => {
    // Check local storage first
    const storedTheme = localStorage.getItem('theme');
    
    if (storedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else if (storedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      // If no stored preference, use system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  // Handle theme toggle
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      toast({
        title: "تم التبديل إلى الوضع النهاري",
        duration: 1500,
      });
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      toast({
        title: "تم التبديل إلى الوضع الليلي",
        duration: 1500,
      });
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="icon"
      onClick={toggleDarkMode}
      className="h-9 w-9 rounded-full bg-white hover:bg-blue-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
      title={isDarkMode ? "وضع النهار" : "وضع الليل"}
    >
      {isDarkMode ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
}
