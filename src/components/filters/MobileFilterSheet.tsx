import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Filter, X, MapPin, DollarSign, Calendar, Package, Star } from 'lucide-react';
import { SearchFilters } from '@/types';
import { useCategories } from '@/hooks/use-api';
interface MobileFilterSheetProps {
  onFilterChange: (filters: SearchFilters) => void;
  currentFilters?: SearchFilters;
  triggerButton?: React.ReactNode;
}
export function MobileFilterSheet({
  onFilterChange,
  currentFilters = {},
  triggerButton
}: MobileFilterSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>(currentFilters);
  const {
    data: categories
  } = useCategories();
  const priceRange = filters.min_price || filters.max_price ? [filters.min_price || 0, filters.max_price || 100000] : [0, 100000];
  const handleFilterUpdate = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  const handlePriceRangeChange = (values: number[]) => {
    setFilters(prev => ({
      ...prev,
      min_price: values[0],
      max_price: values[1]
    }));
  };
  const applyFilters = () => {
    onFilterChange(filters);
    setIsOpen(false);
  };
  const resetFilters = () => {
    setFilters({});
    onFilterChange({});
  };
  const activeFiltersCount = Object.keys(filters).filter(key => filters[key as keyof SearchFilters] !== undefined && filters[key as keyof SearchFilters] !== '' && filters[key as keyof SearchFilters] !== null).length;
  const defaultTrigger = <Button variant="outline" size="sm" className="relative flex items-center gap-2 bg-white dark:bg-dark-card border-2 border-gray-200 dark:border-dark-border hover:border-brand dark:hover:border-brand transition-colors">
      <Filter className="w-4 h-4 text-brand" />
      <span className="text-sm font-medium">فلترة</span>
      {activeFiltersCount > 0 && <Badge variant="destructive" className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs">
          {activeFiltersCount}
        </Badge>}
    </Button>;
  return <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {triggerButton || defaultTrigger}
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl border-0 bg-white dark:bg-dark-background p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="p-6 pb-4 border-b border-gray-100 dark:border-dark-border">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-xl font-bold text-right">خيارات التصفية</SheetTitle>
              <div className="flex items-center gap-2">
                {activeFiltersCount > 0 && <Button variant="ghost" size="sm" onClick={resetFilters} className="text-red-500 hover:text-red-600">
                    <X className="w-4 h-4 ml-1" />
                    مسح الكل
                  </Button>}
              </div>
            </div>
          </SheetHeader>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Search */}
            
            
            
            
            {/* Category */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-brand" />
                <Label className="text-sm font-medium">التصنيف</Label>
              </div>
              <Select
            // FIX: Fall back to 'all' instead of ''
            value={filters.category_id?.toString() || 'all'}
            // FIX: Check for the 'all' value to reset the filter
            onValueChange={value => handleFilterUpdate('category_id', value === 'all' ? undefined : parseInt(value))}>
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="اختر التصنيف" />
                </SelectTrigger>
                <SelectContent>
                  {/* FIX: Use a non-empty string for the value */}
                  <SelectItem value="all">جميع التصنيفات</SelectItem>
                  {categories?.map(category => <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            
            <Separator />
            
            {/* Price Range */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-brand" />
                <Label className="text-sm font-medium">نطاق السعر</Label>
              </div>
              <div className="px-3">
                <Slider value={priceRange} onValueChange={handlePriceRangeChange} max={100000} min={0} step={100} className="w-full" />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>{priceRange[0].toLocaleString()} ر.س</span>
                  <span>{priceRange[1].toLocaleString()} ر.س</span>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Condition */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">حالة المنتج</Label>
              <div className="grid grid-cols-3 gap-2">
                {[{
                value: '',
                label: 'الكل'
              }, {
                value: 'new',
                label: 'جديد'
              }, {
                value: 'used',
                label: 'مستعمل'
              }].map(condition => <Button key={condition.value} variant={filters.condition === condition.value ? "default" : "outline"} size="sm" onClick={() => handleFilterUpdate('condition', condition.value)} className="text-sm">
                    {condition.label}
                  </Button>)}
              </div>
            </div>
            
            <Separator />
            
            {/* Listing Type */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">نوع الإعلان</Label>
              <div className="grid grid-cols-2 gap-2">
                {[{
                value: '',
                label: 'الكل'
              }, {
                value: 'sell',
                label: 'للبيع'
              }, {
                value: 'buy',
                label: 'مطلوب'
              }, {
                value: 'exchange',
                label: 'مقايضة'
              }].map(type => <Button key={type.value} variant={filters.listing_type === type.value ? "default" : "outline"} size="sm" onClick={() => handleFilterUpdate('listing_type', type.value)} className="text-sm">
                    {type.label}
                  </Button>)}
              </div>
            </div>
            
            <Separator />
            
            {/* Special Options */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">خيارات خاصة</Label>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-brand" />
                  <span className="text-sm">الإعلانات المميزة فقط</span>
                </div>
                <Switch checked={filters.featured || false} onCheckedChange={checked => handleFilterUpdate('featured', checked)} />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand" />
                  <span className="text-sm">الإعلانات القريبة مني</span>
                </div>
                <Switch checked={!!filters.radius} onCheckedChange={checked => handleFilterUpdate('radius', checked ? 50 : undefined)} />
              </div>
            </div>
            
            <Separator />
            
            {/* Sort */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand" />
                <Label className="text-sm font-medium">ترتيب النتائج</Label>
              </div>
              <Select
            // FIX: Fall back to 'default' instead of ''
            value={filters.sort || 'default'}
            // FIX: Check for the 'default' value to reset the filter
            onValueChange={value => handleFilterUpdate('sort', value === 'default' ? undefined : value)}>
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="اختر طريقة الترتيب" />
                </SelectTrigger>
                <SelectContent>
                  {/* FIX: Use a non-empty string for the value */}
                  <SelectItem value="default">افتراضي</SelectItem>
                  <SelectItem value="newest">الأحدث أولاً</SelectItem>
                  <SelectItem value="oldest">الأقدم أولاً</SelectItem>
                  <SelectItem value="price_asc">السعر: من الأقل للأعلى</SelectItem>
                  <SelectItem value="price_desc">السعر: من الأعلى للأقل</SelectItem>
                  <SelectItem value="popular">الأكثر مشاهدة</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Footer */}
          <div className="p-6 pt-4 border-t border-gray-100 dark:border-dark-border bg-gray-50 dark:bg-dark-surface">
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={resetFilters} className="text-sm">
                إعادة تعيين
              </Button>
              <Button onClick={applyFilters} className="text-sm bg-brand hover:bg-brand/90">
                تطبيق الفلاتر ({activeFiltersCount})
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>;
}