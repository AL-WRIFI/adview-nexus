
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { CategoryGrid } from './CategoryGrid';
import { SubCategoryButtons } from './SubCategoryButtons';
import { EnhancedMobileCategoryBar } from './EnhancedMobileCategoryBar';
import { useCategories } from '@/hooks/use-api';
import { Category } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { WithSkeleton } from '@/components/ui/loading-skeleton';
import { Link } from 'react-router-dom';

export function CategoryBar() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const params = useParams<{ categoryId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const scrollRef = useRef<HTMLDivElement>(null);

  const categoryIdFromUrl = params.categoryId ? parseInt(params.categoryId, 10) : null;
  const subcategoryIdFromUrl = searchParams.get('subcategory') ? parseInt(searchParams.get('subcategory')!, 10) : null;
  const childCategoryIdFromUrl = searchParams.get('childcategory') ? parseInt(searchParams.get('childcategory')!, 10) : null;

  const [selectedCategory, setSelectedCategory] = useState<number | null>(categoryIdFromUrl);
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(subcategoryIdFromUrl);
  const [selectedChildCategory, setSelectedChildCategory] = useState<number | null>(childCategoryIdFromUrl);

  const { data: categories, isLoading: loadingCategories } = useCategories();

  // Sync state with URL changes
  useEffect(() => {
    setSelectedCategory(categoryIdFromUrl);
    setSelectedSubcategory(subcategoryIdFromUrl);
    setSelectedChildCategory(childCategoryIdFromUrl);
  }, [categoryIdFromUrl, subcategoryIdFromUrl, childCategoryIdFromUrl]);

  // Reset child selections when parent changes
  useEffect(() => {
    if (selectedCategory !== categoryIdFromUrl) {
      setSelectedSubcategory(null);
      setSelectedChildCategory(null);
    }
  }, [selectedCategory, categoryIdFromUrl]);

  useEffect(() => {
    if (selectedSubcategory !== subcategoryIdFromUrl) {
      setSelectedChildCategory(null);
    }
  }, [selectedSubcategory, subcategoryIdFromUrl]);

  const subcategories = selectedCategory && categories
      ? categories.find(cat => cat.id === selectedCategory)?.subcategories || []
      : [];

  const childCategories = selectedSubcategory && subcategories
      ? subcategories.find(sub => sub.id === selectedSubcategory)?.children || []
      : [];

  const getCategoryImage = (category: Category) => {
    if (category.image_url) return category.image_url;
    if (category.image) return category.image;
    
    const defaultImages: Record<string, string> = {
      'سيارات': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=120&h=80&fit=crop',
      'عقارات': 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=120&h=80&fit=crop',
      'إلكترونيات': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=120&h=80&fit=crop',
      'أثاث': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=120&h=80&fit=crop',
      'أزياء': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=120&h=80&fit=crop',
      'وظائف': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=80&fit=crop',
      'خدمات': 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=120&h=80&fit=crop',
      'رياضة': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=120&h=80&fit=crop',
    };
    
    for (const [key, image] of Object.entries(defaultImages)) {
      if (category.name.includes(key)) return image;
    }
    
    return 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=120&h=80&fit=crop';
  };

  const handleCategorySelect = (category: Category) => {
    if (selectedCategory === category.id) {
      setSelectedCategory(null);
      setSelectedSubcategory(null);
      setSelectedChildCategory(null);
      navigate('/', { replace: true });
    } else {
      setSelectedCategory(category.id);
      setSelectedSubcategory(null);
      setSelectedChildCategory(null);
      navigate(`/category/${category.id}`, { replace: true });
    }
  };

  const handleCategorySelectById = (categoryId: number | null) => {
    if (!categoryId) {
      setSelectedCategory(null);
      setSelectedSubcategory(null);
      setSelectedChildCategory(null);
      navigate('/', { replace: true });
      return;
    }

    const category = categories?.find(cat => cat.id === categoryId);
    if (category) {
      handleCategorySelect(category);
    }
  };

  const handleSubcategorySelect = (subcategoryId: number) => {
    if (selectedSubcategory === subcategoryId) {
      setSelectedSubcategory(null);
      setSelectedChildCategory(null);
      if (selectedCategory) {
        navigate(`/category/${selectedCategory}`, { replace: true });
      }
    } else {
      setSelectedSubcategory(subcategoryId);
      setSelectedChildCategory(null);
      if (selectedCategory) {
        navigate(`/category/${selectedCategory}?subcategory=${subcategoryId}`, { replace: true });
      }
    }
  };

  const handleSubcategorySelectById = (subcategoryId: number | null) => {
    if (!subcategoryId) {
      setSelectedSubcategory(null);
      setSelectedChildCategory(null);
      if (selectedCategory) {
        navigate(`/category/${selectedCategory}`, { replace: true });
      }
      return;
    }

    handleSubcategorySelect(subcategoryId);
  };

  const handleChildCategorySelect = (childCategoryId: number) => {
    if (selectedChildCategory === childCategoryId) {
      setSelectedChildCategory(null);
      if (selectedCategory && selectedSubcategory) {
        navigate(`/category/${selectedCategory}?subcategory=${selectedSubcategory}`, { replace: true });
      }
    } else {
      setSelectedChildCategory(childCategoryId);
      if (selectedCategory && selectedSubcategory) {
        navigate(`/category/${selectedCategory}?subcategory=${selectedSubcategory}&childcategory=${childCategoryId}`, { replace: true });
      }
    }
  };

  if (isMobile) {
    return (
      <div dir="rtl" className="bg-white dark:bg-dark-background border-b border-border dark:border-dark-border">
        <EnhancedMobileCategoryBar 
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelectById}
          selectedSubcategory={selectedSubcategory}
          onSubcategorySelect={handleSubcategorySelectById}
        />

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
          <div ref={scrollRef} className="scroll-container gap-3 py-1 overflow-x-auto flex">
            {loadingCategories ? (
                <div className="flex justify-center items-center w-full py-2">
                  <span className="text-muted-foreground">جاري تحميل التصنيفات...</span>
                </div>
            ) : categories && categories.length > 0 ? (
                categories.map((category) => {
                  const isSelected = selectedCategory === category.id;
                  return (
                      <div key={category.id} className="flex flex-col items-center">
                        <button
                            onClick={() => handleCategorySelect(category)}
                            className="min-w-[100px] text-center"
                        >
                          <div className={`relative w-20 h-20 rounded-lg mx-auto mb-2 overflow-hidden transition-all ${isSelected ? 'shadow-lg scale-105' : ''}`}>
                            <img
                              src={getCategoryImage(category)}
                              alt={category.name}
                              className="w-full h-full object-cover transition-transform hover:scale-110"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.parentElement!.innerHTML = `
                                  <div class="w-full h-full bg-brand/10 flex items-center justify-center">
                                    <svg class="w-8 h-8 text-brand" fill="currentColor" viewBox="0 0 20 20">
                                      <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                                    </svg>
                                  </div>
                                `;
                              }}
                            />
                            {isSelected && (
                              <div className="absolute inset-0 bg-brand/20 rounded-lg"></div>
                            )}
                          </div>
                          <span className={`text-sm font-medium block truncate max-w-[80px] ${isSelected ? 'text-brand' : 'text-foreground'}`}>
                            {category.name}
                          </span>
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
