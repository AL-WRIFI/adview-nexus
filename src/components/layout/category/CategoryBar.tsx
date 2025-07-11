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
  const params = useParams<{
    categoryId: string;
  }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const scrollRef = useRef<HTMLDivElement>(null);
  const categoryIdFromUrl = params.categoryId ? parseInt(params.categoryId, 10) : null;
  const subcategoryIdFromUrl = searchParams.get('subcategory') ? parseInt(searchParams.get('subcategory')!, 10) : null;
  const childCategoryIdFromUrl = searchParams.get('childcategory') ? parseInt(searchParams.get('childcategory')!, 10) : null;
  const [selectedCategory, setSelectedCategory] = useState<number | null>(categoryIdFromUrl);
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(subcategoryIdFromUrl);
  const [selectedChildCategory, setSelectedChildCategory] = useState<number | null>(childCategoryIdFromUrl);
  const {
    data: categories,
    isLoading: loadingCategories
  } = useCategories();

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
  const subcategories = selectedCategory && categories ? categories.find(cat => cat.id === selectedCategory)?.subcategories || [] : [];
  const childCategories = selectedSubcategory && subcategories ? subcategories.find(sub => sub.id === selectedSubcategory)?.childcategories || [] : [];
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
      'رياضة': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=120&h=80&fit=crop'
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
      navigate('/', {
        replace: true
      });
    } else {
      setSelectedCategory(category.id);
      setSelectedSubcategory(null);
      setSelectedChildCategory(null);
      navigate(`/category/${category.id}`, {
        replace: true
      });
    }
  };
  const handleCategorySelectById = (categoryId: number | null) => {
    if (!categoryId) {
      setSelectedCategory(null);
      setSelectedSubcategory(null);
      setSelectedChildCategory(null);
      navigate('/', {
        replace: true
      });
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
        navigate(`/category/${selectedCategory}`, {
          replace: true
        });
      }
    } else {
      setSelectedSubcategory(subcategoryId);
      setSelectedChildCategory(null);
      if (selectedCategory) {
        navigate(`/category/${selectedCategory}?subcategory=${subcategoryId}`, {
          replace: true
        });
      }
    }
  };
  const handleSubcategorySelectById = (subcategoryId: number | null) => {
    if (!subcategoryId) {
      setSelectedSubcategory(null);
      setSelectedChildCategory(null);
      if (selectedCategory) {
        navigate(`/category/${selectedCategory}`, {
          replace: true
        });
      }
      return;
    }
    handleSubcategorySelect(subcategoryId);
  };
  const handleChildCategorySelect = (childCategoryId: number) => {
    if (selectedChildCategory === childCategoryId) {
      setSelectedChildCategory(null);
      if (selectedCategory && selectedSubcategory) {
        navigate(`/category/${selectedCategory}?subcategory=${selectedSubcategory}`, {
          replace: true
        });
      }
    } else {
      setSelectedChildCategory(childCategoryId);
      if (selectedCategory && selectedSubcategory) {
        navigate(`/category/${selectedCategory}?subcategory=${selectedSubcategory}&childcategory=${childCategoryId}`, {
          replace: true
        });
      }
    }
  };
  if (isMobile) {
    return <div dir="rtl" className="bg-white dark:bg-dark-background border-b border-border dark:border-dark-border">
        <EnhancedMobileCategoryBar selectedCategory={selectedCategory} onCategorySelect={handleCategorySelectById} selectedSubcategory={selectedSubcategory} onSubcategorySelect={handleSubcategorySelectById} />

        {selectedSubcategory && childCategories.length > 0 && <div className="container px-4 mx-auto border-t border-gray-100 dark:border-dark-border bg-gray-50 dark:bg-dark-surface">
            <SubCategoryButtons items={childCategories} selectedId={selectedChildCategory} onSelect={handleChildCategorySelect} level="child" />
          </div>}
      </div>;
  } else {
    return <div dir="rtl" className="bg-white dark:bg-dark-background border-b border-border dark:border-dark-border">
        {/* Main Categories Row */}
        <div className="container mx-auto px-4 py-4 bg-white dark:bg-dark-background">
          <div className="relative">
            <div className="overflow-x-auto scrollbar-hide" style={{
            scrollBehavior: 'smooth'
          }}>
              <div className="flex gap-6 min-w-max">
                {loadingCategories ? <div className="flex justify-center items-center w-full py-4">
                    <span className="text-sm text-muted-foreground">جاري تحميل التصنيفات...</span>
                  </div> : categories && categories.length > 0 ? categories.map(category => {
                const isSelected = selectedCategory === category.id;
                return <button key={category.id} onClick={() => handleCategorySelect(category)} className="flex flex-col items-center min-w-[px] group">
                        <div className={`relative w-12 h-12 mb-2 flex items-center justify-center border-2 rounded-lg transition-all ${isSelected ? 'border-brand' : 'border-gray-200 dark:border-gray-700'}`}>
                          <img src={getCategoryImage(category)} alt={category.name} className="w-full h-full object-cover rounded-md" onError={e => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = `
                                <div class="w-full h-full bg-brand/10 flex items-center justify-center rounded-md">
                                  <svg class="w-6 h-6 text-brand" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                                  </svg>
                                </div>
                              `;
                    }} />
                        </div>
                        <span className={`text-xs font-medium text-center leading-tight ${isSelected ? 'text-brand' : 'text-foreground'}`}>
                          {category.name}
                        </span>
                      </button>;
              }) : <div className="flex justify-center items-center w-full py-4">
                    <span className="text-sm text-muted-foreground">لا توجد تصنيفات</span>
                  </div>}
              </div>
            </div>
            {/* Scroll indicator */}
            {categories && categories.length > 6}
          </div>
        </div>

        {/* Subcategories and Child Categories in Same Row */}
        {selectedCategory && subcategories.length > 0 && <div className="bg-gray-50 dark:bg-dark-surface">
            <div className="container mx-auto px-4 py-2 relative">
              <div className="overflow-x-auto scrollbar-hide" style={{
            scrollBehavior: 'smooth'
          }}>
                <div className="flex flex-col gap-1 min-w-max">
                  {/* Subcategories */}
                  <div className="flex gap-2">
                    {subcategories.map(subcategory => {
                  const isSelected = selectedSubcategory === subcategory.id;
                  return <button key={subcategory.id} onClick={() => handleSubcategorySelect(subcategory.id)} className={`px-2 py-1 rounded-md text-sm font-medium whitespace-nowrap transition-all ${isSelected ? 'bg-brand text-white' : 'bg-white text-foreground hover:bg-gray-100 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500'}`}>
                          {subcategory.name}
                        </button>;
                })}
                  </div>
                  
                  {/* Child Categories */}
                  {selectedSubcategory && childCategories.length > 0 && <div className="flex gap-2 mt-1">
                      {childCategories.map(childCategory => {
                  const isSelected = selectedChildCategory === childCategory.id;
                  return <button key={childCategory.id} onClick={() => handleChildCategorySelect(childCategory.id)} className={`px-3 py-1 rounded-md text-sm font-medium whitespace-nowrap transition-all ${isSelected ? 'bg-brand text-white' : 'bg-white text-foreground hover:bg-gray-100 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500'}`}>
                          {childCategory.name}
                        </button>;
                })}
                    </div>}
                </div>
              </div>
              {/* Scroll indicator for subcategories */}
              {subcategories && subcategories.length > 4}
            </div>
          </div>}
      </div>;
  }
}