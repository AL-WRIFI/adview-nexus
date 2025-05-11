
import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { AdCard } from '@/components/ads/ad-card';
import { Heart, Loader2, Grid2X2, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useFavorites, useRemoveFromFavorites } from '@/hooks/use-api';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Pagination } from '@/components/custom/pagination';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

export default function FavoritesPage() {
  const [adLayout, setAdLayout] = useState<'grid' | 'list'>('list');
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Fetch favorites using the API
  const { data: favorites, isLoading, error } = useFavorites();
  const removeFavorite = useRemoveFromFavorites();
  
  const handleFavoriteToggle = (adId: string | number) => {
    // Ensure adId is a number for API calls
    const numericId = typeof adId === 'string' ? parseInt(adId, 10) : adId;
    removeFavorite.mutate(numericId);
  };

  // Calculate pagination for client-side
  const totalItems = favorites?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = favorites?.slice(startIndex, endIndex) || [];
  
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 pb-20 md:pb-0">
          <div className="bg-gray-50 border-b border-border">
            <div className="container px-4 mx-auto py-6">
              <h1 className="text-2xl font-bold">المفضلة</h1>
              <p className="text-muted-foreground">الإعلانات التي أضفتها للمفضلة</p>
            </div>
          </div>
          
          <div className="container px-4 mx-auto py-6">
            {/* View toggle and items per page */}
            <div className="flex flex-col sm:flex-row justify-end mb-4 gap-3 items-center">
              <div className="flex items-center">
                <span className="text-sm text-muted-foreground ml-2">عناصر في الصفحة:</span>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(parseInt(value, 10));
                    setPage(1);
                  }}
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
            
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-brand" />
              </div>
            ) : error ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-red-500 mb-4">حدث خطأ أثناء تحميل المفضلة</p>
                <Button onClick={() => window.location.reload()}>إعادة المحاولة</Button>
              </div>
            ) : favorites && favorites.length > 0 ? (
              <>
                <div className={`grid gap-4 ${
                  adLayout === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {currentItems.map((ad) => (
                    <AdCard 
                      key={ad.id} 
                      ad={ad} 
                      layout={adLayout} 
                      onFavoriteToggle={handleFavoriteToggle}
                      isFavorite={true}
                    />
                  ))}
                </div>
                
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                  className="mt-6"
                />
              </>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">لا توجد إعلانات في المفضلة</h3>
                <p className="text-muted-foreground mb-4">
                  أضف إعلانات إلى المفضلة لتتمكن من الوصول إليها بسهولة لاحقاً
                </p>
                <Button asChild>
                  <Link to="/">تصفح الإعلانات</Link>
                </Button>
              </div>
            )}
          </div>
        </main>
        
        <Footer />
        <MobileNav />
      </div>
    </ProtectedRoute>
  );
}
