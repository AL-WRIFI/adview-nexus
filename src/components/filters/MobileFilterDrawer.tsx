import React, { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';
import { CategorySelect } from './category-select';
import { PriceRange } from './price-range';
import { ListingTypeSelect } from './listing-type-select';
import { ConditionSelect } from './condition-select';
import { CitySelect } from './city-select';
import { SearchFilters } from '@/types';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

interface MobileFilterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentFilters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
}

export function MobileFilterDrawer({ 
  open, 
  onOpenChange, 
  currentFilters,
  onFilterChange 
}: MobileFilterDrawerProps) {
  const [localFilters, setLocalFilters] = useState<SearchFilters>(currentFilters);

  useEffect(() => {
    setLocalFilters(currentFilters);
  }, [currentFilters]);

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
    onOpenChange(false);
  };

  const handleResetFilters = () => {
    setLocalFilters({});
  };
  
  const handleCategoryChange = (categoryId: number | undefined) => {
    setLocalFilters(prev => ({
      ...prev,
      category_id: categoryId,
      subcategory_id: undefined,
      child_category_id: undefined,
    }));
  };
  
  const handleSubCategoryChange = (subCategoryId: number | undefined) => {
    setLocalFilters(prev => ({
      ...prev,
      subcategory_id: subCategoryId,
      child_category_id: undefined,
    }));
  };
  
  const handleChildCategoryChange = (childCategoryId: number | undefined) => {
    setLocalFilters(prev => ({
      ...prev,
      child_category_id: childCategoryId,
    }));
  };

  const handlePriceRangeChange = (minPrice: number | undefined, maxPrice: number | undefined) => {
    setLocalFilters(prev => ({
      ...prev,
      min_price: minPrice,
      max_price: maxPrice,
    }));
  };

  const handleListingTypeChange = (listingType: SearchFilters['listing_type']) => {
    setLocalFilters(prev => ({
      ...prev,
      listing_type: listingType,
    }));
  };

  const handleConditionChange = (condition: SearchFilters['condition']) => {
    setLocalFilters(prev => ({
      ...prev,
      condition: condition,
    }));
  };

  const handleCityChange = (cityId: number | undefined) => {
    setLocalFilters(prev => ({
      ...prev,
      city_id: cityId,
    }));
  };
  
  const handleSortChange = (value: string) => {
    const sortValue = value as 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'popular' | 'created_at' | 'updated_at';
    setLocalFilters(prev => ({
      ...prev,
      sort: sortValue,
      sort_by: sortValue // Legacy support
    }));
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Open filters">
          <Filter className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="pr-0 sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>تصفية النتائج</SheetTitle>
        </SheetHeader>
        <div className="py-4 flex flex-col gap-4">
          <CategorySelect
            onCategoryChange={handleCategoryChange}
            onSubCategoryChange={handleSubCategoryChange}
            onChildCategoryChange={handleChildCategoryChange}
            selectedCategory={localFilters.category_id}
            selectedSubCategory={localFilters.subcategory_id}
            selectedChildCategory={localFilters.child_category_id}
          />
          <PriceRange
            onPriceRangeChange={handlePriceRangeChange}
            minPrice={localFilters.min_price}
            maxPrice={localFilters.max_price}
          />
          <ListingTypeSelect
            onListingTypeChange={handleListingTypeChange}
            selectedListingType={localFilters.listing_type}
          />
          <ConditionSelect
            onConditionChange={handleConditionChange}
            selectedCondition={localFilters.condition}
          />
          <CitySelect
            onCityChange={handleCityChange}
            selectedCity={localFilters.city_id}
          />
          
          <Select onValueChange={handleSortChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="الترتيب" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">الأحدث</SelectItem>
              <SelectItem value="oldest">الأقدم</SelectItem>
              {/* Add other sorting options as needed */}
            </SelectContent>
          </Select>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="outline" size="sm" className="w-24" onClick={handleResetFilters}>
            إعادة تعيين
          </Button>
          <Button type="button" size="sm" className="w-24" onClick={handleApplyFilters}>
            تطبيق
          </Button>
        </div>
        <SheetClose asChild>
          <Button
            type="button"
            variant="ghost"
            className="absolute top-2 right-2 h-10 w-10 rounded-sm"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </Button>
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
}
