
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AdFilters } from '@/components/filters/ad-filters';
import { AdCard } from '@/components/ads/ad-card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { MobileNav } from '@/components/layout/mobile-nav';
import { useListings, useCategory, useCategories } from '@/hooks/use-api';
import { SearchFilters } from '@/types';
import { useAuth } from '@/context/auth-context';
import { CategoryBar } from '@/components/layout/category/CategoryBar';
import { CategoryFilters } from '@/components/layout/category/CategoryFilters';
import { Pagination } from '@/components/custom/pagination';
import { useLayoutStore } from '@/store/layout-store';
import { useIsMobile } from '@/hooks/use-mobile';

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { adLayout } = useLayoutStore();
  const isMobile = useIsMobile();
  
  const numericCategoryId = categoryId ? parseInt(categoryId, 10) : 0;
  
  const [filters, setFilters] = useState<SearchFilters>({
    category_id: numericCategoryId,
    subcategory_id: searchParams.get('subcategory') ? parseInt(searchParams.get('subcategory')!, 10) : undefined,
    child_category_id: searchParams.get('childcategory') ? parseInt(searchParams.get('childcategory')!, 10) : undefined,
  });
  const [page, setPage] = useState(1);
  const [selectedRegion, setSelectedRegion] = useState('كل المناطق');
  const { isAuthenticated } = useAuth();
  
  // Fetch data
  const { data: category, isLoading: isCategoryLoading } = useCategory(numericCategoryId);
  const { data: categoriesData } = useCategories();
  const { data: listingsResponse, isLoading: isLoadingListings, error } = useListings({
    category_id: numericCategoryId,
    page,
    per_page: 12,
    sort: 'created_at',
    ...filters,
  });
  
  useEffect(() => {
    // Update filters when URL params change
    if (categoryId || searchParams.get('subcategory') || searchParams.get('childcategory')) {
      setFilters(prev => ({
        ...prev,
        category_id: numericCategoryId,
        subcategory_id: searchParams.get('subcategory') ? parseInt(searchParams.get('subcategory')!, 10) : undefined,
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
      subcategory_id: searchParams.get('subcategory') ? parseInt(searchParams.get('subcategory')!, 10) : undefined,
      child_category_id: searchParams.get('childcategory') ? parseInt(searchParams.get('childcategory')!, 10) : undefined,
    }));
    setPage(1); // Reset to first page when filters change
  };

  const handleNearbyClick = () => {
    // Handle nearby functionality
    console.log('Nearby clicked');
  };

  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region);
  };

  const handleFilterClick = () => {
    // Handle filter click
    console.log('Filter clicked');
  };
  
  // Get the listings from the response, ensure it's an array even if undefined
  const listings = listingsResponse?.data || [];
  const totalPages = listingsResponse?.meta?.last_page || 1;
  const totalResults = listingsResponse?.meta?.total || 0;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <CategoryBar />
      
      <CategoryFilters 
        onNearbyClick={handleNearbyClick}
        onRegionSelect={handleRegionSelect}
        onFilterClick={handleFilterClick}
        selectedRegion={selectedRegion}
      />
      
      <div className="container px-4 mx-auto py-6">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">
              {category?.name || 'إعلانات التصنيف'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {totalResults} إعلان متاح
            </p>
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
            {/* Mobile filters */}
            {isMobile && (
              <div className="mb-6">
                <AdFilters 
                  layout="horizontal" 
                  onFilterChange={handleFilterChange}
                  selectedCategory={category}
                />
              </div>
            )}
            
            {/* Results count */}
            <div className="flex flex-col sm:flex-row justify-between mb-4 gap-3">
              <p className="text-muted-foreground">
                {Array.isArray(listings) && listings.length > 0 ? `${listings.length} نتيجة` : '0 نتيجة'} 
              </p>
            </div>
            
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
