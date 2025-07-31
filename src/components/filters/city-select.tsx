
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CitySelectProps {
  onCityChange: (cityId: number | undefined) => void;
  selectedCity?: number;
}

export function CitySelect({ onCityChange, selectedCity }: CitySelectProps) {
  const cities = [
    { id: 1, name: 'الرياض' },
    { id: 2, name: 'جدة' },
    { id: 3, name: 'الدمام' },
    { id: 4, name: 'مكة' },
  ];

  return (
    <Select
      value={selectedCity?.toString() || ''}
      onValueChange={(value) => onCityChange(value ? parseInt(value) : undefined)}
    >
      <SelectTrigger>
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
  );
}
