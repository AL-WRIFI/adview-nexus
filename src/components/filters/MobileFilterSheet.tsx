
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, X } from 'lucide-react';
import { SearchFilters } from '@/types';
import { useCategories, useStates, useAllCities, useBrands } from '@/hooks/use-api';

interface MobileFilterSheetProps {
  onFilterChange: (filters: SearchFilters) => void;
  currentFilters: SearchFilters;
}

export function MobileFilterSheet({ onFilterChange, currentFilters }: MobileFilterSheetProps) {
  const [open, setOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<SearchFilters>(currentFilters);

  const { data: categories = [] } = useCategories();
  const { data: states = [] } = useStates();
  const { data: cities = [] } = useAllCities();
  const { data: brands = [] } = useBrands();

  const applyFilters = () => {
    onFilterChange(localFilters);
    setOpen(false);
  };

  const resetFilters = () => {
    setLocalFilters({});
    onFilterChange({});
    setOpen(false);
  };

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          الفلاتر
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="bottom" 
        className="h-[85vh] rounded-t-xl p-0"
      >
        <div className="flex flex-col h-full">
          <SheetHeader className="p-6 pb-4 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-xl font-bold">الفلاتر</SheetTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Category Filter */}
            <div className="space-y-2">
              <Label>التصنيف</Label>
              <Select
                value={localFilters.category_id?.toString() || ''}
                onValueChange={(value) => updateFilter('category_id', value ? parseInt(value) : undefined)}
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

            {/* Location Filters */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>المحافظة</Label>
                <Select
                  value={localFilters.state_id?.toString() || ''}
                  onValueChange={(value) => updateFilter('state_id', value ? parseInt(value) : undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المحافظة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">جميع المحافظات</SelectItem>
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
                  onValueChange={(value) => updateFilter('city_id', value ? parseInt(value) : undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المدينة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">جميع المدن</SelectItem>
                    {cities
                      .filter(city => !localFilters.state_id || city.state_id === localFilters.state_id)
                      .map((city) => (
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
              <Label>نطاق السعر</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-sm">الحد الأدنى</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={localFilters.min_price || ''}
                    onChange={(e) => updateFilter('min_price', e.target.value ? parseInt(e.target.value) : undefined)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">الحد الأعلى</Label>
                  <Input
                    type="number"
                    placeholder="بلا حدود"
                    value={localFilters.max_price || ''}
                    onChange={(e) => updateFilter('max_price', e.target.value ? parseInt(e.target.value) : undefined)}
                  />
                </div>
              </div>
            </div>

            {/* Product Condition */}
            <div className="space-y-2">
              <Label>حالة المنتج</Label>
              <Select
                value={localFilters.product_condition || ''}
                onValueChange={(value) => updateFilter('product_condition', value || undefined)}
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
                onValueChange={(value) => updateFilter('listing_type', value || undefined)}
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

            {/* Brand Filter */}
            <div className="space-y-2">
              <Label>العلامة التجارية</Label>
              <Select
                value={localFilters.brand_id?.toString() || ''}
                onValueChange={(value) => updateFilter('brand_id', value ? parseInt(value) : undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر العلامة التجارية" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">جميع العلامات التجارية</SelectItem>
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id.toString()}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div className="space-y-2">
              <Label>ترتيب حسب</Label>
              <Select
                value={localFilters.sort_by || 'newest'}
                onValueChange={(value) => updateFilter('sort_by', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">الأحدث</SelectItem>
                  <SelectItem value="oldest">الأقدم</SelectItem>
                  <SelectItem value="price_asc">السعر: من الأقل للأعلى</SelectItem>
                  <SelectItem value="price_desc">السعر: من الأعلى للأقل</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t p-6 space-y-3">
            <Button onClick={applyFilters} className="w-full">
              تطبيق الفلاتر
            </Button>
            <Button onClick={resetFilters} variant="outline" className="w-full">
              إعادة تعيين الفلاتر
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
