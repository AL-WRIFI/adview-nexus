
import React from 'react';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { SearchFilters } from '@/types';

interface MobileCategoryBarProps {
  onFilterChange: (filters: SearchFilters) => void;
}

export function MobileCategoryBar({ onFilterChange }: MobileCategoryBarProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-1 flex-shrink-0"
        onClick={() => {}}
      >
        <Filter className="w-4 h-4" />
        <span className="text-sm">تصفية</span>
      </Button>
    </div>
  );
}
