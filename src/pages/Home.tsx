
import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { CategoryBar } from '@/components/layout/category/CategoryBar';
import { AdCard } from '@/components/ads/ad-card';
import { MobileFilterSheet } from '@/components/filters/MobileFilterSheet';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Loader2, Grid2X2, List, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAds, useCurrentLocation } from '@/hooks/use-api';
import { SearchFilters, Listing } from '@/types';
import { useAuth } from '@/context/auth-context';
import { Pagination } from '@/components/custom/pagination';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { WithSkeleton, CardSkeleton } from '@/components/ui/loading-skeleton';
import { useIsMobile } from '@/hooks/use-mobile';
import { AdFilters } from '@/components/filters/ad-filters';
import { useLayoutStore } from '@/store/layout-store';

export default function Home() {
  const { adLayout, setAdLayout } = useLayoutStore();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<SearchFilters>({});
  const { isAuthenticated, user } = useAuth();
  const isMobile = useIsMobile();
  
  const { data: locationData, isSuccess: locationLoaded } = useCurrentLocation();
  
  const { data: adsResponse, isLoading: isLoadingAds, error: adsError } = useAds({
    page,
    per_page: 20, // Fixed value
    ...filters,
    ...(locationLoaded ? { lat: locationData?.lat, lon: locationData?.lng, radius: 50 } : {})
  });
  
  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleNearbyClick = () => {
    // Toggle nearby filter
    const newFilters = { ...filters };
    if (newFilters.radius) {
      delete newFilters.radius;
      delete newFilters.lat;
      delete newFilters.lon;
    } else if (locationLoaded) {
      newFilters.lat = locationData?.lat;
      newFilters.lon = locationData?.lng;
      newFilters.radius = 10;
    }
    setFilters(newFilters);
    setPage(1);
  };
  
  const adData = adsResponse?.data || [];
  const totalPages = adsResponse?.meta?.last_page || 
                    Math.ceil((adsResponse?.meta?.total || 0) / 20) || 1;
  
  const featuredAds = Array.isArray(adData) ? adData.filter((ad: Listing) => ad.featured) : [];
  const regularAds = Array.isArray(adData) ? adData.filter((ad: Listing) => !ad.featured) : [];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CategoryBar />
      
      <main className="flex-1 pb-20 md:pb-0">
        <div className="container px-4 mx-auto py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Desktop Filter Sidebar */}
            {!isMobile && (
              <div className="col-span-1 hidden md:block">
                <AdFilters 
                  layout="sidebar" 
                  onLayoutChange={setAdLayout} 
                  currentLayout={adLayout}
                  onFilterChange={handleFilterChange}
                />
              </div>
            )}
            
            <div className="col-span-1 md:col-span-3">
              {/* Controls */}
              <div className="flex items-center justify-between w-full mb-6">
                {isMobile ? (
                  <div className="flex items-center w-full justify-between">
                    {/* Mobile Filter Button and Region/Nearby */}
                    <div className="flex items-center gap-2">
                      <MobileFilterSheet 
                        onFilterChange={handleFilterChange}
                        currentFilters={filters}
                      />
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-1 h-9 px-3 bg-white dark:bg-gray-800"
                        onClick={handleNearbyClick}
                      >
                        <MapPin className="w-4 h-4 text-brand" />
                        <span className="text-sm">القريب</span>
                      </Button>
                    </div>
                    
                    {/* View toggle - smaller */}
                    <div className="flex border rounded-md overflow-hidden bg-white dark:bg-gray-800">
                      <Button 
                        variant={adLayout === 'grid' ? "default" : "ghost"} 
                        size="icon"
                        onClick={() => setAdLayout('grid')}
                        className="h-8 w-8 rounded-none"
                        aria-label="Grid view"
                        title="عرض شبكي"
                      >
                        <Grid2X2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button 
                        variant={adLayout === 'list' ? "default" : "ghost"}
                        size="icon" 
                        onClick={() => setAdLayout('list')}
                        className="h-8 w-8 rounded-none"
                        aria-label="List view"
                        title="عرض قائمة"
                      >
                        <List className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Desktop Region/Nearby Controls */}
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-1 bg-white dark:bg-gray-800"
                        onClick={handleNearbyClick}
                      >
                        <MapPin className="w-4 h-4 text-brand" />
                        <span className="text-sm">القريب مني</span>
                      </Button>
                      
                      <Select
                        value={filters.state_id?.toString() || 'all'}
                        onValueChange={(value) => {
                          const newFilters = { ...filters };
                          if (value === 'all') {
                            delete newFilters.state_id;
                          } else {
                            newFilters.state_id = parseInt(value);
                          }
                          handleFilterChange(newFilters);
                        }}
                      >
                        <SelectTrigger className="w-40 h-8">
                          <SelectValue placeholder="اختر المنطقة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">كل المناطق</SelectItem>
                          <SelectItem value="1">الرياض</SelectItem>
                          <SelectItem value="2">جدة</SelectItem>
                          <SelectItem value="3">مكة المكرمة</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Desktop View Toggle - smaller */}
                    <div className="flex border rounded-sm overflow-hidden">
                      <Button 
                        variant={adLayout === 'grid' ? "default" : "ghost"} 
                        size="icon"
                        onClick={() => setAdLayout('grid')}
                        className="h-8 w-8 rounded-none"
                        aria-label="Grid view"
                        title="عرض شبكي"
                      >
                        <Grid2X2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button 
                        variant={adLayout === 'list' ? "default" : "ghost"}
                        size="icon" 
                        onClick={() => setAdLayout('list')}
                        className="h-8 w-8 rounded-none"
                        aria-label="List view"
                        title="عرض قائمة"
                      >
                        <List className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
              
              {/* Featured ads section */}
              {featuredAds.length > 0 && (
                <div className="mb-8 animate-in fade-in">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">إعلانات مميزة</h2>
                    <Button variant="link" className="text-brand" size="sm" asChild>
                      <Link to="/search?featured=true">
                        عرض الكل
                        <ChevronLeft className="h-4 w-4 mr-1" />
                      </Link>
                    </Button>
                  </div>
                  
                  <WithSkeleton
                    isLoading={isLoadingAds}
                    data={featuredAds}
                    SkeletonComponent={CardSkeleton}
                    skeletonCount={3}
                  >
                    {(featuredAdsData) => (
                      <div className={`grid gap-4 ${
                        adLayout === 'grid' 
                          ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' 
                          : 'grid-cols-1'
                      }`}>
                        {featuredAdsData.slice(0, 3).map((ad) => (
                          <AdCard 
                            key={ad.id} 
                            ad={ad} 
                            layout={adLayout}
                          />
                        ))}
                      </div>
                    )}
                  </WithSkeleton>
                </div>
              )}
              
              {/* Regular ads section */}
              <div className="animate-in fade-in">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">أحدث الإعلانات</h2>
                </div>
                
                <WithSkeleton
                  isLoading={isLoadingAds}
                  data={regularAds}
                  SkeletonComponent={CardSkeleton}
                  skeletonCount={20}
                >
                  {(regularAdsData) => (
                    regularAdsData.length > 0 ? (
                      <div className={`grid gap-4 ${
                        adLayout === 'grid' 
                          ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' 
                          : 'grid-cols-1'
                      }`}>
                        {regularAdsData.map((ad) => (
                          <AdCard 
                            key={ad.id} 
                            ad={ad} 
                            layout={adLayout} 
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-gray-50 dark:bg-gray-800">
                        <p className="text-muted-foreground mb-4">لا توجد إعلانات متطابقة مع البحث</p>
                      </div>
                    )
                  )}
                </WithSkeleton>
                
                {adsError && (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-800">
                    <p className="text-red-500 mb-4">حدث خطأ أثناء تحميل الإعلانات</p>
                    <Button onClick={() => window.location.reload()}>إعادة المحاولة</Button>
                  </div>
                )}
                
                {!isLoadingAds && !adsError && adsResponse && (
                  <Pagination 
                    currentPage={page} 
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <MobileNav />
    </div>
  );
}
