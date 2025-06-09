
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { AdCard } from '@/components/ads/ad-card';
import { MobileFilterSheet } from '@/components/filters/MobileFilterSheet';
import { ModernAdFilters } from '@/components/filters/ModernAdFilters';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, Grid2X2, List } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SearchFilters, Listing } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAds } from '@/hooks/use-api';
import { WithSkeleton, CardSkeleton } from '@/components/ui/loading-skeleton';
import { Pagination } from '@/components/custom/pagination';
import { useIsMobile } from '@/hooks/use-mobile';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || searchParams.get('q') || '');
  const [filters, setFilters] = useState<SearchFilters>({
    category_id: searchParams.get('category_id') ? parseInt(searchParams.get('category_id')!) : undefined,
    sub_category_id: searchParams.get('sub_category_id') ? parseInt(searchParams.get('sub_category_id')!) : undefined,
    state_id: searchParams.get('state_id') ? parseInt(searchParams.get('state_id')!) : undefined,
    city_id: searchParams.get('city_id') ? parseInt(searchParams.get('city_id')!) : undefined,
    brand_id: searchParams.get('brand_id') ? parseInt(searchParams.get('brand_id')!) : undefined,
    min_price: searchParams.get('min_price') ? parseInt(searchParams.get('min_price')!) : undefined,
    max_price: searchParams.get('max_price') ? parseInt(searchParams.get('max_price')!) : undefined,
    product_condition: searchParams.get('product_condition') as 'new' | 'used' | undefined,
    listing_type: searchParams.get('listing_type') as 'sell' | 'rent' | 'job' | 'service' | undefined,
    sort_by: searchParams.get('sort_by') as 'newest' | 'oldest' | 'price_asc' | 'price_desc' | undefined,
  });
  const [adLayout, setAdLayout] = useState<'grid' | 'list'>('grid');
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'));
  
  // Fetch search results using the API with all filters including search
  const { data: adsResponse, isLoading } = useAds({
    page,
    per_page: itemsPerPage,
    search: searchQuery,
    ...filters,
  });
  
  // Update URL search params
  const handleSearch = () => {
    const params: Record<string, string> = {};
    
    if (searchQuery.trim()) params.search = searchQuery.trim();
    if (filters.category_id) params.category_id = filters.category_id.toString();
    if (filters.sub_category_id) params.sub_category_id = filters.sub_category_id.toString();
    if (filters.state_id) params.state_id = filters.state_id.toString();
    if (filters.city_id) params.city_id = filters.city_id.toString();
    if (filters.brand_id) params.brand_id = filters.brand_id.toString();
    if (filters.min_price) params.min_price = filters.min_price.toString();
    if (filters.max_price && filters.max_price !== 999999999) params.max_price = filters.max_price.toString();
    if (filters.product_condition) params.product_condition = filters.product_condition;
    if (filters.listing_type) params.listing_type = filters.listing_type;
    if (filters.sort_by) params.sort_by = filters.sort_by;
    if (page > 1) params.page = page.toString();
    
    setSearchParams(params);
    
    if (searchQuery.trim()) {
      toast({
        title: "جاري البحث...",
        description: `البحث عن "${searchQuery}"`,
      });
    }
  };
  
  // Auto-search when filters change
  useEffect(() => {
    handleSearch();
  }, [filters, page]);
  
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
  };

  // Get listings and pagination from API response
  const listings = adsResponse?.data || [];
  const totalPages = adsResponse?.last_page || 1;
  const totalResults = adsResponse?.total || 0;
  
  return (
    <PageLayout>
      {/* Search Header */}
      <div className="bg-gradient-to-r from-brand/5 to-brand/10 border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="ابحث عن أي شيء..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 bg-background border-border text-lg h-12"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch();
                }}
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              {searchQuery && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                  onClick={() => {
                    setSearchQuery('');
                    handleSearch();
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Button onClick={handleSearch} className="px-8 h-12 text-lg">
              بحث
            </Button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Desktop sidebar filters */}
          <div className="col-span-1 hidden lg:block">
            <div className="sticky top-24">
              <ModernAdFilters 
                onFilterChange={handleFilterChange}
                currentFilters={filters}
              />
            </div>
          </div>
          
          {/* Search results */}
          <div className="col-span-1 lg:col-span-3">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">نتائج البحث</h2>
                <p className="text-muted-foreground">
                  {!isLoading ? `${totalResults.toLocaleString()} نتيجة` : '0 نتيجة'} 
                  {searchQuery && ` لـ "${searchQuery}"`}
                </p>
              </div>
              
              {/* View Controls */}
              <div className="flex items-center gap-3">
                {/* Mobile Filter Button */}
                {isMobile && (
                  <MobileFilterSheet
                    onFilterChange={handleFilterChange}
                    currentFilters={filters}
                  />
                )}
                
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
                  <div className="text-center py-16 bg-muted/30 rounded-2xl">
                    <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2 text-foreground">لم يتم العثور على نتائج</h3>
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
            {!isLoading && listings.length > 0 && totalPages > 1 && (
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
    </PageLayout>
  );
}
