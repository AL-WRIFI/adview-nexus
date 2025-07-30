import React from 'react';
import { useCategories } from '@/hooks/use-api';
import { Category } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { useFilterStore } from '@/store/filter-store';
import { EnhancedMobileCategoryBar } from './EnhancedMobileCategoryBar';
import { ScrollableContainer } from './ScrollableContainer';
import { cn } from '@/lib/utils';

export function CategoryBar() {
  const isMobile = useIsMobile();
  const { filters, setCategory } = useFilterStore();
  const { data: categories, isLoading: loadingCategories } = useCategories();

  const selectedCategory = filters.category_id;
  const selectedSubcategory = filters.sub_category_id;
  const selectedChildCategory = filters.child_category_id;
  
  const subcategories = selectedCategory && categories
    ? categories.find(cat => cat.id === selectedCategory)?.subcategories || []
    : [];

  const childCategories = selectedSubcategory && subcategories
    ? subcategories.find(sub => sub.id === selectedSubcategory)?.childcategories || []
    : [];

  const handleCategorySelect = (categoryId: number) => {
    if (selectedCategory === categoryId) {
      setCategory(undefined, undefined, undefined);
    } else {
      setCategory(categoryId, undefined, undefined);
    }
  };
  
  const handleSubcategorySelect = (subcategoryId: number) => {
    if (selectedSubcategory === subcategoryId) {
      setCategory(selectedCategory, undefined, undefined);
    } else {
      setCategory(selectedCategory, subcategoryId, undefined);
    }
  };

  const handleChildCategorySelect = (childCategoryId: number) => {
    if (selectedChildCategory === childCategoryId) {
      setCategory(selectedCategory, selectedSubcategory, undefined);
    } else {
      setCategory(selectedCategory, selectedSubcategory, childCategoryId);
    }
  };

  const getCategoryImage = (category: Category) => {
    if (category.image_url) return category.image_url;
    if (category.image) return category.image;
    const defaultImages: Record<string, string> = {
      'سيارات': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=120&h=80&fit=crop',
      'عقارات': 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=120&h=80&fit=crop',
      'إلكترونيات': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=120&h=80&fit=crop',
    };
    for (const [key, image] of Object.entries(defaultImages)) {
      if (category.name.includes(key)) return image;
    }
    return 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=120&h=80&fit=crop';
  };

  if (isMobile) {
    return (
      <div dir="rtl" className="bg-white dark:bg-dark-background border-b border-border dark:border-dark-border">
        <EnhancedMobileCategoryBar
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
          selectedSubcategory={selectedSubcategory}
          onSubcategorySelect={handleSubcategorySelect}
          selectedChildCategory={selectedChildCategory}
          onChildCategorySelect={handleChildCategorySelect}
        />
      </div>
    );
  }

  return (
    <div dir="rtl" className="bg-white dark:bg-dark-background border-b border-border dark:border-dark-border">
      <div className="container mx-auto px-4 py-4 bg-white dark:bg-dark-background">
        <ScrollableContainer showScrollbar={categories && categories.length > 6}>
          <div className="flex gap-6 min-w-max">
            {loadingCategories ? (
              <span className="text-sm text-muted-foreground py-4">جاري تحميل التصنيفات...</span>
            ) : (
              categories?.map(category => {
                const isSelected = selectedCategory === category.id;
                return (
                  <button key={category.id} onClick={() => handleCategorySelect(category.id)} className="flex flex-col items-center min-w-[80px] group">
                    <div className={cn('relative w-12 h-12 mb-2 border-2 rounded-lg flex justify-center items-center transition-all', isSelected ? 'border-brand' : 'border-gray-200 dark:border-gray-700')}>
                      <img src={getCategoryImage(category)} alt={category.name} className="w-full h-full object-cover rounded-md" />
                    </div>
                    <span className={cn('text-xs font-medium text-center', isSelected ? 'text-brand' : 'text-foreground')}>{category.name}</span>
                  </button>
                );
              })
            )}
          </div>
        </ScrollableContainer>
      </div>
      {selectedCategory && subcategories.length > 0 && (
        <div className="bg-gray-50 dark:bg-dark-surface">
          <div className="container mx-auto px-4 py-2">
            <ScrollableContainer showScrollbar={subcategories.length > 4}>
              <div className="flex flex-col gap-1 min-w-max">
                <div className="flex gap-2">
                  {subcategories.map(subcategory => {
                    const isSelected = selectedSubcategory === subcategory.id;
                    return (
                      <button key={subcategory.id} onClick={() => handleSubcategorySelect(subcategory.id)} className={cn('px-2 py-1 rounded-md text-sm font-medium whitespace-nowrap transition-all', isSelected ? 'bg-brand text-white' : 'bg-white text-foreground hover:bg-gray-100 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500')}>
                        {subcategory.name}
                      </button>
                    );
                  })}
                </div>
                {selectedSubcategory && childCategories.length > 0 && (
                  <div className="flex gap-2 mt-1">
                    {childCategories.map(childCategory => {
                      const isSelected = selectedChildCategory === childCategory.id;
                      return (
                        <button key={childCategory.id} onClick={() => handleChildCategorySelect(childCategory.id)} className={cn('px-3 py-1 rounded-md text-sm font-medium whitespace-nowrap transition-all', isSelected ? 'bg-brand text-white' : 'bg-white text-foreground hover:bg-gray-100 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500')}>
                          {childCategory.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </ScrollableContainer>
          </div>
        </div>
      )}
    </div>
  );
}