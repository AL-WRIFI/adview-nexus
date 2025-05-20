
import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { CategoryIcon } from './CategoryIcon';
import { useCategories } from '@/hooks/use-api';
import { Category } from '@/types';
import { Button } from '@/components/ui/button';
import SubCategoryButtons from './SubCategoryButtons';

interface MobileCategoryBarProps {
  onCategoryClick?: (category: Category) => void;
  onSubCategoryClick?: (subCategory: Category) => void;
  selectedCategoryId?: number | null;
  selectedSubCategoryId?: number | null;
  className?: string;
}

export function MobileCategoryBar({ 
  onCategoryClick, 
  onSubCategoryClick,
  selectedCategoryId, 
  selectedSubCategoryId,
  className = '' 
}: MobileCategoryBarProps) {
  const { data: categories, isLoading } = useCategories();
  const [visibleIndex, setVisibleIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [activeSubCategories, setActiveSubCategories] = useState<Category[]>([]);
  
  const itemsPerView = 4; // Number of categories shown at once in mobile view
  
  // Scroll to category if it's selected externally
  useEffect(() => {
    if (selectedCategoryId && categories) {
      const index = categories.findIndex(cat => cat.id === selectedCategoryId);
      if (index !== -1) {
        setVisibleIndex(Math.floor(index / itemsPerView) * itemsPerView);
        
        // Set active category
        const category = categories.find(cat => cat.id === selectedCategoryId);
        if (category) {
          setActiveCategory(category);
          if (category.subcategories) {
            setActiveSubCategories(category.subcategories);
          } else {
            setActiveSubCategories([]);
          }
        }
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

  const handleCategoryClick = (category: Category) => {
    setActiveCategory(category);
    
    if (category.subcategories) {
      setActiveSubCategories(category.subcategories);
    } else {
      setActiveSubCategories([]);
    }
    
    if (onCategoryClick) {
      onCategoryClick(category);
    }
  };

  const handleSubCategorySelect = (subCategoryId: number) => {
    if (activeSubCategories && onSubCategoryClick) {
      const subCategory = activeSubCategories.find(sub => sub.id === subCategoryId);
      if (subCategory) {
        onSubCategoryClick(subCategory);
      }
    }
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
    <div className={`space-y-2 ${className}`}>
      <div className="relative">
        <div 
          className="flex items-center justify-between bg-white dark:bg-dark-card shadow-sm rounded-lg overflow-hidden relative border border-gray-100 dark:border-dark-border"
          ref={scrollContainerRef}
        >
          {/* Left arrow button */}
          {showLeftArrow && (
            <Button 
              variant="ghost"
              size="sm"
              className="absolute left-0 z-10 h-full flex items-center justify-center px-2 bg-gradient-to-r from-white via-white to-transparent dark:from-dark-card dark:via-dark-card dark:to-transparent"
              onClick={scrollPrev}
              aria-label="Previous categories"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          
          {/* Categories */}
          <div className="flex justify-between w-full">
            {visibleCategories.map((category) => (
              <CategoryIcon
                key={category.id}
                category={category}
                isSelected={category.id === selectedCategoryId || category.id === activeCategory?.id}
                onClick={() => handleCategoryClick(category)}
                size="sm"
              />
            ))}
          </div>
          
          {/* Right arrow button */}
          {showRightArrow && (
            <Button 
              variant="ghost"
              size="sm"
              className="absolute right-0 z-10 h-full flex items-center justify-center px-2 bg-gradient-to-l from-white via-white to-transparent dark:from-dark-card dark:via-dark-card dark:to-transparent"
              onClick={scrollNext}
              aria-label="Next categories"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* SubCategories */}
      {activeSubCategories && activeSubCategories.length > 0 && (
        <div className="bg-white dark:bg-dark-card shadow-sm rounded-lg overflow-x-auto border border-gray-100 dark:border-dark-border p-2">
          <SubCategoryButtons 
            subCategories={activeSubCategories}
            activeSubCategory={selectedSubCategoryId || null}
            onSelect={handleSubCategorySelect}
          />
        </div>
      )}
    </div>
  );
}
