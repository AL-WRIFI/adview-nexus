
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchFilters } from '@/types';

interface ConditionSelectProps {
  onConditionChange: (condition: SearchFilters['condition']) => void;
  selectedCondition?: SearchFilters['condition'];
}

export function ConditionSelect({ onConditionChange, selectedCondition }: ConditionSelectProps) {
  return (
    <Select
      value={selectedCondition || ''}
      onValueChange={(value) => onConditionChange(value as SearchFilters['condition'])}
    >
      <SelectTrigger>
        <SelectValue placeholder="حالة المنتج" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="new">جديد</SelectItem>
        <SelectItem value="used">مستعمل</SelectItem>
        <SelectItem value="refurbished">مجدد</SelectItem>
      </SelectContent>
    </Select>
  );
}
