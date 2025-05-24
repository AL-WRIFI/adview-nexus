
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SubCategory {
  id: number;
  name: string;
  category_id: number;
}

interface SubCategoryButtonsProps {
  subcategories: SubCategory[];
  selectedSubCategory: number | null;
  onSubCategorySelect: (id: number | null) => void;
}

export default function SubCategoryButtons({
  subcategories,
  selectedSubCategory,
  onSubCategorySelect,
}: SubCategoryButtonsProps) {
  return (
    <ScrollArea className="w-full">
      <div className="flex gap-2 pb-2">
        <Button
          variant={selectedSubCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => onSubCategorySelect(null)}
          className="whitespace-nowrap"
        >
          الكل
        </Button>
        {subcategories.map((subcategory) => (
          <Button
            key={subcategory.id}
            variant={selectedSubCategory === subcategory.id ? "default" : "outline"}
            size="sm"
            onClick={() => onSubCategorySelect(subcategory.id)}
            className="whitespace-nowrap"
          >
            {subcategory.name}
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
}
