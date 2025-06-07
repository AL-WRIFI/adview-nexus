
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AdFilters } from '@/components/filters/ad-filters';
import { AdCard } from '@/components/ads/ad-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Grid2X2, List, Filter, SortAsc, Eye, Heart, TrendingUp, MapPin } from 'lucide-react';
import { MobileNav } from '@/components/layout/mobile-nav';
import { useListings, useCategory, useSubCategories, useChildCategories, useBrandsByCategory } from '@/hooks/use-api';
import { SearchFilters, Listing } from '@/types';
import { useAuth } from '@/context/auth-context';
import { ModernCategoryBar } from '@/components/layout/category/ModernCategoryBar';
import { Pagination } from '@/components/custom/pagination';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { WithSkeleton, CardSkeleton } from '@/components/ui/loading-skeleton';
import { useToast } from '@/hooks/use-toast';

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
  const [sortBy, setSortBy] = useState<string>('newest');
  const [activeTab, setActiveTab] = useState('listings');
  const { isAuthenticated } = useAuth();
  
  // Fetch the category data
  const { data: category, isLoading: loadingCategory } = useCategory(
    categoryId ? parseInt(categoryId, 10) : undefined
  );
  
  // Fetch subcategories and child categories
  const { data: subCategories } = useSubCategories();
  const { data: childCategories } = useChildCategories();
  const { data: brands } = useBrandsByCategory(
    categoryId ? parseInt(categoryId, 10) : undefined
  );
  
  // Fetch listings with the category filter
  const { data: listingsResponse, isLoading, error } = useListings({
    ...filters,
    page,
    per_page: itemsPerPage,
    sort_by: sortBy,
  });
  
  useEffect(() => {
    // Update filters when URL params change
    const newFilters: SearchFilters = {
      category_id: categoryId ? parseInt(categoryId, 10) : undefined,
      sub_category_id: subcategoryId ? parseInt(subcategoryId, 10) : undefined,
      child_category_id: childcategoryId ? parseInt(childcategoryId, 10) : undefined,
    };
    
    setFilters(newFilters);
    setPage(1);
  }, [categoryId, subcategoryId, childcategoryId]);
  
  const handleFilterChange = (newFilters: SearchFilters) => {
    const updatedFilters = {
      ...newFilters,
      category_id: categoryId ? parseInt(categoryId, 10) : undefined,
      sub_category_id: subcategoryId ? parseInt(subcategoryId, 10) : newFilters.sub_category_id,
      child_category_id: childcategoryId ? parseInt(childcategoryId, 10) : newFilters.child_category_id,
    };
    
    setFilters(updatedFilters);
    setPage(1);
    
    // Update URL params
    const params = new URLSearchParams(searchParams);
    if (newFilters.sub_category_id) {
      params.set('subcategory', newFilters.sub_category_id.toString());
    } else {
      params.delete('subcategory');
    }
    if (newFilters.child_category_id) {
      params.set('childcategory', newFilters.child_category_id.toString());
    } else {
      params.delete('childcategory');
    }
    setSearchParams(params);
  };

  const handleSubcategoryClick = (subcategoryId: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('subcategory', subcategoryId.toString());
    params.delete('childcategory');
    setSearchParams(params);
  };

  const handleChildCategoryClick = (childCategoryId: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('childcategory', childCategoryId.toString());
    setSearchParams(params);
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    setPage(1);
  };
  
  // Get the listings from the response
  const listings = listingsResponse?.data || [];
  const totalPages = listingsResponse?.meta?.last_page || listingsResponse?.last_page || 1;
  const total = listingsResponse?.meta?.total || listingsResponse?.total || 0;
  
  // Filter subcategories and child categories for current category
  const categorySubcategories = subCategories?.filter(
    sub => sub.category_id === parseInt(categoryId || '0')
  ) || [];
  
  const currentSubcategoryChildren = childCategories?.filter(
    child => child.category_id === parseInt(subcategoryId || '0')
  ) || [];

  // Split listings by type
  const featuredListings = Array.isArray(listings) ? listings.filter((listing: Listing) => listing.featured) : [];
  const regularListings = Array.isArray(listings) ? listings.filter((listing: Listing) => !listing.featured) : [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <ModernCategoryBar />
      
      <main className="flex-1 py-6">
        <div className="container px-4 mx-auto">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">الرئيسية</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              {category && (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbPage>{category.name}</BreadcrumbPage>
                  </BreadcrumbItem>
                  {subcategoryId && (
                    <>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage>
                          {categorySubcategories.find(sub => sub.id === parseInt(subcategoryId))?.name}
                        </BreadcrumbPage>
                      </BreadcrumbItem>
                    </>
                  )}
                  {childcategoryId && (
                    <>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage>
                          {currentSubcategoryChildren.find(child => child.id === parseInt(childcategoryId))?.name}
                        </BreadcrumbPage>
                      </BreadcrumbItem>
                    </>
                  )}
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>

          {/* Category Header */}
          <Card className="mb-8">
            <CardHeader>
              {loadingCategory ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <div className="text-center">
                  <CardTitle className="text-3xl font-bold mb-2">
                    {category ? category.name : 'جميع التصنيفات'}
                  </CardTitle>
                  {category && (
                    <p className="text-muted-foreground">
                      تصفح أحدث الإعلانات في تصنيف {category.name}
                    </p>
                  )}
                  <div className="flex items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{total} إعلان</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      <span>{featuredListings.length} مميز</span>
                    </div>
                  </div>
                </div>
              )}
            </CardHeader>
          </Card>

          {/* Subcategories */}
          {categorySubcategories.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">التصنيفات الفرعية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {categorySubcategories.map((subcategory) => (
                    <Badge
                      key={subcategory.id}
                      variant={subcategoryId === subcategory.id.toString() ? "default" : "secondary"}
                      className="cursor-pointer hover:bg-primary/80"
                      onClick={() => handleSubcategoryClick(subcategory.id)}
                    >
                      {subcategory.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Child Categories */}
          {subcategoryId && currentSubcategoryChildren.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">التصنيفات الفرعية الثانوية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {currentSubcategoryChildren.map((childCategory) => (
                    <Badge
                      key={childCategory.id}
                      variant={childcategoryId === childCategory.id.toString() ? "default" : "secondary"}
                      className="cursor-pointer hover:bg-primary/80"
                      onClick={() => handleChildCategoryClick(childCategory.id)}
                    >
                      {childCategory.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar with filters - Hidden on mobile */}
            <div className="col-span-1 hidden lg:block">
              <AdFilters 
                layout="sidebar" 
                onLayoutChange={setAdLayout} 
                currentLayout={adLayout}
                onFilterChange={handleFilterChange}
                selectedCategory={category}
              />
            </div>
            
            {/* Main content */}
            <div className="col-span-1 lg:col-span-3">
              {/* Mobile filters and controls */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                {/* Mobile filter button */}
                <div className="lg:hidden">
                  <AdFilters 
                    layout="horizontal" 
                    onLayoutChange={setAdLayout} 
                    currentLayout={adLayout}
                    onFilterChange={handleFilterChange}
                    selectedCategory={category}
                  />
                </div>

                {/* Results info and controls */}
                <div className="flex items-center justify-between w-full lg:w-auto gap-4">
                  <div className="text-sm text-muted-foreground">
                    {!isLoading && Array.isArray(listings) 
                      ? `${listings.length} من ${total} إعلان` 
                      : '0 إعلان'
                    }
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* Sort */}
                    <Select value={sortBy} onValueChange={handleSortChange}>
                      <SelectTrigger className="w-32">
                        <SortAsc className="h-4 w-4 ml-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">الأحدث</SelectItem>
                        <SelectItem value="oldest">الأقدم</SelectItem>
                        <SelectItem value="price_asc">السعر: منخفض إلى عالي</SelectItem>
                        <SelectItem value="price_desc">السعر: عالي إلى منخفض</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Items per page */}
                    <Select
                      value={itemsPerPage.toString()}
                      onValueChange={(value) => {
                        setItemsPerPage(parseInt(value, 10));
                        setPage(1);
                      }}
                    >
                      <SelectTrigger className="w-16">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12">12</SelectItem>
                        <SelectItem value="24">24</SelectItem>
                        <SelectItem value="36">36</SelectItem>
                        <SelectItem value="48">48</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {/* Layout toggle */}
                    <div className="flex border rounded-lg overflow-hidden">
                      <Button 
                        variant={adLayout === 'grid' ? "default" : "ghost"} 
                        size="icon"
                        onClick={() => setAdLayout('grid')}
                        className="h-9 w-9 rounded-none"
                        title="عرض شبكي"
                      >
                        <Grid2X2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant={adLayout === 'list' ? "default" : "ghost"}
                        size="icon" 
                        onClick={() => setAdLayout('list')}
                        className="h-9 w-9 rounded-none"
                        title="عرض قائمة"
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="listings">الإعلانات ({total})</TabsTrigger>
                  <TabsTrigger value="featured">المميزة ({featuredListings.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="listings" className="mt-6">
                  {/* Loading state */}
                  {isLoading && (
                    <WithSkeleton
                      isLoading={isLoading}
                      data={[]}
                      SkeletonComponent={CardSkeleton}
                      skeletonCount={itemsPerPage}
                    >
                      {() => <div />}
                    </WithSkeleton>
                  )}
                  
                  {/* Error state */}
                  {error && !isLoading && (
                    <Card>
                      <CardContent className="text-center py-12">
                        <p className="text-destructive mb-4">حدث خطأ أثناء تحميل الإعلانات</p>
                        <Button onClick={() => window.location.reload()}>إعادة المحاولة</Button>
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Content when data is loaded */}
                  {!isLoading && !error && (
                    <>
                      {/* Featured listings section */}
                      {featuredListings.length > 0 && (
                        <div className="mb-8">
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-yellow-500" />
                            الإعلانات المميزة
                          </h3>
                          <div className={`grid gap-4 ${
                            adLayout === 'grid' 
                              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                              : 'grid-cols-1'
                          }`}>
                            {featuredListings.map((listing) => (
                              <AdCard 
                                key={listing.id} 
                                ad={listing} 
                                layout={adLayout}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Regular listings */}
                      {Array.isArray(listings) && listings.length > 0 ? (
                        <div className={`grid gap-4 ${
                          adLayout === 'grid' 
                            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                            : 'grid-cols-1'
                        }`}>
                          {regularListings.map((listing) => (
                            <AdCard 
                              key={listing.id} 
                              ad={listing} 
                              layout={adLayout}
                            />
                          ))}
                        </div>
                      ) : (
                        <Card>
                          <CardContent className="text-center py-12">
                            <MapPin className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-xl font-semibold mb-2">لا توجد إعلانات</h3>
                            <p className="text-muted-foreground mb-6">
                              لم يتم العثور على إعلانات في هذا التصنيف
                            </p>
                            <Button onClick={() => navigate('/')}>
                              العودة للرئيسية
                            </Button>
                          </CardContent>
                        </Card>
                      )}
                      
                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="mt-8">
                          <Pagination 
                            currentPage={page} 
                            totalPages={totalPages}
                            onPageChange={setPage}
                          />
                        </div>
                      )}
                    </>
                  )}
                </TabsContent>

                <TabsContent value="featured" className="mt-6">
                  {featuredListings.length > 0 ? (
                    <div className={`grid gap-4 ${
                      adLayout === 'grid' 
                        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                        : 'grid-cols-1'
                    }`}>
                      {featuredListings.map((listing) => (
                        <AdCard 
                          key={listing.id} 
                          ad={listing} 
                          layout={adLayout}
                        />
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="text-center py-12">
                        <TrendingUp className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold mb-2">لا توجد إعلانات مميزة</h3>
                        <p className="text-muted-foreground">
                          لا توجد إعلانات مميزة في هذا التصنيف حالياً
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <MobileNav />
    </div>
  );
}
