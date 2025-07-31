
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCategories } from '@/hooks/use-api';
import { Category } from '@/types';

export function CategoryBar() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showLeftScroll, setShowLeftScroll] = useState(false);
    const [showRightScroll, setShowRightScroll] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState<Category | null>(null);

    // Fetch categories from API
    const { data: categories, isLoading: loadingCategories } = useCategories();

    const getCategoryImage = (category: Category) => {
        if (category.image_url) return category.image_url;
        if (category.image) return category.image;
        
        const defaultImages: Record<string, string> = {
            'سيارات': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=140&h=140&fit=crop',
            'عقارات': 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=140&h=140&fit=crop',
            'إلكترونيات': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=140&h=140&fit=crop',
            'أثاث': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=140&h=140&fit=crop',
            'أزياء': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=140&h=140&fit=crop',
            'وظائف': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=140&h=140&fit=crop',
            'خدمات': 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=140&h=140&fit=crop',
            'رياضة': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=140&h=140&fit=crop',
        };
        
        for (const [key, image] of Object.entries(defaultImages)) {
            if (category.name.includes(key)) return image;
        }
        
        return 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=140&h=140&fit=crop';
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
            // If clicking the same category, close it
            setSelectedCategory(null);
            setSelectedSubcategory(null);
        } else {
            // Select new category
            setSelectedCategory(category);
            setSelectedSubcategory(null);
        }
    };

    // Handle subcategory selection
    const handleSubcategoryClick = (subcategory: Category) => {
        if (selectedSubcategory?.id === subcategory.id) {
            setSelectedSubcategory(null);
        } else {
            setSelectedSubcategory(subcategory);
        }
    };

    return (
        <div className="relative bg-gradient-to-r from-white via-gray-50 to-white border-b border-gray-100 shadow-sm">
            <div className="container px-4 mx-auto relative py-6">
                {/* Scroll shadow/gradient on left */}
                {showLeftScroll && (
                    <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white via-white/80 to-transparent z-20 flex items-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 absolute left-4 rounded-full shadow-lg border border-gray-200 bg-white hover:bg-gray-50 hover:shadow-xl transition-all duration-200"
                            onClick={scrollLeft}
                            aria-label="Scroll left"
                        >
                            <ChevronLeft className="h-5 w-5 text-gray-600" />
                        </Button>
                    </div>
                )}

                {/* Categories scroll area */}
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto scrollbar-hide gap-6 py-2 pl-16 pr-16"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {loadingCategories ? (
                        <div className="flex justify-center items-center w-full py-4">
                            <div className="flex space-x-4">
                                {[1,2,3,4,5,6].map(i => (
                                    <div key={i} className="flex flex-col items-center animate-pulse">
                                        <div className="w-28 h-28 bg-gray-200 rounded-2xl mb-3"></div>
                                        <div className="w-20 h-4 bg-gray-200 rounded"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : categories && categories.length > 0 ? (
                        categories.map((category) => {
                            const isSelected = selectedCategory?.id === category.id;

                            return (
                                <div key={category.id} className="flex flex-col items-center group">
                                    <button
                                        onClick={() => handleCategoryClick(category)}
                                        className="flex flex-col items-center min-w-[130px] text-center transition-all duration-300 hover:scale-105"
                                    >
                                        <div className={`relative w-28 h-28 mx-auto mb-4 overflow-hidden rounded-2xl transition-all duration-300 shadow-lg group-hover:shadow-xl ${isSelected ? 'ring-4 ring-brand ring-opacity-50 shadow-xl scale-105' : 'hover:shadow-xl'}`}>
                                            <img
                                                src={getCategoryImage(category)}
                                                alt={category.name}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                    target.parentElement!.innerHTML = `
                                                        <div class="w-full h-full bg-gradient-to-br from-brand/20 to-brand/10 flex items-center justify-center">
                                                            <svg class="w-12 h-12 text-brand opacity-60" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                                                            </svg>
                                                        </div>
                                                    `;
                                                }}
                                            />
                                            {/* Overlay gradient for better text readability */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        </div>
                                        <span className={`text-sm font-semibold transition-all duration-300 px-2 py-1 rounded-lg ${isSelected ? 'text-brand bg-brand/10' : 'text-gray-700 group-hover:text-brand'}`}>
                                            {category.name}
                                        </span>
                                        <span className="text-xs text-gray-500 mt-1">
                                            {category.count || Math.floor(Math.random() * 500 + 50)} إعلان
                                        </span>
                                    </button>
                                </div>
                            );
                        })
                    ) : (
                        <div className="flex justify-center items-center w-full py-4">
                            <span className="text-gray-500 text-lg">لا توجد تصنيفات</span>
                        </div>
                    )}
                </div>

                {/* Scroll shadow/gradient on right */}
                {showRightScroll && (
                    <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white via-white/80 to-transparent z-20 flex items-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 absolute right-4 rounded-full shadow-lg border border-gray-200 bg-white hover:bg-gray-50 hover:shadow-xl transition-all duration-200"
                            onClick={scrollRight}
                            aria-label="Scroll right"
                        >
                            <ChevronRight className="h-5 w-5 text-gray-600" />
                        </Button>
                    </div>
                )}
            </div>

            {/* Subcategories area - Enhanced design */}
            {selectedCategory && selectedCategory.subcategories && selectedCategory.subcategories.length > 0 && (
                <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 border-t border-gray-200 transition-all duration-300">
                    <div className="container px-4 mx-auto py-4">
                        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            {selectedCategory.subcategories.map((subcategory) => {
                                const isSubcategorySelected = selectedSubcategory?.id === subcategory.id;
                                return (
                                    <button
                                        key={subcategory.id}
                                        onClick={() => handleSubcategoryClick(subcategory)}
                                        className={`px-4 py-2.5 rounded-xl whitespace-nowrap text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md ${
                                            isSubcategorySelected 
                                                ? 'bg-brand text-white shadow-lg scale-105' 
                                                : 'bg-white border border-gray-200 text-gray-700 hover:bg-brand hover:text-white hover:border-brand'
                                        }`}
                                    >
                                        {subcategory.name}
                                        {subcategory.subcategories && subcategory.subcategories.length > 0 && (
                                            <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isSubcategorySelected ? 'rotate-180' : ''}`} />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Third level categories - Enhanced design */}
            {selectedSubcategory && selectedSubcategory.subcategories && selectedSubcategory.subcategories.length > 0 && (
                <div className="bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 border-t border-gray-200">
                    <div className="container px-4 mx-auto py-3">
                        <div className="flex flex-wrap items-center gap-2">
                            {selectedSubcategory.subcategories.map((thirdLevel) => (
                                <Link
                                    key={thirdLevel.id}
                                    to={`/category/${thirdLevel.id}`}
                                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-gray-200 hover:bg-brand hover:text-white hover:border-brand transition-all duration-200 shadow-sm hover:shadow-md"
                                >
                                    {thirdLevel.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
