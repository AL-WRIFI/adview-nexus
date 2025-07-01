
import React, { useState } from 'react';
import { Search, Filter, MapPin, ChevronDown, X, DollarSign, Map, Star, Package2, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  const [tempFilters, setTempFilters] = useState<SearchFilters>({});
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
  
  const isMobile = useIsMobile();
  
  // API hooks
  const { data: states = [] } = useStates();
  const { data: cities = [] } = useAllCities();
  const { data: districts = [] } = useCityDistricts(selectedCityId);

  // Get cities for selected state
  const stateCities = selectedStateId 
    ? cities.filter(city => city.state_id === selectedStateId)
    : [];

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
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Search className="w-4 h-4 text-blue-600" />
            البحث
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="ابحث عن أي شيء..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <DollarSign className="w-4 h-4 text-green-600" />
            السعر
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm mb-2 block">من</Label>
              <Input
                type="number"
                placeholder="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="text-right"
              />
            </div>
            <div>
              <Label className="text-sm mb-2 block">إلى</Label>
              <Input
                type="number"
                placeholder="∞"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="text-right"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Map className="w-4 h-4 text-red-600" />
            المنطقة والمدينة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm mb-2 block">المحافظة</Label>
            <Select value={selectedStateId?.toString() || ''} onValueChange={(value) => {
              setSelectedStateId(value ? parseInt(value) : undefined);
              setSelectedCityId(undefined);
              setSelectedDistrictId(undefined);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="اختر المحافظة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">جميع المحافظات</SelectItem>
                {states.map((state) => (
                  <SelectItem key={state.id} value={state.id.toString()}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedStateId && stateCities.length > 0 && (
            <div>
              <Label className="text-sm mb-2 block">المدينة</Label>
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
            </div>
          )}

          {selectedCityId && districts.length > 0 && (
            <div>
              <Label className="text-sm mb-2 block">الحي</Label>
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
            </div>
          )}
        </CardContent>
      </Card>

      {/* Nearby Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <MapPin className="w-4 h-4 text-purple-600" />
            القريب مني
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm">تفعيل البحث القريب</Label>
            <Switch
              checked={nearbyEnabled}
              onCheckedChange={handleLocationToggle}
              disabled={isLoadingLocation}
            />
          </div>
          
          {nearbyEnabled && (
            <div>
              <Label className="text-sm mb-2 block">المسافة (كلم)</Label>
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
            <p className="text-sm text-muted-foreground">جاري تحديد الموقع...</p>
          )}
        </CardContent>
      </Card>

      {/* Featured Only */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Star className="w-4 h-4 text-yellow-600" />
            الإعلانات المميزة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label className="text-sm">الإعلانات المميزة فقط</Label>
            <Switch
              checked={featuredOnly}
              onCheckedChange={setFeaturedOnly}
            />
          </div>
        </CardContent>
      </Card>

      {/* Condition */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Package2 className="w-4 h-4 text-orange-600" />
            حالة السلعة
          </CardTitle>
        </CardHeader>
        <CardContent>
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
                className="text-sm"
              >
                {item.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Listing Type */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Filter className="w-4 h-4 text-indigo-600" />
            نوع الإعلان
          </CardTitle>
        </CardHeader>
        <CardContent>
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
                className="text-sm"
              >
                {item.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Individual Owners Only */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="w-4 h-4 text-teal-600" />
            إعلانات المُلّاك
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label className="text-sm">إعلانات المُلّاك الأفراد فقط</Label>
            <Switch
              checked={individualOwners}
              onCheckedChange={setIndividualOwners}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sort */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="w-4 h-4 text-gray-600" />
            ترتيب الإعلانات من
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
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
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t">
        <Button 
          onClick={applyFilters} 
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          تطبيق الفلاتر
        </Button>
        <Button 
          variant="outline" 
          onClick={resetFilters} 
          className="flex-1"
        >
          إزالة الفلاتر
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="w-full">
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-between gap-2 h-12 text-base font-medium border-2 border-blue-200 hover:border-blue-400 bg-gradient-to-r from-blue-50 to-white"
            >
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-blue-600" />
                <span>فلترة النتائج</span>
              </div>
              {activeFiltersCount > 0 && (
                <Badge variant="destructive" className="rounded-full min-w-[24px] h-6">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[90vh] overflow-y-auto bg-gray-50">
            <SheetHeader className="sticky top-0 bg-gray-50 pb-4 border-b">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-xl font-bold text-right flex items-center gap-2">
                  <Filter className="w-6 h-6 text-blue-600" />
                  خيارات التصفية
                </SheetTitle>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="text-sm">
                    {activeFiltersCount} فلتر نشط
                  </Badge>
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
    <div className="w-full max-w-sm space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            فلترة متقدمة
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </h3>
        </div>
        <div className="p-4">
          <FilterContent />
        </div>
      </div>
    </div>
  );
}
