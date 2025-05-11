
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCategories } from '@/hooks/use-api';
import { Category } from '@/types';
import { 
  Car, Building, Smartphone, Monitor, Briefcase, Wrench, Shirt, Gamepad, 
  Gem, ShoppingBag, Utensils, Laptop, BookOpen, Baby, Bike, Camera, FileText, 
  Headphones, Gift, Train
} from 'lucide-react';

// Icon mapping for categories
const iconMap: Record<string, React.ComponentType<any>> = {
  'Car': Car,
  'Building': Building,
  'Smartphone': Smartphone,
  'Monitor': Monitor,
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const subCategoryScrollRef = useRef<HTMLDivElement>(null);
  const childCategoryScrollRef = useRef<HTMLDivElement>(null);
  
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);
  const [showSubLeftScroll, setShowSubLeftScroll] = useState(false);
  const [showSubRightScroll, setShowSubRightScroll] = useState(false);
  const [showChildLeftScroll, setShowChildLeftScroll] = useState(false);
  const [showChildRightScroll, setShowChildRightScroll] = useState(false);
  
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<number | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ categoryId: string }>();
  
  // Fetch categories from API
  const { data: categories, isLoading: loadingCategories } = useCategories();

  // Set initial selected categories based on URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    
    // Parse category ID from URL params
    if (params.categoryId) {
      setSelectedCategory(parseInt(params.categoryId, 10));
    }
    
    // Parse subcategory ID from query params
    const subcategory = searchParams.get('subcategory');
    if (subcategory) {
      setSelectedSubCategory(parseInt(subcategory, 10));
    } else {
      setSelectedSubCategory(null);
    }
  }, [location.pathname, location.search, params]);

  // Get subcategories of selected category
  const subcategories = selectedCategory && categories 
    ? categories.find(cat => cat.id === selectedCategory)?.subcategories || []
    : [];
    
  // Get child categories of selected subcategory
  const childCategories = selectedSubCategory && subcategories
    ? subcategories.find(subcat => subcat.id === selectedSubCategory)?.children || []
    : [];

  const scrollLeft = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftScroll(scrollLeft > 0);
      setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10);
    }
    
    if (subCategoryScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = subCategoryScrollRef.current;
      setShowSubLeftScroll(scrollLeft > 0);
      setShowSubRightScroll(scrollLeft < scrollWidth - clientWidth - 10);
    }
    
    if (childCategoryScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = childCategoryScrollRef.current;
      setShowChildLeftScroll(scrollLeft > 0);
      setShowChildRightScroll(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const handleCategoryClick = (category: Category) => {
    if (selectedCategory === category.id) {
      // If already selected, deselect it
      setSelectedCategory(null);
      setSelectedSubCategory(null);
    } else {
      // Select new category
      setSelectedCategory(category.id);
      setSelectedSubCategory(null);
      
      // Navigate to category page
      navigate(`/category/${category.id}`);
    }
  };

  const handleSubCategoryClick = (subCatId: number) => {
    if (selectedSubCategory === subCatId) {
      // If already selected, deselect it
      setSelectedSubCategory(null);
    } else {
      // Select new subcategory
      setSelectedSubCategory(subCatId);
      
      // Navigate to subcategory (using query param)
      navigate(`/category/${selectedCategory}?subcategory=${subCatId}`);
    }
  };

  const handleChildCategoryClick = (childCatId: number) => {
    // Navigate to child category (using query params)
    navigate(`/category/${selectedCategory}?subcategory=${selectedSubCategory}&childcategory=${childCatId}`);
  };

  useEffect(() => {
    const scrollEl = scrollRef.current;
    const subScrollEl = subCategoryScrollRef.current;
    const childScrollEl = childCategoryScrollRef.current;
    
    const handleScroll = () => checkScrollButtons();
    
    if (scrollEl) {
      scrollEl.addEventListener('scroll', handleScroll);
    }
    
    if (subScrollEl) {
      subScrollEl.addEventListener('scroll', handleScroll);
    }
    
    if (childScrollEl) {
      childScrollEl.addEventListener('scroll', handleScroll);
    }
    
    // Initial check
    checkScrollButtons();
    
    return () => {
      if (scrollEl) scrollEl.removeEventListener('scroll', handleScroll);
      if (subScrollEl) subScrollEl.removeEventListener('scroll', handleScroll);
      if (childScrollEl) childScrollEl.removeEventListener('scroll', handleScroll);
    };
  }, [selectedCategory, selectedSubCategory]);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 sticky top-16 z-40 shadow-sm">
      {/* Main Categories */}
      <div className="container px-4 mx-auto relative py-4">
        {/* Left scroll button for main categories */}
        {showLeftScroll && (
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-blue-50 to-transparent z-10 flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 absolute left-4 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white" 
              onClick={() => scrollLeft(scrollRef)}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5 text-brand" />
            </Button>
          </div>
        )}
        
        {/* Categories scroll area */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 py-1 px-10 no-scrollbar"
        >
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
                <div
                  key={category.id}
                  className={`cursor-pointer flex flex-col items-center transition-all ${isSelected ? 'opacity-100' : 'opacity-80'}`}
                  onClick={() => handleCategoryClick(category)}
                >
                  <div 
                    className={`${
                      isSelected 
                        ? 'bg-brand text-white shadow-md ring-2 ring-brand/20 ring-offset-2 ring-offset-blue-50' 
                        : 'bg-white text-brand hover:shadow-md hover:scale-105'
                    } p-3 rounded-xl mb-2 transition-all shadow-sm w-16 h-16 flex items-center justify-center`}
                  >
                    <Icon className="h-7 w-7" />
                  </div>
                  <span className={`text-sm font-medium truncate block text-center ${isSelected ? 'text-brand font-bold' : 'text-gray-700'}`}>
                    {category.name}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="flex justify-center items-center w-full py-2">
              <span className="text-muted-foreground">لا توجد تصنيفات</span>
            </div>
          )}
        </div>
        
        {/* Right scroll button for main categories */}
        {showRightScroll && (
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-blue-50 to-transparent z-10 flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 absolute right-4 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white" 
              onClick={() => scrollRight(scrollRef)}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5 text-brand" />
            </Button>
          </div>
        )}
      </div>
      
      {/* Subcategories - Show only if a category is selected */}
      {selectedCategory && subcategories.length > 0 && (
        <div className="container px-4 mx-auto relative py-3 bg-gradient-to-r from-indigo-50 to-purple-50">
          {/* Left scroll button for subcategories */}
          {showSubLeftScroll && (
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-indigo-50 to-transparent z-10 flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 absolute left-4 rounded-full bg-white/80 shadow-sm hover:bg-white" 
                onClick={() => scrollLeft(subCategoryScrollRef)}
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-4 w-4 text-brand" />
              </Button>
            </div>
          )}
          
          {/* Subcategories scroll area */}
          <div 
            ref={subCategoryScrollRef}
            className="flex overflow-x-auto py-1 px-10 gap-2 no-scrollbar"
          >
            {subcategories.map((subcat) => {
              const isSelected = selectedSubCategory === subcat.id;
              
              return (
                <div
                  key={subcat.id}
                  className={`cursor-pointer px-4 py-2 whitespace-nowrap rounded-lg transition-all ${
                    isSelected 
                      ? 'bg-brand/90 text-white shadow-md' 
                      : 'bg-white text-gray-700 hover:bg-blue-50 shadow-sm'
                  }`}
                  onClick={() => handleSubCategoryClick(subcat.id)}
                >
                  {subcat.name}
                </div>
              );
            })}
          </div>
          
          {/* Right scroll button for subcategories */}
          {showSubRightScroll && (
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-indigo-50 to-transparent z-10 flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 absolute right-4 rounded-full bg-white/80 shadow-sm hover:bg-white" 
                onClick={() => scrollRight(subCategoryScrollRef)}
                aria-label="Scroll right"
              >
                <ChevronRight className="h-4 w-4 text-brand" />
              </Button>
            </div>
          )}
        </div>
      )}
      
      {/* Child Categories - Show only if a subcategory is selected */}
      {selectedSubCategory && childCategories.length > 0 && (
        <div className="container px-4 mx-auto relative py-2 bg-gradient-to-r from-purple-50 to-blue-50">
          {/* Left scroll button for child categories */}
          {showChildLeftScroll && (
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-purple-50 to-transparent z-10 flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 absolute left-4 rounded-full bg-white/80" 
                onClick={() => scrollLeft(childCategoryScrollRef)}
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-3 w-3 text-brand" />
              </Button>
            </div>
          )}
          
          {/* Child categories scroll area */}
          <div 
            ref={childCategoryScrollRef}
            className="flex overflow-x-auto py-1 px-10 gap-2 no-scrollbar"
          >
            {childCategories.map((childCat) => (
              <div
                key={childCat.id}
                className="cursor-pointer px-3 py-1.5 text-xs whitespace-nowrap bg-white shadow-sm border-blue-100/50 border text-gray-700 hover:bg-blue-50 rounded-lg"
                onClick={() => handleChildCategoryClick(childCat.id)}
              >
                {childCat.name}
              </div>
            ))}
          </div>
          
          {/* Right scroll button for child categories */}
          {showChildRightScroll && (
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-purple-50 to-transparent z-10 flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 absolute right-4 rounded-full bg-white/80" 
                onClick={() => scrollRight(childCategoryScrollRef)}
                aria-label="Scroll right"
              >
                <ChevronRight className="h-3 w-3 text-brand" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
