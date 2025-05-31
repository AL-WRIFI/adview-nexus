import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { CategoryGrid } from './CategoryGrid';
import { SubCategoryButtons } from './SubCategoryButtons';
import { useCategories } from '@/hooks/use-api';
import { Category } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileFilterDrawer } from '@/components/filters/MobileFilterDrawer';
import { WithSkeleton } from '@/components/ui/loading-skeleton';
import { MobilePagination } from './MobilePagination';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Car, Home, Smartphone, Mouse, Briefcase, Wrench, Shirt, Gamepad,
  Gem, ShoppingBag, Utensils, Laptop, BookOpen, Baby, Bike, Camera, FileText,
  Headphones, Gift, Train
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<any>> = {
  'Car': Car,
  'Home': Home,
  'Smartphone': Smartphone,
  'Mouse': Mouse,
  'Briefcase': Briefcase,
  'Wrench': Wrench,
  'Shirt': Shirt,
  'Gamepad': Gamepad,
  'Gem': Gem,
  'ShoppingBag': ShoppingBag,
  'Utensils': Utensils,
  'Laptop': Laptop,
  'BookOpen': BookOpen,
  'Baby': Baby,
  'Bike': Bike,
  'Camera': Camera,
  'FileText': FileText,
  'Headphones': Headphones,
  'Gift': Gift,
  'Train': Train
};

