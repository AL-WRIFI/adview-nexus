
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCategories } from '@/hooks/use-api';

interface CategorySelectProps {
  onCategoryChange: (categoryId: number | undefined) => void;
  onSubCategoryChange: (subCategoryId: number | undefined) => void;
  onChildCategoryChange: (childCategoryId: number | undefined) => void;
  selectedCategory?: number;
  selectedSubCategory?: number;
  selectedChildCategory?: number;
}

export function CategorySelect({
  onCategoryChange,
  onSubCategoryChange,
  onChildCategoryChange,
  selectedCategory,
  selectedSubCategory,
  selectedChildCategory
}: CategorySelectProps) {
  const { data: categories } = useCategories();

  return (
    <div className="space-y-2">
      <Select
        value={selectedCategory?.toString() || ''}
        onValueChange={(value) => onCategoryChange(value ? parseInt(value) : undefined)}
      >
        <SelectTrigger>
          <SelectValue placeholder="اختر التصنيف" />
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
  );
}
