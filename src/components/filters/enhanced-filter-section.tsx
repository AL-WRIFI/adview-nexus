import { useState } from 'react';
import { 
  Filter, SlidersHorizontal, Grid2X2, List, ArrowDownAZ, 
  CalendarDays, MapPin, Tag, Clock, Bookmark, ArrowUpDown
} from 'lucide-react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { SearchFilters } from '@/types';
import { cn } from '@/lib/utils';

interface EnhancedFilterSectionProps {
  onFilterChange: (filters: SearchFilters) => void;
  onLayoutChange: (layout: 'grid' | 'list') => void;
  currentLayout: 'grid' | 'list';
  className?: string;
  activeFilters?: SearchFilters;
  onItemsPerPageChange?: (value: number) => void;
  itemsPerPage?: number;
}

export function EnhancedFilterSection({
  onFilterChange,
  onLayoutChange,
  currentLayout,
  className,
  activeFilters = {},
  onItemsPerPageChange,
  itemsPerPage = 10
}: EnhancedFilterSectionProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [sortOption, setSortOption] = useState<string>('newest');
  const [locationRadius, setLocationRadius] = useState<number>(50);

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
    onFilterChange({
      ...activeFilters,
      min_price: value[0],
      max_price: value[1]
    });
  };

  const handleSortChange = (value: string) => {
    setSortOption(value);
    onFilterChange({
      ...activeFilters,
      sort: value
    });
  };

  const handleLocationRadiusChange = (value: number[]) => {
    const radius = value[0];
    setLocationRadius(radius);
    onFilterChange({
      ...activeFilters,
      radius
    });
  };

  const handleFilterToggle = (key: string, value: any) => {
    if (activeFilters[key] === value) {
      // If the filter is already active, remove it
      const newFilters = { ...activeFilters };
      delete newFilters[key];
      onFilterChange(newFilters);
    } else {
      // Otherwise add/update it
      onFilterChange({
        ...activeFilters,
        [key]: value
      });
    }
  };

  const countActiveFilters = () => {
    return Object.keys(activeFilters).length;
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  return (
    <div className={cn("flex flex-wrap gap-2 md:gap-3 items-center justify-between w-full", className)}>
      <div className="flex flex-wrap items-center gap-2">
        {/* Main Filters Button */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-2 bg-white border-blue-100 text-gray-700 hover:bg-blue-50 shadow-sm"
            >
              <Filter className="h-4 w-4 text-brand" />
              <span>تصفية</span>
              {countActiveFilters() > 0 && (
                <Badge variant="default" className="h-5 w-5 p-0 flex items-center justify-center rounded-full">
                  {countActiveFilters()}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="start">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">خيارات التصفية</h3>
                {countActiveFilters() > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    className="text-xs text-gray-500 hover:text-gray-800"
                  >
                    مسح الكل
                  </Button>
                )}
              </div>
              
              <Separator />
              
              {/* Price Range Filter */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">نطاق السعر</label>
                  <div className="text-xs text-muted-foreground">
                    {priceRange[0]} - {priceRange[1]} ل.س
                  </div>
                </div>
                <Slider
                  defaultValue={[priceRange[0], priceRange[1]]}
                  max={100000}
                  step={1000}
                  onValueChange={handlePriceRangeChange}
                  className="my-4"
                />
              </div>
              
              <Separator />
              
              {/* Nearby Filter */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-brand" />
                    <label className="text-sm font-medium">إعلانات قريبة</label>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {locationRadius} كم
                  </span>
                </div>
                <Slider
                  defaultValue={[locationRadius]}
                  max={100}
                  step={5}
                  onValueChange={handleLocationRadiusChange}
                />
              </div>
              
              <Separator />
              
              {/* Featured Ads Filter */}
              <div>
                <Button
                  variant={activeFilters.featured ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "mr-2 mb-2", 
                    activeFilters.featured ? "bg-brand text-white" : "bg-white"
                  )}
                  onClick={() => handleFilterToggle('featured', !activeFilters.featured)}
                >
                  <Tag className="mr-2 h-4 w-4" />
                  إعلانات مميزة
                </Button>
                
                <Button
                  variant={activeFilters.today ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "mr-2 mb-2",
                    activeFilters.today ? "bg-brand text-white" : "bg-white"
                  )}
                  onClick={() => handleFilterToggle('today', !activeFilters.today)}
                >
                  <CalendarDays className="mr-2 h-4 w-4" />
                  إعلانات اليوم
                </Button>
                
                <Button
                  variant={activeFilters.verified ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "mr-2 mb-2",
                    activeFilters.verified ? "bg-brand text-white" : "bg-white"
                  )}
                  onClick={() => handleFilterToggle('verified', !activeFilters.verified)}
                >
                  <Bookmark className="mr-2 h-4 w-4" />
                  مُوثَّق
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      
        {/* Sort Options */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-2 bg-white border-blue-100 text-gray-700 hover:bg-blue-50 shadow-sm"
            >
              <ArrowUpDown className="h-4 w-4 text-brand" />
              <span>الترتيب</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56" align="start">
            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start font-normal"
                onClick={() => handleSortChange('newest')}
                data-active={sortOption === 'newest'}
              >
                <Clock className="mr-2 h-4 w-4" />
                الأحدث أولاً
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start font-normal"
                onClick={() => handleSortChange('oldest')}
                data-active={sortOption === 'oldest'}
              >
                <Clock className="mr-2 h-4 w-4" />
                الأقدم أولاً
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start font-normal"
                onClick={() => handleSortChange('price_high')}
                data-active={sortOption === 'price_high'}
              >
                <ArrowDownAZ className="mr-2 h-4 w-4" />
                السعر: من الأعلى
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start font-normal"
                onClick={() => handleSortChange('price_low')}
                data-active={sortOption === 'price_low'}
              >
                <ArrowDownAZ className="mr-2 h-4 w-4" />
                السعر: من الأقل
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Advanced Filters */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-2 bg-white border-blue-100 text-gray-700 hover:bg-blue-50 shadow-sm"
            >
              <SlidersHorizontal className="h-4 w-4 text-brand" />
              <span>خيارات متقدمة</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72" align="start">
            <div className="space-y-4">
              <h3 className="font-medium mb-2">خيارات متقدمة</h3>
              
              <div className="grid grid-cols-2 gap-2">
                {/* More filter options */}
                <Button
                  variant={activeFilters.has_image ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    activeFilters.has_image ? "bg-brand text-white" : "bg-white"
                  )}
                  onClick={() => handleFilterToggle('has_image', !activeFilters.has_image)}
                >
                  مع صور فقط
                </Button>
                
                <Button
                  variant={activeFilters.has_price ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    activeFilters.has_price ? "bg-brand text-white" : "bg-white"
                  )}
                  onClick={() => handleFilterToggle('has_price', !activeFilters.has_price)}
                >
                  مع سعر فقط
                </Button>
                
                <Button
                  variant={activeFilters.has_phone ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    activeFilters.has_phone ? "bg-brand text-white" : "bg-white"
                  )}
                  onClick={() => handleFilterToggle('has_phone', !activeFilters.has_phone)}
                >
                  مع رقم هاتف
                </Button>
                
                <Button
                  variant={activeFilters.negotiable ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    activeFilters.negotiable ? "bg-brand text-white" : "bg-white"
                  )}
                  onClick={() => handleFilterToggle('negotiable', !activeFilters.negotiable)}
                >
                  قابل للتفاوض
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* View toggles and items per page */}
      <div className="flex items-center gap-1">
        {onItemsPerPageChange && (
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                className="h-9 w-9 rounded-r-none border-blue-100 bg-white hover:bg-blue-50 shadow-sm"
              >
                {itemsPerPage}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-16 p-0" align="end">
              <div className="flex flex-col">
                {[5, 10, 20, 50].map(num => (
                  <Button
                    key={num}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "rounded-none",
                      itemsPerPage === num ? "bg-blue-50 text-brand" : ""
                    )}
                    onClick={() => onItemsPerPageChange(num)}
                  >
                    {num}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
        
        <div className="flex border rounded-md overflow-hidden shadow-sm border-blue-100">
          <Button 
            variant={currentLayout === 'grid' ? "default" : "ghost"} 
            size="icon"
            onClick={() => onLayoutChange('grid')}
            className={cn(
              "h-9 w-9 rounded-none",
              currentLayout === 'grid' ? "bg-brand text-white" : "bg-white hover:bg-blue-50"
            )}
            aria-label="Grid view"
            title="عرض شبكي"
          >
            <Grid2X2 className="h-4 w-4" />
          </Button>
          <Button 
            variant={currentLayout === 'list' ? "default" : "ghost"}
            size="icon" 
            onClick={() => onLayoutChange('list')}
            className={cn(
              "h-9 w-9 rounded-none",
              currentLayout === 'list' ? "bg-brand text-white" : "bg-white hover:bg-blue-50"
            )}
            aria-label="List view"
            title="عرض قائمة"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
