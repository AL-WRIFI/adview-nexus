
import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { CategoryBar } from '@/components/layout/category/CategoryBar';
import { AdCard } from '@/components/ads/ad-card';
import { AdFilters } from '@/components/filters/ad-filters';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Loader2, Grid2X2, List } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAds, useCurrentLocation } from '@/hooks/use-api';
import { SearchFilters, Listing } from '@/types';
import { useAuth } from '@/context/auth-context';
import { Pagination } from '@/components/custom/pagination';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { WithSkeleton, CardSkeleton } from '@/components/ui/loading-skeleton';
import { useIsMobile } from '@/hooks/use-mobile';

export default function Home() {
  const [adLayout, setAdLayout] = useState<'grid' | 'list'>('list');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<SearchFilters>({});
  const { isAuthenticated, user } = useAuth();
  const isMobile = useIsMobile();
  
  // Get user location for nearby ads, but don't make this a blocking requirement
  const { data: locationData, isSuccess: locationLoaded } = useCurrentLocation();
  
  // Fetch ads with filters
  const { data: adsResponse, isLoading: isLoadingAds, error: adsError } = useAds({
    page,
    per_page: itemsPerPage,
    ...filters,
    ...(locationLoaded ? { lat: locationData?.lat, lon: locationData?.lng, radius: 50 } : {})
  });
  
  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };
  
  // Extract data - ensure we have access to the right structure
  const adData = adsResponse?.data || [];
  // Use fallback for pagination
  const totalPages = adsResponse?.meta?.last_page || 
                     (adsResponse?.pagination?.total_pages) || 1;
  
  // Split into featured and regular ads
  const featuredAds = Array.isArray(adData) ? adData.filter((ad: Listing) => ad.featured) : [];
  const regularAds = Array.isArray(adData) ? adData.filter((ad: Listing) => !ad.featured) : [];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CategoryBar />
      
      <main className="flex-1 pb-20 md:pb-0">
        <div className="container px-4 mx-auto py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar with filters */}
            <div className="col-span-1 hidden md:block">
              <AdFilters 
                layout="sidebar" 
                onLayoutChange={setAdLayout} 
                currentLayout={adLayout}
                onFilterChange={handleFilterChange}
              />
            </div>
            
            {/* Main content */}
            <div className="col-span-1 md:col-span-3">
              {/* View toggle buttons and items per page - compact layout for mobile */}
              <div className="flex justify-end mb-4 gap-3 items-center">
                {isMobile ? (
                  <div className="flex items-center border rounded-md overflow-hidden bg-white dark:bg-dark-card">
                    <Select
                      value={itemsPerPage.toString()}
                      onValueChange={(value) => {
                        setItemsPerPage(parseInt(value, 10));
                        setPage(1);
                      }}
                    >
                      <SelectTrigger className="w-12 h-8 border-0 focus:ring-0">
                        <SelectValue placeholder="10" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <div className="flex border-r border-border dark:border-dark-border">
                      <Button 
                        variant={adLayout === 'grid' ? "default" : "ghost"} 
                        size="icon"
                        onClick={() => setAdLayout('grid')}
                        className="h-8 w-8 rounded-none"
                        aria-label="Grid view"
                        title="عرض شبكي"
                      >
                        <Grid2X2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant={adLayout === 'list' ? "default" : "ghost"}
                        size="icon" 
                        onClick={() => setAdLayout('list')}
                        className="h-8 w-8 rounded-none"
                        aria-label="List view"
                        title="عرض قائمة"
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center">
                      <span className="text-sm ml-2">عرض</span>
                      <Select
                        value={itemsPerPage.toString()}
                        onValueChange={(value) => {
                          setItemsPerPage(parseInt(value, 10));
                          setPage(1);
                        }}
                      >
                        <SelectTrigger className="w-16 h-8">
                          <SelectValue placeholder="10" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="20">20</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex border rounded-sm overflow-hidden">
                      <Button 
                        variant={adLayout === 'grid' ? "default" : "ghost"} 
                        size="icon"
                        onClick={() => setAdLayout('grid')}
                        className="h-8 w-8 rounded-none"
                        aria-label="Grid view"
                        title="عرض شبكي"
                      >
                        <Grid2X2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant={adLayout === 'list' ? "default" : "ghost"}
                        size="icon" 
                        onClick={() => setAdLayout('list')}
                        className="h-8 w-8 rounded-none"
                        aria-label="List view"
                        title="عرض قائمة"
                      >
                        <List className="h-4 w-4" />
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
                
                {/* Loading state handled by WithSkeleton */}
                <WithSkeleton
                  isLoading={isLoadingAds}
                  data={regularAds}
                  SkeletonComponent={CardSkeleton}
                  skeletonCount={itemsPerPage}
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
                
                {/* Error state */}
                {adsError && (
                  <div className="text-center py-12 bg-gray-50 dark:bg-dark-surface">
                    <p className="text-red-500 mb-4">حدث خطأ أثناء تحميل الإعلانات</p>
                    <Button onClick={() => window.location.reload()}>إعادة المحاولة</Button>
                  </div>
                )}
                
                {/* Pagination */}
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
