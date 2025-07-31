
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PriceRangeProps {
  onPriceRangeChange: (minPrice: number | undefined, maxPrice: number | undefined) => void;
  minPrice?: number;
  maxPrice?: number;
}

export function PriceRange({ onPriceRangeChange, minPrice, maxPrice }: PriceRangeProps) {
  return (
    <div className="space-y-2">
      <Label>نطاق السعر</Label>
      <div className="grid grid-cols-2 gap-2">
        <Input
          type="number"
          placeholder="من"
          value={minPrice || ''}
          onChange={(e) => onPriceRangeChange(
            e.target.value ? parseInt(e.target.value) : undefined,
            maxPrice
          )}
        />
        <Input
          type="number"
          placeholder="إلى"
          value={maxPrice || ''}
          onChange={(e) => onPriceRangeChange(
            minPrice,
            e.target.value ? parseInt(e.target.value) : undefined
          )}
        />
      </div>
    </div>
  );
}
