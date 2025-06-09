import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useCategories, useStates, useCities, useBrands, useCurrentLocation } from '@/hooks/use-api';
import { SearchFilters } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

interface AdFiltersProps {
  onFiltersChange: (filters: SearchFilters) => void;
  currentFilters?: SearchFilters;
}

export function AdFilters({ onFiltersChange, currentFilters = {} }: AdFiltersProps) {
  const [filters, setFilters] = useState<SearchFilters>(currentFilters);
  const { data: locationData } = useCurrentLocation();

  const { data: categories } = useCategories();
  const { data: states } = useStates();
  const { data: cities } = useCities(filters.state_id);
  const { data: brands } = useBrands(filters.category_id);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFilters(prev => {
      const newValue = type === 'checkbox' ? checked : value;
      const updatedFilters = { ...prev, [name]: newValue };
      onFiltersChange(updatedFilters); // Notify parent component
      return updatedFilters;
    });
  };

  const handleSliderChange = (value: number[]) => {
    const [min_price, max_price] = value;
    setFilters(prev => {
      const updatedFilters = { ...prev, min_price, max_price };
      onFiltersChange(updatedFilters); // Notify parent component
      return updatedFilters;
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFilters(prev => {
      const updatedFilters = { ...prev, [name]: value };
      onFiltersChange(updatedFilters); // Notify parent component
      return updatedFilters;
    });
  };

  const handleLocationToggle = (enabled: boolean) => {
    if (enabled && locationData && typeof locationData === 'object') {
      const location = locationData as { lat: number; lon: number };
      if ('lat' in location && 'lon' in location) {
        setFilters(prev => ({
          ...prev,
          lat: location.lat,
          lon: location.lon,
          radius: 10
        }));
      }
    } else {
      setFilters(prev => ({
        ...prev,
        lat: undefined,
        lon: undefined,
        radius: undefined
      }));
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="search">بحث</Label>
        <Input
          type="text"
          id="search"
          name="search"
          value={filters.search || ''}
          onChange={handleInputChange}
          placeholder="ابحث عن أي شيء"
        />
      </div>

      <Separator />

      <div>
        <Label>السعر</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            name="price_min"
            value={filters.min_price || ''}
            onChange={handleInputChange}
            placeholder="من"
            className="w-24"
          />
          <Input
            type="number"
            name="price_max"
            value={filters.max_price || ''}
            onChange={handleInputChange}
            placeholder="إلى"
            className="w-24"
          />
        </div>
        <Slider
          defaultValue={[filters.min_price || 0, filters.max_price || 1000]}
          max={1000}
          step={10}
          onValueChange={handleSliderChange}
        />
      </div>

      <Separator />

      <div>
        <Label>القسم</Label>
        <Select onValueChange={(value) => handleSelectChange('category_id', value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="اختر قسم" />
          </SelectTrigger>
          <SelectContent>
            {categories?.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filters.category_id && (
        <div>
          <Label>الماركة</Label>
          <Select onValueChange={(value) => handleSelectChange('brand_id', value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="اختر ماركة" />
            </SelectTrigger>
            <SelectContent>
              {brands?.map((brand) => (
                <SelectItem key={brand.id} value={brand.id.toString()}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <Separator />

      <div>
        <Label>الموقع</Label>
        <div className="flex items-center gap-2">
          <Select onValueChange={(value) => handleSelectChange('state_id', value)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="الولاية" />
            </SelectTrigger>
            <SelectContent>
              {states?.map((state) => (
                <SelectItem key={state.id} value={state.id.toString()}>
                  {state.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {filters.state_id && (
            <Select onValueChange={(value) => handleSelectChange('city_id', value)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="المدينة" />
              </SelectTrigger>
              <SelectContent>
                {cities?.map((city) => (
                  <SelectItem key={city.id} value={city.id.toString()}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <Separator />

      <div>
        <Label>خيارات أخرى</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Switch id="negotiable" name="is_negotiable" checked={filters.is_negotiable || false} onCheckedChange={(checked) => handleInputChange({ target: { name: 'is_negotiable', type: 'checkbox', value: checked, checked } } as any)} />
            <Label htmlFor="negotiable">قابل للتفاوض</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch id="nearby" name="nearby" checked={filters.lat !== undefined && filters.lon !== undefined} onCheckedChange={handleLocationToggle} />
            <Label htmlFor="nearby">بالقرب مني</Label>
          </div>
        </div>
      </div>
      
      <Separator />

      <Button variant="outline" onClick={() => onFiltersChange({})}>
        إعادة تعيين الفلاتر
      </Button>
    </div>
  );
}
