
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCategories } from '@/hooks/use-api';
import { Category } from '@/types';
import { SubCategoryButtons } from './SubCategoryButtons';
import { CategoryIcon } from './CategoryIcon';

export function MobileCategoryBar() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Category | null>(null);
  const navigate = useNavigate();

  // Fetch categories from API
  const { data: categories, isLoading: loadingCategories } = useCategories();

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftScroll(scrollLeft > 0);
      setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (scrollEl) {
      scrollEl.addEventListener('scroll', checkScrollButtons);
      // Initial check
      checkScrollButtons();

      return () => {
        scrollEl.removeEventListener('scroll', checkScrollButtons);
      };
    }
  }, []);

  // Handle category selection
  const handleCategoryClick = (category: Category) => {
    if (selectedCategory?.id === category.id) {
      // If clicking the same category, navigate to category page
      navigate(`/category/${category.id}`);
    } else {
      // Select new category
      setSelectedCategory(category);
      setSelectedSubcategory(null);
    }
  };

  // Handle subcategory selection
  const handleSubcategoryClick = (subcategory: Category) => {
    if (selectedSubcategory?.id === subcategory.id) {
      // If clicking the same subcategory, navigate to subcategory page
      navigate(`/category/${selectedCategory?.id}?subcategory=${subcategory.id}`);
    } else {
      setSelectedSubcategory(subcategory);
    }
  };

  // Handle child category selection
  const handleChildCategoryClick = (childCategory: Category) => {
    navigate(`/category/${selectedCategory?.id}?subcategory=${selectedSubcategory?.id}&childcategory=${childCategory.id}`);
  };

  return (
    <div className="relative bg-white border-b border-border dark:bg-dark-background dark:border-dark-border overflow-hidden">
      <div className="relative py-3">
        {/* Scroll shadow/gradient on left */}
        {showLeftScroll && (
          <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-white dark:from-dark-background to-transparent z-10 flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 absolute left-1 rounded-full bg-white dark:bg-dark-background shadow-sm border border-gray-100 dark:border-dark-border"
              onClick={scrollLeft}
            >
              <ChevronLeft className="h-3 w-3" />
            </Button>
          </div>
        )}

        {/* Categories scroll area */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto py-1 px-4 gap-3 no-scrollbar snap-x"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {loadingCategories ? (
            <div className="flex justify-center items-center w-full py-1">
              <span className="text-sm text-muted-foreground">جاري التحميل...</span>
            </div>
          ) : categories && categories.length > 0 ? (
            categories.map((category) => {
              const isSelected = selectedCategory?.id === category.id;
              return (
                <div key={category.id} className="flex-shrink-0 snap-start">
                  <button
                    onClick={() => handleCategoryClick(category)}
                    className={`flex flex-col items-center transition-transform ${isSelected ? 'scale-110' : ''}`}
                  >
                    <div 
                      className={`w-12 h-12 flex items-center justify-center rounded-full mb-1 transition-colors
                        ${isSelected ? 'bg-brand' : 'bg-brand-light dark:bg-dark-card'}`}
                    >
                      <CategoryIcon 
                        iconName={category.icon} 
                        className={`h-6 w-6 ${isSelected ? 'text-white' : 'text-brand dark:text-brand-light'}`} 
                      />
                    </div>
                    <span className="text-xs font-medium truncate max-w-16 text-center">
                      {category.name}
                    </span>
                  </button>
                </div>
              );
            })
          ) : (
            <div className="flex justify-center items-center w-full py-1">
              <span className="text-sm text-muted-foreground">لا توجد تصنيفات</span>
            </div>
          )}
        </div>

        {/* Scroll shadow/gradient on right */}
        {showRightScroll && (
          <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-white dark:from-dark-background to-transparent z-10 flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 absolute right-1 rounded-full bg-white dark:bg-dark-background shadow-sm border border-gray-100 dark:border-dark-border"
              onClick={scrollRight}
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      {/* Subcategories area */}
      {selectedCategory && selectedCategory.subcategories && selectedCategory.subcategories.length > 0 && (
        <div className="bg-gray-50 border-t border-border transition-all dark:bg-dark-surface dark:border-dark-border">
          <SubCategoryButtons 
            items={selectedCategory.subcategories}
            selectedId={selectedSubcategory?.id || null}
            onSelect={(id) => {
              const subcategory = selectedCategory.subcategories?.find(sub => sub.id === id);
              if (subcategory) {
                handleSubcategoryClick(subcategory);
              }
            }}
            level="sub"
          />
        </div>
      )}

      {/* Third level categories */}
      {selectedSubcategory?.subcategories && selectedSubcategory.subcategories.length > 0 && (
        <div className="bg-gray-100 border-t border-border dark:bg-dark-background/60 dark:border-dark-border">
          <SubCategoryButtons 
            items={selectedSubcategory.subcategories}
            selectedId={null}
            onSelect={(id) => {
              const childCategory = selectedSubcategory.subcategories?.find(child => child.id === id);
              if (childCategory) {
                handleChildCategoryClick(childCategory);
              }
            }}
            level="child"
          />
        </div>
      )}
    </div>
  );
}
