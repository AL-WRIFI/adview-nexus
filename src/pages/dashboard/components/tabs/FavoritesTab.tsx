
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, Eye, MessageSquare, MapPin, Clock } from 'lucide-react';
import { useFavorites } from '@/hooks/use-api';
import { Favorite } from '@/types';

export function FavoritesTab() {
  const { data: favorites, isLoading } = useFavorites();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const favoritesArray = Array.isArray(favorites) ? favorites : (favorites?.data || []);

  if (!favoritesArray || favoritesArray.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">المفضلة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-card-foreground">لا توجد إعلانات مفضلة</h3>
            <p className="text-muted-foreground">لم تقم بإضافة أي إعلان للمفضلة بعد</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">المفضلة ({favoritesArray.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {favoritesArray.map((favorite: Favorite) => (
              <Card key={favorite.id} className="p-4 bg-card border-border hover:bg-accent/50 transition-colors">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    {favorite.listing.main_image_url ? (
                      <img 
                        src={favorite.listing.main_image_url} 
                        alt={favorite.listing.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground text-xs">لا توجد صورة</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2 flex-1">
                    <div className="flex items-start justify-between">
                      <h4 className="font-semibold text-card-foreground">{favorite.listing.title}</h4>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                        <Heart className="h-4 w-4 fill-current" />
                      </Button>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {favorite.listing.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{favorite.listing.views_count || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        <span>{favorite.listing.favorites_count || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>0</span>
                      </div>
                      {favorite.listing.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{favorite.listing.location}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-brand">
                        {favorite.listing.price} ريال
                      </span>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>
                          {new Date(favorite.created_at).toLocaleDateString('ar-SA')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
