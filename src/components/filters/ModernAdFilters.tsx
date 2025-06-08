import React, { useState } from 'react';
import { Filter, Search, MapPin, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCategories, useBrands, useStates, useAllCities } from '@/hooks/use-api';
import { SearchFilters } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';

interface ModernAdFiltersProps {
  onFilterChange: (filters: SearchFilters) => void;
  currentFilters?: SearchFilters;
}

export function ModernAdFilters({ onFilterChange, currentFilters = {} }: ModernAdFiltersProps) {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<SearchFilters>(currentFilters);
  const [priceRange, setPriceRange] = useState([
    currentFilters.price_min || 0, 
    currentFilters.price_max || 100000
  ]);
  
  const { data: categories } = useCategories();
  const { data: brands } = useBrands();
  const { data: states } = useStates();
  const { data: cities } = useAllCities();

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const applyFilters = () => {
    onFilterChange({
      ...localFilters,
      price_min: priceRange[0],
      price_max: priceRange[1],
    });
    if (isMobile) setIsOpen(false);
  };

  const clearFilters = () => {
    const emptyFilters = {};
    setLocalFilters(emptyFilters);
    setPriceRange([0, 100000]);
    onFilterChange(emptyFilters);
    if (isMobile) setIsOpen(false);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (localFilters.category_id) count++;
    if (localFilters.sub_category_id) count++;
    if (localFilters.brand_id) count++;
    if (localFilters.state_id) count++;
    if (localFilters.city_id) count++;
    if (localFilters.condition) count++;
    if (localFilters.listing_type) count++;
    if (localFilters.is_negotiable) count++;
    if (priceRange[0] > 0 || priceRange[1] < 100000) count++;
    return count;
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="البحث في الإعلانات..."
          value={localFilters.search || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="pr-10 bg-background border-border focus:bg-background focus:border-brand"
        />
      </div>

      {/* Quick Filters */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-foreground">فلاتر سريعة</Label>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={localFilters.listing_type === 'sell' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFilterChange('listing_type', 
              localFilters.listing_type === 'sell' ? undefined : 'sell')}
            className="text-xs"
          >
            للبيع
          </Button>
          <Button
            variant={localFilters.listing_type === 'rent' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFilterChange('listing_type', 
              localFilters.listing_type === 'rent' ? undefined : 'rent')}
            className="text-xs"
          >
            للإيجار
          </Button>
          <Button
            variant={localFilters.condition === 'new' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFilterChange('condition', 
              localFilters.condition === 'new' ? undefined : 'new')}
            className="text-xs"
          >
            جديد
          </Button>
          <Button
            variant={localFilters.condition === 'used' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFilterChange('condition', 
              localFilters.condition === 'used' ? undefined : 'used')}
            className="text-xs"
          >
            مستعمل
          </Button>
        </div>
      </div>

      <Separator />

      {/* Category Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-foreground">التصنيف</Label>
        <Select 
          value={localFilters.category_id?.toString() || ''} 
          onValueChange={(value) => handleFilterChange('category_id', value ? parseInt(value) : undefined)}
        >
          <SelectTrigger className="bg-background border-border focus:border-brand">
            <SelectValue placeholder="اختر التصنيف" />
          </SelectTrigger>
          <SelectContent className="bg-background border-border">
            {categories?.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Brand Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-foreground">الماركة</Label>
        <Select 
          value={localFilters.brand_id?.toString() || ''} 
          onValueChange={(value) => handleFilterChange('brand_id', value ? parseInt(value) : undefined)}
        >
          <SelectTrigger className="bg-background border-border focus:border-brand">
            <SelectValue placeholder="اختر الماركة" />
          </SelectTrigger>
          <SelectContent className="bg-background border-border">
            {brands?.map((brand) => (
              <SelectItem key={brand.id} value={brand.id.toString()}>
                {brand.name || brand.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Location Filters */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          الموقع
        </Label>
        <div className="grid grid-cols-1 gap-3">
          <Select 
            value={localFilters.state_id?.toString() || ''} 
            onValueChange={(value) => handleFilterChange('state_id', value ? parseInt(value) : undefined)}
          >
            <SelectTrigger className="bg-background border-border focus:border-brand">
              <SelectValue placeholder="اختر المنطقة" />
            </SelectTrigger>
            <SelectContent className="bg-background border-border">
              {states?.map((state) => (
                <SelectItem key={state.id} value={state.id.toString()}>
                  {state.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select 
            value={localFilters.city_id?.toString() || ''} 
            onValueChange={(value) => handleFilterChange('city_id', value ? parseInt(value) : undefined)}
          >
            <SelectTrigger className="bg-background border-border focus:border-brand">
              <SelectValue placeholder="اختر المدينة" />
            </SelectTrigger>
            <SelectContent className="bg-background border-border">
              {cities?.map((city) => (
                <SelectItem key={city.id} value={city.id.toString()}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div className="space-y-4">
        <Label className="text-sm font-semibold text-foreground">نطاق السعر</Label>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={100000}
            min={0}
            step={1000}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>{priceRange[0].toLocaleString()} ريال</span>
            <span>{priceRange[1].toLocaleString()} ريال</span>
          </div>
        </div>
      </div>

      {/* Advanced Options */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-foreground">خيارات متقدمة</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2 space-x-reverse">
            <Checkbox
              id="negotiable"
              checked={localFilters.is_negotiable || false}
              onCheckedChange={(checked) => handleFilterChange('is_negotiable', checked)}
            />
            <Label htmlFor="negotiable" className="text-sm">قابل للتفاوض</Label>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <Checkbox
              id="nearby"
              checked={localFilters.radius ? true : false}
              onCheckedChange={(checked) => handleFilterChange('radius', checked ? 50 : undefined)}
            />
            <Label htmlFor="nearby" className="text-sm">القريب مني</Label>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button onClick={applyFilters} className="flex-1">
          تطبيق الفلاتر
          {getActiveFiltersCount() > 0 && (
            <Badge variant="secondary" className="mr-2">
              {getActiveFiltersCount()}
            </Badge>
          )}
        </Button>
        <Button variant="outline" onClick={clearFilters} size="icon">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="relative bg-background border-border">
            <SlidersHorizontal className="h-4 w-4 ml-2" />
            فلترة
            {getActiveFiltersCount() > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
              >
                {getActiveFiltersCount()}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[85vh] overflow-y-auto bg-background border-border">
          <SheetHeader className="text-right">
            <SheetTitle className="flex items-center justify-between">
              <span>فلترة النتائج</span>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <FilterContent />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Card className="sticky top-4 bg-background border-border">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-lg">
          <span className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            فلترة النتائج
          </span>
          {getActiveFiltersCount() > 0 && (
            <Badge variant="secondary">
              {getActiveFiltersCount()} فلاتر نشطة
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FilterContent />
      </CardContent>
    </Card>
  );
}
