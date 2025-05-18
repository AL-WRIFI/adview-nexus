
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCategories } from '@/hooks/use-api';
import { CategoryIcon } from './CategoryIcon';
import { cn } from '@/lib/utils';

interface MobileCategoryBarProps {
  className?: string;
  selectedCategoryId?: number;
}

export function MobileCategoryBar({ className, selectedCategoryId }: MobileCategoryBarProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const navigate = useNavigate();
  const { data: categories, isLoading } = useCategories();
  
  const scrollContainer = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainer.current;
    if (!container) return;

    const scrollAmount = 200; // Scroll by 200px
    
    const newPosition = direction === 'left' 
      ? scrollPosition - scrollAmount 
      : scrollPosition + scrollAmount;
    
    container.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });
    
    setScrollPosition(newPosition);
  };

  const handleCategoryClick = (categoryId: number) => {
    navigate(`/category/${categoryId}`);
  };

  if (isLoading) {
    return (
      <div className={cn("relative overflow-hidden px-4 py-3 flex items-center justify-center dark:bg-gray-900", className)}>
        <div className="animate-pulse flex space-x-4 rtl:space-x-reverse w-full">
          <div className="h-10 bg-gray-200 rounded-full w-1/5 dark:bg-gray-800"></div>
          <div className="h-10 bg-gray-200 rounded-full w-1/5 dark:bg-gray-800"></div>
          <div className="h-10 bg-gray-200 rounded-full w-1/5 dark:bg-gray-800"></div>
          <div className="h-10 bg-gray-200 rounded-full w-1/5 dark:bg-gray-800"></div>
          <div className="h-10 bg-gray-200 rounded-full w-1/5 dark:bg-gray-800"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden dark:bg-gray-900 dark:border-gray-800", className)}>
      <Button 
        variant="outline" 
        size="icon" 
        className="absolute left-1 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full shadow-md dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 dark:text-gray-200"
        onClick={() => scroll('right')}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Scroll left</span>
      </Button>
      
      <Button 
        variant="outline" 
        size="icon" 
        className="absolute right-1 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full shadow-md dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 dark:text-gray-200"
        onClick={() => scroll('left')}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Scroll right</span>
      </Button>
      
      <div 
        ref={scrollContainer} 
        className="overflow-x-auto scrollbar-none px-10 py-3 flex items-center gap-3"
        dir="rtl" // Make sure scrolling works correctly in RTL
      >
        {categories?.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={cn(
              "flex flex-col items-center justify-center min-w-[80px] p-2 rounded-lg transition-colors",
              selectedCategoryId === category.id
                ? "bg-primary/10 text-primary dark:bg-primary/20"
                : "hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
          >
            <CategoryIcon 
              name={category.name} 
              icon={category.icon}
              className={cn(
                "h-8 w-8 mb-1",
                selectedCategoryId === category.id
                  ? "text-primary dark:text-primary"
                  : "text-gray-500 dark:text-gray-400"
              )} 
            />
            <span className={cn(
              "text-xs font-medium text-center",
              selectedCategoryId === category.id
                ? "text-primary dark:text-primary"
                : "text-gray-700 dark:text-gray-300"
            )}>
              {category.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
