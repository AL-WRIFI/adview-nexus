
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LayoutStore {
  adLayout: 'grid' | 'list';
  setAdLayout: (layout: 'grid' | 'list') => void;
}

export const useLayoutStore = create<LayoutStore>()(
  persist(
    (set) => ({
      adLayout: 'list',
      setAdLayout: (layout) => set({ adLayout: layout }),
    }),
    {
      name: 'layout-storage',
    }
  )
);
