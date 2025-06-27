
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, ChevronDown, MapPin } from 'lucide-react';
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

// Mock data for comprehensive filtering based on the uploaded image
const mockVehicleBrands = [
  { id: 1, name: 'تويوتا', logo: 'https://logos-world.net/wp-content/uploads/2020/04/Toyota-Logo.png' },
  { id: 2, name: 'فورد', logo: 'https://logos-world.net/wp-content/uploads/2020/04/Ford-Logo.png' },
  { id: 3, name: 'نيسان', logo: 'https://logos-world.net/wp-content/uploads/2020/04/Nissan-Logo.png' },
  { id: 4, name: 'شيفروليه', logo: 'https://logos-world.net/wp-content/uploads/2020/04/Chevrolet-Logo.png' },
  { id: 5, name: 'مرسيدس', logo: 'https://logos-world.net/wp-content/uploads/2020/04/Mercedes-Logo.png' },
  { id: 6, name: 'BMW', logo: 'https://logos-world.net/wp-content/uploads/2020/04/BMW-Logo.png' },
  { id: 7, name: 'لكزس', logo: 'https://logos-world.net/wp-content/uploads/2020/12/Lexus-Logo.png' },
  { id: 8, name: 'GMC', logo: 'https://logos-world.net/wp-content/uploads/2020/11/GMC-Logo.png' },
  { id: 9, name: 'رام', logo: 'https://logos-world.net/wp-content/uploads/2020/11/Ram-Logo.png' },
];

const mockTechBrands = [
  { id: 10, name: 'كانون', logo: 'https://logos-world.net/wp-content/uploads/2020/04/Canon-Symbol.png' },
  { id: 11, name: 'سامسونج', logo: 'https://logos-world.net/wp-content/uploads/2020/04/Samsung-Logo.png' },
  { id: 12, name: 'أبل', logo: 'https://logos-world.net/wp-content/uploads/2020/04/Apple-Logo.png' },
  { id: 13, name: 'نوكيا', logo: 'https://logos-world.net/wp-content/uploads/2020/04/Nokia-Logo.png' },
  { id: 14, name: 'مايكروسوفت', logo: 'https://logos-world.net/wp-content/uploads/2020/04/Microsoft-Logo.png' },
  { id: 15, name: 'سوني', logo: 'https://logos-world.net/wp-content/uploads/2020/04/Sony-Logo.png' },
  { id: 16, name: 'LG', logo: 'https://logos-world.net/wp-content/uploads/2020/04/LG-Logo.png' },
];

const mockCategories = [
  { id: 1, name: 'دبابات', icon: '🏍️', subcategories: [
    { id: 11, name: 'دبابات نارية' },
    { id: 12, name: 'قطع غيار دبابات' },
    { id: 13, name: 'اكسسوارات دبابات' }
  ]},
  { id: 2, name: 'شاحنات وحافلات', icon: '🚛', subcategories: [
    { id: 21, name: 'شاحنات نقل' },
    { id: 22, name: 'حافلات ومني باص' },
    { id: 23, name: 'معدات ثقيلة' }
  ]},
  { id: 3, name: 'قطع غيار وآلات', icon: '🔧', subcategories: [
    { id: 31, name: 'قطع غيار محركات' },
    { id: 32, name: 'أدوات صيانة' },
    { id: 33, name: 'آلات ورش' }
  ]},
  { id: 4, name: 'سيارات محدد', icon: '🚗', subcategories: [
    { id: 41, name: 'سيارات صالون' },
    { id: 42, name: 'سيارات رياضية' },
    { id: 43, name: 'سيارات عائلية' }
  ]},
  { id: 5, name: 'سيارات دفع رباعي', icon: '🚙', subcategories: [
    { id: 51, name: 'جيب وانجلر' },
    { id: 52, name: 'تاهو وسوبربان' },
    { id: 53, name: 'أخرى' }
  ]},
  { id: 6, name: 'سيارات للبيع', icon: '🏷️', subcategories: [
    { id: 61, name: 'سيارات جديدة' },
    { id: 62, name: 'سيارات مستعملة' },
    { id: 63, name: 'سيارات للتقسيط' }
  ]},
];

const animalCategories = [
  { id: 7, name: 'شق الاستعلام', icon: '🐰' },
  { id: 8, name: 'أراضي الايجار', icon: '🏘️' },
  { id: 9, name: 'ارض للبيع', icon: '🏞️' },
  { id: 10, name: 'شق للايجار', icon: '🏠' },
  { id: 11, name: 'شق البيع', icon: '🏘️' },
  { id: 12, name: 'محلات للايجار', icon: '🏪' },
  { id: 13, name: 'محلات للبيع', icon: '🏬' },
  { id: 14, name: 'عمائر للايجار', icon: '🏢' },
  { id: 15, name: 'مداراس للايجار', icon: '🏫' },
  { id: 16, name: 'مزارع للبيع', icon: '🚜' },
  { id: 17, name: 'استراحات للبيع', icon: '🏡' },
  { id: 18, name: 'مزارع للايجار', icon: '🌾' },
  { id: 19, name: 'بيوت للايجار', icon: '🏠' },
  { id: 20, name: 'أدوار للايجار', icon: '🏘️' },
];

