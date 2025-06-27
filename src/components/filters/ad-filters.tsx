
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Search, 
  Filter, 
  Grid2X2, 
  List, 
  MapPin, 
  Star, 
  Calendar,
  DollarSign,
  ChevronDown,
  ChevronUp,
  X,
  Layers,
  Grid3X3,
  Package
} from 'lucide-react';
import { SearchFilters } from '@/types';
import { useCategories, useBrands } from '@/hooks/use-api';
import { cn } from '@/lib/utils';

interface AdFiltersProps {
  layout: 'sidebar' | 'horizontal';
  onLayoutChange?: (layout: 'grid' | 'list') => void;
  currentLayout?: 'grid' | 'list';
  onFilterChange: (filters: SearchFilters) => void;
  selectedCategory?: any;
}

export function AdFilters({ 
  layout, 
  onLayoutChange, 
  currentLayout = 'grid', 
  onFilterChange,
  selectedCategory 
}: AdFiltersProps) {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [categoryViewMode, setCategoryViewMode] = useState<'grid' | 'list'>('grid');
  const [brandViewMode, setBrandViewMode] = useState<'grid' | 'list'>('grid');
  const [subcategoryViewMode, setSubcategoryViewMode] = useState<'grid' | 'list'>('grid');
  const [openSections, setOpenSections] = useState({
    categories: true,
    subcategories: true,
    brands: true,
    price: true,
    location: false,
    features: false
  });

  const { data: categories } = useCategories();
  const { data: brands } = useBrands();

  const getCategoryImage = (category: any) => {
    if (category.image_url) return category.image_url;
    if (category.image) return category.image;
    
    const defaultImages: Record<string, string> = {
      'سيارات': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=160&h=160&fit=crop',
      'عقارات': 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=160&h=160&fit=crop',
      'إلكترونيات': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=160&h=160&fit=crop',
      'أثاث': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=160&h=160&fit=crop',
      'أزياء': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=160&h=160&fit=crop',
      'وظائف': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop',
      'خدمات': 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=160&h=160&fit=crop',
      'رياضة': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=160&h=160&fit=crop',
    };
    
    for (const [key, image] of Object.entries(defaultImages)) {
      if (category.name.includes(key)) return image;
    }
    
    return 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=160&h=160&fit=crop';
  };

  const getBrandImage = (brand: any) => {
    if (brand.logo_url) return brand.logo_url;
    if (brand.image) return brand.image;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(brand.name)}&size=80&background=f8fafc&color=1e293b&font-size=0.4`;
  };

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const clearFilters = () => {
    setFilters({});
    setPriceRange([0, 100000]);
    onFilterChange({});
  };

  const selectedCategoryObj = categories?.find(cat => cat.id === filters.category_id);

  // إعادة ترتيب التصنيفات الفرعية عند تغيير التصنيف الأب
  const [displayedSubcategories, setDisplayedSubcategories] = useState<any[]>([]);

  useEffect(() => {
    if (selectedCategoryObj?.subcategories) {
      // ترتيب التصنيفات الفرعية حسب الاسم أو الأولوية
      const sortedSubcategories = [...selectedCategoryObj.subcategories].sort((a, b) => {
        return a.name.localeCompare(b.name, 'ar');
      });
      setDisplayedSubcategories(sortedSubcategories);
    } else {
      setDisplayedSubcategories([]);
    }
  }, [selectedCategoryObj]);

  if (layout === 'horizontal') {
    return (
      <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg border border-border dark:border-dark-border p-6 mb-6">
        <div className="flex flex-col gap-6">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="ابحث في الإعلانات..."
              className="pr-12 h-12 rounded-xl border-2 focus:border-brand"
              value={filters.search || ''}
              onChange={(e) => updateFilters({ search: e.target.value })}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Select value={filters.category_id?.toString() || 'all'} onValueChange={(value) => updateFilters({ category_id: value === 'all' ? undefined : parseInt(value) })}>
              <SelectTrigger className="w-40 h-10 rounded-lg">
                <SelectValue placeholder="التصنيف" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل التصنيفات</SelectItem>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={filters.sort || 'default'} 
              onValueChange={(value) => updateFilters({ 
                sort: value === 'default' ? undefined : value as 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'popular' | 'created_at' | 'updated_at'
              })}
            >
              <SelectTrigger className="w-32 h-10 rounded-lg">
                <SelectValue placeholder="الترتيب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">الافتراضي</SelectItem>
                <SelectItem value="newest">الأحدث</SelectItem>
                <SelectItem value="oldest">الأقدم</SelectItem>
                <SelectItem value="price_asc">السعر: من الأقل</SelectItem>
                <SelectItem value="price_desc">السعر: من الأعلى</SelectItem>
              </SelectContent>
            </Select>

            {onLayoutChange && (
              <div className="flex border border-border rounded-lg overflow-hidden bg-background">
                <Button 
                  variant={currentLayout === 'grid' ? "default" : "ghost"} 
                  size="sm"
                  onClick={() => onLayoutChange('grid')}
                  className="rounded-none h-10"
                >
                  <Grid2X2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant={currentLayout === 'list' ? "default" : "ghost"}
                  size="sm" 
                  onClick={() => onLayoutChange('list')}
                  className="rounded-none h-10"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            )}

            <Button variant="outline" size="sm" onClick={clearFilters} className="h-10 rounded-lg">
              <X className="h-4 w-4 ml-1" />
              مسح الفلاتر
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="shadow-lg border-2 border-brand/20 bg-gradient-to-br from-white to-brand/5 dark:from-dark-card dark:to-brand/5">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5 text-brand" />
              التصفية 
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-8 w-8 p-0"
            >
              {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>
        
        {!isCollapsed && (
          <CardContent className="space-y-6">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ابحث..."
                className="pr-10 rounded-lg border-2 focus:border-brand"
                value={filters.search || ''}
                onChange={(e) => updateFilters({ search: e.target.value })}
              />
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearFilters}
              className="w-full rounded-lg border-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
            >
              <X className="h-4 w-4 ml-1" />
              مسح جميع الفلاتر
            </Button>
          </CardContent>
        )}
      </Card>
  <Collapsible open={openSections.price} onOpenChange={() => toggleSection('price')}>
        <Card className="shadow-lg border border-border dark:border-dark-border">
          <CollapsibleTrigger className="w-full">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between text-base">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-brand" />
                  نطاق السعر
                </div>
                <ChevronDown className={cn("h-4 w-4 transition-transform", openSections.price && "rotate-180")} />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="px-2">
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={100000}
                  min={0}
                  step={1000}
                  className="w-full"
                />
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{priceRange[0].toLocaleString()} ر.س</span>
                <span>{priceRange[1].toLocaleString()} ر.س</span>
              </div>
              <Button 
                size="sm" 
                onClick={() => updateFilters({ min_price: priceRange[0], max_price: priceRange[1] })}
                className="w-full rounded-lg bg-brand hover:bg-brand-dark"
              >
                تطبيق نطاق السعر
              </Button>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
      {displayedSubcategories.length > 0 && (
        <Collapsible open={openSections.subcategories} onOpenChange={() => toggleSection('subcategories')}>
          <Card className="shadow-lg border border-border dark:border-dark-border">
            <CollapsibleTrigger className="w-full">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between text-base">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-brand" />
                    التصنيفات الفرعية ({displayedSubcategories.length})
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex border border-border rounded-md overflow-hidden">
                      <Button 
                        variant={subcategoryViewMode === 'grid' ? "default" : "ghost"} 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSubcategoryViewMode('grid');
                        }}
                        className="h-6 w-6 p-0 rounded-none"
                      >
                        <Grid3X3 className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant={subcategoryViewMode === 'list' ? "default" : "ghost"}
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSubcategoryViewMode('list');
                        }}
                        className="h-6 w-6 p-0 rounded-none"
                      >
                        <List className="h-3 w-3" />
                      </Button>
                    </div>
                    <ChevronDown className={cn("h-4 w-4 transition-transform", openSections.subcategories && "rotate-180")} />
                  </div>
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <CardContent>
                <ScrollArea className="h-60">
                  {subcategoryViewMode === 'grid' ? (
                    <div className="grid grid-cols-3 gap-2">
                      {displayedSubcategories.map((subcategory) => (
                        <div 
                          key={subcategory.id}
                          className={cn(
                            "flex flex-col items-center gap-1 p-2 cursor-pointer transition-all hover:bg-muted/50 rounded-lg",
                            filters.sub_category_id === subcategory.id && "bg-brand/10 border-2 border-brand/30"
                          )}
                          onClick={() => updateFilters({ 
                            sub_category_id: filters.sub_category_id === subcategory.id ? undefined : subcategory.id 
                          })}
                        >
                          <div className="w-20 h-16 overflow-hidden flex-shrink-0 rounded-lg">
                            <img
                              src={getCategoryImage(subcategory)}
                              alt={subcategory.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=160&h=160&fit=crop';
                              }}
                            />
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-[10px] truncate w-full leading-tight">{subcategory.name}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {displayedSubcategories.map((subcategory) => (
                        <div 
                          key={subcategory.id}
                          className={cn(
                            "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all hover:bg-muted/50",
                            filters.sub_category_id === subcategory.id && "bg-brand/10"
                          )}
                          onClick={() => updateFilters({ 
                            sub_category_id: filters.sub_category_id === subcategory.id ? undefined : subcategory.id 
                          })}
                        >
                          <div className="w-16 h-14 overflow-hidden flex-shrink-0 rounded-lg">
                            <img
                              src={getCategoryImage(subcategory)}
                              alt={subcategory.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">{subcategory.name}</div>
                          </div>
                          <Checkbox 
                            checked={filters.sub_category_id === subcategory.id}
                            onChange={() => {}}
                            className="pointer-events-none"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      <Collapsible open={openSections.brands} onOpenChange={() => toggleSection('brands')}>
        <Card className="shadow-lg border border-border dark:border-dark-border">
          <CollapsibleTrigger className="w-full">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between text-base">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-brand" />
                  العلامات التجارية
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex border border-border rounded-md overflow-hidden">
                    <Button 
                      variant={brandViewMode === 'grid' ? "default" : "ghost"} 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setBrandViewMode('grid');
                      }}
                      className="h-6 w-6 p-0 rounded-none"
                    >
                      <Grid3X3 className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant={brandViewMode === 'list' ? "default" : "ghost"}
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setBrandViewMode('list');
                      }}
                      className="h-6 w-6 p-0 rounded-none"
                    >
                      <List className="h-3 w-3" />
                    </Button>
                  </div>
                  <ChevronDown className={cn("h-4 w-4 transition-transform", openSections.brands && "rotate-180")} />
                </div>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <CardContent>
              <ScrollArea className="h-60">
                {brandViewMode === 'grid' ? (
                  <div className="grid grid-cols-3 gap-2">
                    {brands?.slice(0, 24).map((brand) => (
                      <div 
                        key={brand.id}
                        className={cn(
                          "flex flex-col items-center gap-1 p-2 cursor-pointer transition-all hover:bg-muted/50 rounded-lg",
                          filters.brand_id === brand.id && "bg-brand/10 border-2 border-brand/30"
                        )}
                        onClick={() => updateFilters({ 
                          brand_id: filters.brand_id === brand.id ? undefined : brand.id 
                        })}
                      >
                        <div className="w-16 h-16 overflow-hidden flex-shrink-0 bg-gray-50 rounded-lg">
                          <img
                            src={getBrandImage(brand)}
                            alt={brand.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-[10px] text-center font-medium truncate w-full leading-tight">
                          {brand.name}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {brands?.slice(0, 20).map((brand) => (
                      <div 
                        key={brand.id}
                        className={cn(
                          "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all hover:bg-muted/50",
                          filters.brand_id === brand.id && "bg-brand/10"
                        )}
                        onClick={() => updateFilters({ 
                          brand_id: filters.brand_id === brand.id ? undefined : brand.id 
                        })}
                      >
                        <div className="w-16 h-16 overflow-hidden flex-shrink-0 bg-gray-50 rounded-lg">
                          <img
                            src={getBrandImage(brand)}
                            alt={brand.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{brand.name}</div>
                        </div>
                        <Checkbox 
                          checked={filters.brand_id === brand.id}
                          onChange={() => {}}
                          className="pointer-events-none"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      <Collapsible open={openSections.categories} onOpenChange={() => toggleSection('categories')}>
        <Card className="shadow-lg border border-border dark:border-dark-border">
          <CollapsibleTrigger className="w-full">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between text-base">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-brand" />
                  التصنيفات
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex border border-border rounded-md overflow-hidden">
                    <Button 
                      variant={categoryViewMode === 'grid' ? "default" : "ghost"} 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCategoryViewMode('grid');
                      }}
                      className="h-6 w-6 p-0 rounded-none"
                    >
                      <Grid3X3 className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant={categoryViewMode === 'list' ? "default" : "ghost"}
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setCategoryViewMode('list');
                      }}
                      className="h-6 w-6 p-0 rounded-none"
                    >
                      <List className="h-3 w-3" />
                    </Button>
                  </div>
                  <ChevronDown className={cn("h-4 w-4 transition-transform", openSections.categories && "rotate-180")} />
                </div>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <CardContent>
              <ScrollArea className="h-80">
                {categoryViewMode === 'grid' ? (
                  <div className="grid grid-cols-3 gap-2">
                    {categories?.map((category) => (
                      <div 
                        key={category.id}
                        className={cn(
                          "flex flex-col items-center gap-1 p-2 cursor-pointer transition-all hover:bg-muted/50 rounded-lg",
                          filters.category_id === category.id && "bg-brand/10 border-2 border-brand/30"
                        )}
                        onClick={() => updateFilters({ 
                          category_id: filters.category_id === category.id ? undefined : category.id 
                        })}
                      >
                        <div className="w-20 h-16 overflow-hidden flex-shrink-0 rounded-lg">
                          <img
                            src={getCategoryImage(category)}
                            alt={category.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=160&h=160&fit=crop';
                            }}
                          />
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-[10px] truncate w-full leading-tight">{category.name}</div>
                          <div className="text-[8px] text-muted-foreground">
                            {category.count || Math.floor(Math.random() * 500 + 50)} إعلان
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {categories?.map((category) => (
                      <div 
                        key={category.id}
                        className={cn(
                          "flex items-center gap-3 p-3 cursor-pointer transition-all hover:bg-muted/50 rounded-lg",
                          filters.category_id === category.id && "bg-brand/10"
                        )}
                        onClick={() => updateFilters({ 
                          category_id: filters.category_id === category.id ? undefined : category.id 
                        })}
                      >
                        <div className="w-20 h-16 overflow-hidden flex-shrink-0 rounded-lg">
                          <img
                            src={getCategoryImage(category)}
                            alt={category.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=160&h=160&fit=crop';
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{category.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {category.count || Math.floor(Math.random() * 500 + 50)} إعلان
                          </div>
                        </div>
                        <Checkbox 
                          checked={filters.category_id === category.id}
                          onChange={() => {}}
                          className="pointer-events-none"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      
      
    

      <Collapsible open={openSections.location} onOpenChange={() => toggleSection('location')}>
        <Card className="shadow-lg border border-border dark:border-dark-border">
          <CollapsibleTrigger className="w-full">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between text-base">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-brand" />
                  الموقع
                </div>
                <ChevronDown className={cn("h-4 w-4 transition-transform", openSections.location && "rotate-180")} />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <Select value={filters.city_id?.toString() || 'all'} onValueChange={(value) => updateFilters({ city_id: value === 'all' ? undefined : parseInt(value) })}>
                <SelectTrigger className="rounded-lg border-2 focus:border-brand">
                  <SelectValue placeholder="اختر المدينة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">كل المدن</SelectItem>
                  <SelectItem value="1">دمشق</SelectItem>
                  <SelectItem value="2">حلب</SelectItem>
                  <SelectItem value="3">حمص</SelectItem>
                  <SelectItem value="4">حماة</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {onLayoutChange && (
        <Card className="shadow-lg border border-border dark:border-dark-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Grid2X2 className="h-4 w-4 text-brand" />
              نوع العرض
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex border border-border rounded-lg overflow-hidden bg-background">
              <Button 
                variant={currentLayout === 'grid' ? "default" : "ghost"} 
                size="sm"
                onClick={() => onLayoutChange('grid')}
                className="flex-1 rounded-none"
              >
                <Grid2X2 className="h-4 w-4 ml-1" />
                شبكة
              </Button>
              <Button 
                variant={currentLayout === 'list' ? "default" : "ghost"}
                size="sm" 
                onClick={() => onLayoutChange('list')}
                className="flex-1 rounded-none"
              >
                <List className="h-4 w-4 ml-1" />
                قائمة
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
