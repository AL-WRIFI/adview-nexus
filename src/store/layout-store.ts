
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LayoutState {
  adLayout: 'grid' | 'list';
  setAdLayout: (layout: 'grid' | 'list') => void;
}

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      adLayout: 'list', // القيمة الافتراضية قائمة
      setAdLayout: (layout) => set({ adLayout: layout }),
    }),
    {
      name: 'layout-storage',
    }
  )
);
