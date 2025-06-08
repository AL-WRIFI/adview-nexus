
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heart, Eye, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useFavorites, useRemoveFromFavorites } from '@/hooks/use-api';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { Badge } from '@/components/ui/badge';

export function FavoritesTab() {
  const { data: favoritesData, isLoading } = useFavorites();
  const removeFromFavorites = useRemoveFromFavorites();

  const favorites = favoritesData?.data || [];

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const handleRemoveFromFavorites = (listingId: number) => {
    removeFromFavorites.mutate(listingId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>المفضلة</CardTitle>
        <CardDescription>الإعلانات المحفوظة في المفضلة</CardDescription>
      </CardHeader>
      <CardContent>
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {favorites.map((favorite) => (
              <Card key={favorite.id} className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                    {favorite.listing.image && (
                      <img 
                        src={typeof favorite.listing.image === 'string' ? 
                          favorite.listing.image : 
                          favorite.listing.image?.image_url || '/placeholder.svg'
                        } 
                        alt={favorite.listing.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{favorite.listing.title}</h3>
                        <p className="text-xl font-bold text-primary mt-1">
                          {favorite.listing.price} ريال
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          {favorite.listing.location || favorite.listing.city}
                        </p>
                        
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Eye className="h-4 w-4" />
                            <span>{favorite.listing.views_count || 0}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MessageSquare className="h-4 w-4" />
                            <span>{favorite.listing.comments_count || 0}</span>
                          </div>
                          {favorite.listing.featured && (
                            <Badge variant="secondary">مميز</Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveFromFavorites(favorite.listing.id)}
                          disabled={removeFromFavorites.isPending}
                        >
                          <Heart className="h-4 w-4 ml-1 fill-current" />
                          إزالة
                        </Button>
                        <Button asChild size="sm">
                          <Link to={`/ad/${favorite.listing.id}`}>
                            عرض
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <Heart className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">لا توجد إعلانات في المفضلة</h3>
            <p className="text-muted-foreground text-center mt-2 mb-4">
              اضغط على أيقونة القلب في أي إعلان لإضافته إلى المفضلة
            </p>
            <Button asChild>
              <Link to="/">تصفح الإعلانات</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
