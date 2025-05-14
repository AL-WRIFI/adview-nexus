
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { AdCard } from '@/components/ads/ad-card';
import { AdFilters } from '@/components/filters/ad-filters';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ADS, CATEGORIES, CITIES } from '@/data/mock-data';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [priceMin, setPriceMin] = useState(searchParams.get('priceMin') || '');
  const [priceMax, setPriceMax] = useState(searchParams.get('priceMax') || '');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [adLayout, setAdLayout] = useState<'grid' | 'list'>('list');
  
  // Search results
  const [searchResults, setSearchResults] = useState(ADS);
  
  // Perform search when params change
  useEffect(() => {
    const query = searchParams.get('q')?.toLowerCase() || '';
    const categoryFilter = searchParams.get('category') || '';
    const cityFilter = searchParams.get('city') || '';
    const minPrice = parseInt(searchParams.get('priceMin') || '0');
    const maxPrice = parseInt(searchParams.get('priceMax') || '999999999');
    
    // Filter ads based on search criteria
    const results = ADS.filter(ad => {
      // Filter by search query
      const matchesQuery = !query || 
        ad.title.toLowerCase().includes(query) || 
        ad.description.toLowerCase().includes(query);
      
      // Filter by category
      const matchesCategory = !categoryFilter || ad.category === categoryFilter;
      
      // Filter by city
      const matchesCity = !cityFilter || ad.city === cityFilter;
      
      // Filter by price range
      const matchesPrice = ad.price >= minPrice && 
        (maxPrice === 999999999 || ad.price <= maxPrice);
      
      return matchesQuery && matchesCategory && matchesCity && matchesPrice;
    });
    
    setSearchResults(results);
  }, [searchParams]);
  
  // Update URL search params
  const handleSearch = () => {
    const params: Record<string, string> = {};
    
    if (searchQuery) params.q = searchQuery;
    if (category) params.category = category;
    if (city) params.city = city;
    if (priceMin) params.priceMin = priceMin;
    if (priceMax) params.priceMax = priceMax;
    
    setSearchParams(params);
    
    if (showMobileFilters) {
      setShowMobileFilters(false);
    }
    
    toast({
      title: "جاري البحث...",
      description: `تم العثور على ${searchResults.length} إعلان`,
    });
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setCategory('');
    setCity('');
    setPriceMin('');
    setPriceMax('');
    setSearchParams({});
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} />
      
      <main className="flex-1 pb-20 md:pb-0">
        <div className="bg-gray-50 border-b border-border">
          <div className="container px-4 mx-auto py-6">
            <div className="flex items-center">
              <div className="relative w-full">
                <Input
                  type="text"
                  placeholder="ابحث عن أي شيء..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearch();
                  }}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                {searchQuery && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5"
                    onClick={() => {
                      setSearchQuery('');
                      if (searchParams.has('q')) {
                        searchParams.delete('q');
                        setSearchParams(searchParams);
                      }
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <Button 
                className="mr-2 md:hidden" 
                size="icon" 
                variant="outline"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
              <Button className="mr-2 hidden md:flex" onClick={handleSearch}>
                بحث
              </Button>
            </div>
          </div>
        </div>
        
        <div className="container px-4 mx-auto py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Desktop sidebar filters */}
            <div className="hidden md:block">
              <Card className="p-4">
                <h3 className="font-bold mb-4">تصفية النتائج</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">الفئة</label>
                    <select 
                      className="w-full border rounded-md p-2" 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="">جميع الفئات</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">المدينة</label>
                    <select 
                      className="w-full border rounded-md p-2" 
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    >
                      <option value="">جميع المدن</option>
                      {CITIES.map((cityName) => (
                        <option key={cityName} value={cityName}>{cityName}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">السعر</label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="من"
                        value={priceMin}
                        onChange={(e) => setPriceMin(e.target.value)}
                        className="flex-1"
                      />
                      <span>-</span>
                      <Input
                        type="number"
                        placeholder="إلى"
                        value={priceMax}
                        onChange={(e) => setPriceMax(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div className="pt-2 flex gap-2">
                    <Button onClick={handleSearch} className="flex-1">تطبيق</Button>
                    <Button variant="outline" onClick={resetFilters} className="flex-1">إعادة ضبط</Button>
                  </div>
                </div>
              </Card>
              
              <AdFilters 
                layout="sidebar" 
                onLayoutChange={setAdLayout} 
                currentLayout={adLayout}
                className="mt-4" 
              />
            </div>
            
            {/* Mobile filters */}
            {showMobileFilters && (
              <div className="md:hidden fixed inset-0 bg-background z-50 p-4 overflow-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">تصفية النتائج</h2>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setShowMobileFilters(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">الفئة</label>
                    <select 
                      className="w-full border rounded-md p-2" 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="">جميع الفئات</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">المدينة</label>
                    <select 
                      className="w-full border rounded-md p-2" 
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    >
                      <option value="">جميع المدن</option>
                      {CITIES.map((cityName) => (
                        <option key={cityName} value={cityName}>{cityName}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">السعر</label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="من"
                        value={priceMin}
                        onChange={(e) => setPriceMin(e.target.value)}
                        className="flex-1"
                      />
                      <span>-</span>
                      <Input
                        type="number"
                        placeholder="إلى"
                        value={priceMax}
                        onChange={(e) => setPriceMax(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <AdFilters 
                    layout="horizontal" 
                    onLayoutChange={setAdLayout} 
                    currentLayout={adLayout}
                  />
                  
                  <div className="pt-2 grid grid-cols-2 gap-2">
                    <Button onClick={handleSearch}>تطبيق</Button>
                    <Button variant="outline" onClick={resetFilters}>إعادة ضبط</Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Search results */}
            <div className="md:col-span-3">
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">نتائج البحث</h2>
                <p className="text-muted-foreground text-sm">
                  {searchResults.length} نتيجة
                </p>
              </div>
              
              {searchResults.length > 0 ? (
                <div className={`grid gap-4 ${
                  adLayout === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {searchResults.map((ad) => (
                    <AdCard key={ad.id} ad={ad} layout={adLayout} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">لم يتم العثور على نتائج</h3>
                  <p className="text-muted-foreground mb-4">
                    جرب تعديل معايير البحث أو استخدم كلمات مفتاحية مختلفة
                  </p>
                  <Button onClick={resetFilters}>إعادة ضبط الفلاتر</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <MobileNav />
    </div>
  );
}
