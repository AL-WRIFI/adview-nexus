
import React, { useState } from 'react';
import { MapPin, Search, Filter, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useStates } from '@/hooks/use-api';
import { requestUserLocation } from '@/utils/location';

interface CategoryFiltersProps {
  onNearbyClick: () => void;
  onRegionSelect: (region: string) => void;
  onFilterClick: () => void;
  selectedRegion?: string;
}

export function CategoryFilters({ 
  onNearbyClick, 
  onRegionSelect, 
  onFilterClick, 
  selectedRegion = 'كل المناطق' 
}: CategoryFiltersProps) {
  const [showRegions, setShowRegions] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  
  const { data: states = [] } = useStates();
  
  const handleNearbyClick = async () => {
    setIsLoadingLocation(true);
    try {
      await requestUserLocation();
      onNearbyClick();
    } catch (error) {
      console.error('Error getting location:', error);
    } finally {
      setIsLoadingLocation(false);
    }
  };
  
  return (
    <div className="sticky top-0 z-20 bg-white dark:bg-dark-background shadow-sm">
      <div className="container px-4 mx-auto py-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1 flex-shrink-0 bg-white dark:bg-dark-card"
            onClick={handleNearbyClick}
            disabled={isLoadingLocation}
          >
            <MapPin className="w-4 h-4 text-brand" />
            <span className="text-sm">{isLoadingLocation ? 'جاري التحديد...' : 'القريب'}</span>
          </Button>
          
          <div className="relative">
            <Select 
              value={selectedRegion} 
              onValueChange={(value) => {
                onRegionSelect(value);
                setShowRegions(false);
              }}
            >
              <SelectTrigger className="flex items-center gap-1 flex-shrink-0 bg-white dark:bg-dark-card h-9">
                <SelectValue placeholder="كل المناطق" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="كل المناطق">كل المناطق</SelectItem>
                {states.map(state => (
                  <SelectItem key={state.id} value={state.name}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
