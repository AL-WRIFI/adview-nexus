
import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { CategoryIcon } from './CategoryIcon';
import { useCategories } from '@/hooks/use-api';
import { Category } from '@/types';

interface MobileCategoryBarProps {
  onCategoryClick?: (category: Category) => void;
  selectedCategoryId?: number | null;
  className?: string;
}

export function MobileCategoryBar({ onCategoryClick, selectedCategoryId, className = '' }: MobileCategoryBarProps) {
  const { data: categories, isLoading } = useCategories();
  const [visibleIndex, setVisibleIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  
  const itemsPerView = 4; // Number of categories shown at once in mobile view
  
  // Scroll to category if it's selected externally
  useEffect(() => {
    if (selectedCategoryId && categories) {
      const index = categories.findIndex(cat => cat.id === selectedCategoryId);
      if (index !== -1) {
        setVisibleIndex(Math.floor(index / itemsPerView) * itemsPerView);
      }
    }
  }, [selectedCategoryId, categories]);

  // Update arrow visibility based on scroll position
  const updateArrowVisibility = () => {
    if (scrollContainerRef.current) {
      setShowLeftArrow(visibleIndex > 0);
      
      const maxStartIndex = categories ? Math.max(0, categories.length - itemsPerView) : 0;
      setShowRightArrow(visibleIndex < maxStartIndex);
    }
  };
  
  useEffect(() => {
    updateArrowVisibility();
  }, [visibleIndex, categories]);
  
  const scrollNext = () => {
    if (categories) {
      const maxStartIndex = Math.max(0, categories.length - itemsPerView);
      setVisibleIndex(prev => Math.min(prev + itemsPerView, maxStartIndex));
    }
  };
  
  const scrollPrev = () => {
    setVisibleIndex(prev => Math.max(0, prev - itemsPerView));
  };
  
  if (isLoading || !categories || categories.length === 0) {
    return (
      <div className="h-24 flex items-center justify-center bg-gray-50 dark:bg-dark-surface rounded-lg">
        <div className="animate-pulse h-8 w-32 bg-gray-200 dark:bg-dark-muted rounded"></div>
      </div>
    );
  }
  
  const visibleCategories = categories.slice(visibleIndex, visibleIndex + itemsPerView);
  
  return (
    <div className={`relative ${className}`}>
      <div 
        className="flex items-center justify-between bg-white dark:bg-dark-card shadow-sm rounded-lg overflow-hidden relative border border-gray-100 dark:border-dark-border"
        ref={scrollContainerRef}
      >
        {/* Left arrow button */}
        {showLeftArrow && (
          <button 
            className="absolute left-0 z-10 h-full flex items-center justify-center px-2 bg-gradient-to-r from-white via-white to-transparent dark:from-dark-card dark:via-dark-card dark:to-transparent"
            onClick={scrollPrev}
            aria-label="Previous categories"
          >
            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-white dark:bg-dark-muted shadow-md text-gray-700 dark:text-gray-300">
              <ArrowLeft className="h-4 w-4" />
            </div>
          </button>
        )}
        
        {/* Categories */}
        <div className="flex justify-between w-full">
          {visibleCategories.map((category) => (
            <CategoryIcon
              key={category.id}
              category={category}
              isSelected={category.id === selectedCategoryId}
              onClick={() => onCategoryClick && onCategoryClick(category)}
              size="sm"
            />
          ))}
        </div>
        
        {/* Right arrow button */}
        {showRightArrow && (
          <button 
            className="absolute right-0 z-10 h-full flex items-center justify-center px-2 bg-gradient-to-l from-white via-white to-transparent dark:from-dark-card dark:via-dark-card dark:to-transparent"
            onClick={scrollNext}
            aria-label="Next categories"
          >
            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-white dark:bg-dark-muted shadow-md text-gray-700 dark:text-gray-300">
              <ArrowRight className="h-4 w-4" />
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
