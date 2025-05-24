
import React, { useState } from 'react';
import { MapPin, Filter, SortAsc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MobileFilterDrawer } from '@/components/filters/MobileFilterDrawer';
import { SearchFilters } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MobileFilterBarProps {
  onFilterChange: (filters: SearchFilters) => void;
  onNearbyClick: () => void;
  selectedRegion?: string;
  isLoading?: boolean;
}

type SortOption = 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'popular';

const sortOptions = [
  { value: 'newest' as SortOption, label: 'الأحدث' },
  { value: 'oldest' as SortOption, label: 'الأقدم' },
  { value: 'price_asc' as SortOption, label: 'السعر: منخفض إلى مرتفع' },
  { value: 'price_desc' as SortOption, label: 'السعر: مرتفع إلى منخفض' },
  { value: 'popular' as SortOption, label: 'الأكثر شعبية' },
];

export function MobileFilterBar({
  onFilterChange,
  onNearbyClick,
  selectedRegion = 'كل المناطق',
  isLoading = false
}: MobileFilterBarProps) {
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const handleSortChange = (value: SortOption) => {
    setSortBy(value);
    onFilterChange({ sort_by: value });
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        <Skeleton className="h-9 w-24 rounded-md" />
        <Skeleton className="h-9 w-32 rounded-md" />
        <Skeleton className="h-9 flex-1 rounded-md" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-1 flex-shrink-0 bg-white dark:bg-dark-card dark:border-dark-border"
        onClick={onNearbyClick}
      >
        <MapPin className="w-4 h-4 text-brand" />
        <span className="text-sm">القريب</span>
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1 flex-shrink-0 bg-white dark:bg-dark-card dark:border-dark-border"
          >
            <SortAsc className="w-4 h-4" />
            <span className="text-sm">ترتيب</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {sortOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleSortChange(option.value)}
              className={sortBy === option.value ? 'bg-accent' : ''}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      <MobileFilterDrawer onFilterChange={onFilterChange} />
    </div>
  );
}
