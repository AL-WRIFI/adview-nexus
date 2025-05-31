
import React from 'react';
import { MapPin, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MobileFilterDrawer } from '@/components/filters-old/MobileFilterDrawer';
import { SearchFilters } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

interface MobileFilterBarProps {
  onFilterChange: (filters: SearchFilters) => void;
  onNearbyClick: () => void;
  selectedRegion?: string;
  isLoading?: boolean;
}

export function MobileFilterBar({
  onFilterChange,
  onNearbyClick,
  selectedRegion = 'كل المناطق',
  isLoading = false
}: MobileFilterBarProps) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        <Skeleton className="h-9 w-24 rounded-md" />
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
      
      <MobileFilterDrawer onFilterChange={onFilterChange} />
    </div>
  );
}
