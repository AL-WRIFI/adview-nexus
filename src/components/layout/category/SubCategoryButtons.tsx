
import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SubCategoryButtonsProps {
  categories: { id: number; name: string }[];
  selectedCategoryId: number | null;
  onSelectCategory: (id: number) => void;
  className?: string;
}

const SubCategoryButtons: React.FC<SubCategoryButtonsProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  className = '',
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(false);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftScroll(scrollLeft > 0);
      setShowRightScroll(scrollLeft + clientWidth < scrollWidth);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    window.addEventListener('resize', checkScrollButtons);
    
    return () => {
      window.removeEventListener('resize', checkScrollButtons);
    };
  }, [categories]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      const newScrollLeft =
        direction === 'left'
          ? scrollContainerRef.current.scrollLeft - scrollAmount
          : scrollContainerRef.current.scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
      
      setTimeout(checkScrollButtons, 300);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {showLeftScroll && (
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-dark-background/80 rounded-full p-1 shadow-md z-10"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-4 w-4 dark:text-gray-300" />
        </button>
      )}
      
      <div 
        ref={scrollContainerRef}
        className="flex gap-2 overflow-x-auto pb-2 scrollbar-none scroll-smooth"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
        onScroll={checkScrollButtons}
      >
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategoryId === category.id ? 'default' : 'outline'}
            onClick={() => onSelectCategory(category.id)}
            size="sm"
            className={`whitespace-nowrap dark:bg-dark-card dark:text-gray-200 dark:border-dark-border ${
              selectedCategoryId === category.id ? 'dark:bg-brand dark:text-white' : 'dark:hover:bg-dark-muted'
            }`}
          >
            {category.name}
          </Button>
        ))}
      </div>
      
      {showRightScroll && (
        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-dark-background/80 rounded-full p-1 shadow-md z-10"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-4 w-4 dark:text-gray-300" />
        </button>
      )}
    </div>
  );
};

export default SubCategoryButtons;
