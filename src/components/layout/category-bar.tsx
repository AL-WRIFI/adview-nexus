
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCategories } from '@/hooks/use-api';
import { Category } from '@/types';
import { 
  Car, Building, Smartphone, Monitor, Briefcase, Wrench, Shirt, Gamepad, 
  Gem, ShoppingBag, Utensils, Laptop, BookOpen, Baby, Bike, Camera, FileText, 
  Headphones, Gift, Palette
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
  'Palette': Palette,
  'Train': Car, // Fallback
};

export function CategoryBar() {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 3; // Adjust based on how many pages you need
  const scrollRef = useRef<HTMLDivElement>(null);
  const subCategoryScrollRef = useRef<HTMLDivElement>(null);
  const childCategoryScrollRef = useRef<HTMLDivElement>(null);
  
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
      const catId = parseInt(params.categoryId, 10);
      if (!isNaN(catId)) {
        setSelectedCategory(catId);
      }
    }
    
    // Parse subcategory ID from query params
    const subcategory = searchParams.get('subcategory');
    if (subcategory) {
      const subCatId = parseInt(subcategory, 10);
      if (!isNaN(subCatId)) {
        setSelectedSubCategory(subCatId);
      }
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

  const handleSubCategoryClick = (subCatId: number | string) => {
    const numericSubCatId = typeof subCatId === 'string' ? parseInt(subCatId, 10) : subCatId;
    
    if (selectedSubCategory === numericSubCatId) {
      // If already selected, deselect it
      setSelectedSubCategory(null);
    } else {
      // Select new subcategory
      setSelectedSubCategory(numericSubCatId);
      
      // Navigate to subcategory (using query param)
      navigate(`/category/${selectedCategory}?subcategory=${numericSubCatId}`);
    }
  };

  const handleChildCategoryClick = (childCatId: number | string) => {
    // Navigate to child category (using query params)
    navigate(`/category/${selectedCategory}?subcategory=${selectedSubCategory}&childcategory=${childCatId}`);
  };

  const handlePageChange = (pageIndex: number) => {
    setCurrentPage(pageIndex);
  };

  // Split categories into pages - each page has up to 10 categories
  const getCategoriesForPage = (pageIndex: number) => {
    if (!categories || !Array.isArray(categories)) return [];
    
    const itemsPerPage = 10;
    const start = pageIndex * itemsPerPage;
    return categories.slice(start, start + itemsPerPage);
  };

  const currentPageCategories = getCategoriesForPage(currentPage);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 sticky top-16 z-40 shadow-sm dark:from-gray-900 dark:to-gray-800 dark:border-gray-800">
      {/* Main Categories */}
      <div className="container mx-auto relative py-6">
        {/* Grid layout for categories */}
        <div className="grid grid-cols-5 gap-3">
          {loadingCategories ? (
            <div className="col-span-5 flex justify-center items-center py-4">
              <span className="text-muted-foreground">جاري تحميل التصنيفات...</span>
            </div>
          ) : currentPageCategories && currentPageCategories.length > 0 ? (
            currentPageCategories.map((category) => {
              const iconName = category.icon || 'Car';
              const Icon = iconMap[iconName] || iconMap.Car;
              const isSelected = selectedCategory === category.id;
              
              return (
                <div
                  key={category.id}
                  className="flex flex-col items-center"
                  onClick={() => handleCategoryClick(category)}
                >
                  <div className={`
                    flex flex-col items-center justify-center w-full cursor-pointer
                    ${isSelected ? 'opacity-100' : 'opacity-80 hover:opacity-100'}
                  `}>
                    <div className={`
                      p-3 rounded-xl mb-1 w-16 h-16 flex items-center justify-center
                      ${isSelected 
                        ? 'bg-brand text-white shadow-md' 
                        : 'bg-white text-brand hover:bg-blue-50 dark:bg-gray-800 dark:text-blue-300 dark:hover:bg-gray-700'}
                      transition-all shadow-sm
                    `}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <span className={`
                      text-xs font-medium text-center truncate w-full px-1
                      ${isSelected ? 'text-brand font-bold dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}
                    `}>
                      {category.name}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-5 flex justify-center items-center py-4">
              <span className="text-muted-foreground">لا توجد تصنيفات</span>
            </div>
          )}
        </div>

        {/* Pagination dots */}
        {categories && Array.isArray(categories) && categories.length > 10 && (
          <div className="flex justify-center mt-4 gap-1">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`h-1 rounded-full transition-all ${
                  currentPage === index 
                    ? 'w-8 bg-brand' 
                    : 'w-2 bg-gray-300 dark:bg-gray-600'
                }`}
                onClick={() => handlePageChange(index)}
                aria-label={`Page ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Filter button - For mobile view */}
        <div className="md:hidden fixed bottom-20 right-4 z-50">
          <Button 
            size="icon" 
            className="h-12 w-12 rounded-full shadow-lg bg-brand text-white hover:bg-brand-hover"
          >
            <Filter className="h-5 w-5" />
            <span className="sr-only">تصفية</span>
          </Button>
        </div>
      </div>
      
      {/* Subcategories - Show only if a category is selected */}
      {selectedCategory && subcategories.length > 0 && (
        <div className="container mx-auto relative py-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-750">
          {/* Subcategories scroll area */}
          <div 
            ref={subCategoryScrollRef}
            className="flex overflow-x-auto py-1 px-4 gap-2 no-scrollbar"
          >
            {subcategories.map((subcat) => {
              const isSelected = selectedSubCategory === subcat.id;
              
              return (
                <div
                  key={subcat.id}
                  className={`cursor-pointer px-4 py-2 whitespace-nowrap rounded-lg transition-all flex-shrink-0 ${
                    isSelected 
                      ? 'bg-brand/90 text-white shadow-md' 
                      : 'bg-white text-gray-700 hover:bg-blue-50 shadow-sm dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                  }`}
                  onClick={() => handleSubCategoryClick(subcat.id)}
                >
                  {subcat.name}
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Child Categories - Show only if a subcategory is selected */}
      {selectedSubCategory && childCategories.length > 0 && (
        <div className="container mx-auto relative py-2 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-750 dark:to-gray-700">
          {/* Child categories scroll area */}
          <div 
            ref={childCategoryScrollRef}
            className="flex overflow-x-auto py-1 px-4 gap-2 no-scrollbar"
          >
            {childCategories.map((childCat) => (
              <div
                key={childCat.id}
                className="cursor-pointer px-3 py-1.5 text-xs whitespace-nowrap bg-white shadow-sm border-blue-100/50 border text-gray-700 hover:bg-blue-50 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600 flex-shrink-0"
                onClick={() => handleChildCategoryClick(childCat.id)}
              >
                {childCat.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
