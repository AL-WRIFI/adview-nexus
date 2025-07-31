import { create } from 'zustand';
import { SearchFilters } from '@/types';

interface FilterState {
  filters: SearchFilters;
  setFilters: (newFilters: Partial<SearchFilters>) => void;
  setCategory: (categoryId?: number, subcategoryId?: number, childCategoryId?: number) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  filters: {},
  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters, page: 1 }
  })),
  setCategory: (categoryId, subcategoryId, childCategoryId) => set((state) => ({
    filters: {
      ...state.filters,
      category_id: categoryId,
      sub_category_id: subcategoryId,
      child_category_id: childCategoryId,
      page: 1,
    },
  })),
  resetFilters: () => set({ filters: {} }),
}));