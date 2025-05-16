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

export function CategoryBar() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const params = useParams<{ categoryId: string }>();
  const [searchParams] = useSearchParams();
  const scrollContainer = useRef<HTMLDivElement>(null);

  // Get category IDs from current URL
  const categoryIdFromUrl = params.categoryId ? parseInt(params.categoryId, 10) : null;
  const subcategoryIdFromUrl = searchParams.get('subcategory') ? parseInt(searchParams.get('subcategory')!, 10) : null;
  const childCategoryIdFromUrl = searchParams.get('childcategory') ? parseInt(searchParams.get('childcategory')!, 10) : null;

  // Component state
  const [selectedCategory, setSelectedCategory] = useState<number | null>(categoryIdFromUrl);
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(subcategoryIdFromUrl);
  const [selectedChildCategory, setSelectedChildCategory] = useState<number | null>(childCategoryIdFromUrl);
  const [selectedRegion, setSelectedRegion] = useState<string>('كل المناطق');

  const { data: categories, isLoading: loadingCategories } = useCategories();

  // Pagination state
  const categoriesPerPage = 8; // 4 تصنيفات × صفين
  const totalPages = categories ? Math.ceil(categories.length / categoriesPerPage) : 1;
  const [currentPage, setCurrentPage] = useState(1);

  // Touch state for swipe
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Update state when URL changes
  useEffect(() => {
    if (categoryIdFromUrl !== selectedCategory) setSelectedCategory(categoryIdFromUrl);
    if (subcategoryIdFromUrl !== selectedSubcategory) setSelectedSubcategory(subcategoryIdFromUrl);
    if (childCategoryIdFromUrl !== selectedChildCategory) setSelectedChildCategory(childCategoryIdFromUrl);
  }, [categoryIdFromUrl, subcategoryIdFromUrl, childCategoryIdFromUrl]);

  // Get subcategories and child categories (كما في الكود الأصلي)
  const subcategories = selectedCategory && categories
    ? categories.find(cat => cat.id === selectedCategory)?.subcategories || []
    : [];

  const childCategories = selectedSubcategory && subcategories
    ? subcategories.find(sub => sub.id === selectedSubcategory)?.children || []
    : [];

  // Handlers
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

  const handleSubcategorySelect = (subcategoryId: number) => {
    if (selectedSubcategory === subcategoryId) {
      setSelectedSubcategory(null);
      setSelectedChildCategory(null);
      navigate(`/category/${selectedCategory}`);
    } else {
      setSelectedSubcategory(subcategoryId);
      setSelectedChildCategory(null);
      navigate(`/category/${selectedCategory}?subcategory=${subcategoryId}`);
    }
  };

  const handleChildCategorySelect = (childCategoryId: number) => {
    if (selectedChildCategory === childCategoryId) {
      setSelectedChildCategory(null);
      navigate(`/category/${selectedCategory}?subcategory=${selectedSubcategory}`);
    } else {
      setSelectedChildCategory(childCategoryId);
      navigate(`/category/${selectedCategory}?subcategory=${selectedSubcategory}&childcategory=${childCategoryId}`);
    }
  };

  const handleFilterChange = (filters: any) => {
    console.log('Filters applied:', filters);
  };

  // Touch event handlers for swipe (مع مراعاة الاتجاه العربي RTL)
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const onTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const deltaX = touchStartX.current - touchEndX.current;
      const swipeThreshold = 50; // حد السحب للتغيير

      // في اتجاه RTL السحب لليسار يعني الصفحة السابقة، ولليمين الصفحة القادمة
      if (deltaX > swipeThreshold && currentPage > 1) {
        // سحب لليسار → الصفحة السابقة (العكس لأن RTL)
        setCurrentPage(currentPage - 1);
      } else if (deltaX < -swipeThreshold && currentPage < totalPages) {
        // سحب لليمين → الصفحة القادمة
        setCurrentPage(currentPage + 1);
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div
      dir="rtl"
      className="bg-white dark:bg-dark-background border-b border-border dark:border-dark-border"
      ref={scrollContainer}
    >
      {/* <div className="container px-4 mx-auto py-3">
        <MobileFilterDrawer
          onFilterChange={handleFilterChange}
          selectedCategory={selectedCategory && categories ? categories.find(cat => cat.id === selectedCategory) : undefined}
        />
      </div> */}

      {/* Carousel container */}
      <div
        className="container px-4 mx-auto overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{ touchAction: 'pan-y' }} // يسمح بالسحب العمودي بدون تعارض
      >
        <WithSkeleton isLoading={loadingCategories} data={categories} skeletonCount={8}>
          {(categoriesData) => {
            // تقسيم التصنيفات إلى صفحات
            const pages = [];
            for (let i = 0; i < totalPages; i++) {
              pages.push(categoriesData.slice(i * categoriesPerPage, (i + 1) * categoriesPerPage));
            }

            return (
              <div
                className="flex flex-nowrap transition-transform duration-300 ease-in-out"
                style={{
                  width: `${totalPages * 100}%`,
                  // هنا تعكس الترجمة ليتناسب مع RTL
                  transform: `translateX(${(currentPage - 1) * (100 / totalPages)}%)`
                }}
              >
                {pages.map((pageCategories, idx) => (
                  <div
                    key={idx}
                    className="flex-shrink-0"
                    style={{ width: `${100 / totalPages}%` }}
                  >
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

      <MobilePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onChange={(page) => setCurrentPage(page)}
      />

      {/* Subcategories */}
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

      {/* Child categories */}
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
}