export function CategoryBar() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const params = useParams<{ categoryId: string }>();
  const [searchParams] = useSearchParams();
  const scrollContainer = useRef<HTMLDivElement>(null);

  const categoryIdFromUrl = params.categoryId ? parseInt(params.categoryId, 10) : null;
  const subcategoryIdFromUrl = searchParams.get('subcategory') ? parseInt(searchParams.get('subcategory')!, 10) : null;
  const childCategoryIdFromUrl = searchParams.get('childcategory') ? parseInt(searchParams.get('childcategory')!, 10) : null;

  const [selectedCategory, setSelectedCategory] = useState<number | null>(categoryIdFromUrl);
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(subcategoryIdFromUrl);
  const [selectedChildCategory, setSelectedChildCategory] = useState<number | null>(childCategoryIdFromUrl);
  const [selectedRegion, setSelectedRegion] = useState<string>('كل المناطق');

  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);

  const { data: categories, isLoading: loadingCategories } = useCategories();

  const categoriesPerPage = 8;
  const totalPages = categories ? Math.ceil(categories.length / categoriesPerPage) : 1;
  const [currentPage, setCurrentPage] = useState(1);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    if (categoryIdFromUrl !== selectedCategory) setSelectedCategory(categoryIdFromUrl);
    if (subcategoryIdFromUrl !== selectedSubcategory) setSelectedSubcategory(subcategoryIdFromUrl);
    if (childCategoryIdFromUrl !== selectedChildCategory) setSelectedChildCategory(childCategoryIdFromUrl);
  }, [categoryIdFromUrl, subcategoryIdFromUrl, childCategoryIdFromUrl]);

  const subcategories = selectedCategory && categories
    ? categories.find(cat => cat.id === selectedCategory)?.subcategories || []
    : [];

  const childCategories = selectedSubcategory && subcategories
    ? subcategories.find(sub => sub.id === selectedSubcategory)?.children || []
    : [];

  const handleCategorySelect = (category: Category) => {
    if (selectedCategory === category.id) {
      setSelectedCategory(null);
      setSelectedSubcategory(null);
      setSelectedChildCategory(null);
      navigate('/');
    } else {
      setSelectedCategory(category.id);
      setSelectedSubcategory(null);
      setSelectedChildCategory(null);
      navigate(`/category/${category.id}`);
    }
  };

  const handleSubcategorySelect = (subcategoryId: number | undefined) => {
    if (selectedSubcategory === subcategoryId) {
      setSelectedSubcategory(null);
      setSelectedChildCategory(null);
      navigate(`/category/${selectedCategory}`);
    } else {
      setSelectedSubcategory(subcategoryId || null);
      setSelectedChildCategory(null);
      navigate(`/category/${selectedCategory}?subcategory=${subcategoryId}`);
    }
  };

  const handleChildCategorySelect = (childCategoryId: number | undefined) => {
    if (selectedChildCategory === childCategoryId) {
      setSelectedChildCategory(null);
      navigate(`/category/${selectedCategory}?subcategory=${selectedSubcategory}`);
    } else {
      setSelectedChildCategory(childCategoryId || null);
      navigate(`/category/${selectedCategory}?subcategory=${selectedSubcategory}&childcategory=${childCategoryId}`);
    }
  };

  const handleFilterChange = (filters: any) => {
    console.log('Filters applied:', filters);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const onTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const deltaX = touchStartX.current - touchEndX.current;
      const swipeThreshold = 50;
      if (deltaX > swipeThreshold && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else if (deltaX < -swipeThreshold && currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

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
      checkScrollButtons();
      return () => {
        scrollEl.removeEventListener('scroll', checkScrollButtons);
      };
    }
  }, []);

  if (isMobile) {
    return (
      <div dir="rtl" className="bg-white dark:bg-dark-background border-b border-border dark:border-dark-border" ref={scrollContainer}>
        <div className="container px-4 mx-auto overflow-hidden" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} style={{ touchAction: 'pan-y' }}>
          <WithSkeleton isLoading={loadingCategories} data={categories} skeletonCount={8}>
            {(categoriesData) => {
              const pages = [];
              for (let i = 0; i < totalPages; i++) {
                pages.push(categoriesData.slice(i * categoriesPerPage, (i + 1) * categoriesPerPage));
              }
              return (
                <div className="flex flex-nowrap transition-transform duration-300 ease-in-out" style={{ width: `${totalPages * 100}%`, transform: `translateX(${-(currentPage - 1) * (100 / totalPages)}%)` }}>
                  {pages.map((pageCategories, idx) => (
                    <div key={idx} className="flex-shrink-0" style={{ width: `${100 / totalPages}%` }}>
                      <CategoryGrid
                        categories={pageCategories}
                        selectedCategoryId={selectedCategory}
                        onCategorySelect={handleCategorySelect}
                      />
                    </div>
                  ))}
                </div>
              );
            }}
          </WithSkeleton>
        </div>
        <MobilePagination currentPage={currentPage} totalPages={totalPages} onChange={(page) => setCurrentPage(page)} />
        {selectedCategory && subcategories.length > 0 && (
          <div className="container px-4 mx-auto border-t border-gray-100 dark:border-dark-border">
            <SubCategoryButtons 
              items={subcategories} 
              selectedId={selectedSubcategory} 
              onSelect={handleSubcategorySelect} 
              level="sub" 
            />
          </div>
        )}
        {selectedSubcategory && childCategories.length > 0 && (
          <div className="container px-4 mx-auto border-t border-gray-100 dark:border-dark-border bg-gray-50 dark:bg-dark-surface">
            <SubCategoryButtons 
              items={childCategories} 
              selectedId={selectedChildCategory} 
              onSelect={handleChildCategorySelect} 
              level="child" 
            />
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div className="relative bg-white border-b border-border dark:bg-dark-background">
        <div className="container px-4 mx-auto relative py-4">
          {showLeftScroll && (
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 flex items-center">
              <Button variant="ghost" size="icon" className="h-8 w-8 absolute left-4 rounded-full shadow-sm" onClick={scrollLeft} aria-label="Scroll left">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </div>
          )}
          <div ref={scrollRef} className="scroll-container gap-3 py-1 pl-10 pr-10 overflow-x-auto flex">
            {loadingCategories ? (
              <div className="flex justify-center items-center w-full py-2">
                <span className="text-muted-foreground">جاري تحميل التصنيفات...</span>
              </div>
            ) : categories && categories.length > 0 ? (
              categories.map((category) => {
                const iconName = category.icon || 'Car';
                const Icon = iconMap[iconName] || Car;
                const isSelected = selectedCategory === category.id;
                return (
                  <div key={category.id} className="flex flex-col items-center">
                    <button
                      onClick={() => handleCategorySelect(category)}
                      className={`category-icon dark:border-dark-border bg-white dark:bg-dark-background min-w-[100px] text-center transition-all ${isSelected ? 'scale-105' : ''}`}
                    >
                      <div className={`p-3 rounded-full mx-auto mb-2 transition-colors ${isSelected ? 'bg-brand text-white' : 'bg-brand-light'}`} style={{ width: '56px', height: '56px' }}>
                        <Icon className={`h-full w-full ${isSelected ? 'text-white' : 'text-brand'}`} />
                      </div>
                      <span className="text-sm font-medium truncate block">{category.name}</span>
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="flex justify-center items-center w-full py-2">
                <span className="text-muted-foreground">لا توجد تصنيفات</span>
              </div>
            )}
          </div>
          {showRightScroll && (
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 flex items-center">
              <Button variant="ghost" size="icon" className="h-8 w-8 absolute right-4 rounded-full shadow-sm" onClick={scrollRight} aria-label="Scroll right">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
        {selectedCategory && subcategories.length > 0 && (
          <div className="bg-gray-50 border-t border-border transition-all dark:bg-dark-background">
            <div className="container px-4 mx-auto py-3">
              <SubCategoryButtons 
                items={subcategories} 
                selectedId={selectedSubcategory} 
                onSelect={handleSubcategorySelect} 
                level="sub" 
              />
            </div>
          </div>
        )}
        {selectedSubcategory && childCategories.length > 0 && (
          <div className="bg-gray-100 border-t border-border transition-all dark:bg-dark-background">
            <div className="container px-4 mx-auto py-3">
              <SubCategoryButtons 
                items={childCategories} 
                selectedId={selectedChildCategory} 
                onSelect={handleChildCategorySelect} 
                level="child" 
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}
