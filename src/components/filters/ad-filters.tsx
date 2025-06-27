
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  MapPin, 
  ChevronDown,
  ChevronUp,
  X,
  Navigation,
  Calendar,
  DollarSign
} from 'lucide-react';
import { SearchFilters } from '@/types';
import { useCategories, useBrands, useStates, useCities } from '@/hooks/use-api';
import { cn } from '@/lib/utils';

interface AdFiltersProps {
  layout: 'sidebar' | 'horizontal';
  onLayoutChange?: (layout: 'grid' | 'list') => void;
  currentLayout?: 'grid' | 'list';
  onFilterChange: (filters: SearchFilters) => void;
  selectedCategory?: any;
}

// Mock data for missing APIs
const mockAnimals = [
  { id: 1, name: 'طيور', icon: '🐦' },
  { id: 2, name: 'قطط', icon: '🐱' },
  { id: 3, name: 'كلاب', icon: '🐕' },
  { id: 4, name: 'أسماك', icon: '🐟' },
];

const mockRealEstate = [
  { id: 1, name: 'شقق للبيع', icon: '🏠' },
  { id: 2, name: 'شقق للإيجار', icon: '🏢' },
  { id: 3, name: 'فيلات', icon: '🏘️' },
  { id: 4, name: 'أراضي', icon: '🏞️' },
];

const mockBrands = [
  { id: 1, name: 'فورد', logo_url: 'https://1000logos.net/wp-content/uploads/2017/03/Ford-Logo.png' },
  { id: 2, name: 'نيسان', logo_url: 'https://1000logos.net/wp-content/uploads/2017/03/Nissan-Logo.png' },
  { id: 3, name: 'تويوتا', logo_url: 'https://1000logos.net/wp-content/uploads/2017/03/Toyota-Logo.png' },
  { id: 4, name: 'مرسيدس', logo_url: 'https://1000logos.net/wp-content/uploads/2017/03/Mercedes-Logo.png' },
  { id: 5, name: 'شيفروليه', logo_url: 'https://1000logos.net/wp-content/uploads/2017/03/Chevrolet-Logo.png' },
  { id: 6, name: 'لكزس', logo_url: 'https://1000logos.net/wp-content/uploads/2017/03/Lexus-Logo.png' },
  { id: 7, name: 'دودج', logo_url: 'https://1000logos.net/wp-content/uploads/2017/03/Dodge-Logo.png' },
  { id: 8, name: 'بي إم دبليو', logo_url: 'https://1000logos.net/wp-content/uploads/2017/03/BMW-Logo.png' },
  { id: 9, name: 'جي إم سي', logo_url: 'https://1000logos.net/wp-content/uploads/2017/03/GMC-Logo.png' },
];

const mockTechBrands = [
  { id: 10, name: 'كانون', logo_url: 'https://1000logos.net/wp-content/uploads/2017/03/Canon-Logo.png' },
  { id: 11, name: 'سامسونج', logo_url: 'https://1000logos.net/wp-content/uploads/2017/03/Samsung-Logo.png' },
  { id: 12, name: 'آبل', logo_url: 'https://1000logos.net/wp-content/uploads/2017/03/Apple-Logo.png' },
  { id: 13, name: 'نوكيا', logo_url: 'https://1000logos.net/wp-content/uploads/2017/03/Nokia-Logo.png' },
  { id: 14, name: 'مايكروسوفت', logo_url: 'https://1000logos.net/wp-content/uploads/2017/03/Microsoft-Logo.png' },
  { id: 15, name: 'سوني', logo_url: 'https://1000logos.net/wp-content/uploads/2017/03/Sony-Logo.png' },
  { id: 16, name: 'إل جي', logo_url: 'https://1000logos.net/wp-content/uploads/2017/03/LG-Logo.png' },
];

