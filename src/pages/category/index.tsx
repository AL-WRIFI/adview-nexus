
import { useParams, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { AdCard } from '@/components/ads/ad-card';
import { ModernAdFilters } from '@/components/filters/ModernAdFilters';
import { MobileFilterDrawer } from '@/components/filters/MobileFilterDrawer';
import { Pagination } from '@/components/custom/pagination';
import { Button } from '@/components/ui/button';
import { Filter, Grid, List } from 'lucide-react';
import { useListings, useCategories } from '@/hooks/use-api';
import { SearchFilters } from '@/types';
import { cn } from '@/lib/utils';

export default function CategoryPage() {
  const { categoryId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  const { data: categories = [] } = useCategories();
  
  // Build filters from URL params
  const filters: SearchFilters = {
    category_id: categoryId ? parseInt(categoryId) : undefined,
    sub_category_id: searchParams.get('sub_category_id') ? parseInt(searchParams.get('sub_category_id')!) : undefined,
    child_category_id: searchParams.get('child_category_id') ? parseInt(searchParams.get('child_category_id')!) : undefined,
    brand_id: searchParams.get('brand_id') ? parseInt(searchParams.get('brand_id')!) : undefined,
    state_id: searchParams.get('state_id') ? parseInt(searchParams.get('state_id')!) : undefined,
    city_id: searchParams.get('city_id') ? parseInt(searchParams.get('city_id')!) : undefined,
    min_price: searchParams.get('min_price') ? parseFloat(searchParams.get('min_price')!) : undefined,
    max_price: searchParams.get('max_price') ? parseFloat(searchParams.get('max_price')!) : undefined,
    product_condition: searchParams.get('product_condition') as 'new' | 'used' | undefined,
    listing_type: searchParams.get('listing_type') as 'sell' | 'rent' | 'job' | 'service' | undefined,
    sort_by: searchParams.get('sort_by') as 'newest' | 'oldest' | 'price_asc' | 'price_desc' | undefined,
    page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
    per_page: 12,
  };

  const { data: listingsData, isLoading } = useListings(filters);
  const listings = listingsData?.data || [];
  const pagination = listingsData?.meta;

  const currentCategory = categories.find(cat => cat.id === parseInt(categoryId || ''));

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    const updatedParams = new URLSearchParams(searchParams);
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        updatedParams.set(key, value.toString());
      } else {
        updatedParams.delete(key);
      }
    });
    
    // Reset to page 1 when filters change
    if (Object.keys(newFilters).some(key => key !== 'page')) {
      updatedParams.set('page', '1');
    }
    
    setSearchParams(updatedParams);
  };

  const handlePageChange = (page: number) => {
    handleFilterChange({ page });
  };

  const handleSortChange = (sortBy: string) => {
    handleFilterChange({ sort_by: sortBy as any });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {currentCategory?.name || 'التصنيفات'}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {listings.length} إعلان متاح
          </p>
        </div>

        <div className="flex gap-6">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-6">
              <ModernAdFilters 
                filters={filters}
                onFiltersChange={handleFilterChange}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="lg:hidden"
                    onClick={() => setMobileFiltersOpen(true)}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    الفلاتر
                  </Button>
                  
                  <div className="hidden sm:flex items-center gap-2">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <select
                    value={filters.sort_by || 'newest'}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="newest">الأحدث</option>
                    <option value="oldest">الأقدم</option>
                    <option value="price_asc">السعر: من الأقل للأعلى</option>
                    <option value="price_desc">السعر: من الأعلى للأقل</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Listings Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 animate-pulse">
                    <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : listings.length > 0 ? (
              <>
                <div className={cn(
                  viewMode === 'grid' 
                    ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "space-y-4"
                )}>
                  {listings.map((listing) => (
                    <AdCard 
                      key={listing.id}
                      ad={listing}
                      variant={viewMode}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.last_page > 1 && (
                  <div className="mt-8 flex justify-center">
                    <Pagination
                      currentPage={pagination.current_page}
                      totalPages={pagination.last_page}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  لا توجد إعلانات في هذا التصنيف
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer
        isOpen={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        filters={filters}
        onFiltersChange={handleFilterChange}
      />

      <Footer />
      <MobileNav />
    </div>
  );
}
