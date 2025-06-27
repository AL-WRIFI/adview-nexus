import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Category, SubCategory, Brand, State, City, SearchFilters } from '@/types';
import { useCategories, useBrands, useStates, useCities } from '@/hooks/use-api';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface MobileFilterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFilterChange: (filters: SearchFilters) => void;
  currentFilters: SearchFilters;
}

export function MobileFilterDrawer({
  open,
  onOpenChange,
  onFilterChange,
  currentFilters,
}: MobileFilterDrawerProps) {
  // Initialize filters from current filters
  const [selectedCategory, setSelectedCategory] = useState(currentFilters.category_id || 0);
  const [selectedSubCategory, setSelectedSubCategory] = useState(currentFilters.subcategory_id || currentFilters.sub_category_id || 0);
  const [selectedBrand, setSelectedBrand] = useState(currentFilters.brand_id || 0);
  const [selectedState, setSelectedState] = useState(currentFilters.state_id || 0);
  const [selectedCity, setSelectedCity] = useState(currentFilters.city_id || 0);
  const [minPrice, setMinPrice] = useState(currentFilters.min_price?.toString() || '');
  const [maxPrice, setMaxPrice] = useState(currentFilters.max_price?.toString() || '');
  const [selectedCondition, setSelectedCondition] = useState(currentFilters.condition || currentFilters.product_condition || '');
  const [selectedListingType, setSelectedListingType] = useState(currentFilters.listing_type || '');
  const [selectedSort, setSelectedSort] = useState(currentFilters.sort || currentFilters.sort_by || 'newest');

  const { data: categoriesData } = useCategories();
  const { data: brandsData } = useBrands();
  const { data: statesData } = useStates();
  const { data: citiesData, isLoading: citiesLoading } = useCities(selectedState);

  const categories = Array.isArray(categoriesData) ? categoriesData : [];
  const subCategories = categories.find((cat) => cat.id === selectedCategory)?.subcategories || [];
  const states = Array.isArray(statesData) ? statesData : [];

  const handleApplyFilters = () => {
    const filters: SearchFilters = {};
    
    if (selectedCategory) filters.category_id = selectedCategory;
    if (selectedSubCategory) filters.subcategory_id = selectedSubCategory;
    if (selectedBrand) filters.brand_id = selectedBrand;
    if (selectedState) filters.state_id = selectedState;
    if (selectedCity) filters.city_id = selectedCity;
    if (minPrice) filters.min_price = parseFloat(minPrice);
    if (maxPrice) filters.max_price = parseFloat(maxPrice);
    if (selectedCondition) filters.condition = selectedCondition as any;
    if (selectedListingType) filters.listing_type = selectedListingType as any;
    if (selectedSort) filters.sort = selectedSort as any;
    
    onFilterChange(filters);
    onOpenChange(false);
  };

  const handleClearFilters = () => {
    setSelectedCategory(0);
    setSelectedSubCategory(0);
    setSelectedBrand(0);
    setSelectedState(0);
    setSelectedCity(0);
    setMinPrice('');
    setMaxPrice('');
    setSelectedCondition('');
    setSelectedListingType('');
    setSelectedSort('newest');
    
    onFilterChange({});
  };

  const filteredSubCategories = subCategories || [];
  const filteredCities = Array.isArray(citiesData) ? citiesData : [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>تصفية النتائج</SheetTitle>
          <SheetDescription>
            اختر الخيارات التي تناسبك لتضييق نطاق البحث.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          {/* Category Filter */}
          <div>
            <Label className="text-base font-semibold">القسم</Label>
            <Select value={selectedCategory.toString()} onValueChange={(value) => setSelectedCategory(Number(value))}>
              <SelectTrigger>
                <SelectValue placeholder="اختر القسم" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">جميع الأقسام</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subcategory Filter */}
          {selectedCategory !== 0 && filteredSubCategories.length > 0 && (
            <div>
              <Label className="text-base font-semibold">القسم الفرعي</Label>
              <Select value={selectedSubCategory.toString()} onValueChange={(value) => setSelectedSubCategory(Number(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر القسم الفرعي" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">جميع الأقسام الفرعية</SelectItem>
                  {filteredSubCategories.map((subCategory) => (
                    <SelectItem key={subCategory.id} value={subCategory.id.toString()}>
                      {subCategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Brand Filter */}
          {brandsData && brandsData.length > 0 && (
            <div>
              <Label className="text-base font-semibold">الماركة</Label>
              <Select value={selectedBrand.toString()} onValueChange={(value) => setSelectedBrand(Number(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الماركة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">جميع الماركات</SelectItem>
                  {brandsData.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id.toString()}>
                      <div className="flex items-center gap-2">
                        {(brand.logo_url || brand.logo || brand.image) && (
                          <img 
                            src={brand.logo_url || brand.logo || brand.image} 
                            alt={brand.name}
                            className="w-4 h-4 object-contain"
                          />
                        )}
                        {brand.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Price Range Filter */}
          <div>
            <Label className="text-base font-semibold">نطاق السعر</Label>
            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder="من"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <Input
                type="number"
                placeholder="إلى"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>

          {/* Condition Filter */}
          <div>
            <Label className="text-base font-semibold">الحالة</Label>
            <Select value={selectedCondition} onValueChange={(value) => setSelectedCondition(value)}>
              <SelectTrigger>
                <SelectValue placeholder="اختر الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">جميع الحالات</SelectItem>
                <SelectItem value="new">جديد</SelectItem>
                <SelectItem value="used">مستعمل</SelectItem>
                <SelectItem value="refurbished">مجدد</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Listing Type Filter */}
          <div>
            <Label className="text-base font-semibold">نوع الإعلان</Label>
            <Select value={selectedListingType} onValueChange={(value) => setSelectedListingType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="اختر نوع الإعلان" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">جميع الأنواع</SelectItem>
                <SelectItem value="sell">بيع</SelectItem>
                <SelectItem value="rent">إيجار</SelectItem>
                <SelectItem value="wanted">مطلوب</SelectItem>
                <SelectItem value="exchange">تبادل</SelectItem>
                <SelectItem value="service">خدمة</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* State Filter */}
          <div>
            <Label className="text-base font-semibold">الولاية</Label>
            <Select value={selectedState.toString()} onValueChange={(value) => {
              setSelectedState(Number(value));
              setSelectedCity(0); // Reset city when state changes
            }}>
              <SelectTrigger>
                <SelectValue placeholder="اختر الولاية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">جميع الولايات</SelectItem>
                {states.map((state) => (
                  <SelectItem key={state.id} value={state.id.toString()}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* City Filter */}
          {selectedState !== 0 && filteredCities.length > 0 && (
            <div>
              <Label className="text-base font-semibold">المدينة</Label>
              <Select value={selectedCity.toString()} onValueChange={(value) => setSelectedCity(Number(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر المدينة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">جميع المدن</SelectItem>
                  {filteredCities.map((city) => (
                    <SelectItem key={city.id} value={city.id.toString()}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Sort By Filter */}
          <div>
            <Label className="text-base font-semibold">الترتيب حسب</Label>
            <Select value={selectedSort} onValueChange={(value) => setSelectedSort(value)}>
              <SelectTrigger>
                <SelectValue placeholder="الأحدث" />
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">الأحدث</SelectItem>
                <SelectItem value="oldest">الأقدم</SelectItem>
                <SelectItem value="price_asc">السعر: من الأقل للأعلى</SelectItem>
                <SelectItem value="price_desc">السعر: من الأعلى للأقل</SelectItem>
                {/* Add other sorting options as needed */}
              </SelectContent>
            </Select>
          </div>

          {/* Apply and Clear Buttons */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleClearFilters}>
              مسح الفلاتر
            </Button>
            <Button onClick={handleApplyFilters}>تطبيق الفلاتر</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
