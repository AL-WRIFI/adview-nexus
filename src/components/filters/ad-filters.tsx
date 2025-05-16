
import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Grid2X2, List, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { MobileFilterDrawer } from './MobileFilterDrawer';
import { useSubCategories as useSubcategories, useChildCategories, useCities } from '@/hooks/use-api';
import { Category, SearchFilters } from '@/types';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce';
import { useGeolocation } from '@/hooks/use-geolocation';

interface AdFiltersProps {
  layout: 'sidebar' | 'horizontal';
  onLayoutChange?: (layout: 'grid' | 'list') => void;
  currentLayout?: 'grid' | 'list';
  className?: string;
  onFilterChange: (filters: SearchFilters) => void;
  selectedCategory?: Category | null;
}

export function AdFilters({
  layout,
  onLayoutChange,
  currentLayout = 'grid',
  className = '',
  onFilterChange,
  selectedCategory
}: AdFiltersProps) {
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(null);
  const [selectedChildCategory, setSelectedChildCategory] = useState<number | null>(null);
  const [condition, setCondition] = useState<'' | 'new' | 'used' | null>(null);
  const [hasImage, setHasImage] = useState(false);
  const [hasDelivery, setHasDelivery] = useState(false);
  const [nearbyOnly, setNearbyOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'price_asc' | 'price_desc'>('newest');
  const [filters, setFilters] = useState<SearchFilters>({});
  
  // Get user's location for nearby search
  const { getLocation, locationData, locationError } = useGeolocation();
  
  // Fetch subcategories based on selected category
  const { data: subcategories } = useSubcategories(
    selectedCategory?.id ? selectedCategory.id : undefined
  );
  
  // Fetch child categories based on selected subcategory
  const { data: childCategories } = useChildCategories(selectedSubcategory);
  
  // Fetch cities for city filter
  const { data: cities } = useCities();
  
  // Update filters when inputs change
  useEffect(() => {
    const newFilters: SearchFilters = {};
    
    if (debouncedSearchTerm) {
      newFilters.search = debouncedSearchTerm;
    }
    
    if (selectedCategory?.id) {
      newFilters.category_id = selectedCategory.id;
    }
    
    if (selectedSubcategory) {
      newFilters.subcategory_id = selectedSubcategory;
    }
    
    if (selectedChildCategory) {
      newFilters.child_category_id = selectedChildCategory;
    }
    
    if (selectedCity) {
      newFilters.city = selectedCity;
    }
    
    if (condition) {
      newFilters.condition = condition;
    }
    
    if (priceRange[0] > 0 || priceRange[1] < 100000) {
      newFilters.min_price = priceRange[0];
      newFilters.max_price = priceRange[1];
    }
    
    if (hasImage) {
      newFilters.has_image = true;
    }
    
    if (hasDelivery) {
      newFilters.has_delivery = true;
    }
    
    if (sortBy) {
      newFilters.sort_by = sortBy;
    }
    
    setFilters(newFilters);
    onFilterChange(newFilters);
  }, [
    debouncedSearchTerm,
    selectedCategory,
    selectedSubcategory,
    selectedChildCategory,
    selectedCity,
    condition,
    priceRange,
    hasImage,
    hasDelivery,
    sortBy,
    onFilterChange
  ]);
  
  // Handle nearby search
  useEffect(() => {
    if (nearbyOnly) {
      getLocation();
    } else {
      // Remove location from filters if nearby is turned off
      setFilters(prev => {
        const newFilters = { ...prev };
        delete newFilters.lat;
        delete newFilters.lng;
        delete newFilters.distance;
        return newFilters;
      });
      onFilterChange({
        ...filters,
        lat: undefined,
        lng: undefined,
        distance: undefined
      });
    }
  }, [nearbyOnly, filters, onFilterChange, getLocation]);
  
  // Update filters with location data when available
  useEffect(() => {
    if (locationData && typeof locationData === 'object' && 'lat' in locationData && 'lng' in locationData) {
      const typedLocation = locationData;
      setFilters(prev => ({
        ...prev,
        lat: typedLocation.lat,
        lng: typedLocation.lng
      }));
      onFilterChange({
        ...filters,
        lat: typedLocation.lat,
        lng: typedLocation.lng,
        distance: 10 // Default to 10km radius
      });
    }
  }, [locationData, filters, onFilterChange]);
  
  // Reset child category when subcategory changes
  useEffect(() => {
    if (selectedSubcategory) {
      setSelectedChildCategory(null);
    }
  }, [selectedSubcategory]);
  
  // Reset filters when category changes
  useEffect(() => {
    if (selectedCategory) {
      setSelectedSubcategory(null);
      setSelectedChildCategory(null);
    }
  }, [selectedCategory]);
  
  // Horizontal layout (mobile)
  if (layout === 'horizontal') {
    return (
      <div className={cn("flex items-center justify-between gap-2", className)}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-gray-400" />
          <Input
            placeholder="ابحث عن منتجات..."
            className="pl-9 pr-3 w-full dark:bg-dark-card dark:border-dark-border dark:text-gray-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Button
          variant="outline"
          size="icon"
          className="flex-shrink-0 dark:bg-dark-card dark:border-dark-border dark:text-gray-200"
          onClick={() => setIsFilterDrawerOpen(true)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="sr-only">فلترة</span>
        </Button>
        
        {onLayoutChange && (
          <div className="flex border rounded-sm overflow-hidden dark:border-dark-border">
            <Button 
              variant={currentLayout === 'grid' ? "default" : "ghost"} 
              size="icon"
              onClick={() => onLayoutChange('grid')}
              className="h-9 w-9 rounded-none"
              aria-label="Grid view"
            >
              <Grid2X2 className="h-4 w-4" />
            </Button>
            <Button 
              variant={currentLayout === 'list' ? "default" : "ghost"}
              size="icon" 
              onClick={() => onLayoutChange('list')}
              className="h-9 w-9 rounded-none"
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        <MobileFilterDrawer 
          onFilterChange={onFilterChange}
        />
      </div>
    );
  }
  
  // Sidebar layout (desktop)
  return (
    <div className={cn("space-y-6", className)}>
      {/* Search */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-gray-400" />
          <Input
            placeholder="ابحث عن منتجات..."
            className="pl-9 pr-3 dark:bg-dark-card dark:border-dark-border dark:text-gray-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Layout toggle */}
      {onLayoutChange && (
        <div className="space-y-2">
          <Label className="text-base font-medium dark:text-gray-200">طريقة العرض</Label>
          <div className="flex border rounded-sm overflow-hidden dark:border-dark-border">
            <Button 
              variant={currentLayout === 'grid' ? "default" : "ghost"} 
              size="sm"
              onClick={() => onLayoutChange('grid')}
              className="flex-1 rounded-none dark:text-gray-200"
            >
              <Grid2X2 className="h-4 w-4 mr-2" />
              شبكة
            </Button>
            <Button 
              variant={currentLayout === 'list' ? "default" : "ghost"}
              size="sm" 
              onClick={() => onLayoutChange('list')}
              className="flex-1 rounded-none dark:text-gray-200"
            >
              <List className="h-4 w-4 mr-2" />
              قائمة
            </Button>
          </div>
        </div>
      )}
      
      <Separator className="dark:bg-dark-border" />
      
      {/* Subcategories */}
      {subcategories && subcategories.length > 0 && (
        <div className="space-y-2">
          <Label className="text-base font-medium dark:text-gray-200">التصنيف الفرعي</Label>
          <Select
            value={selectedSubcategory?.toString() || ""}
            onValueChange={(value) => setSelectedSubcategory(value ? parseInt(value, 10) : null)}
          >
            <SelectTrigger className="dark:bg-dark-card dark:border-dark-border dark:text-gray-200">
              <SelectValue placeholder="اختر التصنيف الفرعي" />
            </SelectTrigger>
            <SelectContent className="dark:bg-dark-card dark:border-dark-border">
              <SelectItem value="all">الكل</SelectItem>
              {subcategories.map((subcategory) => (
                <SelectItem key={subcategory.id} value={subcategory.id.toString()}>
                  {subcategory.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      {/* Child categories */}
      {childCategories && childCategories.length > 0 && (
        <div className="space-y-2">
          <Label className="text-base font-medium dark:text-gray-200">التصنيف الفرعي الثانوي</Label>
          <Select
            value={selectedChildCategory?.toString() || ""}
            onValueChange={(value) => setSelectedChildCategory(value ? parseInt(value, 10) : null)}
          >
            <SelectTrigger className="dark:bg-dark-card dark:border-dark-border dark:text-gray-200">
              <SelectValue placeholder="اختر التصنيف الفرعي الثانوي" />
            </SelectTrigger>
            <SelectContent className="dark:bg-dark-card dark:border-dark-border">
              <SelectItem value="all">الكل</SelectItem>
              {childCategories.map((childCategory) => (
                <SelectItem key={childCategory.id} value={childCategory.id.toString()}>
                  {childCategory.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      <Separator className="dark:bg-dark-border" />
      
      {/* City filter */}
      <div className="space-y-2">
        <Label className="text-base font-medium dark:text-gray-200">المدينة</Label>
        <Select
          value={selectedCity || ""}
          onValueChange={(value) => setSelectedCity(value || null)}
        >
          <SelectTrigger className="dark:bg-dark-card dark:border-dark-border dark:text-gray-200">
            <SelectValue placeholder="اختر المدينة" />
          </SelectTrigger>
          <SelectContent className="dark:bg-dark-card dark:border-dark-border">
            <SelectItem value="all">الكل</SelectItem>
            {cities && cities.map((city) => (
              <SelectItem key={city.id} value={city.name}>
                {city.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Nearby search */}
      <div className="flex items-center space-x-2 space-x-reverse">
        <Checkbox 
          id="nearby" 
          checked={nearbyOnly}
          onCheckedChange={(checked) => setNearbyOnly(checked as boolean)}
          className="dark:border-dark-border"
        />
        <div className="grid gap-1.5 leading-none">
          <Label 
            htmlFor="nearby" 
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center dark:text-gray-200"
          >
            <MapPin className="h-4 w-4 mr-1" />
            بالقرب مني
          </Label>
          {locationError && (
            <p className="text-xs text-red-500">
              {locationError === 'PERMISSION_DENIED' 
                ? 'يرجى السماح بالوصول إلى موقعك' 
                : 'حدث خطأ في تحديد موقعك'}
            </p>
          )}
        </div>
      </div>
      
      <Separator className="dark:bg-dark-border" />
      
      {/* Price range */}
      <div className="space-y-4">
        <Label className="text-base font-medium dark:text-gray-200">نطاق السعر</Label>
        <Slider
          defaultValue={[0, 100000]}
          min={0}
          max={100000}
          step={1000}
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          className="dark:bg-dark-muted"
        />
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground dark:text-gray-400">
            {priceRange[0]} ريال
          </span>
          <span className="text-sm text-muted-foreground dark:text-gray-400">
            {priceRange[1] === 100000 ? '100,000+ ريال' : `${priceRange[1]} ريال`}
          </span>
        </div>
      </div>
      
      <Separator className="dark:bg-dark-border" />
      
      {/* Condition */}
      <div className="space-y-2">
        <Label className="text-base font-medium dark:text-gray-200">الحالة</Label>
        <RadioGroup 
          value={condition || ""} 
          onValueChange={(value) => setCondition(value as '' | 'new' | 'used' || null)}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2 space-x-reverse">
            <RadioGroupItem value="" id="condition-all" className="dark:border-dark-border" />
            <Label htmlFor="condition-all" className="dark:text-gray-200">الكل</Label>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <RadioGroupItem value="new" id="condition-new" className="dark:border-dark-border" />
            <Label htmlFor="condition-new" className="dark:text-gray-200">جديد</Label>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <RadioGroupItem value="used" id="condition-used" className="dark:border-dark-border" />
            <Label htmlFor="condition-used" className="dark:text-gray-200">مستعمل</Label>
          </div>
        </RadioGroup>
      </div>
      
      <Separator className="dark:bg-dark-border" />
      
      {/* Additional filters */}
      <div className="space-y-2">
        <Label className="text-base font-medium dark:text-gray-200">خيارات إضافية</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2 space-x-reverse">
            <Checkbox 
              id="has-image" 
              checked={hasImage}
              onCheckedChange={(checked) => setHasImage(checked as boolean)}
              className="dark:border-dark-border"
            />
            <Label htmlFor="has-image" className="dark:text-gray-200">يحتوي على صور</Label>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <Checkbox 
              id="has-delivery" 
              checked={hasDelivery}
              onCheckedChange={(checked) => setHasDelivery(checked as boolean)}
              className="dark:border-dark-border"
            />
            <Label htmlFor="has-delivery" className="dark:text-gray-200">يوفر توصيل</Label>
          </div>
        </div>
      </div>
      
      <Separator className="dark:bg-dark-border" />
      
      {/* Sort by */}
      <div className="space-y-2">
        <Label className="text-base font-medium dark:text-gray-200">ترتيب حسب</Label>
        <Select
          value={sortBy}
          onValueChange={(value) => setSortBy(value as 'newest' | 'oldest' | 'price_asc' | 'price_desc')}
        >
          <SelectTrigger className="dark:bg-dark-card dark:border-dark-border dark:text-gray-200">
            <SelectValue placeholder="الترتيب" />
          </SelectTrigger>
          <SelectContent className="dark:bg-dark-card dark:border-dark-border">
            <SelectItem value="newest">الأحدث</SelectItem>
            <SelectItem value="oldest">الأقدم</SelectItem>
            <SelectItem value="price_asc">السعر: من الأقل للأعلى</SelectItem>
            <SelectItem value="price_desc">السعر: من الأعلى للأقل</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Reset filters button */}
      <Button 
        variant="outline" 
        className="w-full dark:bg-dark-card dark:border-dark-border dark:text-gray-200 dark:hover:bg-dark-muted"
        onClick={() => {
          setSearchTerm('');
          setPriceRange([0, 100000]);
          setSelectedCity(null);
          setSelectedSubcategory(null);
          setSelectedChildCategory(null);
          setCondition(null);
          setHasImage(false);
          setHasDelivery(false);
          setNearbyOnly(false);
          setSortBy('newest');
          onFilterChange({});
        }}
      >
        إعادة ضبط الفلاتر
      </Button>
    </div>
  );
}
