
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Category, SearchFilters } from '@/types';

interface MobileFilterDrawerProps {
  onFilterChange: (filters: SearchFilters) => void;
  onClose?: () => void;
}

export function MobileFilterDrawer({ 
  onFilterChange,
  onClose
}: MobileFilterDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(null);
  const [selectedChildCategory, setSelectedChildCategory] = useState<number | null>(null);
  const [condition, setCondition] = useState<'' | 'new' | 'used' | null>(null);
  const [hasImage, setHasImage] = useState(false);
  const [hasDelivery, setHasDelivery] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'price_asc' | 'price_desc'>('newest');
  
  // Sample data for the drawer - in a real app, this would come from props or API
  const subcategories = [
    { id: 1, name: 'سيارات' },
    { id: 2, name: 'عقارات' },
    { id: 3, name: 'إلكترونيات' },
  ];
  
  const childCategories = [
    { id: 1, name: 'تويوتا' },
    { id: 2, name: 'نيسان' },
    { id: 3, name: 'هوندا' },
  ];
  
  const cities = [
    { id: 1, name: 'الرياض' },
    { id: 2, name: 'جدة' },
    { id: 3, name: 'مكة' },
  ];
  
  const handleApplyFilters = () => {
    const filters: SearchFilters = {};
    
    if (searchTerm) {
      filters.search = searchTerm;
    }
    
    if (selectedSubcategory) {
      filters.subcategory_id = selectedSubcategory;
    }
    
    if (selectedChildCategory) {
      filters.child_category_id = selectedChildCategory;
    }
    
    if (selectedCity) {
      filters.city = selectedCity;
    }
    
    if (condition) {
      filters.condition = condition;
    }
    
    if (priceRange[0] > 0 || priceRange[1] < 100000) {
      filters.min_price = priceRange[0];
      filters.max_price = priceRange[1];
    }
    
    if (hasImage) {
      filters.has_image = true;
    }
    
    if (hasDelivery) {
      filters.has_delivery = true;
    }
    
    if (sortBy) {
      filters.sort_by = sortBy;
    }
    
    onFilterChange(filters);
    setIsOpen(false);
    
    if (onClose) {
      onClose();
    }
  };
  
  const handleReset = () => {
    setSearchTerm('');
    setPriceRange([0, 100000]);
    setSelectedCity(null);
    setSelectedSubcategory(null);
    setSelectedChildCategory(null);
    setCondition(null);
    setHasImage(false);
    setHasDelivery(false);
    setSortBy('newest');
    
    onFilterChange({});
    
    if (onClose) {
      onClose();
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 flex-shrink-0 bg-white dark:bg-dark-card dark:border-dark-border"
        >
          <Filter className="w-4 h-4 text-brand" />
          <span className="text-sm">فلترة</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[90vh] overflow-auto dark:bg-dark-background dark:border-t dark:border-dark-border">
        <DrawerHeader>
          <DrawerTitle className="text-right dark:text-white">خيارات الفلترة</DrawerTitle>
          <DrawerDescription className="text-right dark:text-gray-400">
            قم بضبط الفلاتر لتحسين نتائج البحث
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="px-4 space-y-6">
          {/* Search */}
          <div className="space-y-2">
            <Label className="dark:text-gray-200">بحث</Label>
            <Input 
              placeholder="ابحث عن منتجات..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="dark:bg-dark-card dark:border-dark-border dark:text-gray-200"
            />
          </div>
          
          <Separator className="dark:bg-dark-border" />
          
          {/* Subcategories */}
          <div className="space-y-2">
            <Label className="dark:text-gray-200">التصنيف الفرعي</Label>
            <Select
              value={selectedSubcategory?.toString() || ""}
              onValueChange={(value) => setSelectedSubcategory(value ? parseInt(value, 10) : null)}
            >
              <SelectTrigger className="dark:bg-dark-card dark:border-dark-border dark:text-gray-200">
                <SelectValue placeholder="اختر التصنيف الفرعي" />
              </SelectTrigger>
              <SelectContent className="dark:bg-dark-card dark:border-dark-border">
                <SelectItem value="all">الكل</SelectItem>
                {subcategories.map((subcategory) => (
                  <SelectItem key={subcategory.id} value={subcategory.id.toString()}>
                    {subcategory.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Child categories */}
          <div className="space-y-2">
            <Label className="dark:text-gray-200">التصنيف الفرعي الثانوي</Label>
            <Select
              value={selectedChildCategory?.toString() || ""}
              onValueChange={(value) => setSelectedChildCategory(value ? parseInt(value, 10) : null)}
            >
              <SelectTrigger className="dark:bg-dark-card dark:border-dark-border dark:text-gray-200">
                <SelectValue placeholder="اختر التصنيف الفرعي الثانوي" />
              </SelectTrigger>
              <SelectContent className="dark:bg-dark-card dark:border-dark-border">
                <SelectItem value="all">الكل</SelectItem>
                {childCategories.map((childCategory) => (
                  <SelectItem key={childCategory.id} value={childCategory.id.toString()}>
                    {childCategory.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Separator className="dark:bg-dark-border" />
          
          {/* Cities */}
          <div className="space-y-2">
            <Label className="dark:text-gray-200">المدينة</Label>
            <Select
              value={selectedCity || ""}
              onValueChange={(value) => setSelectedCity(value || null)}
            >
              <SelectTrigger className="dark:bg-dark-card dark:border-dark-border dark:text-gray-200">
                <SelectValue placeholder="اختر المدينة" />
              </SelectTrigger>
              <SelectContent className="dark:bg-dark-card dark:border-dark-border">
                <SelectItem value="all">الكل</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city.id} value={city.name}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Separator className="dark:bg-dark-border" />
          
          {/* Price range */}
          <div className="space-y-4">
            <Label className="dark:text-gray-200">نطاق السعر</Label>
            <Slider
              defaultValue={[0, 100000]}
              min={0}
              max={100000}
              step={1000}
              value={priceRange}
              onValueChange={(value) => setPriceRange(value as [number, number])}
              className="dark:bg-dark-muted"
            />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground dark:text-gray-400">
                {priceRange[0]} ريال
              </span>
              <span className="text-sm text-muted-foreground dark:text-gray-400">
                {priceRange[1] === 100000 ? '100,000+ ريال' : `${priceRange[1]} ريال`}
              </span>
            </div>
          </div>
          
          <Separator className="dark:bg-dark-border" />
          
          {/* Condition */}
          <div className="space-y-2">
            <Label className="dark:text-gray-200">الحالة</Label>
            <RadioGroup 
              value={condition || ""} 
              onValueChange={(value) => setCondition(value as '' | 'new' | 'used' || null)}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="" id="mobile-condition-all" className="dark:border-dark-border" />
                <Label htmlFor="mobile-condition-all" className="dark:text-gray-200">الكل</Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="new" id="mobile-condition-new" className="dark:border-dark-border" />
                <Label htmlFor="mobile-condition-new" className="dark:text-gray-200">جديد</Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="used" id="mobile-condition-used" className="dark:border-dark-border" />
                <Label htmlFor="mobile-condition-used" className="dark:text-gray-200">مستعمل</Label>
              </div>
            </RadioGroup>
          </div>
          
          <Separator className="dark:bg-dark-border" />
          
          {/* Additional filters */}
          <div className="space-y-2">
            <Label className="dark:text-gray-200">خيارات إضافية</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox 
                  id="mobile-has-image" 
                  checked={hasImage}
                  onCheckedChange={(checked) => setHasImage(checked as boolean)}
                  className="dark:border-dark-border"
                />
                <Label htmlFor="mobile-has-image" className="dark:text-gray-200">يحتوي على صور</Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox 
                  id="mobile-has-delivery" 
                  checked={hasDelivery}
                  onCheckedChange={(checked) => setHasDelivery(checked as boolean)}
                  className="dark:border-dark-border"
                />
                <Label htmlFor="mobile-has-delivery" className="dark:text-gray-200">يوفر توصيل</Label>
              </div>
            </div>
          </div>
          
          <Separator className="dark:bg-dark-border" />
          
          {/* Sort by */}
          <div className="space-y-2">
            <Label className="dark:text-gray-200">ترتيب حسب</Label>
            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value as 'newest' | 'oldest' | 'price_asc' | 'price_desc')}
            >
              <SelectTrigger className="dark:bg-dark-card dark:border-dark-border dark:text-gray-200">
                <SelectValue placeholder="الترتيب" />
              </SelectTrigger>
              <SelectContent className="dark:bg-dark-card dark:border-dark-border">
                <SelectItem value="newest">الأحدث</SelectItem>
                <SelectItem value="oldest">الأقدم</SelectItem>
                <SelectItem value="price_asc">السعر: من الأقل للأعلى</SelectItem>
                <SelectItem value="price_desc">السعر: من الأعلى للأقل</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DrawerFooter className="flex flex-row gap-3">
          <Button 
            onClick={handleReset}
            variant="outline"
            className="flex-1 dark:bg-dark-card dark:border-dark-border dark:text-gray-200 dark:hover:bg-dark-muted"
          >
            إعادة ضبط
          </Button>
          <Button 
            onClick={handleApplyFilters}
            className="flex-1"
          >
            تطبيق الفلاتر
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
