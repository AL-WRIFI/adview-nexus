
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface Category {
  id: number;
  name: string;
  icon?: string;
}

interface MobileCategoryBarProps {
  categories: Category[];
  selectedCategory: number | null;
  onCategorySelect: (id: number | null) => void;
  isLoading?: boolean;
}

export function MobileCategoryBar({
  categories,
  selectedCategory,
  onCategorySelect,
  isLoading = false
}: MobileCategoryBarProps) {
  if (isLoading) {
    return (
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 px-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-20 rounded-full flex-shrink-0" />
        ))}
      </div>
    );
  }

  return (
    <ScrollArea className="w-full">
      <div className="flex gap-2 py-2 px-4">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => onCategorySelect(null)}
          className="whitespace-nowrap rounded-full"
        >
          الكل
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => onCategorySelect(category.id)}
            className="whitespace-nowrap rounded-full"
          >
            {category.name}
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
}
