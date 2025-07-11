import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { CategoryBar } from '@/components/layout/category/CategoryBar';
import { AdCard } from '@/components/ads/ad-card';
import { MobileFilterSheet } from '@/components/filters/MobileFilterSheet';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Loader2, Grid2X2, List, MapPin, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAds, useCurrentLocation, useStates } from '@/hooks/use-api';
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
  const [selectedStateId, setSelectedStateId] = useState<number | undefined>();
  const [nearbyEnabled, setNearbyEnabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated, user } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  const { data: locationData, isSuccess: locationLoaded } = useCurrentLocation();
  const { data: states = [] } = useStates();
  
  const { data: adsResponse, isLoading: isLoadingAds, error: adsError } = useAds({
    page,
    per_page: 12, // Fixed at 12 per page
    ...filters,
    ...(locationLoaded ? { lat: locationData?.lat, lon: locationData?.lng, radius: 50 } : {})
  });
  
  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setPage(1);
  };
  
  const adData = adsResponse?.data || [];
  const totalPages = adsResponse?.meta?.last_page || 
                    Math.ceil((adsResponse?.data?.length || 0) / 12) || 1;
  
  const featuredAds = Array.isArray(adData) ? adData.filter((ad: Listing) => ad.featured) : [];
  const regularAds = Array.isArray(adData) ? adData.filter((ad: Listing) => !ad.featured) : [];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/* Mobile Search Bar - only on mobile */}
      {isMobile && (
        <div className="bg-white dark:bg-dark-background border-b border-border dark:border-dark-border px-4 py-3">
          <form onSubmit={(e) => {
            e.preventDefault();
            if (searchQuery.trim()) {
              navigate(`/search?search=${encodeURIComponent(searchQuery.trim())}`);
            }
          }}>
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث عن منتجات، خدمات، وظائف..."
                className="w-full h-10 pr-10 pl-4 rounded-lg border border-input bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute top-0 right-0 h-full px-3 flex items-center">
                <Search className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
          </form>
        </div>
      )}
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
              {/* Control bar */}
              <div className="flex justify-end mb-4 gap-3 items-center">
                <div className="flex items-center justify-between w-full mb-6">
                  {isMobile ? (
                    <div className="flex items-center w-full justify-between">
                      {/* Mobile Filter Button - Compact */}
                      <MobileFilterSheet 
                        onFilterChange={handleFilterChange}
                        currentFilters={filters}
                        triggerButton={
                          <Button variant="outline" size="sm" className="flex items-center gap-2 h-10 px-4">
                            <span className="text-sm font-medium">فلترة</span>
                          </Button>
                        }
                      />
                      
                      {/* View toggle - smaller */}
                      <div className="flex items-center border rounded-md overflow-hidden bg-white dark:bg-dark-card">
                        <Button 
                          variant={adLayout === 'grid' ? "default" : "ghost"} 
                          size="sm"
                          onClick={() => setAdLayout('grid')}
                          className="h-8 w-8 rounded-none p-1"
                          aria-label="Grid view"
                          title="عرض شبكي"
                        >
                          <Grid2X2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          variant={adLayout === 'list' ? "default" : "ghost"}
                          size="sm" 
                          onClick={() => setAdLayout('list')}
                          className="h-8 w-8 rounded-none p-1"
                          aria-label="List view"
                          title="عرض قائمة"
                        >
                          <List className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Desktop Region and Nearby filters */}
                      <div className="flex items-center gap-3">
                        <Select
                          value={selectedStateId?.toString() || 'all'}
                          onValueChange={(value) => {
                            const stateId = value === 'all' ? undefined : parseInt(value);
                            setSelectedStateId(stateId);
                            handleFilterChange({ ...filters, state_id: stateId });
                          }}
                        >
                          <SelectTrigger className="w-40 h-8">
                            <SelectValue placeholder="المنطقة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">كل المناطق</SelectItem>
                            {states.map((state) => (
                              <SelectItem key={state.id} value={state.id.toString()}>
                                {state.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Button
                          variant={nearbyEnabled ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            setNearbyEnabled(!nearbyEnabled);
                            if (locationData) {
                              handleFilterChange({
                                ...filters,
                                lat: !nearbyEnabled ? locationData.lat : undefined,
                                lon: !nearbyEnabled ? locationData.lng : undefined,
                                radius: !nearbyEnabled ? 20 : undefined
                              });
                            }
                          }}
                          className="flex items-center gap-2 h-8"
                        >
                          <MapPin className="h-4 w-4" />
                          <span>القريب مني</span>
                        </Button>
                      </div>
                      
                      {/* View toggle - smaller */}
                      <div className="flex border rounded-sm overflow-hidden">
                        <Button 
                          variant={adLayout === 'grid' ? "default" : "ghost"} 
                          size="sm"
                          onClick={() => setAdLayout('grid')}
                          className="h-8 w-8 rounded-none p-1"
                          aria-label="Grid view"
                          title="عرض شبكي"
                        >
                          <Grid2X2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          variant={adLayout === 'list' ? "default" : "ghost"}
                          size="sm" 
                          onClick={() => setAdLayout('list')}
                          className="h-8 w-8 rounded-none p-1"
                          aria-label="List view"
                          title="عرض قائمة"
                        >
                          <List className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
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
                  skeletonCount={12}
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
                      <div className="text-center py-12 bg-gray-50 dark:bg-dark-surface">
                        <p className="text-muted-foreground mb-4">لا توجد إعلانات متطابقة مع البحث</p>
                      </div>
                    )
                  )}
                </WithSkeleton>
                
                {adsError && (
                  <div className="text-center py-12 bg-gray-50 dark:bg-dark-surface">
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
