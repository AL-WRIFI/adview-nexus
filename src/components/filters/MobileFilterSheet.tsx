
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, SlidersHorizontal } from 'lucide-react';
import { SearchFilters } from '@/types';
import { useCategories, useBrands, useStates, useCities } from '@/hooks/use-api';

interface MobileFilterSheetProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function MobileFilterSheet({
  filters,
  onFiltersChange,
  open,
  onOpenChange
}: MobileFilterSheetProps) {
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);
  
  const { data: categories = [] } = useCategories();
  const { data: brands = [] } = useBrands();
  const { data: states = [] } = useStates();
  const { data: cities = [] } = useCities(localFilters.state_id);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    onOpenChange?.(false);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      search: localFilters.search || '',
      page: 1
    };
    setLocalFilters(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (localFilters.category_id) count++;
    if (localFilters.sub_category_id) count++;
    if (localFilters.brand_id) count++;
    if (localFilters.state_id) count++;
    if (localFilters.city_id) count++;
    if (localFilters.min_price) count++;
    if (localFilters.max_price) count++;
    if (localFilters.product_condition) count++;
    if (localFilters.listing_type) count++;
    return count;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative">
          <SlidersHorizontal className="h-4 w-4 ml-2" />
          فلترة
          {getActiveFiltersCount() > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {getActiveFiltersCount()}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent side="bottom" className="h-[90vh] rounded-t-xl">
        <SheetHeader className="text-right">
          <SheetTitle>تصفية النتائج</SheetTitle>
          <SheetDescription>
            استخدم المرشحات أدناه لتضييق نطاق البحث
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-6 space-y-6">
          {/* Search */}
          <div className="space-y-2">
            <Label>البحث</Label>
            <Input
              placeholder="ابحث عن منتجات، خدمات..."
              value={localFilters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>التصنيف</Label>
            <Select
              value={localFilters.category_id?.toString() || ''}
              onValueChange={(value) => handleFilterChange('category_id', value ? parseInt(value) : undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر التصنيف" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">جميع التصنيفات</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Brand */}
          <div className="space-y-2">
            <Label>العلامة التجارية</Label>
            <Select
              value={localFilters.brand_id?.toString() || ''}
              onValueChange={(value) => handleFilterChange('brand_id', value ? parseInt(value) : undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر العلامة التجارية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">جميع العلامات التجارية</SelectItem>
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id.toString()}>
                    {brand.name || brand.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>المنطقة</Label>
              <Select
                value={localFilters.state_id?.toString() || ''}
                onValueChange={(value) => {
                  handleFilterChange('state_id', value ? parseInt(value) : undefined);
                  handleFilterChange('city_id', undefined); // Reset city when state changes
                }}
              >
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
            </div>

            <div className="space-y-2">
              <Label>المدينة</Label>
              <Select
                value={localFilters.city_id?.toString() || ''}
                onValueChange={(value) => handleFilterChange('city_id', value ? parseInt(value) : undefined)}
                disabled={!localFilters.state_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر المدينة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">جميع المدن</SelectItem>
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={city.id.toString()}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-4">
            <Label>نطاق السعر (ريال)</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm">الحد الأدنى</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={localFilters.min_price || ''}
                  onChange={(e) => handleFilterChange('min_price', e.target.value ? parseInt(e.target.value) : undefined)}
                />
              </div>
              <div>
                <Label className="text-sm">الحد الأقصى</Label>
                <Input
                  type="number"
                  placeholder="بلا حدود"
                  value={localFilters.max_price || ''}
                  onChange={(e) => handleFilterChange('max_price', e.target.value ? parseInt(e.target.value) : undefined)}
                />
              </div>
            </div>
          </div>

          {/* Condition */}
          <div className="space-y-2">
            <Label>حالة المنتج</Label>
            <Select
              value={localFilters.product_condition || ''}
              onValueChange={(value) => handleFilterChange('product_condition', value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">جميع الحالات</SelectItem>
                <SelectItem value="new">جديد</SelectItem>
                <SelectItem value="used">مستعمل</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Listing Type */}
          <div className="space-y-2">
            <Label>نوع الإعلان</Label>
            <Select
              value={localFilters.listing_type || ''}
              onValueChange={(value) => handleFilterChange('listing_type', value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر النوع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">جميع الأنواع</SelectItem>
                <SelectItem value="sell">للبيع</SelectItem>
                <SelectItem value="rent">للإيجار</SelectItem>
                <SelectItem value="job">وظائف</SelectItem>
                <SelectItem value="service">خدمات</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <SheetFooter className="flex gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleClearFilters} className="flex-1">
            مسح الفلاتر
          </Button>
          <Button onClick={handleApplyFilters} className="flex-1">
            تطبيق ({getActiveFiltersCount()})
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
