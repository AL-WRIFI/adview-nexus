
import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { CategoryBar } from '@/components/layout/category-bar';
import { AdCard } from '@/components/ads/ad-card';
import AdFilters from '@/components/filters/ad-filters';
import { useSearchParams } from 'react-router-dom';
import { useAds } from '@/hooks/use-api';
import { WithSkeleton, CardSkeleton } from '@/components/ui/loading-skeleton';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/custom/pagination';
import { Grid2X2, List } from 'lucide-react';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [adLayout, setAdLayout] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Build filters from search params
  const filters = Object.fromEntries(searchParams.entries());
  
  // Fetch ads with filters
  const { data: adsResponse, isLoading, error } = useAds({
    page,
    per_page: itemsPerPage,
    ...filters,
  });

  // Update page in URL when it changes
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page.toString());
    setSearchParams(newParams);
  }, [page]);

  const handleFilterChange = (newFilters: Record<string, any>) => {
    setPage(1); // Reset to first page when filters change
    // Convert filters to search params
    const newParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) newParams.set(key, value.toString());
    });
    setSearchParams(newParams);
  };

  // Extract data
  const adsData = adsResponse?.data || [];
  const totalPages = adsResponse?.meta?.last_page || 1;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CategoryBar />
      
      <main className="flex-1 pb-20 md:pb-0">
        <div className="container px-4 mx-auto py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">نتائج البحث</h1>
            <div className="flex items-center gap-2">
              <Button 
                variant={adLayout === 'grid' ? "default" : "outline"} 
                size="icon"
                onClick={() => setAdLayout('grid')}
                className="h-8 w-8"
              >
                <Grid2X2 className="h-4 w-4" />
              </Button>
              <Button 
                variant={adLayout === 'list' ? "default" : "outline"}
                size="icon" 
                onClick={() => setAdLayout('list')}
                className="h-8 w-8"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Filters sidebar */}
            <div className="md:col-span-1">
              <AdFilters 
                onFilterChange={handleFilterChange}
              />
            </div>
            
            {/* Results */}
            <div className="md:col-span-3">
              <WithSkeleton
                isLoading={isLoading}
                data={adsData}
                SkeletonComponent={CardSkeleton}
                skeletonCount={itemsPerPage}
              >
                {(ads) => (
                  ads.length > 0 ? (
                    <div className={`grid gap-4 ${
                      adLayout === 'grid' 
                        ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' 
                        : 'grid-cols-1'
                    }`}>
                      {ads.map((ad) => (
                        <AdCard 
                          key={ad.id} 
                          ad={ad}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 dark:bg-dark-surface rounded-lg">
                      <p className="text-muted-foreground mb-4">لم يتم العثور على نتائج لبحثك</p>
                      <Button onClick={() => window.location.href = '/'}>العودة للصفحة الرئيسية</Button>
                    </div>
                  )
                )}
              </WithSkeleton>
              
              {/* Error state */}
              {error && (
                <div className="text-center py-12 bg-gray-50 dark:bg-dark-surface rounded-lg">
                  <p className="text-red-500 mb-4">حدث خطأ أثناء تحميل النتائج</p>
                  <Button onClick={() => window.location.reload()}>إعادة المحاولة</Button>
                </div>
              )}
              
              {/* Pagination */}
              {!isLoading && !error && adsResponse && adsData.length > 0 && (
                <div className="mt-8">
                  <Pagination 
                    currentPage={page} 
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
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