export function AdFilters({ 
  layout, 
  onLayoutChange, 
  currentLayout = 'grid', 
  onFilterChange,
  selectedCategory 
}: AdFiltersProps) {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
  const [showMoreBrands, setShowMoreBrands] = useState(false);
  const [showMoreSubcategories, setShowMoreSubcategories] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lon: number} | null>(null);

  const { data: categories } = useCategories();
  const { data: brands } = useBrands();
  const { data: states } = useStates();
  const { data: cities } = useCities(filters.state_id);

  // Get stored location
  useEffect(() => {
    const storedLocation = localStorage.getItem('userLocation');
    if (storedLocation) {
      setCurrentLocation(JSON.parse(storedLocation));
    }
  }, []);

  // Get user location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
          };
          setCurrentLocation(location);
          localStorage.setItem('userLocation', JSON.stringify(location));
          updateFilters({ ...location, radius: 10 });
        },
        (error) => {
          console.error('Error getting location:', error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    }
  };

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const clearFilters = () => {
    setFilters({});
    setPriceRange([0, 100000]);
    setSelectedCategoryId(null);
    setSelectedBrandId(null);
    onFilterChange({});
  };

  const selectedCategoryObj = categories?.find(cat => cat.id === selectedCategoryId);
  const subcategories = selectedCategoryObj?.subcategories || [];
  const visibleSubcategories = showMoreSubcategories ? subcategories : subcategories.slice(0, 6);

  // Determine brands to show based on selected category
  const getBrandsForCategory = () => {
    if (selectedCategoryId === 1) { // Cars category
      return mockBrands;
    } else if (selectedCategoryId === 2) { // Electronics category
      return mockTechBrands;
    }
    return [...mockBrands, ...mockTechBrands];
  };

  const currentBrands = getBrandsForCategory();
  const visibleBrands = showMoreBrands ? currentBrands : currentBrands.slice(0, 9);

  if (layout === 'horizontal') {
    return (
      <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-4 mb-6">
        <div className="flex flex-col gap-4">
          {/* Search Bar */}
          <div className="relative">
            <Input
              placeholder="ابحث في الإعلانات..."
              className="pr-10 h-12 rounded-lg border-2 focus:border-blue-500"
              value={filters.search || ''}
              onChange={(e) => updateFilters({ search: e.target.value })}
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filters.sort === 'newest' ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateFilters({ sort: filters.sort === 'newest' ? undefined : 'newest' })}
            >
              الأحدث
            </Button>
            <Button
              variant={filters.sort === 'oldest' ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateFilters({ sort: filters.sort === 'oldest' ? undefined : 'oldest' })}
            >
              الأقدم
            </Button>
            <Button
              variant={currentLocation ? 'default' : 'outline'}
              size="sm"
              onClick={getCurrentLocation}
            >
              <Navigation className="h-4 w-4 ml-1" />
              الأقرب
            </Button>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 ml-1" />
              مسح الفلاتر
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white dark:bg-dark-card h-fit">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200 dark:border-dark-border">
        <div className="relative">
          <Input
            placeholder="ابحث..."
            className="pr-10 h-12 rounded-lg border-2 focus:border-blue-500"
            value={filters.search || ''}
            onChange={(e) => updateFilters({ search: e.target.value })}
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Filter Options */}
      <div className="p-4 space-y-6">
        {/* Classification Toggle */}
        <div className="flex items-center justify-center">
          <Button
            variant="outline"
            className="w-full justify-center text-blue-600 border-blue-600 hover:bg-blue-50"
          >
            تصنيف
          </Button>
        </div>

        {/* Transfer Type */}
        <div className="flex items-center justify-center">
          <Button
            variant="outline"
            className="w-full justify-center text-blue-600 border-blue-600 hover:bg-blue-50"
          >
            نقل السيارة
          </Button>
        </div>

        {/* Categories Grid */}
        <div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {categories?.slice(0, 9).map((category) => (
              <div
                key={category.id}
                className={cn(
                  "flex flex-col items-center p-3 cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-dark-surface rounded-lg",
                  selectedCategoryId === category.id && "ring-2 ring-blue-500"
                )}
                onClick={() => {
                  const newCategoryId = selectedCategoryId === category.id ? null : category.id;
                  setSelectedCategoryId(newCategoryId);
                  updateFilters({ category_id: newCategoryId || undefined });
                }}
              >
                <div className="w-full h-16 flex items-center justify-center mb-2">
                  {category.image_url ? (
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="w-12 h-12 object-contain"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 dark:bg-dark-surface rounded-lg flex items-center justify-center">
                      <span className="text-xs text-gray-500">{category.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <span className="text-xs text-center text-gray-700 dark:text-gray-300">
                  {category.name}
                </span>
              </div>
            ))}
          </div>

          {/* Show More Categories Button */}
          {categories && categories.length > 9 && (
            <Button
              variant="outline"
              size="sm"
              className="w-full mb-4"
              onClick={() => {/* Implement show more categories */}}
            >
              <ChevronDown className="h-4 w-4 ml-1" />
              عرض المزيد
            </Button>
          )}
        </div>

        {/* Subcategories */}
        {subcategories.length > 0 && (
          <div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {visibleSubcategories.map((subcategory) => (
                <div
                  key={subcategory.id}
                  className={cn(
                    "flex flex-col items-center p-3 cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-dark-surface rounded-lg",
                    filters.subcategory_id === subcategory.id && "ring-2 ring-blue-500"
                  )}
                  onClick={() => {
                    const newSubcategoryId = filters.subcategory_id === subcategory.id ? undefined : subcategory.id;
                    updateFilters({ subcategory_id: newSubcategoryId });
                  }}
                >
                  <div className="w-full h-16 flex items-center justify-center mb-2">
                    {subcategory.image_url ? (
                      <img
                        src={subcategory.image_url}
                        alt={subcategory.name}
                        className="w-12 h-12 object-contain"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 dark:bg-dark-surface rounded-lg flex items-center justify-center">
                        <span className="text-xs text-gray-500">{subcategory.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-center text-gray-700 dark:text-gray-300">
                    {subcategory.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Show More Subcategories Button */}
            {subcategories.length > 6 && (
              <Button
                variant="outline"
                size="sm"
                className="w-full mb-4"
                onClick={() => setShowMoreSubcategories(!showMoreSubcategories)}
              >
                {showMoreSubcategories ? (
                  <>
                    <ChevronUp className="h-4 w-4 ml-1" />
                    عرض أقل
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 ml-1" />
                    عرض المزيد
                  </>
                )}
              </Button>
            )}
          </div>
        )}

        {/* Brands */}
        <div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {visibleBrands.map((brand) => (
              <div
                key={brand.id}
                className={cn(
                  "flex flex-col items-center p-3 cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-dark-surface rounded-lg",
                  selectedBrandId === brand.id && "ring-2 ring-blue-500"
                )}
                onClick={() => {
                  const newBrandId = selectedBrandId === brand.id ? null : brand.id;
                  setSelectedBrandId(newBrandId);
                  updateFilters({ brand_id: newBrandId || undefined });
                }}
              >
                <div className="w-full h-16 flex items-center justify-center mb-2">
                  <img
                    src={brand.logo_url}
                    alt={brand.name}
                    className="w-12 h-12 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                </div>
                <span className="text-xs text-center text-gray-700 dark:text-gray-300">
                  {brand.name}
                </span>
              </div>
            ))}
          </div>

          {/* Show More Brands Button */}
          {currentBrands.length > 9 && (
            <Button
              variant="outline"
              size="sm"
              className="w-full mb-4"
              onClick={() => setShowMoreBrands(!showMoreBrands)}
            >
              {showMoreBrands ? (
                <>
                  <ChevronUp className="h-4 w-4 ml-1" />
                  عرض أقل
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 ml-1" />
                  عرض المزيد
                </>
              )}
            </Button>
          )}
        </div>

        {/* Animals Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">الحيوانات</h3>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {mockAnimals.map((animal) => (
              <div
                key={animal.id}
                className="flex flex-col items-center p-3 cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-dark-surface rounded-lg"
                onClick={() => updateFilters({ category_id: animal.id })}
              >
                <div className="w-full h-16 flex items-center justify-center mb-2 text-2xl">
                  {animal.icon}
                </div>
                <span className="text-xs text-center text-gray-700 dark:text-gray-300">
                  {animal.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Real Estate Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">العقارات</h3>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {mockRealEstate.map((item) => (
              <div
                key={item.id}
                className="flex flex-col items-center p-3 cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-dark-surface rounded-lg"
                onClick={() => updateFilters({ category_id: item.id })}
              >
                <div className="w-full h-16 flex items-center justify-center mb-2 text-2xl">
                  {item.icon}
                </div>
                <span className="text-xs text-center text-gray-700 dark:text-gray-300">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Location Filters */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">الموقع</h3>
          
          <Select
            value={filters.state_id?.toString() || ''}
            onValueChange={(value) => updateFilters({ 
              state_id: value ? parseInt(value) : undefined,
              city_id: undefined 
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر المحافظة" />
            </SelectTrigger>
            <SelectContent>
              {states?.map((state) => (
                <SelectItem key={state.id} value={state.id.toString()}>
                  {state.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.city_id?.toString() || ''}
            onValueChange={(value) => updateFilters({ 
              city_id: value ? parseInt(value) : undefined 
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر المدينة" />
            </SelectTrigger>
            <SelectContent>
              {cities?.map((city) => (
                <SelectItem key={city.id} value={city.id.toString()}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={getCurrentLocation}
          >
            <Navigation className="h-4 w-4 ml-1" />
            استخدام موقعي الحالي
          </Button>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">نطاق السعر</h3>
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={100000}
              min={0}
              step={1000}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>{priceRange[0].toLocaleString()} ل.س</span>
            <span>{priceRange[1].toLocaleString()} ل.س</span>
          </div>
          <Button
            size="sm"
            onClick={() => updateFilters({ min_price: priceRange[0], max_price: priceRange[1] })}
            className="w-full"
          >
            تطبيق نطاق السعر
          </Button>
        </div>

        {/* Sort Options */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">الترتيب</h3>
          <div className="flex flex-col gap-2">
            <Button
              variant={filters.sort === 'newest' ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateFilters({ sort: filters.sort === 'newest' ? undefined : 'newest' })}
            >
              <Calendar className="h-4 w-4 ml-1" />
              الأحدث
            </Button>
            <Button
              variant={filters.sort === 'oldest' ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateFilters({ sort: filters.sort === 'oldest' ? undefined : 'oldest' })}
            >
              <Calendar className="h-4 w-4 ml-1" />
              الأقدم
            </Button>
            <Button
              variant={filters.sort === 'price_asc' ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateFilters({ sort: filters.sort === 'price_asc' ? undefined : 'price_asc' })}
            >
              <DollarSign className="h-4 w-4 ml-1" />
              السعر: من الأقل
            </Button>
            <Button
              variant={filters.sort === 'price_desc' ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateFilters({ sort: filters.sort === 'price_desc' ? undefined : 'price_desc' })}
            >
              <DollarSign className="h-4 w-4 ml-1" />
              السعر: من الأعلى
            </Button>
          </div>
        </div>

        {/* Active Filters */}
        {Object.keys(filters).length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">الفلاتر النشطة</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters).map(([key, value]) => (
                value && (
                  <Badge key={key} variant="secondary" className="text-xs">
                    {key}: {value.toString()}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer"
                      onClick={() => updateFilters({ [key]: undefined })}
                    />
                  </Badge>
                )
              ))}
            </div>
          </div>
        )}

        {/* Clear All Filters */}
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={clearFilters}
        >
          <X className="h-4 w-4 ml-1" />
          مسح جميع الفلاتر
        </Button>
      </div>
    </div>
  );
}
