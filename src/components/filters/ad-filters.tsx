
import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, ChevronDown, X } from 'lucide-react';
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
  const [condition, setCondition] = useState<string>('');
  const [listingType, setListingType] = useState<string>('');
  const [individualOwners, setIndividualOwners] = useState(false);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  
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

  // Apply filters
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
  };

  useEffect(() => {
    applyFilters();
  }, [
    searchTerm, minPrice, maxPrice, selectedStateId, selectedCityId, selectedDistrictId,
    condition, listingType, featuredOnly, sortBy, individualOwners,
    nearbyEnabled, nearbyRadius, userLocation
  ]);

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
  };

  // Count active filters
  const activeFiltersCount = [
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
      {/* Price Range */}
      <div>
        <Label className="text-sm font-medium mb-3 block">السعر</Label>
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
        <Label className="text-sm font-medium">المنطقة والمدينة</Label>
        
        <Select value={selectedStateId?.toString() || ''} onValueChange={(value) => {
          setSelectedStateId(value ? parseInt(value) : undefined);
          setSelectedCityId(undefined);
          setSelectedDistrictId(undefined);
        }}>
          <SelectTrigger>
            <SelectValue placeholder="اختر المنطقة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">جميع المناطق</SelectItem>
            {states.map((state) => (
              <SelectItem key={state.id} value={state.id.toString()}>
                {state.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedStateId && stateCities.length > 0 && (
          <Select value={selectedCityId?.toString() || ''} onValueChange={(value) => {
            setSelectedCityId(value ? parseInt(value) : undefined);
            setSelectedDistrictId(undefined);
          }}>
            <SelectTrigger>
              <SelectValue placeholder="اختر المدينة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">جميع المدن</SelectItem>
              {stateCities.map((city) => (
                <SelectItem key={city.id} value={city.id.toString()}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {selectedCityId && districts.length > 0 && (
          <Select value={selectedDistrictId?.toString() || ''} onValueChange={(value) => {
            setSelectedDistrictId(value ? parseInt(value) : undefined);
          }}>
            <SelectTrigger>
              <SelectValue placeholder="اختر الحي" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">جميع الأحياء</SelectItem>
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
          <Label className="text-sm font-medium">القريب مني</Label>
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
              <SelectTrigger>
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
        <Label className="text-sm font-medium">الإعلانات المميزة فقط</Label>
        <Switch
          checked={featuredOnly}
          onCheckedChange={setFeaturedOnly}
        />
      </div>

      <Separator />

      {/* Condition */}
      <div>
        <Label className="text-sm font-medium mb-3 block">حالة السلعة</Label>
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
              onClick={() => setCondition(item.value)}
              className="text-xs"
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Listing Type */}
      <div>
        <Label className="text-sm font-medium mb-3 block">نوع الإعلان</Label>
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
              onClick={() => setListingType(item.value)}
              className="text-xs"
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Individual Owners Only */}
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">إعلانات المُلّاك الأفراد فقط</Label>
        <Switch
          checked={individualOwners}
          onCheckedChange={setIndividualOwners}
        />
      </div>

      <Separator />

      {/* Sort */}
      <div>
        <Label className="text-sm font-medium mb-3 block">ترتيب الإعلانات من</Label>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">الأحدث</SelectItem>
            <SelectItem value="oldest">الأقدم</SelectItem>
            <SelectItem value="price_asc">السعر: الأقل للأعلى</SelectItem>
            <SelectItem value="price_desc">السعر: الأعلى للأقل</SelectItem>
            <SelectItem value="popular">الأكثر مشاهدة</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const AdvancedFiltersDropdown = () => (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
        className="flex items-center gap-2"
      >
        <Filter className="w-4 h-4" />
        <span>فلاتر متقدمة</span>
        {activeFiltersCount > 0 && (
          <Badge variant="secondary" className="ml-1">
            {activeFiltersCount}
          </Badge>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
      </Button>

      {showAdvancedFilters && (
        <div className="absolute top-full mt-2 left-0 w-80 bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-4 z-50 max-h-96 overflow-y-auto">
          <FilterContent />
          <div className="flex gap-2 pt-4 border-t mt-4">
            <Button variant="outline" onClick={resetFilters} className="flex-1">
              إعادة تعيين
            </Button>
            <Button onClick={() => setShowAdvancedFilters(false)} className="flex-1">
              تطبيق
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <div className="space-y-3">
        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="ابحث عن أي شيء..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
          <Button>
            <Search className="w-4 h-4" />
          </Button>
        </div>

        {/* Mobile Filter Sheet */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <span>فلترة النتائج</span>
              {activeFiltersCount > 0 && (
                <Badge variant="destructive" className="ml-auto">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
            <SheetHeader>
              <div className="flex items-center justify-between">
                <SheetTitle className="text-xl font-bold text-right">خيارات التصفية</SheetTitle>
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" onClick={resetFilters} size="sm">
                    <X className="w-4 h-4 mr-1" />
                    مسح الكل
                  </Button>
                )}
              </div>
            </SheetHeader>
            <div className="p-4 mt-4">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="ابحث عن أي شيء..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
        <Button>
          <Search className="w-4 h-4" />
        </Button>
      </div>

      {/* Advanced Filters Dropdown */}
      <AdvancedFiltersDropdown />

      {/* Desktop Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
        <FilterContent />
      </div>
    </div>
  );
}
