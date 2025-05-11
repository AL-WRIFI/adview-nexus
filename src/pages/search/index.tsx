
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/layout/header';
import { CategoryBar } from '@/components/layout/category-bar';
import { AdCard } from '@/components/ads/ad-card';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { useAds } from '@/hooks/use-api';
import { SearchFilters } from '@/types';
import { Pagination } from '@/components/custom/pagination';
import { Loader2, Search } from 'lucide-react';
import { EnhancedFilterSection } from '@/components/filters/enhanced-filter-section';
import { Button } from '@/components/ui/button';
import { ProtectedRoute } from '@/components/auth/protected-route';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [filters, setFilters] = useState<SearchFilters>({});
  const [adLayout, setAdLayout] = useState<'grid' | 'list'>('list');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  
  // Initialize filters based on URL search parameters
  useEffect(() => {
    const initialFilters: SearchFilters = {};
    
    for (const [key, value] of searchParams.entries()) {
      if (key === 'q') {
        initialFilters.search = value;
      } else if (key === 'category') {
        initialFilters.category_id = parseInt(value, 10);
      } else if (key === 'featured' && value === 'true') {
        initialFilters.featured = true;
      }
    }
    
    setFilters(initialFilters);
  }, [searchParams]);
  
  // Fetch ads with filters
  const { data: adsResponse, isLoading: isLoadingAds, error: adsError } = useAds({
    page,
    per_page: itemsPerPage,
    ...filters,
  });
  
  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    
    // Update URL search parameters
    const newSearchParams = new URLSearchParams();
    if (newFilters.search) newSearchParams.set('q', newFilters.search);
    if (newFilters.category_id) newSearchParams.set('category', newFilters.category_id.toString());
    if (newFilters.featured) newSearchParams.set('featured', 'true');
    
    setSearchParams(newSearchParams);
    setPage(1); // Reset to first page when filters change
  };
  
  // Extract data
  const ads = adsResponse?.data || [];
  const totalPages = adsResponse?.meta?.last_page || 1;
  
  const searchQuery = searchParams.get('q') || '';
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <CategoryBar />
      
      <main className="flex-1 pb-20 md:pb-0">
        <div className="container px-4 mx-auto py-6">
          {/* Search title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Search className="mr-2 h-5 w-5" /> نتائج البحث
            </h1>
            {searchQuery && (
              <p className="text-gray-600 mt-1">
                البحث عن: <span className="font-semibold">{searchQuery}</span>
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar with filters */}
            <div className="col-span-1 hidden md:block">
              <div className="bg-white rounded-xl shadow-sm p-4 border border-blue-100">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">خيارات البحث</h3>
                {/* Additional sidebar filters can go here */}
              </div>
            </div>
            
            {/* Main content */}
            <div className="col-span-1 md:col-span-3 space-y-6">
              {/* Enhanced filters */}
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
              
              {/* Ads content */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100">
                {/* Loading state */}
                {isLoadingAds && (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-brand" />
                  </div>
                )}
                
                {/* Error state */}
                {adsError && (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-red-500 mb-4">حدث خطأ أثناء تحميل الإعلانات</p>
                    <Button onClick={() => window.location.reload()}>إعادة المحاولة</Button>
                  </div>
                )}
                
                {/* Content when data is loaded */}
                {!isLoadingAds && !adsError && (
                  <>
                    {/* Ads count */}
                    <div className="mb-4">
                      <p className="text-gray-600">
                        تم العثور على <span className="font-bold text-brand">{ads.length}</span> إعلان
                      </p>
                    </div>
                    
                    {/* Ads grid/list */}
                    {ads.length > 0 ? (
                      <div className={`grid gap-4 ${
                        adLayout === 'grid' 
                          ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' 
                          : 'grid-cols-1'
                      }`}>
                        {ads.map((ad) => (
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
                  </>
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
