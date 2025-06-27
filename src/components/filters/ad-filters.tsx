
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
  Package,
  Tag,
  Building
} from 'lucide-react';
import { SearchFilters } from '@/types';
import { useCategories, useBrands, useStates, useCities } from '@/hooks/use-api';
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
    search: true,
    subcategories: true,
    brands: true,  
    categories: true,
    price: true,
    location: true,
    condition: true,
    listingType: true,
    features: true
  });

  const { data: categories } = useCategories();
  const { data: brands } = useBrands();
  const { data: states } = useStates();
  const { data: cities } = useCities(filters.state_id);

  const getCategoryImage = (category: any) => {
    if (category.image_url) return category.image_url;
    if (category.image) return category.image;
    if (category.icon_url) return category.icon_url;
    
    // Default images based on category name
    const defaultImages: Record<string, string> = {
      'سيارات': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=200&h=150&fit=crop&crop=center',
      'عقارات': 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=200&h=150&fit=crop&crop=center',
      'إلكترونيات': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200&h=150&fit=crop&crop=center',
      'أثاث': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=150&fit=crop&crop=center',
      'أزياء': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=150&fit=crop&crop=center',
      'وظائف': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=150&fit=crop&crop=center',
      'خدمات': 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=200&h=150&fit=crop&crop=center',
      'رياضة': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=150&fit=crop&crop=center',
      'هواتف': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=150&fit=crop&crop=center',
      'كتب': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=150&fit=crop&crop=center'
    };
    
    for (const [key, image] of Object.entries(defaultImages)) {
      if (category.name.includes(key)) return image;
    }
    
    return 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=200&h=150&fit=crop&crop=center';
  };

  const getBrandImage = (brand: any) => {
    if (brand.logo_url) return brand.logo_url;
    if (brand.image) return brand.image;
    if (brand.logo) return brand.logo;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(brand.name)}&size=120&background=f8fafc&color=1e293b&font-size=0.4`;
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
  const [displayedSubcategories, setDisplayedSubcategories] = useState<any[]>([]);

  useEffect(() => {
    if (selectedCategoryObj?.subcategories) {
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
    <div className="space-y-6 w-80">
      {/* Search Section */}
      <Collapsible open={openSections.search} onOpenChange={() => toggleSection('search')}>
        <Card className="shadow-lg border-2 border-brand/20 bg-gradient-to-br from-white to-brand/5 dark:from-dark-card dark:to-brand/5">
          <CollapsibleTrigger className="w-full">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between text-lg">
                <div className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-brand" />
                  البحث والفلترة
                </div>
                <ChevronDown className={cn("h-4 w-4 transition-transform", openSections.search && "rotate-180")} />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ابحث عن أي منتج أو خدمة..."
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
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Subcategories Section */}
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
                <ScrollArea className="h-80">
                  {subcategoryViewMode === 'grid' ? (
                    <div className="grid grid-cols-2 gap-3">
                      {displayedSubcategories.map((subcategory) => (
                        <div 
                          key={subcategory.id}
                          className={cn(
                            "flex flex-col items-center gap-2 p-3 cursor-pointer transition-all hover:bg-muted/50 rounded-xl border-2 border-transparent hover:border-brand/30",
                            filters.subcategory_id === subcategory.id && "bg-brand/10 border-brand/50"
                          )}
                          onClick={() => updateFilters({ 
                            subcategory_id: filters.subcategory_id === subcategory.id ? undefined : subcategory.id 
                          })}
                        >
                          <div className="w-20 h-16 overflow-hidden flex-shrink-0 rounded-lg shadow-sm">
                            <img
                              src={getCategoryImage(subcategory)}
                              alt={subcategory.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=200&h=150&fit=crop';
                              }}
                            />
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-xs truncate w-full leading-tight">{subcategory.name}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {displayedSubcategories.map((subcategory) => (
                        <div 
                          key={subcategory.id}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all hover:bg-muted/50 border-2 border-transparent hover:border-brand/30",
                            filters.subcategory_id === subcategory.id && "bg-brand/10 border-brand/50"
                          )}
                          onClick={() => updateFilters({ 
                            subcategory_id: filters.subcategory_id === subcategory.id ? undefined : subcategory.id 
                          })}
                        >
                          <div className="w-16 h-14 overflow-hidden flex-shrink-0 rounded-lg shadow-sm">
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
                            checked={filters.subcategory_id === subcategory.id}
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

      {/* Brands Section */}
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
              <ScrollArea className="h-80">
                {brandViewMode === 'grid' ? (
                  <div className="grid grid-cols-2 gap-3">
                    {brands?.slice(0, 24).map((brand) => (
                      <div 
                        key={brand.id}
                        className={cn(
                          "flex flex-col items-center gap-2 p-3 cursor-pointer transition-all hover:bg-muted/50 rounded-xl border-2 border-transparent hover:border-brand/30",
                          filters.brand_id === brand.id && "bg-brand/10 border-brand/50"
                        )}
                        onClick={() => updateFilters({ 
                          brand_id: filters.brand_id === brand.id ? undefined : brand.id 
                        })}
                      >
                        <div className="w-16 h-16 overflow-hidden flex-shrink-0 bg-gray-50 rounded-lg shadow-sm">
                          <img
                            src={getBrandImage(brand)}
                            alt={brand.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-xs text-center font-medium truncate w-full leading-tight">
                          {brand.name}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {brands?.slice(0, 20).map((brand) => (
                      <div 
                        key={brand.id}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all hover:bg-muted/50 border-2 border-transparent hover:border-brand/30",
                          filters.brand_id === brand.id && "bg-brand/10 border-brand/50"
                        )}
                        onClick={() => updateFilters({ 
                          brand_id: filters.brand_id === brand.id ? undefined : brand.id 
                        })}
                      >
                        <div className="w-16 h-16 overflow-hidden flex-shrink-0 bg-gray-50 rounded-lg shadow-sm">
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

      {/* Categories Section */}
      <Collapsible open={openSections.categories} onOpenChange={() => toggleSection('categories')}>
        <Card className="shadow-lg border border-border dark:border-dark-border">
          <CollapsibleTrigger className="w-full">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between text-base">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-brand" />
                  التصنيفات الرئيسية
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
              <ScrollArea className="h-96">
                {categoryViewMode === 'grid' ? (
                  <div className="grid grid-cols-2 gap-3">
                    {categories?.map((category) => (
                      <div 
                        key={category.id}
                        className={cn(
                          "flex flex-col items-center gap-2 p-3 cursor-pointer transition-all hover:bg-muted/50 rounded-xl border-2 border-transparent hover:border-brand/30",
                          filters.category_id === category.id && "bg-brand/10 border-brand/50"
                        )}
                        onClick={() => updateFilters({ 
                          category_id: filters.category_id === category.id ? undefined : category.id,
                          subcategory_id: undefined // Reset subcategory when changing category
                        })}
                      >
                        <div className="w-20 h-16 overflow-hidden flex-shrink-0 rounded-lg shadow-sm">
                          <img
                            src={getCategoryImage(category)}
                            alt={category.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=200&h=150&fit=crop';
                            }}
                          />
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-xs truncate w-full leading-tight">{category.name}</div>
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
                          "flex items-center gap-3 p-3 cursor-pointer transition-all hover:bg-muted/50 rounded-xl border-2 border-transparent hover:border-brand/30",
                          filters.category_id === category.id && "bg-brand/10 border-brand/50"
                        )}
                        onClick={() => updateFilters({ 
                          category_id: filters.category_id === category.id ? undefined : category.id,
                          subcategory_id: undefined
                        })}
                      >
                        <div className="w-20 h-16 overflow-hidden flex-shrink-0 rounded-lg shadow-sm">
                          <img
                            src={getCategoryImage(category)}
                            alt={category.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=200&h=150&fit=crop';
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

      {/* Price Range Section */}
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
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="من"
                  value={filters.min_price || ''}
                  onChange={(e) => updateFilters({ min_price: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="rounded-lg"
                />
                <Input
                  type="number"
                  placeholder="إلى"
                  value={filters.max_price || ''}
                  onChange={(e) => updateFilters({ max_price: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="rounded-lg"
                />
              </div>
              
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

      {/* Location Section */}
      <Collapsible open={openSections.location} onOpenChange={() => toggleSection('location')}>
        <Card className="shadow-lg border border-border dark:border-dark-border">
          <CollapsibleTrigger className="w-full">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between text-base">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-brand" />
                  الموقع الجغرافي
                </div>
                <ChevronDown className={cn("h-4 w-4 transition-transform", openSections.location && "rotate-180")} />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <Select value={filters.state_id?.toString() || 'all'} onValueChange={(value) => updateFilters({ 
                state_id: value === 'all' ? undefined : parseInt(value),
                city_id: undefined // Reset city when changing state
              })}>
                <SelectTrigger className="rounded-lg border-2 focus:border-brand">
                  <SelectValue placeholder="اختر المحافظة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">كل المحافظات</SelectItem>
                  {states?.map((state) => (
                    <SelectItem key={state.id} value={state.id.toString()}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {filters.state_id && (
                <Select value={filters.city_id?.toString() || 'all'} onValueChange={(value) => updateFilters({ 
                  city_id: value === 'all' ? undefined : parseInt(value) 
                })}>
                  <SelectTrigger className="rounded-lg border-2 focus:border-brand">
                    <SelectValue placeholder="اختر المدينة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">كل المدن</SelectItem>
                    {cities?.map((city) => (
                      <SelectItem key={city.id} value={city.id.toString()}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <div className="flex gap-2">
                <Input
                  type="number"
                  step="any"
                  placeholder="خط العرض"
                  value={filters.lat || ''}
                  onChange={(e) => updateFilters({ lat: e.target.value ? parseFloat(e.target.value) : undefined })}
                  className="rounded-lg"
                />
                <Input
                  type="number"
                  step="any"
                  placeholder="خط الطول"
                  value={filters.lon || ''}
                  onChange={(e) => updateFilters({ lon: e.target.value ? parseFloat(e.target.value) : undefined })}
                  className="rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label>نطاق البحث (كم)</Label>
                <Select value={filters.radius?.toString() || '10'} onValueChange={(value) => updateFilters({ radius: parseInt(value) })}>
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="اختر النطاق" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 كم</SelectItem>
                    <SelectItem value="5">5 كم</SelectItem>
                    <SelectItem value="10">10 كم</SelectItem>
                    <SelectItem value="25">25 كم</SelectItem>
                    <SelectItem value="50">50 كم</SelectItem>
                    <SelectItem value="100">100 كم</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Condition Section */}
      <Collapsible open={openSections.condition} onOpenChange={() => toggleSection('condition')}>
        <Card className="shadow-lg border border-border dark:border-dark-border">
          <CollapsibleTrigger className="w-full">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between text-base">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-brand" />
                  حالة المنتج
                </div>
                <ChevronDown className={cn("h-4 w-4 transition-transform", openSections.condition && "rotate-180")} />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <CardContent className="space-y-3">
              {[
                { value: 'new', label: 'جديد' },
                { value: 'used', label: 'مستعمل' },
                { value: 'refurbished', label: 'مُجدد' }
              ].map((condition) => (
                <div 
                  key={condition.value}
                  className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer p-2 rounded-lg hover:bg-muted/50"
                  onClick={() => updateFilters({ 
                    condition: filters.condition === condition.value ? undefined : condition.value as any
                  })}
                >
                  <Checkbox 
                    checked={filters.condition === condition.value}
                    onChange={() => {}}
                    className="pointer-events-none"
                  />
                  <Label className="cursor-pointer">{condition.label}</Label>
                </div>
              ))}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Listing Type Section */}
      <Collapsible open={openSections.listingType} onOpenChange={() => toggleSection('listingType')}>
        <Card className="shadow-lg border border-border dark:border-dark-border">
          <CollapsibleTrigger className="w-full">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between text-base">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-brand" />
                  نوع الإعلان
                </div>
                <ChevronDown className={cn("h-4 w-4 transition-transform", openSections.listingType && "rotate-180")} />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <CardContent className="space-y-3">
              {[
                { value: 'sell', label: 'للبيع' },
                { value: 'rent', label: 'للإيجار' },
                { value: 'wanted', label: 'مطلوب' },
                { value: 'exchange', label: 'للمقايضة' },
                { value: 'service', label: 'خدمة' }
              ].map((type) => (
                <div 
                  key={type.value}
                  className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer p-2 rounded-lg hover:bg-muted/50"
                  onClick={() => updateFilters({ 
                    listing_type: filters.listing_type === type.value ? undefined : type.value as any
                  })}
                >
                  <Checkbox 
                    checked={filters.listing_type === type.value}
                    onChange={() => {}}
                    className="pointer-events-none"
                  />
                  <Label className="cursor-pointer">{type.label}</Label>
                </div>
              ))}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Features Section */}
      <Collapsible open={openSections.features} onOpenChange={() => toggleSection('features')}>
        <Card className="shadow-lg border border-border dark:border-dark-border">
          <CollapsibleTrigger className="w-full">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between text-base">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-brand" />
                  المميزات الخاصة
                </div>
                <ChevronDown className={cn("h-4 w-4 transition-transform", openSections.features && "rotate-180")} />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <CardContent className="space-y-3">
              <div 
                className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer p-2 rounded-lg hover:bg-muted/50"
                onClick={() => updateFilters({ 
                  featured: !filters.featured
                })}
              >
                <Checkbox 
                  checked={filters.featured || false}
                  onChange={() => {}}
                  className="pointer-events-none"
                />
                <Label className="cursor-pointer">إعلانات مميزة</Label>
              </div>

              <div 
                className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer p-2 rounded-lg hover:bg-muted/50"
                onClick={() => updateFilters({ 
                  verified_user: !filters.verified_user
                })}
              >
                <Checkbox 
                  checked={filters.verified_user || false}
                  onChange={() => {}}
                  className="pointer-events-none"
                />
                <Label className="cursor-pointer">مستخدمين موثقين</Label>
              </div>

              <div 
                className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer p-2 rounded-lg hover:bg-muted/50"
                onClick={() => updateFilters({ 
                  with_images: !filters.with_images
                })}
              >
                <Checkbox 
                  checked={filters.with_images || false}
                  onChange={() => {}}
                  className="pointer-events-none"
                />
                <Label className="cursor-pointer">مع صور فقط</Label>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Sort and Layout Section */}
      {onLayoutChange && (
        <Card className="shadow-lg border border-border dark:border-dark-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Grid2X2 className="h-4 w-4 text-brand" />
              الترتيب والعرض
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>ترتيب النتائج</Label>
              <Select 
                value={filters.sort || 'newest'} 
                onValueChange={(value) => updateFilters({ 
                  sort: value as 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'popular' | 'created_at' | 'updated_at'
                })}
              >
                <SelectTrigger className="rounded-lg border-2 focus:border-brand">
                  <SelectValue placeholder="اختر الترتيب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">الأحدث</SelectItem>
                  <SelectItem value="oldest">الأقدم</SelectItem>
                  <SelectItem value="price_asc">السعر: من الأقل للأعلى</SelectItem>
                  <SelectItem value="price_desc">السعر: من الأعلى للأقل</SelectItem>
                  <SelectItem value="popular">الأكثر مشاهدة</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>نوع العرض</Label>
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
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
