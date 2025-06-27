import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AdCard } from '@/components/ads/ad-card';
import { SearchFilters, Listing } from '@/types';
import { useAds } from '@/hooks/use-api';
import { AdFilters } from '@/components/filters/ad-filters';
import { MobileFilterSheet } from '@/components/filters/MobileFilterSheet';
import { Button } from '@/components/ui/button';
import { Grid2X2, List } from 'lucide-react';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { useIsMobile } from '@/hooks/use-mobile';

export default function NewSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const isMobile = useIsMobile();
  
  const initialFilters: SearchFilters = {};
  for (const [key, value] of searchParams.entries()) {
    initialFilters[key] = value;
  }

  const [filters, setFilters] = useState<SearchFilters>(initialFilters);

  useEffect(() => {
    const newParams = new URLSearchParams();
    for (const key in filters) {
      if (filters[key] !== undefined) {
        newParams.set(key, String(filters[key]));
      }
    }
    setSearchParams(newParams);
  }, [filters, setSearchParams]);
  
  useEffect(() => {
    const items = searchParams.get('per_page');
    if (items) {
      setItemsPerPage(parseInt(items));
    }
  }, [searchParams]);

  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
  };
  
  const { data: adsResponse, isLoading: isLoadingAds, error: adsError } = useAds(searchParams);

  const totalPages = adsResponse?.data?.last_page || Math.ceil((adsResponse?.data?.total || 0) / (searchParams.per_page || 10));
  const totalResults = adsResponse?.data?.total || 0;

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setFilters(prevFilters => ({ ...prevFilters, per_page: parseInt(value) }));
  };

  const adData = Array.isArray(adsResponse?.data?.data) ? adsResponse.data.data : 
                 Array.isArray(adsResponse?.data) ? adsResponse.data : [];

  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="bg-muted py-3">
        <div className="container px-4 mx-auto">
          <h2 className="text-lg font-semibold">
            {totalResults > 0 ? `نتائج البحث: ${totalResults}` : 'لا توجد نتائج'}
          </h2>
        </div>
      </div>
      
      <main className="flex-1 pb-20 md:pb-0">
        <div className="container px-4 mx-auto py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Desktop Filter Sidebar */}
            {!isMobile && (
              <div className="col-span-1 hidden md:block">
                <AdFilters 
                  layout="sidebar" 
                  onLayoutChange={setViewMode} 
                  currentLayout={viewMode}
                  onFilterChange={handleFilterChange}
                />
              </div>
            )}
            
            <div className="col-span-1 md:col-span-3">
              {/* View toggle buttons and items per page */}
              <div className="flex justify-end mb-4 gap-3 items-center">
                <div className="flex items-center w-full justify-between">
                  {isMobile ? (
                    <div className="flex items-center w-full justify-between">
                      {/* Mobile Filter Button */}
                      <MobileFilterSheet 
                        onFilterChange={handleFilterChange}
                        currentFilters={filters}
                      />
                      
                      {/* Items per page and view toggle */}
                      <div className="flex items-center border rounded-md overflow-hidden bg-white dark:bg-dark-card">
                        <Select
                          value={itemsPerPage.toString()}
                          onValueChange={handleItemsPerPageChange}
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
                            variant={viewMode === 'grid' ? "default" : "ghost"} 
                            size="icon"
                            onClick={() => setViewMode('grid')}
                            className="h-8 w-8 rounded-none"
                            aria-label="Grid view"
                            title="عرض شبكي"
                          >
                            <Grid2X2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant={viewMode === 'list' ? "default" : "ghost"}
                            size="icon" 
                            onClick={() => setViewMode('list')}
                            className="h-8 w-8 rounded-none"
                            aria-label="List view"
                            title="عرض قائمة"
                          >
                            <List className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center">
                        <span className="text-sm ml-2">عرض</span>
                        <Select
                          value={itemsPerPage.toString()}
                          onValueChange={handleItemsPerPageChange}
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
                          variant={viewMode === 'grid' ? "default" : "ghost"} 
                          size="icon"
                          onClick={() => setViewMode('grid')}
                          className="h-8 w-8 rounded-none"
                          aria-label="Grid view"
                          title="عرض شبكي"
                        >
                          <Grid2X2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant={viewMode === 'list' ? "default" : "ghost"}
                          size="icon" 
                          onClick={() => setViewMode('list')}
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
              </div>
              
              {!isLoadingAds && !adsError && adData.length > 0 && (
                <div className={`grid gap-4 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {adData.map((ad: Listing) => (
                    <AdCard 
                      key={ad.id} 
                      ad={ad} 
                      layout={viewMode}
                    />
                  ))}
                </div>
              )}
              
              {!isLoadingAds && !adsError && adData.length === 0 && (
                <div className="text-center py-12 bg-gray-50 dark:bg-dark-surface">
                  <p className="text-muted-foreground mb-4">لا توجد إعلانات مطابقة لبحثك</p>
                </div>
              )}
              
              {adsError && (
                <div className="text-center py-12 bg-gray-50 dark:bg-dark-surface">
                  <p className="text-red-500 mb-4">حدث خطأ أثناء تحميل الإعلانات</p>
                  <Button onClick={() => window.location.reload()}>إعادة المحاولة</Button>
                </div>
              )}
              
              {!isLoadingAds && !adsError && adsResponse && (
                <div className="flex justify-center mt-8">
                  {totalPages > 1 && (
                    [...Array(totalPages)].map((_, i) => (
                      <Button
                        key={i + 1}
                        variant={Number(searchParams.get('page')) === i + 1 || (!searchParams.get('page') && i === 0) ? 'default' : 'outline'}
                        onClick={() => {
                          const newParams = new URLSearchParams(searchParams);
                          newParams.set('page', String(i + 1));
                          setSearchParams(newParams);
                        }}
                        className="mx-1"
                      >
                        {i + 1}
                      </Button>
                    ))
                  )}
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
