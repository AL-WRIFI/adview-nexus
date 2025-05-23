
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AdFilters } from '@/components/filters/ad-filters';
import { AdCard } from '@/components/ads/ad-card';
import { Button } from '@/components/ui/button';
import { Loader2, Grid2X2, List } from 'lucide-react';
import { MobileNav } from '@/components/layout/mobile-nav';
import { useListings, useCategory } from '@/hooks/use-api';
import { SearchFilters } from '@/types';
import { useAuth } from '@/context/auth-context';
import { CategoryBar } from '@/components/layout/category/CategoryBar';
import { Pagination } from '@/components/custom/pagination';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [searchParams] = useSearchParams();
  const subcategoryId = searchParams.get('subcategory');
  const childcategoryId = searchParams.get('childcategory');
  
  const [filters, setFilters] = useState<SearchFilters>({
    category_id: categoryId ? parseInt(categoryId, 10) : undefined,
    sub_category_id: subcategoryId ? parseInt(subcategoryId, 10) : undefined,
    child_category_id: childcategoryId ? parseInt(childcategoryId, 10) : undefined,
  });
  const [adLayout, setAdLayout] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const { isAuthenticated } = useAuth();
  
  // Fetch the category data to display the title, etc.
  const { data: category, isLoading: loadingCategory } = useCategory(
    categoryId ? parseInt(categoryId, 10) : undefined
  );
  
  // Fetch listings with the category filter
  const { data: listingsResponse, isLoading, error } = useListings({
    ...filters,
    page,
    per_page: itemsPerPage,
  });
  
  useEffect(() => {
    // Update filters when URL params change
    if (categoryId || subcategoryId || childcategoryId) {
      setFilters(prev => ({
        ...prev,
        category_id: categoryId ? parseInt(categoryId, 10) : undefined,
        sub_category_id: subcategoryId ? parseInt(subcategoryId, 10) : undefined,
        child_category_id: childcategoryId ? parseInt(childcategoryId, 10) : undefined,
      }));
      setPage(1); // Reset to first page on filter changes
    }
  }, [categoryId, subcategoryId, childcategoryId]);
  
  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      category_id: categoryId ? parseInt(categoryId, 10) : undefined,
      sub_category_id: subcategoryId ? parseInt(subcategoryId, 10) : newFilters.sub_category_id,
      child_category_id: childcategoryId ? parseInt(childcategoryId, 10) : newFilters.child_category_id,
    }));
    setPage(1); // Reset to first page when filters change
  };
  
  // Get the listings from the response, ensure it's an array even if undefined
  const listings = listingsResponse?.data || [];
  const totalPages = listingsResponse?.last_page || 1;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CategoryBar />
      
      <main className="flex-1 py-8">
        <div className="container px-4 mx-auto">
          {/* Category header */}
          <div className="mb-8 text-center">
            {loadingCategory ? (
              <Loader2 className="h-6 w-6 animate-spin mx-auto" />
            ) : (
              <>
                <h1 className="text-3xl font-bold">
                  {category ? category.name : 'جميع التصنيفات'}
                </h1>
                {category && (
                  <p className="text-muted-foreground mt-2">
                    تصفح أحدث الإعلانات في تصنيف {category.name}
                  </p>
                )}
              </>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar with filters */}
            <div className="col-span-1 hidden md:block">
              <AdFilters 
                layout="sidebar" 
                onLayoutChange={setAdLayout} 
                currentLayout={adLayout}
                onFilterChange={handleFilterChange}
                selectedCategory={category}
              />
            </div>
            
            {/* Main content */}
            <div className="col-span-1 md:col-span-3">
              {/* Mobile filters */}
              <AdFilters 
                layout="horizontal" 
                onLayoutChange={setAdLayout} 
                currentLayout={adLayout} 
                className="md:hidden mb-6"
                onFilterChange={handleFilterChange}
                selectedCategory={category}
              />
              
              {/* Compact view toggle buttons and per page select */}
              <div className="flex flex-col sm:flex-row justify-between mb-4 gap-3">
                <p className="text-muted-foreground">
                  {Array.isArray(listings) && listings.length > 0 ? `${listings.length} نتيجة` : '0 نتيجة'} 
                </p>
                
                <div className="flex items-center gap-3">
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => {
                      setItemsPerPage(parseInt(value, 10));
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="w-16 h-8">
                      <SelectValue placeholder="12" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">12</SelectItem>
                      <SelectItem value="24">24</SelectItem>
                      <SelectItem value="36">36</SelectItem>
                      <SelectItem value="48">48</SelectItem>
                    </SelectContent>
                  </Select>
                  
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
                </div>
              </div>
              
              {/* Loading state */}
              {isLoading && (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-brand" />
                </div>
              )}
              
              {/* Error state */}
              {error && !isLoading && (
                <div className="text-center py-12 bg-gray-50 dark:bg-dark-surface">
                  <p className="text-red-500 mb-4">حدث خطأ أثناء تحميل الإعلانات</p>
                  <Button onClick={() => window.location.reload()}>إعادة المحاولة</Button>
                </div>
              )}
              
              {/* Content when data is loaded */}
              {!isLoading && !error && (
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
                  <Pagination 
                    currentPage={page} 
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
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
