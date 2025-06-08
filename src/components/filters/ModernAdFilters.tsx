
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Filter, X, Grid, List } from 'lucide-react';
import { useCategories, useBrands, useStates, useAllCities } from '@/hooks/use-api';
import { SearchFilters } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface ModernAdFiltersProps {
  onFilterChange: (filters: SearchFilters) => void;
  currentFilters?: SearchFilters;
}

export function ModernAdFilters({ onFilterChange, currentFilters = {} }: ModernAdFiltersProps) {
  const isMobile = useIsMobile();
  const [localFilters, setLocalFilters] = useState<SearchFilters>(currentFilters);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  // View mode states for categories and brands
  const [categoryViewMode, setCategoryViewMode] = useState<'list' | 'grid'>('list');
  const [brandViewMode, setBrandViewMode] = useState<'list' | 'grid'>('list');

  const { data: categories = [] } = useCategories();
  const { data: brands = [] } = useBrands();
  const { data: states = [] } = useStates();
  const { data: cities = [] } = useAllCities();

  const handleFilterUpdate = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setLocalFilters({});
    onFilterChange({});
  };

  const getActiveFilterCount = () => {
    return Object.values(localFilters).filter(value => 
      value !== undefined && value !== null && value !== ''
    ).length;
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <Card className="bg-background border-border">
        <CardHeader>
          <CardTitle className="text-lg">نطاق السعر</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="min-price">الحد الأدنى</Label>
              <Input
                id="min-price"
                type="number"
                placeholder="0"
                value={localFilters.price_min || ''}
                onChange={(e) => handleFilterUpdate('price_min', e.target.value ? Number(e.target.value) : undefined)}
                className="bg-background border-border"
              />
            </div>
            <div>
              <Label htmlFor="max-price">الحد الأعلى</Label>
              <Input
                id="max-price"
                type="number"
                placeholder="بدون حد أقصى"
                value={localFilters.price_max || ''}
                onChange={(e) => handleFilterUpdate('price_max', e.target.value ? Number(e.target.value) : undefined)}
                className="bg-background border-border"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card className="bg-background border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">التصنيفات</CardTitle>
            <div className="flex items-center gap-2">
              <Label htmlFor="category-view" className="text-sm">العرض:</Label>
              <Switch
                id="category-view"
                checked={categoryViewMode === 'grid'}
                onCheckedChange={(checked) => setCategoryViewMode(checked ? 'grid' : 'list')}
              />
              <span className="text-sm text-muted-foreground">
                {categoryViewMode === 'grid' ? 'صور' : 'قائمة'}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {categoryViewMode === 'list' ? (
            <Select
              value={localFilters.category_id?.toString() || 'all'}
              onValueChange={(value) => handleFilterUpdate('category_id', value === 'all' ? undefined : Number(value))}
            >
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="اختر التصنيف" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل التصنيفات</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {categories.slice(0, 8).map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleFilterUpdate('category_id', 
                    localFilters.category_id === category.id ? undefined : category.id
                  )}
                  className={cn(
                    "p-3 rounded-lg border text-center transition-all",
                    localFilters.category_id === category.id
                      ? "border-brand bg-brand/10 text-brand"
                      : "border-border bg-background hover:border-brand/50"
                  )}
                >
                  <div className="text-xs font-medium">{category.name}</div>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Brands */}
      <Card className="bg-background border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">العلامات التجارية</CardTitle>
            <div className="flex items-center gap-2">
              <Label htmlFor="brand-view" className="text-sm">العرض:</Label>
              <Switch
                id="brand-view"
                checked={brandViewMode === 'grid'}
                onCheckedChange={(checked) => setBrandViewMode(checked ? 'grid' : 'list')}
              />
              <span className="text-sm text-muted-foreground">
                {brandViewMode === 'grid' ? 'صور' : 'قائمة'}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {brandViewMode === 'list' ? (
            <Select
              value={localFilters.brand_id?.toString() || 'all'}
              onValueChange={(value) => handleFilterUpdate('brand_id', value === 'all' ? undefined : Number(value))}
            >
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="اختر العلامة التجارية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل العلامات التجارية</SelectItem>
                {brands.map((brand: any) => (
                  <SelectItem key={brand.id} value={brand.id.toString()}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {brands.slice(0, 8).map((brand: any) => (
                <button
                  key={brand.id}
                  onClick={() => handleFilterUpdate('brand_id', 
                    localFilters.brand_id === brand.id ? undefined : brand.id
                  )}
                  className={cn(
                    "p-3 rounded-lg border text-center transition-all",
                    localFilters.brand_id === brand.id
                      ? "border-brand bg-brand/10 text-brand"
                      : "border-border bg-background hover:border-brand/50"
                  )}
                >
                  <div className="text-xs font-medium">{brand.name}</div>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Location */}
      <Card className="bg-background border-border">
        <CardHeader>
          <CardTitle className="text-lg">الموقع</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="state">المحافظة</Label>
            <Select
              value={localFilters.state_id?.toString() || 'all'}
              onValueChange={(value) => handleFilterUpdate('state_id', value === 'all' ? undefined : Number(value))}
            >
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="اختر المحافظة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل المحافظات</SelectItem>
                {states.map((state: any) => (
                  <SelectItem key={state.id} value={state.id.toString()}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="city">المدينة</Label>
            <Select
              value={localFilters.city_id?.toString() || 'all'}
              onValueChange={(value) => handleFilterUpdate('city_id', value === 'all' ? undefined : Number(value))}
            >
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="اختر المدينة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل المدن</SelectItem>
                {cities.map((city: any) => (
                  <SelectItem key={city.id} value={city.id.toString()}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Condition */}
      <Card className="bg-background border-border">
        <CardHeader>
          <CardTitle className="text-lg">حالة المنتج</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={localFilters.product_condition || 'all'}
            onValueChange={(value) => handleFilterUpdate('product_condition', value === 'all' ? undefined : value)}
          >
            <SelectTrigger className="bg-background border-border">
              <SelectValue placeholder="اختر الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الحالات</SelectItem>
              <SelectItem value="new">جديد</SelectItem>
              <SelectItem value="used">مستعمل</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Listing Type */}
      <Card className="bg-background border-border">
        <CardHeader>
          <CardTitle className="text-lg">نوع الإعلان</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={localFilters.listing_type || 'all'}
            onValueChange={(value) => handleFilterUpdate('listing_type', value === 'all' ? undefined : value)}
          >
            <SelectTrigger className="bg-background border-border">
              <SelectValue placeholder="اختر النوع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الأنواع</SelectItem>
              <SelectItem value="sell">للبيع</SelectItem>
              <SelectItem value="rent">للإيجار</SelectItem>
              <SelectItem value="job">وظائف</SelectItem>
              <SelectItem value="service">خدمات</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Clear Filters */}
      {getActiveFilterCount() > 0 && (
        <Button 
          variant="outline" 
          onClick={clearFilters}
          className="w-full border-border bg-background hover:bg-accent"
        >
          <X className="h-4 w-4 mr-2" />
          مسح كل الفلاتر ({getActiveFilterCount()})
        </Button>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="relative border-border bg-background">
            <Filter className="h-4 w-4 mr-2" />
            <span>الفلاتر</span>
            {getActiveFilterCount() > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {getActiveFilterCount()}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent 
          side="right" 
          className="w-full sm:w-96 bg-background border-border overflow-y-auto"
        >
          <SheetHeader>
            <SheetTitle>تصفية النتائج</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <FilterContent />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">تصفية النتائج</h2>
        {getActiveFilterCount() > 0 && (
          <Badge variant="secondary">
            {getActiveFilterCount()} فلتر نشط
          </Badge>
        )}
      </div>
      <FilterContent />
    </div>
  );
}
