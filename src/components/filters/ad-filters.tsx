
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Check, ChevronDown, Filter, SlidersHorizontal } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { useCategories, useBrands, useAllCities, useStates, useCities } from '@/hooks/use-api';
import { Category, Brand } from '@/types';
import { cn } from '@/lib/utils';

interface AdFiltersProps {
  inline?: boolean;
  categories?: Category[];
  brands?: Brand[];
  className?: string;
  onFilterChange?: (filters: Record<string, any>) => void;
  layout?: 'sidebar' | 'inline';
  currentLayout?: 'grid' | 'list';
  onLayoutChange?: (layout: 'grid' | 'list') => void;
}

interface FilterOption {
  id: string | number;
  name: string;
}

export default function AdFilters({ 
  inline = true, 
  categories: propCategories, 
  brands: propBrands, 
  className, 
  onFilterChange,
  layout,
  currentLayout,
  onLayoutChange
}: AdFiltersProps) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Fetch filter data
  const { data: apiCategories } = useCategories();
  const { data: apiBrands } = useBrands();
  const { data: cities } = useAllCities();
  const { data: states } = useStates();
  
  const allCategories = propCategories || apiCategories || [];
  const allBrands = propBrands || apiBrands || [];
  
  // Filter states
  const [category, setCategory] = useState<string | null>(searchParams.get('category_id') || null);
  const [subcategory, setSubcategory] = useState<string | null>(searchParams.get('subcategory_id') || null);
  const [childCategory, setChildCategory] = useState<string | null>(searchParams.get('child_category_id') || null);
  const [brand, setBrand] = useState<string | null>(searchParams.get('brand_id') || null);
  const [condition, setCondition] = useState<string>(searchParams.get('condition') || '');
  const [listingType, setListingType] = useState<string>(searchParams.get('listing_type') || '');
  const [priceRange, setPriceRange] = useState<[number, number]>([
    parseInt(searchParams.get('min_price') || '0'),
    parseInt(searchParams.get('max_price') || '200000')
  ]);
  const [minPrice, setMinPrice] = useState<string>(searchParams.get('min_price') || '0');
  const [maxPrice, setMaxPrice] = useState<string>(searchParams.get('max_price') || '200000');
  const [state, setState] = useState<string | null>(searchParams.get('state_id') || null);
  const [city, setCity] = useState<string | null>(searchParams.get('city_id') || null);
  const [sort, setSort] = useState<string>(searchParams.get('sort_by') || 'newest');
  
  // Get cities for the selected state
  const { data: stateCities } = useCities(state ? parseInt(state) : undefined);
  
  // Get subcategories for the selected category
  const selectedCategory = allCategories.find(c => c.id.toString() === category);
  const subcategories = selectedCategory?.subcategories || [];
  
  // Get child categories for the selected subcategory
  const selectedSubcategory = subcategories.find(s => s.id.toString() === subcategory);
  const childCategories = selectedSubcategory?.children || [];
  
  // Apply filters
  const applyFilters = () => {
    const filters: Record<string, string> = {};
    
    if (category) filters.category_id = category;
    if (subcategory) filters.subcategory_id = subcategory;
    if (childCategory) filters.child_category_id = childCategory;
    if (brand) filters.brand_id = brand;
    if (condition) filters.condition = condition;
    if (listingType) filters.listing_type = listingType;
    if (minPrice && parseInt(minPrice) > 0) filters.min_price = minPrice;
    if (maxPrice) filters.max_price = maxPrice;
    if (state) filters.state_id = state;
    if (city) filters.city_id = city;
    if (sort) filters.sort_by = sort;
    
    if (onFilterChange) {
      onFilterChange(filters);
    } else {
      setSearchParams(filters);
    }
  };
  
  // Reset filters
  const resetFilters = () => {
    setCategory(null);
    setSubcategory(null);
    setChildCategory(null);
    setBrand(null);
    setCondition('');
    setListingType('');
    setPriceRange([0, 200000]);
    setMinPrice('0');
    setMaxPrice('200000');
    setState(null);
    setCity(null);
    setSort('newest');
    
    if (onFilterChange) {
      onFilterChange({});
    } else {
      setSearchParams({});
    }
  };
  
  // Handle price range changes
  useEffect(() => {
    setMinPrice(priceRange[0].toString());
    setMaxPrice(priceRange[1].toString());
  }, [priceRange]);
  
  // Reset dependent fields when parent field changes
  useEffect(() => {
    if (!category) {
      setSubcategory(null);
      setChildCategory(null);
    }
  }, [category]);
  
  useEffect(() => {
    if (!subcategory) {
      setChildCategory(null);
    }
  }, [subcategory]);
  
  useEffect(() => {
    if (!state) {
      setCity(null);
    }
  }, [state]);
  
  // Inline filter view (for medium to large screens)
  const inlineFilters = (
    <div className={cn("grid grid-cols-1 md:grid-cols-5 gap-3", className)}>
      <Select value={category || undefined} onValueChange={(value) => {
        setCategory(value); 
        setSubcategory(null);
        setChildCategory(null);
      }}>
        <SelectTrigger>
          <SelectValue placeholder="جميع الفئات" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">جميع الفئات</SelectItem>
          {allCategories.map((category) => (
            <SelectItem key={category.id} value={category.id.toString()}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select value={brand || undefined} onValueChange={(value) => setBrand(value)}>
        <SelectTrigger>
          <SelectValue placeholder="جميع الماركات" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">جميع الماركات</SelectItem>
          {allBrands.map((brand) => (
            <SelectItem key={brand.id} value={brand.id.toString()}>
              {brand.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select value={state || undefined} onValueChange={(value) => {
        setState(value);
        setCity(null);
      }}>
        <SelectTrigger>
          <SelectValue placeholder="جميع المناطق" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">جميع المناطق</SelectItem>
          {states?.map((state) => (
            <SelectItem key={state.id} value={state.id.toString()}>
              {state.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select value={condition} onValueChange={setCondition}>
        <SelectTrigger>
          <SelectValue placeholder="الحالة" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">الكل</SelectItem>
          <SelectItem value="new">جديد</SelectItem>
          <SelectItem value="used">مستعمل</SelectItem>
        </SelectContent>
      </Select>
      
      <Select value={sort} onValueChange={setSort}>
        <SelectTrigger>
          <SelectValue placeholder="الترتيب" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">الأحدث</SelectItem>
          <SelectItem value="oldest">الأقدم</SelectItem>
          <SelectItem value="price_asc">السعر: من الأقل إلى الأعلى</SelectItem>
          <SelectItem value="price_desc">السعر: من الأعلى إلى الأقل</SelectItem>
        </SelectContent>
      </Select>
      
      <div className="md:col-span-5 flex justify-end gap-2 mt-2">
        <Button variant="outline" onClick={resetFilters}>إعادة ضبط</Button>
        <Button onClick={applyFilters}>تطبيق الفلاتر</Button>
      </div>
    </div>
  );
  
  // Mobile filter drawer (for small screens)
  const mobileFilters = (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="px-3 h-9">
          <Filter className="h-4 w-4 ml-1" />
          فلترة
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-md dark:bg-gray-900 dark:border-gray-800">
        <SheetHeader>
          <SheetTitle>خيارات الفلترة</SheetTitle>
        </SheetHeader>
        
        <div className="py-4 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">الفئات</h3>
            <Select value={category || undefined} onValueChange={(value) => {
              setCategory(value);
              setSubcategory(null);
              setChildCategory(null);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="جميع الفئات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الفئات</SelectItem>
                {allCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {category && subcategories.length > 0 && (
              <Select value={subcategory || undefined} onValueChange={(value) => {
                setSubcategory(value);
                setChildCategory(null);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="التصنيف الفرعي" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع التصنيفات الفرعية</SelectItem>
                  {subcategories.map((subcat) => (
                    <SelectItem key={subcat.id} value={subcat.id.toString()}>
                      {subcat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            {subcategory && childCategories.length > 0 && (
              <Select value={childCategory || undefined} onValueChange={(value) => setChildCategory(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="التصنيف الفرعي الثانوي" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  {childCategories.map((child) => (
                    <SelectItem key={child.id} value={child.id.toString()}>
                      {child.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">الماركة</h3>
            <Select value={brand || undefined} onValueChange={(value) => setBrand(value)}>
              <SelectTrigger>
                <SelectValue placeholder="جميع الماركات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الماركات</SelectItem>
                {allBrands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id.toString()}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">حالة المنتج</h3>
            <RadioGroup value={condition} onValueChange={setCondition}>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="all" id="condition-all" />
                <Label htmlFor="condition-all">الكل</Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="new" id="condition-new" />
                <Label htmlFor="condition-new">جديد</Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="used" id="condition-used" />
                <Label htmlFor="condition-used">مستعمل</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">نوع الإعلان</h3>
            <RadioGroup value={listingType} onValueChange={setListingType}>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="all" id="type-all" />
                <Label htmlFor="type-all">الكل</Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="sell" id="type-sell" />
                <Label htmlFor="type-sell">للبيع</Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="buy" id="type-buy" />
                <Label htmlFor="type-buy">شراء</Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="rent" id="type-rent" />
                <Label htmlFor="type-rent">للايجار</Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="job" id="type-job" />
                <Label htmlFor="type-job">وظيفة</Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="service" id="type-service" />
                <Label htmlFor="type-service">خدمة</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">السعر</h3>
              <div className="text-sm text-muted-foreground">
                {minPrice} - {maxPrice} ريال
              </div>
            </div>
            <Slider
              defaultValue={[parseInt(minPrice), parseInt(maxPrice)]}
              min={0}
              max={200000}
              step={1000}
              value={[parseInt(minPrice), parseInt(maxPrice)]}
              onValueChange={(value) => {
                setMinPrice(value[0].toString());
                setMaxPrice(value[1].toString());
              }}
              className="mb-6"
            />
            <div className="flex gap-4">
              <div className="space-y-1 flex-1">
                <Label htmlFor="min-price">من</Label>
                <Input
                  type="number"
                  id="min-price"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              <div className="space-y-1 flex-1">
                <Label htmlFor="max-price">إلى</Label>
                <Input
                  type="number"
                  id="max-price"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">المنطقة</h3>
            <Select value={state || undefined} onValueChange={(value) => {
              setState(value);
              setCity(null);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="اختر المنطقة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المناطق</SelectItem>
                {states?.map((state) => (
                  <SelectItem key={state.id} value={state.id.toString()}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {state && (
              <Select value={city || undefined} onValueChange={(value) => setCity(value)}>
                <SelectTrigger disabled={!state}>
                  <SelectValue placeholder={state ? "اختر المدينة" : "اختر المنطقة أولاً"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع المدن</SelectItem>
                  {stateCities?.map((city) => (
                    <SelectItem key={city.id} value={city.id.toString()}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">الترتيب حسب</h3>
            <RadioGroup value={sort} onValueChange={setSort}>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="newest" id="sort-newest" />
                <Label htmlFor="sort-newest">الأحدث</Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="oldest" id="sort-oldest" />
                <Label htmlFor="sort-oldest">الأقدم</Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="price_asc" id="sort-price-asc" />
                <Label htmlFor="sort-price-asc">السعر: من الأقل إلى الأعلى</Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="price_desc" id="sort-price-desc" />
                <Label htmlFor="sort-price-desc">السعر: من الأعلى إلى الأقل</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="flex gap-3 pt-4">
            <SheetClose asChild>
              <Button variant="outline" className="flex-1" onClick={resetFilters}>
                إعادة ضبط
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button className="flex-1" onClick={applyFilters}>
                تطبيق الفلاتر
              </Button>
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
  
  return inline ? inlineFilters : mobileFilters;
}
