
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { AdCard } from '@/components/ads/ad-card';
import { ModernAdFilters } from '@/components/filters/ModernAdFilters';
import { ModernCategoryBar } from '@/components/layout/category/ModernCategoryBar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, Grid2X2, List } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SearchFilters, Listing } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAds } from '@/hooks/use-api';
import { WithSkeleton, CardSkeleton } from '@/components/ui/loading-skeleton';
import { Pagination } from '@/components/custom/pagination';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState<SearchFilters>({
    category_id: searchParams.get('category') ? parseInt(searchParams.get('category')!) : undefined,
    state_id: searchParams.get('state') ? parseInt(searchParams.get('state')!) : undefined,
    price_min: searchParams.get('priceMin') ? parseInt(searchParams.get('priceMin')!) : undefined,
    price_max: searchParams.get('priceMax') ? parseInt(searchParams.get('priceMax')!) : undefined,
  });
  const [adLayout, setAdLayout] = useState<'grid' | 'list'>('list');
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [page, setPage] = useState(1);
  
  // Fetch search results using the API
  const { data: adsResponse, isLoading } = useAds({
    page,
    per_page: itemsPerPage,
    search: searchQuery,
    ...filters,
  });
  
  // Update URL search params
  const handleSearch = () => {
    const params: Record<string, string> = {};
    
    if (searchQuery) params.q = searchQuery;
    if (filters.category_id) params.category = filters.category_id.toString();
    if (filters.state_id) params.state = filters.state_id.toString();
    if (filters.price_min) params.priceMin = filters.price_min.toString();
    if (filters.price_max && filters.price_max !== 999999999) params.priceMax = filters.price_max.toString();
    
    setSearchParams(params);
    setPage(1);
    
    toast({
      title: "جاري البحث...",
      description: `البحث عن "${searchQuery}"`,
    });
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setFilters({});
    setSearchParams({});
    setPage(1);
  };

  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setPage(1);
    // Update URL params
    const params: Record<string, string> = {};
    if (searchQuery) params.q = searchQuery;
    if (newFilters.category_id) params.category = newFilters.category_id.toString();
    if (newFilters.state_id) params.state = newFilters.state_id.toString();
    if (newFilters.price_min) params.priceMin = newFilters.price_min.toString();
    if (newFilters.price_max) params.priceMax = newFilters.price_max.toString();
    setSearchParams(params);
  };

  // Get listings and pagination
  const listings = adsResponse?.data || [];
  const totalPages = adsResponse?.last_page || 1;
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <ModernCategoryBar />
      
      {/* Search Header */}
      <div className="bg-accent/30 border-b border-border">
        <div className="container px-4 mx-auto py-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="ابحث عن أي شيء..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 bg-background border-border"
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
            <Button onClick={handleSearch} className="px-8">
              بحث
            </Button>
          </div>
        </div>
      </div>
      
      <main className="flex-1 pb-20 md:pb-0">
        <div className="container px-4 mx-auto py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Desktop sidebar filters */}
            <div className="col-span-1 hidden lg:block">
              <ModernAdFilters 
                onFilterChange={handleFilterChange}
                currentFilters={filters}
              />
            </div>
            
            {/* Search results */}
            <div className="col-span-1 lg:col-span-3">
              {/* Results Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold">نتائج البحث</h2>
                  <p className="text-muted-foreground">
                    {!isLoading && listings.length > 0 ? `${listings.length} نتيجة` : '0 نتيجة'} 
                    {searchQuery && ` لـ "${searchQuery}"`}
                  </p>
                </div>
                
                {/* View Controls */}
                <div className="flex items-center gap-3">
                  {/* Mobile Filter Button */}
                  <div className="lg:hidden">
                    <ModernAdFilters 
                      onFilterChange={handleFilterChange}
                      currentFilters={filters}
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-sm mr-2 text-muted-foreground hidden sm:block">عرض</span>
                    <Select
                      value={itemsPerPage.toString()}
                      onValueChange={(value) => {
                        setItemsPerPage(parseInt(value, 10));
                        setPage(1);
                      }}
                    >
                      <SelectTrigger className="w-16 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6">6</SelectItem>
                        <SelectItem value="12">12</SelectItem>
                        <SelectItem value="24">24</SelectItem>
                        <SelectItem value="48">48</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex border rounded-lg overflow-hidden bg-background">
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
              </div>
              
              {/* Results Grid */}
              <WithSkeleton
                isLoading={isLoading}
                data={listings}
                SkeletonComponent={CardSkeleton}
                skeletonCount={itemsPerPage}
              >
                {(searchResults) => (
                  searchResults.length > 0 ? (
                    <div className={`grid gap-4 ${
                      adLayout === 'grid' 
                        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                        : 'grid-cols-1'
                    }`}>
                      {searchResults.map((ad: Listing) => (
                        <AdCard key={ad.id} ad={ad} layout={adLayout} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-accent/30 rounded-2xl">
                      <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-xl font-semibold mb-2">لم يتم العثور على نتائج</h3>
                      <p className="text-muted-foreground mb-6">
                        جرب تعديل معايير البحث أو استخدم كلمات مفتاحية مختلفة
                      </p>
                      <Button onClick={resetFilters} variant="outline">
                        إعادة ضبط الفلاتر
                      </Button>
                    </div>
                  )
                )}
              </WithSkeleton>
              
              {/* Pagination */}
              {!isLoading && listings.length > 0 && (
                <Pagination 
                  currentPage={page} 
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
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
