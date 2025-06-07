
import { useState, useEffect, useCallback } from 'react';
import { Search, ChevronDown, X, Filter, MapPin, Grid2X2, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  useCategories, 
  useBrands,
  useAllCities,
  useStates,
  useCurrentLocation 
} from '@/hooks/use-api';
import { SearchFilters, Category, Brand } from '@/types';
import { debounce } from '@/lib/utils';
import { 
  Car, Home, Smartphone, Mouse, Briefcase, Wrench, Shirt, Gamepad, 
  Gem, ShoppingBag, Utensils, Laptop, BookOpen, Baby, Bike, Camera, FileText, 
  Headphones, Gift, Train
} from 'lucide-react';

// Icon mapping for categories
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

interface AdFiltersProps {
  layout?: 'sidebar' | 'horizontal';
  onLayoutChange?: (layout: 'grid' | 'list') => void;
  currentLayout?: 'grid' | 'list';
  onFilterChange?: (filters: SearchFilters) => void;
  className?: string;
  initialFilters?: SearchFilters;
  selectedCategory?: Category;
}

export function AdFilters({
  layout = 'sidebar',
  onLayoutChange,
  currentLayout = 'list',
  onFilterChange,
  className,
  initialFilters,
  selectedCategory,
}: AdFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [locationOpen, setLocationOpen] = useState(true);
  const [brandOpen, setBrandOpen] = useState(true);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [searchText, setSearchText] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(
    initialFilters?.category_id as number | undefined
  );
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<number | undefined>(
    initialFilters?.sub_category_id as number | undefined
  );
  const [selectedBrandId, setSelectedBrandId] = useState<number | undefined>(
    initialFilters?.brand_id as number | undefined
  );
  const [selectedStateId, setSelectedStateId] = useState<number | undefined>(
    initialFilters?.state_id as number | undefined
  );
  const [selectedCityId, setSelectedCityId] = useState<number | undefined>(
    initialFilters?.city_id as number | undefined
  );
  const [listingType, setListingType] = useState<'sell' | 'buy' | 'exchange' | undefined>(
    initialFilters?.listing_type as 'sell' | 'buy' | 'exchange' | undefined
  );
  const [condition, setCondition] = useState<'new' | 'used' | undefined>(
    initialFilters?.condition as 'new' | 'used' | undefined
  );
  const [nearbyAds, setNearbyAds] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'oldest' | undefined>(
    initialFilters?.sort as 'newest' | 'price_asc' | 'price_desc' | 'oldest' | undefined
  );
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [displayMode, setDisplayMode] = useState<'grid' | 'list'>('grid'); // For categories display
  
  // Fetch data from API
  const { data: categories = [], isLoading: loadingCategories } = useCategories();
  const { data: brands = [], isLoading: loadingBrands } = useBrands();
  const { data: states = [], isLoading: loadingStates } = useStates();
  const { data: cities = [], isLoading: loadingCities } = useAllCities();
  const { data: location, isLoading: loadingLocation } = useCurrentLocation();
  
  // If a specific category is provided via props, use it
  useEffect(() => {
    if (selectedCategory) {
      setSelectedCategoryId(selectedCategory.id);
    }
  }, [selectedCategory]);

  // Get subcategories based on selected category
  const subcategories = selectedCategoryId && categories
    ? categories.find(cat => cat.id === selectedCategoryId)?.subcategories || []
    : [];
  
  // Get cities based on selected state
  const stateCities = selectedStateId && cities
    ? cities.filter(city => city.state_id === selectedStateId)
    : [];
  
  // Toggle filter
  const toggleFilter = () => {
    setIsOpen(!isOpen);
  };
  
  // Debounced filter application for real-time filtering
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedApplyFilters = useCallback(
    debounce(() => {
      applyFilters();
    }, 500),
    [
      searchText, selectedCategoryId, selectedSubCategoryId, selectedBrandId,
      selectedStateId, selectedCityId, priceRange, listingType, condition,
      nearbyAds, sortBy
    ]
  );
  
  const applyFilters = () => {
    // Build filters object
    const filters: SearchFilters = {};
    
    if (searchText) filters.query = searchText;
    if (selectedCategoryId) filters.category_id = selectedCategoryId;
    if (selectedSubCategoryId) filters.sub_category_id = selectedSubCategoryId;
    if (selectedBrandId) filters.brand_id = selectedBrandId;
    if (selectedStateId) filters.state_id = selectedStateId;
    if (selectedCityId) filters.city_id = selectedCityId;
    if (priceRange[0] > 0) filters.price_min = priceRange[0];
    if (priceRange[1] < 100000) filters.price_max = priceRange[1];
    if (listingType) filters.listing_type = listingType;
    if (condition) filters.condition = condition;
    if (sortBy) filters.sort = sortBy;
    
    // Add location if nearby ads is selected
    if (nearbyAds && location) {
      filters.lat = location.lat;
      filters.lon = location.lon;
      filters.radius = 20; // 20 km radius
    }
    
    // Update active filters for display
    const newActiveFilters: string[] = [];
    if (searchText) newActiveFilters.push(`بحث: ${searchText}`);
    
    if (selectedCategoryId && categories) {
      const category = categories.find(cat => cat.id === selectedCategoryId);
      if (category) newActiveFilters.push(`التصنيف: ${category.name}`);
    }
    
    if (selectedSubCategoryId && subcategories) {
      const subcategory = subcategories.find(subcat => subcat.id === selectedSubCategoryId);
      if (subcategory) newActiveFilters.push(`التصنيف الفرعي: ${subcategory.name}`);
    }
    
    if (selectedBrandId && brands) {
      const brand = brands.find(b => b.id === selectedBrandId);
      if (brand) newActiveFilters.push(`الماركة: ${brand.name || brand.title}`);
    }
    
    if (selectedStateId && states) {
      const state = states.find(s => s.id === selectedStateId);
      if (state) newActiveFilters.push(`المنطقة: ${state.name}`);
    }
    
    if (selectedCityId && cities) {
      const city = cities.find(c => c.id === selectedCityId);
      if (city) newActiveFilters.push(`المدينة: ${city.name}`);
    }
    
    if (priceRange[0] > 0 || priceRange[1] < 100000) {
      newActiveFilters.push(`السعر: ${priceRange[0]} - ${priceRange[1]} ريال`);
    }
    
    if (listingType) {
      const listingTypeMap = {
        'sell': 'للبيع',
        'buy': 'للشراء',
        'exchange': 'للتبديل'
      };
      newActiveFilters.push(`نوع الإعلان: ${listingTypeMap[listingType]}`);
    }
    
    if (condition) {
      const conditionMap = {
        'new': 'جديد',
        'used': 'مستعمل'
      };
      newActiveFilters.push(`الحالة: ${conditionMap[condition]}`);
    }
    
    if (sortBy) {
      const sortByMap = {
        'newest': 'الأحدث',
        'oldest': 'الأقدم',
        'price_asc': 'السعر: من الأقل للأعلى',
        'price_desc': 'السعر: من الأعلى للأقل'
      };
      newActiveFilters.push(`الترتيب: ${sortByMap[sortBy]}`);
    }
    
    if (nearbyAds) newActiveFilters.push('الإعلانات القريبة');
    
    setActiveFilters(newActiveFilters);
    
    // Call parent callback with filters
    if (onFilterChange) {
      onFilterChange(filters);
    }
    
    // Close filter panel on mobile
    if (layout === 'horizontal') {
      setIsOpen(false);
    }
  };
  
  // Apply filters automatically when any filter changes (real-time filtering)
  useEffect(() => {
    debouncedApplyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    searchText, selectedCategoryId, selectedSubCategoryId, selectedBrandId,
    selectedStateId, selectedCityId, priceRange, listingType, condition,
    nearbyAds, sortBy
  ]);
  
  // Set initial state from props
  useEffect(() => {
    if (initialFilters) {
      if (initialFilters.price_min !== undefined || initialFilters.price_max !== undefined) {
        setPriceRange([
          initialFilters.price_min || 0,
          initialFilters.price_max || 100000
        ]);
      }
      
      if (initialFilters.query) setSearchText(initialFilters.query);
      if (initialFilters.category_id) setSelectedCategoryId(initialFilters.category_id as number);
      if (initialFilters.sub_category_id) setSelectedSubCategoryId(initialFilters.sub_category_id as number);
      if (initialFilters.brand_id) setSelectedBrandId(initialFilters.brand_id as number);
      if (initialFilters.state_id) setSelectedStateId(initialFilters.state_id as number);
      if (initialFilters.city_id) setSelectedCityId(initialFilters.city_id as number);
      if (initialFilters.listing_type) setListingType(initialFilters.listing_type as any);
      if (initialFilters.condition) setCondition(initialFilters.condition as any);
      if (initialFilters.sort) setSortBy(initialFilters.sort as any);
      if (initialFilters.lat && initialFilters.lon) setNearbyAds(true);
      
      // Apply initial filters
      applyFilters();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFilters]);
  
  const clearFilters = () => {
    setSearchText('');
    setSelectedCategoryId(undefined);
    setSelectedSubCategoryId(undefined);
    setSelectedBrandId(undefined);
    setSelectedStateId(undefined);
    setSelectedCityId(undefined);
    setPriceRange([0, 100000]);
    setListingType(undefined);
    setCondition(undefined);
    setSortBy(undefined);
    setNearbyAds(false);
    setActiveFilters([]);
    
    if (onFilterChange) {
      onFilterChange({});
    }
  };
  
  const removeFilter = (index: number) => {
    const filter = activeFilters[index];
    
    // Reset the corresponding filter
    if (filter.includes('بحث')) setSearchText('');
    if (filter.includes('التصنيف') && !filter.includes('التصنيف الفرعي')) setSelectedCategoryId(undefined);
    if (filter.includes('التصنيف الفرعي')) setSelectedSubCategoryId(undefined);
    if (filter.includes('الماركة')) setSelectedBrandId(undefined);
    if (filter.includes('المنطقة')) setSelectedStateId(undefined);
    if (filter.includes('المدينة')) setSelectedCityId(undefined);
    if (filter.includes('السعر')) setPriceRange([0, 100000]);
    if (filter.includes('نوع الإعلان')) setListingType(undefined);
    if (filter.includes('الحالة')) setCondition(undefined);
    if (filter.includes('الترتيب')) setSortBy(undefined);
    if (filter === 'الإعلانات القريبة') setNearbyAds(false);
    
    // Remove from active filters
    const newFilters = [...activeFilters];
    newFilters.splice(index, 1);
    setActiveFilters(newFilters);
  };
  
  const isSidebar = layout === 'sidebar';
  
  // Render categories in grid/list mode
  const renderCategories = () => {
    if (loadingCategories) {
      return (
        <div className="text-center py-2 text-sm text-muted-foreground">
          جاري التحميل...
        </div>
      );
    }
    
    if (!categories || categories.length === 0) {
      return (
        <div className="text-center py-2 text-sm text-muted-foreground">
          لا توجد تصنيفات
        </div>
      );
    }
    
    if (displayMode === 'grid') {
      return (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
          {categories.map((category) => {
            const iconName = category.icon || 'Car';
            const Icon = iconMap[iconName] || Car;
            const isSelected = selectedCategoryId === category.id;
            
            return (
              <div
                key={category.id}
                className={`flex flex-col items-center p-2 cursor-pointer rounded ${
                  isSelected ? 'bg-brand/10 border border-brand' : 'hover:bg-gray-100'
                }`}
                onClick={() => setSelectedCategoryId(isSelected ? undefined : category.id)}
              >
                <div className={`p-2 rounded-full ${isSelected ? 'bg-brand text-white' : 'bg-gray-100'}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs mt-1 text-center truncate w-full">{category.name}</span>
              </div>
            );
          })}
        </div>
      );
    }
    
    return (
      <Select 
        value={selectedCategoryId?.toString()} 
        onValueChange={(value) => {
          setSelectedCategoryId(value ? Number(value) : undefined);
          setSelectedSubCategoryId(undefined); // Reset subcategory when category changes
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="اختر التصنيف" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem 
              key={category.id} 
              value={category.id.toString()}
            >
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  };
  
  // Render brands in grid/list mode
  const renderBrands = () => {
    if (loadingBrands) {
      return (
        <div className="text-center py-2 text-sm text-muted-foreground">
          جاري التحميل...
        </div>
      );
    }
    
    if (!brands || brands.length === 0) {
      return (
        <div className="text-center py-2 text-sm text-muted-foreground">
          لا توجد ماركات
        </div>
      );
    }
    
    if (displayMode === 'grid') {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
          {brands.slice(0, 12).map((brand) => {
            const isSelected = selectedBrandId === brand.id;
            
            return (
              <div
                key={brand.id}
                className={`flex flex-col items-center p-2 cursor-pointer rounded ${
                  isSelected ? 'bg-brand/10 border border-brand' : 'hover:bg-gray-100'
                }`}
                onClick={() => setSelectedBrandId(isSelected ? undefined : brand.id)}
              >
                {brand.logo ? (
                  <img src={brand.logo} alt={brand.name} className="h-8 w-8 object-contain" />
                ) : (
                  <div className={`p-2 rounded-full ${isSelected ? 'bg-brand text-white' : 'bg-gray-100'}`}>
                    <ShoppingBag className="h-4 w-4" />
                  </div>
                )}
                <span className="text-xs mt-1 text-center truncate w-full">
                  {brand.name || brand.title}
                </span>
              </div>
            );
          })}
        </div>
      );
    }
    
    return (
      <Select 
        value={selectedBrandId?.toString()} 
        onValueChange={(value) => {
          setSelectedBrandId(value ? Number(value) : undefined);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="اختر الماركة" />
        </SelectTrigger>
        <SelectContent>
          {brands.map((brand) => (
            <SelectItem 
              key={brand.id} 
              value={brand.id.toString()}
            >
              {brand.name || brand.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  };

  return (
    <div className={className}>
      {/* Mobile filter toggle */}
      {!isSidebar && (
        <>
          <Button 
            variant="outline" 
            onClick={toggleFilter}
            className="w-full flex items-center justify-between mb-2"
          >
            <span className="flex items-center">
              <Filter className="w-4 h-4 ml-2" />
              تصفية النتائج
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </Button>
          
          {/* Active filters */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {activeFilters.map((filter, index) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {filter}
                  <button 
                    onClick={() => removeFilter(index)} 
                    className="ml-1 rounded-full hover:bg-muted p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-6 px-2"
                onClick={clearFilters}
              >
                مسح الكل
              </Button>
            </div>
          )}
        </>
      )}
      
      {/* Filter content */}
      <div className={`
        ${isSidebar ? 'space-y-6' : 'space-y-4 border-t border-border pt-4 mt-4'}
        ${!isSidebar && !isOpen ? 'hidden md:block' : 'block'}
      `}>
        {/* Search */}
        <div>
          <div className="relative">
            <Input
              type="text"
              placeholder="ابحث..."
              className="w-full h-10 pr-10"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Search className="absolute top-1/2 right-3 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        
        {/* Display Mode Toggle */}
        <div className="flex justify-end mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">طريقة العرض:</span>
            <div className="flex border rounded overflow-hidden">
              <Button
                variant={displayMode === 'grid' ? "default" : "ghost"}
                size="icon"
                onClick={() => setDisplayMode('grid')}
                className="h-6 w-6 rounded-none"
                aria-label="Grid view"
                title="عرض شبكة"
              >
                <Grid2X2 className="h-3 w-3" />
              </Button>
              <Button
                variant={displayMode === 'list' ? "default" : "ghost"}
                size="icon"
                onClick={() => setDisplayMode('list')}
                className="h-6 w-6 rounded-none"
                aria-label="List view"
                title="عرض قائمة"
              >
                <List className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Categories */}
        <div>
          <div
            className="flex items-center justify-between cursor-pointer py-2"
            onClick={() => setCategoryOpen(!categoryOpen)}
          >
            <h3 className="text-lg font-bold">التصنيفات</h3>
            <ChevronDown className={`w-5 h-5 transition-transform ${categoryOpen ? 'rotate-180' : ''}`} />
          </div>
          
          {categoryOpen && (
            <div className="mt-2 space-y-3 bg-gray-50 p-3 rounded-md">
              {renderCategories()}
              
              {/* Subcategories */}
              {selectedCategoryId && subcategories && subcategories.length > 0 && (
                <div className="mt-3">
                  <label className="text-sm font-medium mb-1 block">التصنيف الفرعي</label>
                  <Select 
                    value={selectedSubCategoryId?.toString()} 
                    onValueChange={(value) => {
                      setSelectedSubCategoryId(value ? Number(value) : undefined);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر التصنيف الفرعي" />
                    </SelectTrigger>
                    <SelectContent>
                      {subcategories.map((subcat) => (
                        <SelectItem 
                          key={subcat.id} 
                          value={subcat.id?.toString() || `subcat-${subcat.slug}`}
                        >
                          {subcat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Brands */}
        <div>
          <div
            className="flex items-center justify-between cursor-pointer py-2"
            onClick={() => setBrandOpen(!brandOpen)}
          >
            <h3 className="text-lg font-bold">الماركات</h3>
            <ChevronDown className={`w-5 h-5 transition-transform ${brandOpen ? 'rotate-180' : ''}`} />
          </div>
          
          {brandOpen && (
            <div className="mt-2 bg-gray-50 p-3 rounded-md">
              {renderBrands()}
            </div>
          )}
        </div>
        
        {/* Price Range */}
        <div>
          <div
            className="flex items-center justify-between cursor-pointer py-2"
            onClick={() => setPriceOpen(!priceOpen)}
          >
            <h3 className="text-lg font-bold">السعر</h3>
            <ChevronDown className={`w-5 h-5 transition-transform ${priceOpen ? 'rotate-180' : ''}`} />
          </div>
          
          {priceOpen && (
            <div className="mt-2 bg-gray-50 p-3 rounded-md">
              <div className="mb-4">
                <Slider
                  value={priceRange}
                  max={100000}
                  step={1000}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                />
              </div>
              <div className="flex justify-between">
                <div className="text-sm">{priceRange[0]} ريال</div>
                <div className="text-sm">{priceRange[1]} ريال</div>
              </div>
              
              <div className="mt-3 flex gap-2">
                <Input 
                  type="number" 
                  placeholder="من" 
                  className="w-1/2" 
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                />
                <Input 
                  type="number" 
                  placeholder="إلى" 
                  className="w-1/2" 
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 100000])}
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Location */}
        <div>
          <div
            className="flex items-center justify-between cursor-pointer py-2"
            onClick={() => setLocationOpen(!locationOpen)}
          >
            <h3 className="text-lg font-bold">الموقع</h3>
            <ChevronDown className={`w-5 h-5 transition-transform ${locationOpen ? 'rotate-180' : ''}`} />
          </div>
          
          {locationOpen && (
            <div className="mt-2 bg-gray-50 p-3 rounded-md">
              {/* States */}
              {loadingStates ? (
                <div className="text-center py-2 text-sm text-muted-foreground">
                  جاري التحميل...
                </div>
              ) : (
                <div className="mb-3">
                  <label className="text-sm font-medium mb-1 block">المنطقة</label>
                  <Select 
                    value={selectedStateId?.toString()} 
                    onValueChange={(value) => {
                      setSelectedStateId(value ? Number(value) : undefined);
                      setSelectedCityId(undefined); // Reset city when state changes
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المنطقة" />
                    </SelectTrigger>
                    <SelectContent>
                      {states && states.map((state) => (
                        <SelectItem 
                          key={state.id} 
                          value={state.id.toString()}
                        >
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {/* Cities */}
              {selectedStateId && (
                <div>
                  <label className="text-sm font-medium mb-1 block">المدينة</label>
                  <Select 
                    value={selectedCityId?.toString()} 
                    onValueChange={(value) => {
                      setSelectedCityId(value ? Number(value) : undefined);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المدينة" />
                    </SelectTrigger>
                    <SelectContent>
                      {stateCities.map((city) => (
                        <SelectItem 
                          key={city.id} 
                          value={city.id.toString()}
                        >
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {/* Nearby ads option */}
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 ml-2 text-muted-foreground" />
                  <Label className="text-sm" htmlFor="nearby-ads">
                    الإعلانات القريبة مني
                  </Label>
                </div>
                <Switch 
                  id="nearby-ads" 
                  checked={nearbyAds}
                  onCheckedChange={setNearbyAds}
                  disabled={loadingLocation || !location}
                />
              </div>
              {loadingLocation && (
                <div className="text-xs text-muted-foreground mt-1">
                  جاري تحديد موقعك...
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* More filters */}
        <div className="p-3 bg-gray-50 rounded-md">
          <h3 className="font-medium mb-3">خيارات إضافية</h3>
          
          <div className="space-y-3">
            {/* Listing Type */}
            <div>
              <label className="text-sm font-medium mb-1 block">نوع الإعلان</label>
              <Select value={listingType || "all"} onValueChange={(value: 'sell' | 'buy' | 'exchange' | 'all') => {
                setListingType(value === 'all' ? undefined : value);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع الإعلان" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  <SelectItem value="sell">للبيع</SelectItem>
                  <SelectItem value="buy">للشراء</SelectItem>
                  <SelectItem value="exchange">للتبديل</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Condition */}
            <div>
              <label className="text-sm font-medium mb-1 block">الحالة</label>
              <Select value={condition || "all"} onValueChange={(value: 'new' | 'used' | 'all') => {
                setCondition(value === 'all' ? undefined : value);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر حالة المنتج" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  <SelectItem value="new">جديد</SelectItem>
                  <SelectItem value="used">مستعمل</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Sorting */}
            <div>
              <label className="text-sm font-medium mb-1 block">الترتيب حسب</label>
              <Select value={sortBy || "default"} onValueChange={(value: 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'default') => {
                setSortBy(value === 'default' ? undefined : value);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر طريقة الترتيب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">الافتراضي</SelectItem>
                  <SelectItem value="newest">الأحدث</SelectItem>
                  <SelectItem value="oldest">الأقدم</SelectItem>
                  <SelectItem value="price_asc">السعر: من الأقل للأعلى</SelectItem>
                  <SelectItem value="price_desc">السعر: من الأعلى للأقل</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Apply filters button */}
        <div className="flex justify-end mt-4 gap-2">
          {isSidebar && activeFilters.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              className="mr-auto"
              onClick={clearFilters}
            >
              مسح الكل
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            className="mr-2"
            onClick={clearFilters}
          >
            إعادة ضبط
          </Button>
          <Button size="sm" onClick={applyFilters}>تطبيق</Button>
        </div>
      </div>
    </div>
  );
}
