
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCategories } from '@/hooks/use-api';
import { CategoryIcon } from './CategoryIcon';
import { Category } from '@/types';

export function DesktopCategoryBar() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showLeftScroll, setShowLeftScroll] = useState(false);
    const [showRightScroll, setShowRightScroll] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState<Category | null>(null);
    const [selectedChildCategory, setSelectedChildCategory] = useState<Category | null>(null);

    const navigate = useNavigate();
    const { categoryId } = useParams<{ categoryId: string }>();
    const [searchParams] = useSearchParams();
    const subcategoryId = searchParams.get('subcategory');
    const childcategoryId = searchParams.get('childcategory');

    // Fetch categories from API
    const { data: categories, isLoading: loadingCategories } = useCategories();

    // Set selected categories based on URL params
    useEffect(() => {
        if (categories?.length && categoryId) {
            const category = categories.find(cat => cat.id === parseInt(categoryId, 10));
            if (category) {
                setSelectedCategory(category);
                
                if (subcategoryId && category.subcategories) {
                    const subcategory = category.subcategories.find(
                        sub => sub.id === parseInt(subcategoryId, 10)
                    );
                    
                    if (subcategory) {
                        setSelectedSubcategory(subcategory);
                        
                        if (childcategoryId && subcategory.subcategories) {
                            const childCategory = subcategory.subcategories.find(
                                child => child.id === parseInt(childcategoryId, 10)
                            );
                            
                            if (childCategory) {
                                setSelectedChildCategory(childCategory);
                            }
                        }
                    }
                }
            }
        }
    }, [categories, categoryId, subcategoryId, childcategoryId]);

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
            // If already selected, navigate to category page
            navigate(`/category/${category.id}`);
        } else {
            // Select new category
            setSelectedCategory(category);
            setSelectedSubcategory(null);
            setSelectedChildCategory(null);
            navigate(`/category/${category.id}`);
        }
    };

    // Handle subcategory selection
    const handleSubcategoryClick = (subcategory: Category) => {
        if (selectedSubcategory?.id === subcategory.id) {
            // If already selected, navigate to subcategory page
            navigate(`/category/${selectedCategory?.id}?subcategory=${subcategory.id}`);
        } else {
            // Select new subcategory
            setSelectedSubcategory(subcategory);
            setSelectedChildCategory(null);
            navigate(`/category/${selectedCategory?.id}?subcategory=${subcategory.id}`);
        }
    };

    // Handle child category selection
    const handleChildCategoryClick = (childCategory: Category) => {
        setSelectedChildCategory(childCategory);
        navigate(`/category/${selectedCategory?.id}?subcategory=${selectedSubcategory?.id}&childcategory=${childCategory.id}`);
    };

    return (
        <div className="relative bg-white border-b border-border dark:bg-dark-background dark:border-dark-border">
            <div className="container px-4 mx-auto relative py-4">
                {showLeftScroll && (
                    <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white dark:from-dark-background to-transparent z-10 flex items-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 absolute left-4 rounded-full shadow-sm bg-white dark:bg-dark-card"
                            onClick={scrollLeft}
                            aria-label="Scroll left"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                    </div>
                )}

                <div
                    ref={scrollRef}
                    className="scroll-container gap-3 py-1 pl-10 pr-10 snap-x"
                    style={{ scrollSnapType: 'x mandatory' }}
                >
                    {loadingCategories ? (
                        <div className="flex justify-center items-center w-full py-2">
                            <span className="text-muted-foreground">جاري تحميل التصنيفات...</span>
                        </div>
                    ) : categories && categories.length > 0 ? (
                        categories.map((category) => {
                            const isSelected = selectedCategory?.id === category.id;

                            return (
                                <div key={category.id} className="flex flex-col items-center snap-start">
                                    <button
                                        onClick={() => handleCategoryClick(category)}
                                        className={`category-icon min-w-[100px] text-center transition-all ${isSelected ? 'scale-105' : ''}`}
                                    >
                                        <div className={`p-3 rounded-full mx-auto mb-2 transition-colors ${isSelected ? 'bg-brand text-white' : 'bg-brand-light dark:bg-dark-card'}`} style={{ width: '56px', height: '56px' }}>
                                            <CategoryIcon 
                                                iconName={category.icon} 
                                                className={`h-full w-full ${isSelected ? 'text-white' : 'text-brand dark:text-brand-light'}`}
                                            />
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
                    <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white dark:from-dark-background to-transparent z-10 flex items-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 absolute right-4 rounded-full shadow-sm bg-white dark:bg-dark-card"
                            onClick={scrollRight}
                            aria-label="Scroll right"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </div>
                )}
            </div>

            {selectedCategory && selectedCategory.subcategories && selectedCategory.subcategories.length > 0 && (
                <div className="bg-gray-50 border-t border-border transition-all dark:bg-dark-surface dark:border-dark-border">
                    <div className="container px-4 mx-auto py-3">
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {selectedCategory.subcategories.map((subcategory) => {
                                const isSubcategorySelected = selectedSubcategory?.id === subcategory.id;
                                return (
                                    <button
                                        key={subcategory.id}
                                        onClick={() => handleSubcategoryClick(subcategory)}
                                        className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-colors ${
                                            isSubcategorySelected 
                                              ? 'bg-brand text-white' 
                                              : 'bg-white border border-gray-200 dark:bg-dark-card dark:border-dark-border dark:text-gray-200'
                                        }`}
                                    >
                                        {subcategory.name}
                                        {subcategory.subcategories && subcategory.subcategories.length > 0 && (
                                            <ChevronDown className={`inline-block h-3 w-3 mr-1 ${isSubcategorySelected ? 'rotate-180' : ''}`} />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {selectedSubcategory && selectedSubcategory.subcategories && selectedSubcategory.subcategories.length > 0 && (
                <div className="bg-gray-100 border-t border-border dark:bg-dark-background/60 dark:border-dark-border">
                    <div className="container px-4 mx-auto py-2">
                        <div className="flex flex-wrap items-center gap-2">
                            {selectedSubcategory.subcategories.map((childCategory) => (
                                <button
                                    key={childCategory.id}
                                    onClick={() => handleChildCategoryClick(childCategory)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                                        selectedChildCategory?.id === childCategory.id
                                          ? 'bg-brand text-white'
                                          : 'bg-white border border-gray-200 hover:bg-gray-50 dark:bg-dark-card dark:border-dark-border dark:text-gray-200 dark:hover:bg-dark-surface'
                                    } transition-colors`}
                                >
                                    {childCategory.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
