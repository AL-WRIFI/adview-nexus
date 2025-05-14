
import React from 'react';
import { Category } from '@/types';
import { CategoryIcon } from './CategoryIcon';
import { useIsMobile } from '@/hooks/use-mobile';

interface CategoryGridProps {
  categories: Category[];
  selectedCategoryId: number | null;
  onCategorySelect: (category: Category) => void;
  itemsPerRow?: number;
}

export function CategoryGrid({
  categories,
  selectedCategoryId,
  onCategorySelect,
  itemsPerRow = 8
}: CategoryGridProps) {
  const isMobile = useIsMobile();
  
  // Determine grid columns based on itemsPerRow
  const gridColsClass = isMobile
    ? itemsPerRow === 4 ? 'grid-cols-4' : 'grid-cols-3'
    : 'grid-cols-8';
  
  // Use smaller icons on mobile
  const iconSize = isMobile ? 'sm' : 'md';
  
  return (
    <div className={`grid ${gridColsClass} gap-2 py-2 snap-x snap-mandatory`}>
      {categories.map((category) => (
        <div key={category.id} className="snap-start">
          <CategoryIcon
            category={category}
            isSelected={selectedCategoryId === category.id}
            onClick={() => onCategorySelect(category)}
            size={iconSize}
          />
        </div>
      ))}
    </div>
  );
}
