
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { CategoryGrid } from './CategoryGrid';
import { SubCategoryButtons } from './SubCategoryButtons';
import { useCategories } from '@/hooks/use-api';
import { Category } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileFilterBar } from './MobileFilterBar';
import { WithSkeleton, CategorySkeleton } from '@/components/ui/loading-skeleton';

export function CategoryBar() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const params = useParams<{ categoryId: string }>();
  const [searchParams] = useSearchParams();
  const scrollContainer = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);
  
  // Get category IDs from current URL
  const categoryIdFromUrl = params.categoryId 
    ? parseInt(params.categoryId, 10) 
    : null;
    
  const subcategoryIdFromUrl = searchParams.get('subcategory')
    ? parseInt(searchParams.get('subcategory')!, 10)
    : null;
    
  const childCategoryIdFromUrl = searchParams.get('childcategory')
    ? parseInt(searchParams.get('childcategory')!, 10)
    : null;
  
  // Component state
  const [selectedCategory, setSelectedCategory] = useState<number | null>(categoryIdFromUrl);
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(subcategoryIdFromUrl);
  const [selectedChildCategory, setSelectedChildCategory] = useState<number | null>(childCategoryIdFromUrl);
  const [selectedRegion, setSelectedRegion] = useState<string>('كل المناطق');
  
  // Fetch categories from API
  const { data: categories, isLoading: loadingCategories } = useCategories();
  
  // Update state when URL changes
  useEffect(() => {
    if (categoryIdFromUrl !== selectedCategory) {
      setSelectedCategory(categoryIdFromUrl);
    }
    
    if (subcategoryIdFromUrl !== selectedSubcategory) {
      setSelectedSubcategory(subcategoryIdFromUrl);
    }
    
    if (childCategoryIdFromUrl !== selectedChildCategory) {
      setSelectedChildCategory(childCategoryIdFromUrl);
    }
  }, [categoryIdFromUrl, subcategoryIdFromUrl, childCategoryIdFromUrl]);
  
  // Get subcategories for selected category
  const subcategories = selectedCategory && categories 
    ? categories.find(cat => cat.id === selectedCategory)?.subcategories || []
    : [];
  
  // Get child categories for selected subcategory
  const childCategories = selectedSubcategory && subcategories
    ? subcategories.find(sub => sub.id === selectedSubcategory)?.children || []
    : [];
  
  // Event handlers
  const handleCategorySelect = (category: Category) => {
    if (selectedCategory === category.id) {
      // Deselect if clicked on the same category
      setSelectedCategory(null);
      setSelectedSubcategory(null);
      setSelectedChildCategory(null);
      navigate('/');
    } else {
      // Select new category
      setSelectedCategory(category.id);
      setSelectedSubcategory(null);
      setSelectedChildCategory(null);
      navigate(`/category/${category.id}`);
    }
  };
  
  const handleSubcategorySelect = (subcategoryId: number) => {
    if (selectedSubcategory === subcategoryId) {
      // Deselect if clicked on the same subcategory
      setSelectedSubcategory(null);
      setSelectedChildCategory(null);
      navigate(`/category/${selectedCategory}`);
    } else {
      // Select new subcategory
      setSelectedSubcategory(subcategoryId);
      setSelectedChildCategory(null);
      navigate(`/category/${selectedCategory}?subcategory=${subcategoryId}`);
    }
  };
  
  const handleChildCategorySelect = (childCategoryId: number) => {
    if (selectedChildCategory === childCategoryId) {
      // Deselect if clicked on the same child category
      setSelectedChildCategory(null);
      navigate(`/category/${selectedCategory}?subcategory=${selectedSubcategory}`);
    } else {
      // Select new child category
      setSelectedChildCategory(childCategoryId);
      navigate(`/category/${selectedCategory}?subcategory=${selectedSubcategory}&childcategory=${childCategoryId}`);
    }
  };
  
  const handleFilterChange = (filters: any) => {
    console.log('Filters applied:', filters);
    // Logic for filtering ads
  };
  
  const handleNearbyClick = () => {
    console.log('Nearby clicked');
    // Logic for nearby ads
  };
  
  // Handle scroll with IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: '-1px 0px 0px 0px' }
    );
    
    const categoryBarElement = scrollContainer.current;
    if (categoryBarElement) {
      observer.observe(categoryBarElement);
    }
    
    return () => {
      if (categoryBarElement) {
        observer.unobserve(categoryBarElement);
      }
    };
  }, []);
  
  return (
    <div 
      className={`bg-white dark:bg-dark-background border-b border-border dark:border-dark-border relative`}
      ref={scrollContainer}
    >
      {/* Main categories grid */}
      <div className="container px-4 mx-auto py-3 overflow-x-auto no-scrollbar">
        <WithSkeleton
          isLoading={loadingCategories}
          data={categories}
          skeletonCount={8}
          SkeletonComponent={CategorySkeleton}
        >
          {(categoriesData) => (
            <CategoryGrid
              categories={categoriesData}
              selectedCategoryId={selectedCategory}
              onCategorySelect={handleCategorySelect}
              itemsPerRow={isMobile ? 4 : 8}
            />
          )}
        </WithSkeleton>
      </div>
      
      {/* Mobile filter bar */}
      {isMobile && (
        <div className="container px-4 mx-auto pb-2">
          <MobileFilterBar 
            onFilterChange={handleFilterChange}
            onNearbyClick={handleNearbyClick}
            selectedRegion={selectedRegion}
            isLoading={loadingCategories}
          />
        </div>
      )}
      
      {/* Subcategories - only show if a main category is selected */}
      {selectedCategory && subcategories.length > 0 && (
        <div className="container px-0 mx-auto border-t border-gray-100 dark:border-dark-border">
          <SubCategoryButtons
            items={subcategories}
            selectedId={selectedSubcategory}
            onSelect={handleSubcategorySelect}
            level="sub"
          />
        </div>
      )}
      
      {/* Child categories - only show if a subcategory is selected */}
      {selectedSubcategory && childCategories.length > 0 && (
        <div className="container px-0 mx-auto border-t border-gray-100 dark:border-dark-border bg-gray-50 dark:bg-dark-surface">
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
}
