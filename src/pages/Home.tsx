
import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { CategoryBar } from '@/components/layout/category-bar';
import { AdCard } from '@/components/ads/ad-card';
import { AdFilters } from '@/components/filters/ad-filters';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAds, useCurrentLocation } from '@/hooks/use-api';
import { SearchFilters, Listing } from '@/types';
import { useAuth } from '@/context/auth-context';
import { Pagination } from '@/components/custom/pagination';
import { EnhancedFilterSection } from '@/components/filters/enhanced-filter-section';

export default function Home() {
  const [adLayout, setAdLayout] = useState<'grid' | 'list'>('list');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<SearchFilters>({});
  const { isAuthenticated, user } = useAuth();
  
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
  
  // Extract data with proper type checking
  const adData = adsResponse?.data?.data || [];
  const totalPages = adsResponse?.data?.meta?.last_page || adsResponse?.data?.last_page || 1;
  
  // Split into featured and regular ads
  const featuredAds = Array.isArray(adData) ? adData.filter((ad: Listing) => ad.featured) : [];
  const regularAds = Array.isArray(adData) ? adData.filter((ad: Listing) => !ad.featured) : [];
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <CategoryBar />
      
      <main className="flex-1 pb-20 md:pb-0">
        <div className="container px-4 mx-auto py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar with filters */}
            <div className="col-span-1 hidden md:block">
              <div className="bg-white rounded-xl shadow-sm p-4 border border-blue-100">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">خيارات البحث</h3>
                <AdFilters 
                  layout="sidebar" 
                  onLayoutChange={setAdLayout} 
                  currentLayout={adLayout}
                  onFilterChange={handleFilterChange}
                />
              </div>
            </div>
            
            {/* Main content */}
            <div className="col-span-1 md:col-span-3 space-y-6">
              {/* Enhanced filters for both mobile and desktop */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100">
                <EnhancedFilterSection 
                  onLayoutChange={setAdLayout} 
                  currentLayout={adLayout} 
                  onFilterChange={handleFilterChange}
                  activeFilters={filters}
                  onItemsPerPageChange={setItemsPerPage}
                  itemsPerPage={itemsPerPage}
                />
              </div>

              {/* Loading state */}
              {isLoadingAds && (
                <div className="flex justify-center items-center py-12 bg-white rounded-xl shadow-sm">
                  <Loader2 className="h-8 w-8 animate-spin text-brand" />
                </div>
              )}
              
              {/* Error state */}
              {adsError && (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                  <p className="text-red-500 mb-4">حدث خطأ أثناء تحميل الإعلانات</p>
                  <Button onClick={() => window.location.reload()}>إعادة المحاولة</Button>
                </div>
              )}
              
              {/* Content when data is loaded */}
              {!isLoadingAds && !adsError && adsResponse && (
                <>
                  {/* Featured ads section */}
                  {featuredAds.length > 0 && (
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">إعلانات مميزة</h2>
                        <Button variant="link" className="text-brand" size="sm" asChild>
                          <Link to="/search?featured=true">
                            عرض الكل
                            <ChevronLeft className="h-4 w-4 mr-1" />
                          </Link>
                        </Button>
                      </div>
                      
                      <div className={`grid gap-4 ${
                        adLayout === 'grid' 
                          ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' 
                          : 'grid-cols-1'
                      }`}>
                        {featuredAds.slice(0, 3).map((ad) => (
                          <AdCard 
                            key={ad.id} 
                            ad={ad} 
                            layout={adLayout}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Regular ads section */}
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold">أحدث الإعلانات</h2>
                    </div>
                    
                    {regularAds.length > 0 ? (
                      <div className={`grid gap-4 ${
                        adLayout === 'grid' 
                          ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' 
                          : 'grid-cols-1'
                      }`}>
                        {regularAds.map((ad) => (
                          <AdCard 
                            key={ad.id} 
                            ad={ad} 
                            layout={adLayout} 
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <p className="text-muted-foreground mb-4">لا توجد إعلانات متطابقة مع البحث</p>
                      </div>
                    )}
                    
                    {/* Pagination */}
                    <div className="mt-6">
                      <Pagination 
                        currentPage={page} 
                        totalPages={totalPages}
                        onPageChange={setPage}
                      />
                    </div>
                  </div>
                </>
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
