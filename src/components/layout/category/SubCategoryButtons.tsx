
import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SubCategory } from '@/types';

interface SubCategoryButtonsProps {
  subCategories?: SubCategory[];
  items?: SubCategory[];
  selectedSubCategory?: number;
  selectedId?: number;
  onSubCategorySelect?: (subCategoryId: number | undefined) => void;
  onSelect?: (subCategoryId: number | undefined) => void;
  level?: string;
}

export function SubCategoryButtons({
  subCategories,
  items,
  selectedSubCategory,
  selectedId,
  onSubCategorySelect,
  onSelect,
  level
}: SubCategoryButtonsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Use items or subCategories
  const categories = items || subCategories || [];
  const selected = selectedId || selectedSubCategory;
  const onSelectHandler = onSelect || onSubCategorySelect;

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      // Apply webkit scrolling for iOS devices safely
      const style = container.style as any;
      if (style && typeof style.WebkitOverflowScrolling !== 'undefined') {
        style.WebkitOverflowScrolling = 'touch';
      }
    }
  }, []);

  if (!categories?.length) return null;

  return (
    <div className="relative">
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 flex items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={scrollLeft}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
      
      <div 
        ref={scrollContainerRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide py-2 px-8"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <Button
          variant={selected === undefined ? "default" : "outline"}
          size="sm"
          onClick={() => onSelectHandler?.(undefined)}
          className="whitespace-nowrap"
        >
          الكل
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selected === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => onSelectHandler?.(category.id)}
            className="whitespace-nowrap"
          >
            {category.name}
          </Button>
        ))}
      </div>
      
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 flex items-center justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={scrollRight}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
