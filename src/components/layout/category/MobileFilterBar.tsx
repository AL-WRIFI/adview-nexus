
import React, { useState } from 'react';
import { MapPin, Filter, SortAscending, ChevronDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { SearchFilters } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { useState as useHookState } from '@/hooks/use-api';

interface MobileFilterBarProps {
  onFilterChange: (filters: SearchFilters) => void;
  onNearbyClick: () => void;
  selectedRegion?: string;
  isLoading?: boolean;
  currentFilters?: SearchFilters;
}

export function MobileFilterBar({
  onFilterChange,
  onNearbyClick,
  selectedRegion = 'كل المناطق',
  isLoading = false,
  currentFilters = {}
}: MobileFilterBarProps) {
  const [open, setOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  
  // Filter states
  const [minPrice, setMinPrice] = useState(currentFilters.price_min || 0);
  const [maxPrice, setMaxPrice] = useState(currentFilters.price_max || 100000);
  const [condition, setCondition] = useState<string>(currentFilters.condition || '');
  const [listingType, setListingType] = useState<string>(currentFilters.listing_type || '');
  const [priceRange, setPriceRange] = useState<[number, number]>([
    currentFilters.price_min || 0, 
    currentFilters.price_max || 100000
  ]);
  const [sort, setSort] = useState(currentFilters.sort || 'newest');

  const handleFilterApply = () => {
    onFilterChange({
      ...currentFilters,
      price_min: priceRange[0],
      price_max: priceRange[1],
      condition: condition as any,
      listing_type: listingType as any,
    });
    setOpen(false);
  };

  const handleSortChange = (value: string) => {
    setSort(value);
    onFilterChange({
      ...currentFilters,
      sort: value as any
    });
    setSortOpen(false);
  };

  const handleReset = () => {
    setPriceRange([0, 100000]);
    setCondition('');
    setListingType('');
    onFilterChange({
      sort: currentFilters.sort,
      category_id: currentFilters.category_id,
      sub_category_id: currentFilters.sub_category_id,
      query: currentFilters.query
    });
    setOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        <Skeleton className="h-9 w-24 rounded-md" />
        <Skeleton className="h-9 flex-1 rounded-md" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-1 flex-shrink-0 bg-white dark:bg-dark-card dark:border-dark-border"
        onClick={onNearbyClick}
      >
        <MapPin className="w-4 h-4 text-brand" />
        <span className="text-sm">القريب</span>
      </Button>
      
      <Drawer open={sortOpen} onOpenChange={setSortOpen}>
        <DrawerTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1 flex-shrink-0 bg-white dark:bg-dark-card dark:border-dark-border"
          >
            <SortAscending className="w-4 h-4 text-brand" />
            <span className="text-sm">الترتيب</span>
            <ChevronDown className="w-3 h-3 mr-1" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[85vh] overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle>ترتيب النتائج</DrawerTitle>
            <DrawerDescription>اختر طريقة ترتيب الإعلانات</DrawerDescription>
          </DrawerHeader>
          <div className="grid gap-3 px-4">
            {[
              { id: 'newest', label: 'الأحدث أولاً' },
              { id: 'oldest', label: 'الأقدم أولاً' },
              { id: 'price_asc', label: 'السعر: من الأقل للأعلى' },
              { id: 'price_desc', label: 'السعر: من الأعلى للأقل' },
              { id: 'popular', label: 'الأكثر مشاهدة' }
            ].map((sortOption) => (
              <Button 
                key={sortOption.id}
                variant={sort === sortOption.id ? "default" : "outline"}
                className="justify-start"
                onClick={() => handleSortChange(sortOption.id)}
              >
                {sortOption.label}
              </Button>
            ))}
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">إلغاء</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1 flex-shrink-0 bg-white dark:bg-dark-card dark:border-dark-border flex-1"
          >
            <Filter className="w-4 h-4 text-brand" />
            <span className="text-sm">تصفية</span>
          </Button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[85vh] overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle>تصفية النتائج</DrawerTitle>
            <DrawerDescription>اختر خيارات التصفية المناسبة</DrawerDescription>
          </DrawerHeader>
          <div className="space-y-6 px-4">
            <div className="space-y-3">
              <h3 className="text-sm font-medium">السعر</h3>
              <div className="flex justify-between items-center gap-2">
                <Input 
                  type="number" 
                  placeholder="من" 
                  value={priceRange[0]}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value) && value >= 0) {
                      setPriceRange([value, priceRange[1]]);
                    }
                  }}
                  className="text-left ltr w-full"
                />
                <span>-</span>
                <Input 
                  type="number" 
                  placeholder="إلى" 
                  value={priceRange[1]}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value) && value >= priceRange[0]) {
                      setPriceRange([priceRange[0], value]);
                    }
                  }}
                  className="text-left ltr w-full"
                />
              </div>
              <Slider 
                defaultValue={[minPrice, maxPrice]} 
                min={0} 
                max={100000}
                step={500}
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number, number])}
                className="mt-6"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0 ريال</span>
                <span>100,000 ريال</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-sm font-medium">الحالة</h3>
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
            
            <div className="space-y-3">
              <h3 className="text-sm font-medium">نوع الإعلان</h3>
              <Select value={listingType} onValueChange={setListingType}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع الإعلان" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">الكل</SelectItem>
                  <SelectItem value="sell">بيع</SelectItem>
                  <SelectItem value="buy">شراء</SelectItem>
                  <SelectItem value="exchange">تبادل</SelectItem>
                  <SelectItem value="service">خدمة</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DrawerFooter className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={handleReset}>إعادة ضبط</Button>
            <Button onClick={handleFilterApply}>تطبيق</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="ابحث عن منتج..." 
          className="h-9 px-9 bg-white dark:bg-dark-card dark:border-dark-border"
          value={currentFilters.query || ''}
          onChange={(e) => {
            onFilterChange({
              ...currentFilters,
              query: e.target.value
            });
          }}
        />
      </div>
    </div>
  );
}
