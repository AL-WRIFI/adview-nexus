
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchFilters } from '@/types';

interface ListingTypeSelectProps {
  onListingTypeChange: (listingType: SearchFilters['listing_type']) => void;
  selectedListingType?: SearchFilters['listing_type'];
}

export function ListingTypeSelect({ onListingTypeChange, selectedListingType }: ListingTypeSelectProps) {
  return (
    <Select
      value={selectedListingType || ''}
      onValueChange={(value) => onListingTypeChange(value as SearchFilters['listing_type'])}
    >
      <SelectTrigger>
        <SelectValue placeholder="نوع الإعلان" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="sell">للبيع</SelectItem>
        <SelectItem value="rent">للإيجار</SelectItem>
        <SelectItem value="wanted">مطلوب</SelectItem>
        <SelectItem value="exchange">مقايضة</SelectItem>
        <SelectItem value="service">خدمة</SelectItem>
        <SelectItem value="buy">شراء</SelectItem>
      </SelectContent>
    </Select>
  );
}
