
import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, ChevronDown, ChevronUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useCategories, useBrands, useStates, useAllCities } from '@/hooks/use-api';
import { SearchFilters, Category, Brand } from '@/types';
import { CategoryIcon } from '@/components/ui/category-icon';
import { useIsMobile } from '@/hooks/use-mobile';

interface AdFiltersProps {
  layout: 'sidebar' | 'horizontal';
  onLayoutChange?: (layout: 'grid' | 'list') => void;
  currentLayout?: 'grid' | 'list';
  onFilterChange: (filters: SearchFilters) => void;
  selectedCategory?: Category;
}

export function AdFilters({
  layout,
  onLayoutChange,
  currentLayout,
  onFilterChange,
  selectedCategory
}: AdFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(selectedCategory?.id);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<number | undefined>();
  const [selectedBrandId, setSelectedBrandId] = useState<number | undefined>();
  const [selectedStateId, setSelectedStateId] = useState<number | undefined>();
  const [selectedCityId, setSelectedCityId] = useState<number | undefined>();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [listingType, setListingType] = useState<string>('');
  const [condition, setCondition] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [nearbyEnabled, setNearbyEnabled] = useState(false);
  const [showMoreBrands, setShowMoreBrands] = useState(false);
  const [showMoreSubcategories, setShowMoreSubcategories] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  
  const isMobile = useIsMobile();
  
  // API hooks
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: allBrands = [], isLoading: brandsLoading } = useBrands();
  const { data: states = [], isLoading: statesLoading } = useStates();
  const { data: cities = [], isLoading: citiesLoading } = useAllCities();

  // Get category-specific brands
  const [categoryBrands, setCategoryBrands] = useState<Brand[]>([]);

  useEffect(() => {
    if (selectedCategoryId) {
      // Filter brands by category (simplified logic - in real app, this would be an API call)
      const filteredBrands = allBrands.filter(brand => 
        !brand.category_id || brand.category_id === selectedCategoryId
      );
      setCategoryBrands(filteredBrands);
    } else {
      setCategoryBrands(allBrands);
    }
  }, [selectedCategoryId, allBrands]);

  // Get subcategories
  const subcategories = selectedCategoryId 
    ? categories.find(cat => cat.id === selectedCategoryId)?.subcategories || []
    : [];

  // Get cities for selected state
  const stateCities = selectedStateId 
    ? cities.filter(city => city.state_id === selectedStateId)
    : [];

  // Get location from localStorage or request it
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      setUserLocation(JSON.parse(savedLocation));
    }
  }, []);

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          localStorage.setItem('userLocation', JSON.stringify(location));
          setNearbyEnabled(true);
        },
        (error) => {
          console.error('Error getting location:', error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    }
  };

  // Apply filters
  const applyFilters = () => {
    const filters: SearchFilters = {
      search: searchTerm || undefined,
      category_id: selectedCategoryId,
      sub_category_id: selectedSubCategoryId,
      brand_id: selectedBrandId,
      state_id: selectedStateId,
      city_id: selectedCityId,
      min_price: priceRange[0] > 0 ? priceRange[0] : undefined,
      max_price: priceRange[1] < 100000 ? priceRange[1] : undefined,
      listing_type: listingType || undefined,
      condition: condition || undefined,
      sort: sortBy || undefined,
      ...(nearbyEnabled && userLocation ? {
        lat: userLocation.lat,
        lon: userLocation.lng,
        radius: 10
      } : {})
    };

    onFilterChange(filters);
  };

  useEffect(() => {
    applyFilters();
  }, [
    searchTerm, selectedCategoryId, selectedSubCategoryId, selectedBrandId,
    selectedStateId, selectedCityId, priceRange, listingType, condition,
    sortBy, nearbyEnabled, userLocation
  ]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategoryId(undefined);
    setSelectedSubCategoryId(undefined);
    setSelectedBrandId(undefined);
    setSelectedStateId(undefined);
    setSelectedCityId(undefined);
    setPriceRange([0, 100000]);
    setListingType('');
    setCondition('');
    setSortBy('newest');
    setNearbyEnabled(false);
  };

  // Count active filters
  const activeFiltersCount = [
    selectedCategoryId,
    selectedSubCategoryId,
    selectedBrandId,
    selectedStateId,
    selectedCityId,
    priceRange[0] > 0 ? 1 : 0,
    priceRange[1] < 100000 ? 1 : 0,
    listingType,
    condition,
    nearbyEnabled ? 1 : 0
  ].filter(Boolean).length;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">التصنيفات</h3>
        <div className="grid grid-cols-3 gap-3">
          {categories.slice(0, 9).map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategoryId(selectedCategoryId === category.id ? undefined : category.id);
                setSelectedSubCategoryId(undefined);
              }}
              className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                selectedCategoryId === category.id
                  ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <div className="w-12 h-12 mb-2 flex items-center justify-center">
                <CategoryIcon name={category.icon || 'Car'} className="w-8 h-8 text-gray-600 dark:text-gray-400" />
              </div>
              <span className="text-xs text-center leading-tight">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Subcategories */}
      {subcategories.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">التصنيفات الفرعية</h3>
          <div className="grid grid-cols-3 gap-3">
            {subcategories.slice(0, showMoreSubcategories ? subcategories.length : 6).map((subcat) => (
              <button
                key={subcat.id}
                onClick={() => setSelectedSubCategoryId(selectedSubCategoryId === subcat.id ? undefined : subcat.id)}
                className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                  selectedSubCategoryId === subcat.id
                    ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <div className="w-12 h-12 mb-2 flex items-center justify-center">
                  <CategoryIcon name={subcat.icon || 'Car'} className="w-8 h-8 text-gray-600 dark:text-gray-400" />
                </div>
                <span className="text-xs text-center leading-tight">{subcat.name}</span>
              </button>
            ))}
          </div>
          {subcategories.length > 6 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMoreSubcategories(!showMoreSubcategories)}
              className="w-full mt-3"
            >
              {showMoreSubcategories ? 'عرض أقل' : `عرض المزيد (${subcategories.length - 6})`}
              <ChevronDown className={`w-4 h-4 mr-2 transition-transform ${showMoreSubcategories ? 'rotate-180' : ''}`} />
            </Button>
          )}
        </div>
      )}

      {/* Brands */}
      {categoryBrands.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">الماركات</h3>
          <div className="grid grid-cols-3 gap-3">
            {categoryBrands.slice(0, showMoreBrands ? categoryBrands.length : 9).map((brand) => (
              <button
                key={brand.id}
                onClick={() => setSelectedBrandId(selectedBrandId === brand.id ? undefined : brand.id)}
                className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                  selectedBrandId === brand.id
                    ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <div className="w-16 h-12 mb-2 flex items-center justify-center">
                  {brand.logo ? (
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        {brand.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <span className="text-xs text-center leading-tight">{brand.name}</span>
              </button>
            ))}
          </div>
          {categoryBrands.length > 9 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMoreBrands(!showMoreBrands)}
              className="w-full mt-3"
            >
              {showMoreBrands ? 'عرض أقل' : `عرض المزيد (${categoryBrands.length - 9})`}
              <ChevronDown className={`w-4 h-4 mr-2 transition-transform ${showMoreBrands ? 'rotate-180' : ''}`} />
            </Button>
          )}
        </div>
      )}

      {/* Animals Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">الحيوانات</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { name: 'دواب', icon: '🐐' },
            { name: 'طيور وقطط', icon: '🐱' },
            { name: 'قطع غيار وقطع', icon: '🔧' },
            { name: 'سيارات معدل', icon: '🚗' },
            { name: 'سيارات قديمة', icon: '🚙' },
            { name: 'سيارات تاريخية', icon: '🏎️' }
          ].map((item, index) => (
            <button
              key={index}
              className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              <div className="w-12 h-12 mb-2 flex items-center justify-center text-2xl">
                {item.icon}
              </div>
              <span className="text-xs text-center leading-tight">{item.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const FilterDropdown = () => (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setShowFilterDropdown(!showFilterDropdown)}
        className="flex items-center gap-2"
      >
        <Filter className="w-4 h-4" />
        <span>فلاتر أخرى</span>
        {activeFiltersCount > 0 && (
          <Badge variant="secondary" className="ml-1">
            {activeFiltersCount}
          </Badge>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
      </Button>

      {showFilterDropdown && (
        <div className="absolute top-full mt-2 left-0 w-80 bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-4 z-50 space-y-4">
          {/* Price Range */}
          <div>
            <Label className="text-sm font-medium mb-2 block">نطاق السعر</Label>
            <Slider
              value={priceRange}
              onValueChange={(value) => setPriceRange(value as [number, number])}
              max={100000}
              step={1000}
              className="mb-2"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{priceRange[0]} ر.س</span>
              <span>{priceRange[1]} ر.س</span>
            </div>
          </div>

          <Separator />

          {/* Location */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">المنطقة</Label>
            <Select value={selectedStateId?.toString() || ''} onValueChange={(value) => {
              setSelectedStateId(value ? parseInt(value) : undefined);
              setSelectedCityId(undefined);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="اختر المنطقة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">جميع المناطق</SelectItem>
                {states.map((state) => (
                  <SelectItem key={state.id} value={state.id.toString()}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedStateId && stateCities.length > 0 && (
              <Select value={selectedCityId?.toString() || ''} onValueChange={(value) => {
                setSelectedCityId(value ? parseInt(value) : undefined);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر المدينة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">جميع المدن</SelectItem>
                  {stateCities.map((city) => (
                    <SelectItem key={city.id} value={city.id.toString()}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <Separator />

          {/* Nearby Switch */}
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">الإعلانات القريبة</Label>
            <div className="flex items-center gap-2">
              <Switch
                checked={nearbyEnabled}
                onCheckedChange={(checked) => {
                  if (checked && !userLocation) {
                    requestLocation();
                  } else {
                    setNearbyEnabled(checked);
                  }
                }}
              />
              {!userLocation && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={requestLocation}
                  className="text-xs"
                >
                  <MapPin className="w-3 h-3 mr-1" />
                  تحديد الموقع
                </Button>
              )}
            </div>
          </div>

          <Separator />

          {/* Listing Type */}
          <div>
            <Label className="text-sm font-medium mb-2 block">نوع الإعلان</Label>
            <Select value={listingType} onValueChange={setListingType}>
              <SelectTrigger>
                <SelectValue placeholder="اختر النوع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">الكل</SelectItem>
                <SelectItem value="sell">للبيع</SelectItem>
                <SelectItem value="rent">للإيجار</SelectItem>
                <SelectItem value="wanted">مطلوب</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Condition */}
          <div>
            <Label className="text-sm font-medium mb-2 block">الحالة</Label>
            <Select value={condition} onValueChange={setCondition}>
              <SelectTrigger>
                <SelectValue placeholder="اختر الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">الكل</SelectItem>
                <SelectItem value="new">جديد</SelectItem>
                <SelectItem value="used">مستعمل</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort */}
          <div>
            <Label className="text-sm font-medium mb-2 block">الترتيب</Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="اختر الترتيب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">الأحدث</SelectItem>
                <SelectItem value="oldest">الأقدم</SelectItem>
                <SelectItem value="price_asc">السعر: الأقل أولاً</SelectItem>
                <SelectItem value="price_desc">السعر: الأعلى أولاً</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={resetFilters} className="flex-1">
              إعادة تعيين
            </Button>
            <Button onClick={() => setShowFilterDropdown(false)} className="flex-1">
              تطبيق
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <div className="space-y-3">
        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="ابحث عن أي شيء..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
          <Button>
            <Search className="w-4 h-4" />
          </Button>
        </div>

        {/* Filter Dropdown */}
        <FilterDropdown />

        {/* Mobile Filter Sheet */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <span>فلترة النتائج</span>
              {activeFiltersCount > 0 && (
                <Badge variant="destructive" className="ml-auto">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">تصفية النتائج</h2>
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" onClick={resetFilters} size="sm">
                    <X className="w-4 h-4 mr-1" />
                    مسح الكل
                  </Button>
                )}
              </div>
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="ابحث عن أي شيء..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
        <Button>
          <Search className="w-4 h-4" />
        </Button>
      </div>

      {/* Filter Dropdown */}
      <FilterDropdown />

      {/* Desktop Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
        <FilterContent />
      </div>
    </div>
  );
}
