
import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SubCategory } from '@/types';

interface SubCategoryButtonsProps {
  subCategories: SubCategory[];
  selectedSubCategory?: number;
  onSubCategorySelect: (subCategoryId: number | undefined) => void;
}

export function SubCategoryButtons({
  subCategories,
  selectedSubCategory,
  onSubCategorySelect
}: SubCategoryButtonsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
      if ('WebkitOverflowScrolling' in style) {
        style.WebkitOverflowScrolling = 'touch';
      }
    }
  }, []);

  if (!subCategories?.length) return null;

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
          variant={selectedSubCategory === undefined ? "default" : "outline"}
          size="sm"
          onClick={() => onSubCategorySelect(undefined)}
          className="whitespace-nowrap"
        >
          الكل
        </Button>
        {subCategories.map((subCategory) => (
          <Button
            key={subCategory.id}
            variant={selectedSubCategory === subCategory.id ? "default" : "outline"}
            size="sm"
            onClick={() => onSubCategorySelect(subCategory.id)}
            className="whitespace-nowrap"
          >
            {subCategory.name}
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
