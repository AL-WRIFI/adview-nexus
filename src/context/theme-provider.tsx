
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      applyDarkModeStyles(systemTheme === "dark");
      return;
    }

    root.classList.add(theme);
    applyDarkModeStyles(theme === "dark");
  }, [theme]);

  const applyDarkModeStyles = (isDark: boolean) => {
    const root = window.document.documentElement;
    
    if (isDark) {
      // Enhanced dark mode colors - soft black and dark gray theme
      root.style.setProperty('--background', 'hsl(0 0% 7%)');
      root.style.setProperty('--foreground', 'hsl(0 0% 98%)');
      root.style.setProperty('--card', 'hsl(0 0% 10%)');
      root.style.setProperty('--card-foreground', 'hsl(0 0% 98%)');
      root.style.setProperty('--popover', 'hsl(0 0% 10%)');
      root.style.setProperty('--popover-foreground', 'hsl(0 0% 98%)');
      root.style.setProperty('--primary', 'hsl(142 71% 45%)');
      root.style.setProperty('--primary-foreground', 'hsl(144 70% 10%)');
      root.style.setProperty('--secondary', 'hsl(0 0% 15%)');
      root.style.setProperty('--secondary-foreground', 'hsl(0 0% 98%)');
      root.style.setProperty('--muted', 'hsl(0 0% 15%)');
      root.style.setProperty('--muted-foreground', 'hsl(0 5% 65%)');
      root.style.setProperty('--accent', 'hsl(0 0% 15%)');
      root.style.setProperty('--accent-foreground', 'hsl(0 0% 98%)');
      root.style.setProperty('--destructive', 'hsl(0 62.8% 30.6%)');
      root.style.setProperty('--destructive-foreground', 'hsl(0 0% 98%)');
      root.style.setProperty('--border', 'hsl(0 0% 20%)');
      root.style.setProperty('--input', 'hsl(0 0% 20%)');
      root.style.setProperty('--ring', 'hsl(142 71% 45%)');
      
      // Custom dark theme variables - soft black with dark gray
      root.style.setProperty('--dark-background', '#121212');
      root.style.setProperty('--dark-card', '#1e1e1e');
      root.style.setProperty('--dark-border', '#333333');
      root.style.setProperty('--dark-surface', '#242424');
      root.style.setProperty('--dark-muted', '#2a2a2a');
      root.style.setProperty('--dark-primary', '#303030');
      
      // Brand color in dark mode
      root.style.setProperty('--brand', 'hsl(142 71% 45%)');
      root.style.setProperty('--brand-foreground', 'hsl(144 70% 10%)');
      root.style.setProperty('--brand-hover', 'hsl(142 71% 40%)');
    } else {
      // Light mode - reset to default theme
      root.style.removeProperty('--background');
      root.style.removeProperty('--foreground');
      root.style.removeProperty('--card');
      root.style.removeProperty('--card-foreground');
      root.style.removeProperty('--popover');
      root.style.removeProperty('--popover-foreground');
      root.style.removeProperty('--primary');
      root.style.removeProperty('--primary-foreground');
      root.style.removeProperty('--secondary');
      root.style.removeProperty('--secondary-foreground');
      root.style.removeProperty('--muted');
      root.style.removeProperty('--muted-foreground');
      root.style.removeProperty('--accent');
      root.style.removeProperty('--accent-foreground');
      root.style.removeProperty('--destructive');
      root.style.removeProperty('--destructive-foreground');
      root.style.removeProperty('--border');
      root.style.removeProperty('--input');
      root.style.removeProperty('--ring');
      
      // Reset custom dark theme variables
      root.style.removeProperty('--dark-background');
      root.style.removeProperty('--dark-card');
      root.style.removeProperty('--dark-border');
      root.style.removeProperty('--dark-surface');
      root.style.removeProperty('--dark-muted');
      root.style.removeProperty('--dark-primary');
      
      // Brand color in light mode
      root.style.setProperty('--brand', 'hsl(142 76% 36%)');
      root.style.setProperty('--brand-foreground', 'hsl(0 0% 100%)');
      root.style.setProperty('--brand-hover', 'hsl(142 76% 30%)');
    }
  };

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
