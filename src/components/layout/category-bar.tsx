
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCategories } from '@/hooks/use-api';
import { Category } from '@/types';

interface CategoryBarProps {
  className?: string;
  categories?: Category[];
}

export function CategoryBar({ className, categories: propCategories }: CategoryBarProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrollWidth, setScrollWidth] = useState(0);
  const [clientWidth, setClientWidth] = useState(0);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // Fetch categories from API if not provided as props
  const { data: apiCategories, isLoading } = useCategories();
  const categories = propCategories || apiCategories || [];
  
  // Track scroll position for scroll buttons
  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        setScrollPosition(scrollRef.current.scrollLeft);
      }
    };
    
    const element = scrollRef.current;
    if (element) {
      element.addEventListener('scroll', handleScroll);
      setScrollWidth(element.scrollWidth);
      setClientWidth(element.clientWidth);
      
      return () => {
        element.removeEventListener('scroll', handleScroll);
      };
    }
  }, [categories]);
  
  // Re-measure on window resize
  useEffect(() => {
    const handleResize = () => {
      if (scrollRef.current) {
        setScrollWidth(scrollRef.current.scrollWidth);
        setClientWidth(scrollRef.current.clientWidth);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Calculate if we need scroll buttons
  const canScrollLeft = scrollPosition > 0;
  const canScrollRight = scrollWidth > clientWidth && scrollPosition < scrollWidth - clientWidth;
  
  // Scroll functions
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };
  
  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };
  
  const handleCategoryClick = (categoryId: string | number) => {
    navigate(`/category/${categoryId}`);
  };
  
  // Show loading placeholder
  if (isLoading) {
    return (
      <div className={cn("px-4 py-2 overflow-hidden", className)}>
        <div className="flex space-x-4 space-x-reverse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex-shrink-0 w-24 h-20 rounded-md bg-gray-200 dark:bg-gray-800 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className={cn("relative px-4 py-2", className)}>
      {/* Scroll buttons */}
      {canScrollLeft && (
        <div className="absolute top-0 right-0 bottom-0 flex items-center pr-2 z-10">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm dark:bg-gray-900/80"
            onClick={scrollRight} // RTL, so right button scrolls left
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Scroll right</span>
          </Button>
        </div>
      )}
      
      {canScrollRight && (
        <div className="absolute top-0 left-0 bottom-0 flex items-center pl-2 z-10">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm dark:bg-gray-900/80"
            onClick={scrollLeft} // RTL, so left button scrolls right
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Scroll left</span>
          </Button>
        </div>
      )}
      
      {/* Categories */}
      <div
        ref={scrollRef}
        className={cn(
          "flex space-x-3 space-x-reverse overflow-x-auto scrollbar-hide pb-3 pt-2",
          canScrollLeft && "mr-10",
          canScrollRight && "ml-10"
        )}
      >
        {categories.map((category) => (
          <button
            key={category.id}
            className="flex flex-col items-center flex-shrink-0 w-24 transition-all"
            onClick={() => handleCategoryClick(category.id)}
          >
            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-2 hover:bg-gray-200 transition-colors dark:bg-gray-800 dark:hover:bg-gray-700">
              {category.icon ? (
                <img src={category.icon} alt={category.name} className="h-8 w-8" />
              ) : (
                <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded-full" />
              )}
            </div>
            <span className="text-xs text-center line-clamp-2">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
