
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  mode: 'light' | 'dark' | 'system';
  setMode: (mode: 'light' | 'dark' | 'system') => void;
  applyTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'system',

      setMode: (mode) => {
        set({ mode });
        setTimeout(() => {
          get().applyTheme();
        }, 50);
      },

      applyTheme: () => {
        const { mode } = get();
        const root = document.documentElement;
        
        // Determine actual theme
        let actualMode = mode;
        if (mode === 'system') {
          actualMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }

        // Apply theme class
        root.classList.remove('light', 'dark');
        root.classList.add(actualMode);

        console.log(`🎨 Theme applied: ${actualMode}`);
      },
    }),
    {
      name: 'theme-storage',
      partialize: (state) => ({ mode: state.mode }),
    }
  )
);