const animalSubCategories = [
  { id: 101, name: '🐦', label: 'طيور' },
  { id: 102, name: '🐰', label: 'أرانب' },
  { id: 103, name: '🐑', label: 'خراف' },
  { id: 104, name: '🐐', label: 'ماعز' },
  { id: 105, name: '🐔', label: 'دجاج' },
  { id: 106, name: '🐱', label: 'قطط' },
  { id: 107, name: '🐕', label: 'كلاب' },
  { id: 108, name: '🐎', label: 'خيول' },
  { id: 109, name: '🐪', label: 'جمال' },
];

export function AdFilters({ 
  layout, 
  onLayoutChange, 
  currentLayout, 
  onFilterChange, 
  selectedCategory 
}: AdFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<number | null>(null);
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
  const [showMoreBrands, setShowMoreBrands] = useState(false);
  const [currentBrands, setCurrentBrands] = useState(mockVehicleBrands);
  const [userLocation, setUserLocation] = useState<{lat: number, lon: number} | null>(null);
  const [showAnimals, setShowAnimals] = useState(false);

  // Get stored location on component mount
  useEffect(() => {
    const storedLocation = localStorage.getItem('userLocation');
    if (storedLocation) {
      setUserLocation(JSON.parse(storedLocation));
    } else {
      // Get location with high accuracy
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              lat: position.coords.latitude,
              lon: position.coords.longitude
            };
            setUserLocation(location);
            localStorage.setItem('userLocation', JSON.stringify(location));
          },
          (error) => {
            console.log('Location access denied or error:', error);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
        );
      }
    }
  }, []);

  // Update brands based on selected category
  useEffect(() => {
    if (selectedCategoryId && [1,2,3,4,5,6].includes(selectedCategoryId)) {
      setCurrentBrands(mockVehicleBrands);
    } else {
      setCurrentBrands(mockTechBrands);
    }
  }, [selectedCategoryId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filters: SearchFilters = {
      search: searchQuery,
      category_id: selectedCategoryId || undefined,
      sub_category_id: selectedSubCategoryId || undefined,
      brand_id: selectedBrandId || undefined,
      ...(userLocation && {
        lat: userLocation.lat,
        lon: userLocation.lon,
        radius: 10
      })
    };
    onFilterChange(filters);
  };

  const handleCategoryClick = (categoryId: number) => {
    if (categoryId === 7) {
      setShowAnimals(true);
      return;
    }
    setSelectedCategoryId(selectedCategoryId === categoryId ? null : categoryId);
    setSelectedSubCategoryId(null);
    setSelectedBrandId(null);
  };

  const handleSubCategoryClick = (subCategoryId: number) => {
    setSelectedSubCategoryId(selectedSubCategoryId === subCategoryId ? null : subCategoryId);
  };

  const handleBrandClick = (brandId: number) => {
    setSelectedBrandId(selectedBrandId === brandId ? null : brandId);
  };

  const selectedCategoryData = mockCategories.find(cat => cat.id === selectedCategoryId);
  const displayedBrands = showMoreBrands ? currentBrands : currentBrands.slice(0, 6);

  if (showAnimals) {
    return (
      <div className="w-full bg-gray-50 p-4">
        {/* Search Bar */}
        <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="ابحث في جميع الإعلانات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 h-12 text-lg border-2 focus:border-blue-500"
              />
            </div>
            <Button type="submit" size="lg" className="bg-blue-500 hover:bg-blue-600 px-8">
              <Search className="h-5 w-5" />
            </Button>
          </form>
        </div>

        {/* Back Button */}
        <Button 
          variant="outline" 
          onClick={() => setShowAnimals(false)}
          className="mb-4"
        >
          العودة للتصنيفات
        </Button>

        {/* Animal Categories Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {animalSubCategories.map((animal) => (
            <button
              key={animal.id}
              onClick={() => handleSubCategoryClick(animal.id)}
              className={cn(
                "p-4 text-center transition-all hover:bg-gray-100 bg-white rounded-lg",
                selectedSubCategoryId === animal.id && "bg-blue-50 border-2 border-blue-500"
              )}
            >
              <div className="text-4xl mb-2">{animal.name}</div>
              <div className="text-sm text-gray-600">{animal.label}</div>
            </button>
          ))}
        </div>

        {/* Real Estate Categories */}
        <div className="grid grid-cols-3 gap-3">
          {animalCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={cn(
                "p-4 text-center transition-all hover:bg-gray-100 border rounded-lg bg-white",
                selectedCategoryId === category.id && "bg-blue-50 border-2 border-blue-500"
              )}
            >
              <div className="text-2xl mb-2">{category.icon}</div>
              <div className="text-sm text-gray-700">{category.name}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 p-4">
      {/* Search Bar */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="ابحث في جميع الإعلانات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 h-12 text-lg border-2 focus:border-blue-500"
            />
          </div>
          <Button type="submit" size="lg" className="bg-blue-500 hover:bg-blue-600 px-8">
            <Search className="h-5 w-5" />
          </Button>
        </form>
        
        {userLocation && (
          <div className="flex items-center mt-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4 ml-1" />
            <span>البحث في نطاق 10 كم من موقعك</span>
          </div>
        )}
      </div>

      {/* Filter Categories */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">تصنيفة</h2>
        <div className="grid grid-cols-3 gap-3">
          {mockCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={cn(
                "p-4 text-center transition-all hover:bg-gray-100 bg-white rounded-lg",
                selectedCategoryId === category.id && "bg-blue-50 border-2 border-blue-500"
              )}
            >
              <div className="text-2xl mb-2">{category.icon}</div>
              <div className="text-sm text-gray-700">{category.name}</div>
            </button>
          ))}
          
          {/* Animals/Real Estate Category */}
          <button
            onClick={() => setShowAnimals(true)}
            className="p-4 text-center transition-all hover:bg-gray-100 bg-white rounded-lg"
          >
            <div className="text-2xl mb-2">🐾</div>
            <div className="text-sm text-gray-700">حيوانات وعقارات</div>
          </button>
        </div>
      </div>

      {/* Sub Categories */}
      {selectedCategoryData && (
        <div className="mb-6">
          <h3 className="text-md font-medium mb-3 text-gray-600">التصنيفات الفرعية</h3>
          <div className="grid grid-cols-3 gap-3">
            {selectedCategoryData.subcategories.map((subcat) => (
              <button
                key={subcat.id}
                onClick={() => handleSubCategoryClick(subcat.id)}
                className={cn(
                  "p-3 text-center text-sm transition-all hover:bg-gray-100 border rounded-lg bg-white",
                  selectedSubCategoryId === subcat.id && "bg-blue-50 border-2 border-blue-500"
                )}
              >
                {subcat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Brands */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">العلامات التجارية</h2>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {displayedBrands.map((brand) => (
            <button
              key={brand.id}
              onClick={() => handleBrandClick(brand.id)}
              className={cn(
                "p-4 transition-all hover:bg-gray-100 bg-white rounded-lg",
                selectedBrandId === brand.id && "bg-blue-50 border-2 border-blue-500"
              )}
            >
              <div className="w-full h-20 mb-2 flex items-center justify-center">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(brand.name)}&size=80&background=f8fafc&color=1e293b`;
                  }}
                />
              </div>
              <div className="text-xs text-gray-600 text-center">{brand.name}</div>
            </button>
          ))}
        </div>
        
        {currentBrands.length > 6 && (
          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => setShowMoreBrands(!showMoreBrands)}
              className="w-full"
            >
              <ChevronDown className={cn("h-4 w-4 ml-2 transition-transform", showMoreBrands && "rotate-180")} />
              {showMoreBrands ? 'عرض أقل' : 'عرض المزيد'}
            </Button>
          </div>
        )}
      </div>

      {/* Active Filters */}
      {(selectedCategoryId || selectedSubCategoryId || selectedBrandId || searchQuery) && (
        <div className="mb-6">
          <h3 className="text-md font-medium mb-3 text-gray-600">الفلاتر المطبقة</h3>
          <div className="flex flex-wrap gap-2">
            {searchQuery && (
              <Badge variant="secondary" className="px-3 py-1">
                البحث: "{searchQuery}"
              </Badge>
            )}
            {selectedCategoryId && (
              <Badge variant="secondary" className="px-3 py-1">
                {mockCategories.find(c => c.id === selectedCategoryId)?.name}
              </Badge>
            )}
            {selectedSubCategoryId && selectedCategoryData && (
              <Badge variant="secondary" className="px-3 py-1">
                {selectedCategoryData.subcategories.find(s => s.id === selectedSubCategoryId)?.name}
              </Badge>
            )}
            {selectedBrandId && (
              <Badge variant="secondary" className="px-3 py-1">
                {currentBrands.find(b => b.id === selectedBrandId)?.name}
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
