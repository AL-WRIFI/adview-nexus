
import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, ChevronDown, X, DollarSign, Package, Star, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useStates, useAllCities } from '@/hooks/use-api';
import { useCityDistricts } from '@/hooks/use-districts';
import { SearchFilters } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { requestUserLocation, getStoredLocation } from '@/utils/location';

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
  currentLayout,
  onFilterChange,
  selectedCategory
}: AdFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedStateId, setSelectedStateId] = useState<number | undefined>();
  const [selectedCityId, setSelectedCityId] = useState<number | undefined>();
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | undefined>();
  const [nearbyEnabled, setNearbyEnabled] = useState(false);
  const [nearbyRadius, setNearbyRadius] = useState(5);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [condition, setCondition] = useState<'new' | 'used' | 'refurbished' | ''>('');
  const [listingType, setListingType] = useState<'sell' | 'rent' | 'wanted' | 'exchange' | 'service' | ''>('');
  const [individualOwners, setIndividualOwners] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'popular' | 'created_at' | 'updated_at'>('newest');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  const isMobile = useIsMobile();
  
  // API hooks
  const { data: states = [] } = useStates();
  const { data: cities = [] } = useAllCities();
  const { data: districts = [] } = useCityDistricts(selectedCityId);

  // Get cities for selected state
  const stateCities = selectedStateId 
    ? cities.filter(city => city.state_id === selectedStateId)
    : [];

  // Check for stored location on component mount
  useEffect(() => {
    const stored = getStoredLocation();
    if (stored) {
      setUserLocation({ lat: stored.lat, lng: stored.lng });
    }
  }, []);

  const handleLocationToggle = async (enabled: boolean) => {
    setNearbyEnabled(enabled);
    
    if (enabled && !userLocation) {
      setIsLoadingLocation(true);
      try {
        const location = await requestUserLocation();
        setUserLocation({ lat: location.lat, lng: location.lng });
      } catch (error) {
        console.error('Error getting location:', error);
        setNearbyEnabled(false);
      } finally {
        setIsLoadingLocation(false);
      }
    }
  };

  // Apply filters - only when button is clicked
  const applyFilters = () => {
    const filters: SearchFilters = {
      search: searchTerm || undefined,
      min_price: minPrice ? parseInt(minPrice) : undefined,
      max_price: maxPrice ? parseInt(maxPrice) : undefined,
      state_id: selectedStateId,
      city_id: selectedCityId,
      district_id: selectedDistrictId,
      condition: condition || undefined,
      listing_type: listingType || undefined,
      featured: featuredOnly || undefined,
      sort: sortBy || undefined,
      verified_user: individualOwners || undefined,
      ...(nearbyEnabled && userLocation ? {
        lat: userLocation.lat,
        lon: userLocation.lng,
        radius: nearbyRadius
      } : {})
    };

    onFilterChange(filters);
    if (isMobile) {
      setIsSheetOpen(false);
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setMinPrice('');
    setMaxPrice('');
    setSelectedStateId(undefined);
    setSelectedCityId(undefined);
    setSelectedDistrictId(undefined);
    setNearbyEnabled(false);
    setNearbyRadius(5);
    setFeaturedOnly(false);
    setCondition('');
    setListingType('');
    setIndividualOwners(false);
    setSortBy('newest');
    onFilterChange({});
    if (isMobile) {
      setIsSheetOpen(false);
    }
  };

  // Count active filters
  const activeFiltersCount = [
    searchTerm,
    minPrice,
    maxPrice,
    selectedStateId,
    selectedCityId,
    selectedDistrictId,
    condition,
    listingType,
    featuredOnly ? 1 : 0,
    individualOwners ? 1 : 0,
    nearbyEnabled ? 1 : 0
  ].filter(Boolean).length;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-brand" />
          <Label className="text-sm font-medium">البحث</Label>
        </div>
        <Input
          placeholder="ابحث عن أي شيء..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-10"
        />
      </div>

      <Separator />

      {/* Price Range */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-brand" />
          <Label className="text-sm font-medium">السعر</Label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">من</Label>
            <Input
              type="number"
              placeholder="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="text-right"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">إلى</Label>
            <Input
              type="number"
              placeholder="∞"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="text-right"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Location */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-brand" />
          <Label className="text-sm font-medium">المنطقة والمدينة</Label>
        </div>
        
        <Select value={selectedStateId?.toString() || 'all'} onValueChange={(value) => {
          setSelectedStateId(value === 'all' ? undefined : parseInt(value));
          setSelectedCityId(undefined);
          setSelectedDistrictId(undefined);
        }}>
          <SelectTrigger className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <SelectValue placeholder="اختر المنطقة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع المناطق</SelectItem>
            {states.map((state) => (
              <SelectItem key={state.id} value={state.id.toString()}>
                {state.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedStateId && stateCities.length > 0 && (
          <Select value={selectedCityId?.toString() || 'all'} onValueChange={(value) => {
            setSelectedCityId(value === 'all' ? undefined : parseInt(value));
            setSelectedDistrictId(undefined);
          }}>
            <SelectTrigger className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <SelectValue placeholder="اختر المدينة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع المدن</SelectItem>
              {stateCities.map((city) => (
                <SelectItem key={city.id} value={city.id.toString()}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {selectedCityId && districts.length > 0 && (
          <Select value={selectedDistrictId?.toString() || 'all'} onValueChange={(value) => {
            setSelectedDistrictId(value === 'all' ? undefined : parseInt(value));
          }}>
            <SelectTrigger className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <SelectValue placeholder="اختر الحي" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الأحياء</SelectItem>
              {districts.map((district) => (
                <SelectItem key={district.id} value={district.id.toString()}>
                  {district.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <Separator />

      {/* Nearby Filter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand" />
            <Label className="text-sm font-medium">القريب مني</Label>
          </div>
          <Switch
            checked={nearbyEnabled}
            onCheckedChange={handleLocationToggle}
            disabled={isLoadingLocation}
          />
        </div>
        
        {nearbyEnabled && (
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">المسافة (كلم)</Label>
            <Select value={nearbyRadius.toString()} onValueChange={(value) => setNearbyRadius(parseInt(value))}>
              <SelectTrigger className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 كلم</SelectItem>
                <SelectItem value="10">10 كلم</SelectItem>
                <SelectItem value="20">20 كلم</SelectItem>
                <SelectItem value="50">50 كلم</SelectItem>
                <SelectItem value="80">80 كلم</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {isLoadingLocation && (
          <p className="text-xs text-muted-foreground">جاري تحديد الموقع...</p>
        )}
      </div>

      <Separator />

      {/* Featured Only */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-brand" />
          <Label className="text-sm font-medium">الإعلانات المميزة فقط</Label>
        </div>
        <Switch
          checked={featuredOnly}
          onCheckedChange={setFeaturedOnly}
        />
      </div>

      <Separator />

      {/* Condition */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-brand" />
          <Label className="text-sm font-medium">حالة السلعة</Label>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: '', label: 'الكل' },
            { value: 'new', label: 'جديد' },
            { value: 'used', label: 'مستخدم' }
          ].map((item) => (
            <Button
              key={item.value}
              variant={condition === item.value ? "default" : "outline"}
              size="sm"
              onClick={() => setCondition(item.value as any)}
              className="text-xs h-9 rounded-lg border-2 transition-all duration-200 hover:scale-105"
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Listing Type */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-brand" />
          <Label className="text-sm font-medium">نوع الإعلان</Label>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: '', label: 'الكل' },
            { value: 'sell', label: 'بيع' },
            { value: 'wanted', label: 'مطلوب' },
            { value: 'rent', label: 'إيجار' },
            { value: 'exchange', label: 'مقايضة' },
            { value: 'service', label: 'وظائف' }
          ].map((item) => (
            <Button
              key={item.value}
              variant={listingType === item.value ? "default" : "outline"}
              size="sm"
              onClick={() => setListingType(item.value as any)}
              className="text-xs h-9 rounded-lg border-2 transition-all duration-200 hover:scale-105"
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Individual Owners Only */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-brand" />
          <Label className="text-sm font-medium">إعلانات المُلّاك الأفراد فقط</Label>
        </div>
        <Switch
          checked={individualOwners}
          onCheckedChange={setIndividualOwners}
        />
      </div>

      <Separator />

      {/* Sort */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-brand" />
          <Label className="text-sm font-medium">ترتيب الإعلانات من</Label>
        </div>
        <Select value={sortBy || 'default'} onValueChange={(value) => setSortBy(value === 'default' ? 'newest' : value as any)}>
          <SelectTrigger className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">الافتراضي</SelectItem>
            <SelectItem value="newest">الأحدث</SelectItem>
            <SelectItem value="oldest">الأقدم</SelectItem>
            <SelectItem value="price_asc">السعر: الأقل للأعلى</SelectItem>
            <SelectItem value="price_desc">السعر: الأعلى للأقل</SelectItem>
            <SelectItem value="popular">الأكثر مشاهدة</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t">
        <Button 
          variant="outline" 
          onClick={resetFilters} 
          className="flex-1 h-11 rounded-lg border-2 hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-all duration-200"
        >
          <X className="w-4 h-4 ml-2" />
          إعادة تعيين
        </Button>
        <Button 
          onClick={applyFilters} 
          className="flex-1 h-11 rounded-lg bg-brand hover:bg-brand/90 transition-all duration-200 hover:scale-105"
        >
          <Filter className="w-4 h-4 ml-2" />
          تطبيق الفلاتر ({activeFiltersCount})
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="relative flex items-center gap-2 h-9 px-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-brand dark:hover:border-brand transition-all duration-200 rounded-lg"
          >
            <Filter className="w-4 h-4 text-brand" />
            <span className="text-sm font-medium">فلترة</span>
            {activeFiltersCount > 0 && (
              <Badge variant="destructive" className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent 
          side="bottom" 
          className="h-[85vh] rounded-t-3xl border-0 bg-white dark:bg-gray-900 p-0 overflow-hidden"
        >
          <div className="flex flex-col h-full">
            <SheetHeader className="p-6 pb-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-xl font-bold text-right flex items-center gap-2">
                  <Filter className="w-5 h-5 text-brand" />
                  خيارات التصفية
                </SheetTitle>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="bg-brand/10 text-brand">
                    {activeFiltersCount} فلتر نشط
                  </Badge>
                )}
              </div>
            </SheetHeader>
            
            <div className="flex-1 overflow-y-auto p-6">
              <FilterContent />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-5 h-5 text-brand" />
        <h3 className="text-lg font-semibold">خيارات التصفية</h3>
        {activeFiltersCount > 0 && (
          <Badge variant="secondary" className="bg-brand/10 text-brand">
            {activeFiltersCount} فلتر نشط
          </Badge>
        )}
      </div>
      <FilterContent />
    </div>
  );
}
