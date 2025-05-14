
import React from 'react';
import { WithSkeleton, CardSkeleton } from '@/components/ui/loading-skeleton';
import { useFavorites } from '@/hooks/use-api';
import { AdCard } from '@/components/ads/ad-card';
import { Button } from '@/components/ui/button';

export default function FavoritesTab() {
  const { data: favorites, isLoading, error } = useFavorites();

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 mb-4">حدث خطأ أثناء تحميل المفضلة</p>
        <Button onClick={() => window.location.reload()}>إعادة المحاولة</Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">المفضلة</h2>
      
      <WithSkeleton
        isLoading={isLoading}
        data={favorites?.data}
        SkeletonComponent={CardSkeleton}
        skeletonCount={4}
      >
        {(data) => (
          data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.map((item) => (
                <AdCard key={item.id} ad={item.listing || item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 dark:bg-dark-surface rounded-lg">
              <p className="text-muted-foreground mb-4">لا توجد إعلانات في المفضلة</p>
              <Button asChild>
                <a href="/">تصفح الإعلانات</a>
              </Button>
            </div>
          )
        )}
      </WithSkeleton>
    </div>
  );
}
