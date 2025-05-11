
import React, { useState } from 'react';
import { LayoutGrid, ListFilter, LayoutList, Calendar, Check, User, Image, Phone, DollarSign, ArrowDownUp } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { SearchFilters } from '@/types';

interface EnhancedFilterSectionProps {
  onFilterChange: (filters: SearchFilters) => void;
  onLayoutChange: (layout: 'grid' | 'list') => void;
  currentLayout: 'grid' | 'list';
  activeFilters?: SearchFilters;
  itemsPerPage?: number;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
}

export function EnhancedFilterSection({
  onFilterChange,
  onLayoutChange,
  currentLayout,
  activeFilters = {},
  itemsPerPage = 10,
  onItemsPerPageChange
}: EnhancedFilterSectionProps) {
  // Track local filter state
  const [filters, setFilters] = useState<SearchFilters>(activeFilters);
  
  // Handle sort change
  const handleSortChange = (sortValue: string) => {
    const validSortValues = ["newest", "oldest", "price_asc", "price_desc", "popular"];
    const newSortValue = validSortValues.includes(sortValue) 
      ? sortValue as SearchFilters['sort']
      : "newest"; // Default to newest if invalid value
    
    const updatedFilters = { ...filters, sort: newSortValue };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };
  
  // Handle layout change
  const handleLayoutChange = (layout: 'grid' | 'list') => {
    onLayoutChange(layout);
  };
  
  // Handle items per page change
  const handleItemsPerPageChange = (value: string) => {
    const numValue = parseInt(value, 10);
    if (onItemsPerPageChange && !isNaN(numValue)) {
      onItemsPerPageChange(numValue);
    }
  };

  // Handle filter toggle
  const toggleFilter = (key: keyof SearchFilters, value: any) => {
    const updatedFilters = { ...filters };
    
    if (updatedFilters[key] === value) {
      delete updatedFilters[key]; // Remove if toggling off
    } else {
      updatedFilters[key] = value; // Set if toggling on
    }
    
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  // Get active filters count (excluding sort, which is a view preference)
  const getActiveFiltersCount = () => {
    return Object.keys(filters).filter(key => key !== 'sort').length;
  };

  return (
    <div className="w-full">
      {/* Filter header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <div className="flex items-center gap-2">
          <ListFilter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">الفلترة والترتيب</h3>
          {getActiveFiltersCount() > 0 && (
            <span className="bg-brand/10 text-brand text-xs font-semibold px-2 py-0.5 rounded-full dark:bg-brand-light/10 dark:text-brand-light">
              {getActiveFiltersCount()}
            </span>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {/* Sort dropdown */}
          <Select 
            defaultValue={filters.sort as string || "newest"} 
            onValueChange={handleSortChange}
          >
            <SelectTrigger className="w-[130px] h-9 text-sm">
              <SelectValue placeholder="الترتيب حسب" />
            </SelectTrigger>
            <SelectContent className="z-50">
              <SelectItem value="newest">الأحدث</SelectItem>
              <SelectItem value="oldest">الأقدم</SelectItem>
              <SelectItem value="price_asc">السعر: الأقل</SelectItem>
              <SelectItem value="price_desc">السعر: الأعلى</SelectItem>
              <SelectItem value="popular">الأكثر مشاهدة</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Layout Toggle */}
          <ToggleGroup type="single" value={currentLayout} onValueChange={(value) => {
            if (value) handleLayoutChange(value as 'grid' | 'list');
          }} className="border rounded-md h-9">
            <ToggleGroupItem value="list" aria-label="قائمة" className="px-3 data-[state=on]:bg-muted">
              <LayoutList className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="grid" aria-label="شبكة" className="px-3 data-[state=on]:bg-muted">
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          
          {/* Items per page (Desktop) */}
          {onItemsPerPageChange && (
            <div className="hidden md:flex">
              <Select 
                defaultValue={itemsPerPage.toString()} 
                onValueChange={handleItemsPerPageChange}
              >
                <SelectTrigger className="w-[100px] h-9 text-sm">
                  <SelectValue placeholder="عدد العناصر" />
                </SelectTrigger>
                <SelectContent className="z-50">
                  <SelectItem value="10">10 عناصر</SelectItem>
                  <SelectItem value="20">20 عنصر</SelectItem>
                  <SelectItem value="50">50 عنصر</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          {/* Filter dropdown for mobile */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <ListFilter className="h-4 w-4 mr-2" />
                  فلترة
                  {getActiveFiltersCount() > 0 && (
                    <span className="ml-1 w-4 h-4 rounded-full bg-brand text-white text-[10px] flex items-center justify-center dark:bg-brand-light">
                      {getActiveFiltersCount()}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>خيارات التصفية</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuGroup>
                  {/* Today's Ads Filter */}
                  <DropdownMenuItem 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleFilter('today', !filters.today)}
                  >
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>إعلانات اليوم</span>
                    </div>
                    {filters.today && (
                      <Check className="h-4 w-4 text-brand dark:text-brand-light" />
                    )}
                  </DropdownMenuItem>
                  
                  {/* Verified Ads Filter */}
                  <DropdownMenuItem 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleFilter('verified', !filters.verified)}
                  >
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      <span>حسابات موثقة</span>
                    </div>
                    {filters.verified && (
                      <Check className="h-4 w-4 text-brand dark:text-brand-light" />
                    )}
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  {/* With Image Filter */}
                  <DropdownMenuItem 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleFilter('has_image', !filters.has_image)}
                  >
                    <div className="flex items-center">
                      <Image className="h-4 w-4 mr-2" />
                      <span>مع صور فقط</span>
                    </div>
                    {filters.has_image && (
                      <Check className="h-4 w-4 text-brand dark:text-brand-light" />
                    )}
                  </DropdownMenuItem>
                  
                  {/* With Price Filter */}
                  <DropdownMenuItem 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleFilter('has_price', !filters.has_price)}
                  >
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2" />
                      <span>مع سعر فقط</span>
                    </div>
                    {filters.has_price && (
                      <Check className="h-4 w-4 text-brand dark:text-brand-light" />
                    )}
                  </DropdownMenuItem>
                  
                  {/* With Phone Filter */}
                  <DropdownMenuItem 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleFilter('has_phone', !filters.has_phone)}
                  >
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>مع رقم هاتف</span>
                    </div>
                    {filters.has_phone && (
                      <Check className="h-4 w-4 text-brand dark:text-brand-light" />
                    )}
                  </DropdownMenuItem>
                  
                  {/* Negotiable Filter */}
                  <DropdownMenuItem 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleFilter('negotiable', !filters.negotiable)}
                  >
                    <div className="flex items-center">
                      <ArrowDownUp className="h-4 w-4 mr-2" />
                      <span>قابل للتفاوض</span>
                    </div>
                    {filters.negotiable && (
                      <Check className="h-4 w-4 text-brand dark:text-brand-light" />
                    )}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                
                <DropdownMenuSeparator />
                
                {/* Reset Filters */}
                {getActiveFiltersCount() > 0 && (
                  <DropdownMenuItem 
                    className="text-red-500 focus:text-red-500 cursor-pointer"
                    onClick={() => {
                      const sortValue = filters.sort;
                      setFilters(sortValue ? { sort: sortValue } : {});
                      onFilterChange(sortValue ? { sort: sortValue } : {});
                    }}
                  >
                    إعادة ضبط الفلترة
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      {/* Desktop Filter pills */}
      <div className="hidden md:flex flex-wrap gap-2 items-center">
        {/* Today's Ads Filter */}
        <Toggle 
          size="sm"
          pressed={!!filters.today}
          onPressedChange={(pressed) => toggleFilter('today', pressed)}
          className="text-xs font-medium"
          variant="outline"
        >
          <Calendar className="h-3.5 w-3.5 mr-2" />
          إعلانات اليوم
        </Toggle>
        
        {/* Verified Ads Filter */}
        <Toggle 
          size="sm"
          pressed={!!filters.verified}
          onPressedChange={(pressed) => toggleFilter('verified', pressed)}
          className="text-xs font-medium"
          variant="outline"
        >
          <User className="h-3.5 w-3.5 mr-2" />
          حسابات موثقة
        </Toggle>
        
        <Separator orientation="vertical" className="h-6 mx-1" />
        
        {/* With Image Filter */}
        <Toggle 
          size="sm"
          pressed={!!filters.has_image}
          onPressedChange={(pressed) => toggleFilter('has_image', pressed)}
          className="text-xs font-medium"
          variant="outline"
        >
          <Image className="h-3.5 w-3.5 mr-2" />
          مع صور فقط
        </Toggle>
        
        {/* With Price Filter */}
        <Toggle 
          size="sm"
          pressed={!!filters.has_price}
          onPressedChange={(pressed) => toggleFilter('has_price', pressed)}
          className="text-xs font-medium"
          variant="outline"
        >
          <DollarSign className="h-3.5 w-3.5 mr-2" />
          مع سعر فقط
        </Toggle>
        
        {/* With Phone Filter */}
        <Toggle 
          size="sm"
          pressed={!!filters.has_phone}
          onPressedChange={(pressed) => toggleFilter('has_phone', pressed)}
          className="text-xs font-medium"
          variant="outline"
        >
          <Phone className="h-3.5 w-3.5 mr-2" />
          مع رقم هاتف
        </Toggle>
        
        {/* Negotiable Filter */}
        <Toggle 
          size="sm"
          pressed={!!filters.negotiable}
          onPressedChange={(pressed) => toggleFilter('negotiable', pressed)}
          className="text-xs font-medium"
          variant="outline"
        >
          <ArrowDownUp className="h-3.5 w-3.5 mr-2" />
          قابل للتفاوض
        </Toggle>
        
        {/* Reset Filters */}
        {getActiveFiltersCount() > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={() => {
              const sortValue = filters.sort;
              setFilters(sortValue ? { sort: sortValue } : {});
              onFilterChange(sortValue ? { sort: sortValue } : {});
            }}
          >
            إعادة ضبط
          </Button>
        )}
      </div>
    </div>
  );
}
