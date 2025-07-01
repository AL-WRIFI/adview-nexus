
import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { CategoryBar } from '@/components/layout/category/CategoryBar';
import { AdCard } from '@/components/ads/ad-card';
import { MobileFilterSheet } from '@/components/filters/MobileFilterSheet';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Loader2, Grid2X2, List } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAds, useCurrentLocation } from '@/hooks/use-api';
import { SearchFilters, Listing } from '@/types';
import { useAuth } from '@/context/auth-context';
import { Pagination } from '@/components/custom/pagination';
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
    per_page: 10,
    ...filters,
    ...(locationLoaded ? { lat: locationData?.lat, lon: locationData?.lng, radius: 50 } : {})
  });
  
  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setPage(1);
  };
  
  const adData = adsResponse?.data || [];
  const totalPages = adsResponse?.meta?.last_page || 
                    Math.ceil((adsResponse?.meta?.total || 0) / 10) || 1;
  
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
              {/* View toggle and mobile filters */}
              <div className="flex justify-end mb-4 gap-3 items-center">
                <div className="flex items-center justify-between w-full mb-6">
                  {isMobile ? (
                    <div className="flex items-center w-full justify-between">
                      {/* Mobile Filter Button */}
                      <AdFilters 
                        layout="horizontal"
                        onFilterChange={handleFilterChange}
                      />
                      
                      {/* View toggle - smaller size */}
                      <div className="flex border rounded-md overflow-hidden bg-white dark:bg-dark-card">
                        <Button 
                          variant={adLayout === 'grid' ? "default" : "ghost"} 
                          size="sm"
                          onClick={() => setAdLayout('grid')}
                          className="h-7 w-7 rounded-none p-0"
                          aria-label="Grid view"
                          title="عرض شبكي"
                        >
                          <Grid2X2 className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant={adLayout === 'list' ? "default" : "ghost"}
                          size="sm" 
                          onClick={() => setAdLayout('list')}
                          className="h-7 w-7 rounded-none p-0"
                          aria-label="List view"
                          title="عرض قائمة"
                        >
                          <List className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div></div>
                      
                      <div className="flex border rounded-sm overflow-hidden">
                        <Button 
                          variant={adLayout === 'grid' ? "default" : "ghost"} 
                          size="sm"
                          onClick={() => setAdLayout('grid')}
                          className="h-7 w-7 rounded-none p-0"
                          aria-label="Grid view"
                          title="عرض شبكي"
                        >
                          <Grid2X2 className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant={adLayout === 'list' ? "default" : "ghost"}
                          size="sm" 
                          onClick={() => setAdLayout('list')}
                          className="h-7 w-7 rounded-none p-0"
                          aria-label="List view"
                          title="عرض قائمة"
                        >
                          <List className="h-3 w-3" />
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
                  skeletonCount={10}
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
