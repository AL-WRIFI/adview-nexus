
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AdFilters } from '@/components/filters/ad-filters';
import { AdCard } from '@/components/ads/ad-card';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin } from 'lucide-react';
import { MobileNav } from '@/components/layout/mobile-nav';
import { useListings, useCategory, useCategories, useStates } from '@/hooks/use-api';
import { SearchFilters } from '@/types';
import { useAuth } from '@/context/auth-context';
import { CategoryBar } from '@/components/layout/category/CategoryBar';
import { Pagination } from '@/components/custom/pagination';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useLayoutStore } from '@/store/layout-store';
import { MobileFilterSheet } from '@/components/filters/MobileFilterSheet';
import { useIsMobile } from '@/hooks/use-mobile';

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const numericCategoryId = categoryId ? parseInt(categoryId, 10) : 0;
  const { adLayout } = useLayoutStore(); // Use global layout
  const isMobile = useIsMobile();
  
  const [filters, setFilters] = useState<SearchFilters>({
    category_id: numericCategoryId,
    sub_category_id: searchParams.get('subcategory') ? parseInt(searchParams.get('subcategory')!, 10) : undefined,
    child_category_id: searchParams.get('childcategory') ? parseInt(searchParams.get('childcategory')!, 10) : undefined,
  });
  const [page, setPage] = useState(1);
  const [selectedStateId, setSelectedStateId] = useState<number | undefined>();
  const [nearbyEnabled, setNearbyEnabled] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'popular' | 'created_at' | 'updated_at'>('created_at');
  const { isAuthenticated } = useAuth();
  
  // Fetch data
  const { data: category, isLoading: isCategoryLoading } = useCategory(numericCategoryId);
  const { data: categoriesData } = useCategories();
  const { data: states = [] } = useStates();
  const { data: listingsResponse, isLoading: isLoadingListings, error } = useListings({
    category_id: numericCategoryId,
    page,
    per_page: 12, // Fixed at 12 per page
    sort: sortBy,
    ...filters,
  });
  
  useEffect(() => {
    // Update filters when URL params change
    if (categoryId || searchParams.get('subcategory') || searchParams.get('childcategory')) {
      setFilters(prev => ({
        ...prev,
        category_id: numericCategoryId,
        sub_category_id: searchParams.get('subcategory') ? parseInt(searchParams.get('subcategory')!, 10) : undefined,
        child_category_id: searchParams.get('childcategory') ? parseInt(searchParams.get('childcategory')!, 10) : undefined,
      }));
      setPage(1); // Reset to first page on filter changes
    }
  }, [categoryId, searchParams.get('subcategory'), searchParams.get('childcategory')]);
  
  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      category_id: numericCategoryId,
      sub_category_id: searchParams.get('subcategory') ? parseInt(searchParams.get('subcategory')!, 10) : undefined,
      child_category_id: searchParams.get('childcategory') ? parseInt(searchParams.get('childcategory')!, 10) : undefined,
    }));
    setPage(1); // Reset to first page when filters change
  };
  
  // Get the listings from the response, ensure it's an array even if undefined
  const listings = listingsResponse?.data || [];
  const totalPages = listingsResponse?.last_page || 1;
  const totalResults = listings.length || 0;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <CategoryBar />
      
      <div className="container px-4 mx-auto py-6">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-xl font-bold">
                {category?.name || 'إعلانات التصنيف'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {totalResults} إعلان متاح
              </p>
            </div>
            
            {/* Mobile Filter Button - Compact */}
            {isMobile && (
              <MobileFilterSheet 
                onFilterChange={handleFilterChange}
                currentFilters={filters}
                triggerButton={
                  <Button variant="outline" size="sm" className="flex items-center gap-2 h-10 px-4">
                    <span className="text-sm font-medium">فلترة</span>
                  </Button>
                }
              />
            )}
          </div>
          
          {/* Sort and Region controls */}
          <div className="flex items-center gap-3">
            <Select
              value={sortBy}
              onValueChange={(value: 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'popular' | 'created_at' | 'updated_at') => {
                setSortBy(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-32 h-8">
                <SelectValue placeholder="الترتيب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">الأحدث</SelectItem>
                <SelectItem value="updated_at">الأقدم</SelectItem>
                <SelectItem value="price_asc">السعر: أقل لأعلى</SelectItem>
                <SelectItem value="price_desc">السعر: أعلى لأقل</SelectItem>
              </SelectContent>
            </Select>

            {!isMobile && (
              <>
                <Select
                  value={selectedStateId?.toString() || 'all'}
                  onValueChange={(value) => {
                    const stateId = value === 'all' ? undefined : parseInt(value);
                    setSelectedStateId(stateId);
                    handleFilterChange({ ...filters, state_id: stateId });
                  }}
                >
                  <SelectTrigger className="w-32 h-8">
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
                    handleFilterChange({
                      ...filters,
                      radius: !nearbyEnabled ? 20 : undefined
                    });
                  }}
                  className="flex items-center gap-2 h-8"
                >
                  <MapPin className="h-4 w-4" />
                  <span>القريب</span>
                </Button>
              </>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar with filters */}
          {!isMobile && (
            <div className="col-span-1 hidden md:block">
              <AdFilters 
                layout="sidebar" 
                onFilterChange={handleFilterChange}
                selectedCategory={category}
              />
            </div>
          )}
          
          {/* Main content */}
          <div className="col-span-1 md:col-span-3">
            {/* Loading state */}
            {isLoadingListings && (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-brand" />
              </div>
            )}
            
            {/* Error state */}
            {error && !isLoadingListings && (
              <div className="text-center py-12 bg-gray-50 dark:bg-dark-surface">
                <p className="text-red-500 mb-4">حدث خطأ أثناء تحميل الإعلانات</p>
                <Button onClick={() => window.location.reload()}>إعادة المحاولة</Button>
              </div>
            )}
            
            {/* Content when data is loaded */}
            {!isLoadingListings && !error && (
              <>
                {/* Listings grid */}
                {Array.isArray(listings) && listings.length > 0 ? (
                  <div className={`grid gap-4 ${
                    adLayout === 'grid' 
                      ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' 
                      : 'grid-cols-1'
                  }`}>
                    {listings.map((listing) => (
                      <AdCard 
                        key={listing.id} 
                        ad={listing} 
                        layout={adLayout}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 dark:bg-dark-surface">
                    <p className="text-muted-foreground mb-4">
                      لا توجد إعلانات متطابقة مع البحث في هذا التصنيف
                    </p>
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
      
      <Footer />
      <MobileNav />
    </div>
  );
}
