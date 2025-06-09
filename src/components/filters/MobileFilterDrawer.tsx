import React, { useState, useEffect } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Category, State, City, Brand, SearchFilters } from '@/types';
import { useCurrentLocation } from '@/hooks/use-api';

interface MobileFilterDrawerProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  categories: Category[];
  states: State[];
  cities: City[];
  brands: Brand[];
}

export function MobileFilterDrawer({
  filters,
  onFiltersChange,
  categories,
  states,
  cities,
  brands
}: MobileFilterDrawerProps) {
  const [open, setOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);
  const { data: locationData } = useCurrentLocation();

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    setOpen(false);
  };

  const handleResetFilters = () => {
    setLocalFilters({});
    onFiltersChange({});
    setOpen(false);
  };

  const handlePriceChange = (value: number[]) => {
    setLocalFilters(prev => ({
      ...prev,
      price_min: value[0],
      price_max: value[1]
    }));
  };

  const handleCategoryChange = (categoryId: number) => {
    setLocalFilters(prev => ({
      ...prev,
      category_id: categoryId
    }));
  };

  const handleStateChange = (stateId: number) => {
    setLocalFilters(prev => ({
      ...prev,
      state_id: stateId,
      city_id: undefined
    }));
  };

  const handleCityChange = (cityId: number) => {
    setLocalFilters(prev => ({
      ...prev,
      city_id: cityId
    }));
  };

  const handleBrandChange = (brandId: number) => {
    setLocalFilters(prev => ({
      ...prev,
      brand_id: brandId
    }));
  };

  const handleConditionChange = (condition: 'new' | 'used') => {
    setLocalFilters(prev => ({
      ...prev,
      condition: condition
    }));
  };

  const handleNegotiableChange = (checked: boolean) => {
    setLocalFilters(prev => ({
      ...prev,
      is_negotiable: checked
    }));
  };

  const handleLocationToggle = (enabled: boolean) => {
    if (enabled && locationData && typeof locationData === 'object') {
      const location = locationData as { lat: number; lon: number };
      if ('lat' in location && 'lon' in location) {
        setLocalFilters(prev => ({
          ...prev,
          lat: location.lat,
          lon: location.lon,
          radius: 10
        }));
      }
    } else {
      setLocalFilters(prev => ({
        ...prev,
        lat: undefined,
        lon: undefined,
        radius: undefined
      }));
    }
  };

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        تصفية
      </Button>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>تصفية الإعلانات</DrawerTitle>
            <DrawerDescription>
              تصفح الإعلانات حسب الفئة والسعر والموقع والمزيد.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 space-y-4">
            {/* Category Filter */}
            <div>
              <Label htmlFor="category">الفئة</Label>
              <Select onValueChange={(value) => handleCategoryChange(parseInt(value))}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="اختر الفئة" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Range Filter */}
            <div>
              <Label>نطاق السعر</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="من"
                  value={localFilters.price_min?.toString() || ''}
                  onChange={(e) => setLocalFilters(prev => ({ ...prev, price_min: parseInt(e.target.value) }))}
                  className="w-24"
                />
                <Input
                  type="number"
                  placeholder="إلى"
                  value={localFilters.price_max?.toString() || ''}
                  onChange={(e) => setLocalFilters(prev => ({ ...prev, price_max: parseInt(e.target.value) }))}
                  className="w-24"
                />
              </div>
              <Slider
                defaultValue={[localFilters.price_min || 0, localFilters.price_max || 1000]}
                max={1000}
                step={10}
                onValueChange={handlePriceChange}
              />
            </div>

            {/* Location Filters */}
            <div>
              <Label>الموقع</Label>
              <Switch id="location" onCheckedChange={handleLocationToggle} />
              <Label htmlFor="location" className="text-sm text-muted-foreground">
                استخدام الموقع الحالي
              </Label>
            </div>

            {/* State Filter */}
            <div>
              <Label htmlFor="state">الولاية</Label>
              <Select onValueChange={(value) => handleStateChange(parseInt(value))}>
                <SelectTrigger id="state">
                  <SelectValue placeholder="اختر الولاية" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state.id} value={state.id.toString()}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* City Filter */}
            <div>
              <Label htmlFor="city">المدينة</Label>
              <Select onValueChange={(value) => handleCityChange(parseInt(value))}>
                <SelectTrigger id="city">
                  <SelectValue placeholder="اختر المدينة" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={city.id.toString()}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Brand Filter */}
            <div>
              <Label htmlFor="brand">العلامة التجارية</Label>
              <Select onValueChange={(value) => handleBrandChange(parseInt(value))}>
                <SelectTrigger id="brand">
                  <SelectValue placeholder="اختر العلامة التجارية" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id.toString()}>
                      {brand.title || brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Condition Filter */}
            <div>
              <Label htmlFor="condition">الحالة</Label>
              <Select onValueChange={(value) => handleConditionChange(value as 'new' | 'used')}>
                <SelectTrigger id="condition">
                  <SelectValue placeholder="اختر الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">جديد</SelectItem>
                  <SelectItem value="used">مستعمل</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Negotiable Filter */}
            <div>
              <Label htmlFor="negotiable">قابل للتفاوض</Label>
              <Switch id="negotiable" onCheckedChange={handleNegotiableChange} />
            </div>
          </div>
          <DrawerFooter>
            <Button variant="outline" onClick={handleResetFilters}>
              إعادة تعيين
            </Button>
            <Button onClick={handleApplyFilters}>تطبيق</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
