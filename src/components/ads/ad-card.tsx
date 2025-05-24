
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Calendar, Eye, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAddToFavorites, useRemoveFromFavorites, useIsFavorite } from '@/hooks/use-api';
import { Listing } from '@/types';
import { cn } from '@/lib/utils';

interface AdCardProps {
  ad: Listing;
  layout?: 'grid' | 'list';
  showDistance?: boolean;
  userLocation?: { lat: number; lng: number };
}

// Helper function to calculate distance between two coordinates
const calculateDistance = (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export function AdCard({ ad, layout = 'list', showDistance = true, userLocation }: AdCardProps) {
  const [imageError, setImageError] = useState(false);
  const { data: isFavorite, isLoading: isFavoriteLoading } = useIsFavorite(ad.id);
  const addToFavoritesMutation = useAddToFavorites();
  const removeFromFavoritesMutation = useRemoveFromFavorites();

  // Handle image safely
  const getImageUrl = () => {
    if (ad.image && typeof ad.image === 'object' && 'url' in ad.image) {
      return ad.image.url;
    }
    if (ad.images && Array.isArray(ad.images) && ad.images.length > 0) {
      const firstImage = ad.images[0];
      if (typeof firstImage === 'object' && 'url' in firstImage) {
        return firstImage.url;
      }
    }
    return '/placeholder.svg';
  };

  const imageUrl = getImageUrl();

  // Calculate distance if user location is available
  const distance = showDistance && userLocation && ad.latitude && ad.longitude
    ? calculateDistance(userLocation.lat, userLocation.lng, ad.latitude, ad.longitude)
    : null;

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      if (isFavorite) {
        await removeFromFavoritesMutation.mutateAsync(ad.id);
      } else {
        await addToFavoritesMutation.mutateAsync(ad.id);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SY', {
      style: 'currency',
      currency: 'SYP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (layout === 'grid') {
    return (
      <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden h-full">
        <Link to={`/ad/${ad.id}`} className="block">
          <div className="relative">
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={imageError ? '/placeholder.svg' : imageUrl}
                alt={ad.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => setImageError(true)}
              />
            </div>
            
            {/* Favorite Button */}
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 left-2 h-8 w-8 bg-white/80 hover:bg-white shadow-sm"
              onClick={handleFavoriteToggle}
              disabled={isFavoriteLoading}
            >
              <Heart 
                className={cn(
                  "h-4 w-4 transition-colors",
                  isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
                )}
              />
            </Button>

            {/* Featured Badge */}
            {ad.featured && (
              <Badge className="absolute top-2 right-2 bg-yellow-500">
                مميز
              </Badge>
            )}
          </div>

          <CardContent className="p-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-sm line-clamp-2 min-h-[2.5rem]">
                {ad.title}
              </h3>
              
              <p className="text-xs text-muted-foreground line-clamp-2">
                {ad.description}
              </p>

              <div className="flex items-center justify-between pt-2">
                <span className="font-bold text-primary text-sm">
                  {formatPrice(ad.price)}
                </span>
                
                {distance && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3 ml-1" />
                    <span>{distance.toFixed(1)} كم</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                <span>{ad.city?.name || 'غير محدد'}</span>
                <div className="flex items-center gap-2">
                  {ad.views && (
                    <div className="flex items-center">
                      <Eye className="h-3 w-3 ml-1" />
                      <span>{ad.views}</span>
                    </div>
                  )}
                  <Calendar className="h-3 w-3 ml-1" />
                  <span>{new Date(ad.created_at).toLocaleDateString('ar-SY')}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Link>
      </Card>
    );
  }

  // List layout
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <Link to={`/ad/${ad.id}`} className="block">
        <div className="flex gap-4 p-4">
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden">
              <img
                src={imageError ? '/placeholder.svg' : imageUrl}
                alt={ad.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => setImageError(true)}
              />
            </div>
            
            {/* Favorite Button */}
            <Button
              size="icon"
              variant="ghost"
              className="absolute -top-2 -left-2 h-7 w-7 bg-white/90 hover:bg-white shadow-sm"
              onClick={handleFavoriteToggle}
              disabled={isFavoriteLoading}
            >
              <Heart 
                className={cn(
                  "h-3 w-3 transition-colors",
                  isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
                )}
              />
            </Button>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-sm md:text-base line-clamp-2 pl-2">
                {ad.title}
              </h3>
              
              {ad.featured && (
                <Badge className="bg-yellow-500 flex-shrink-0">
                  مميز
                </Badge>
              )}
            </div>
            
            <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 mb-3">
              {ad.description}
            </p>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <span className="font-bold text-primary text-lg">
                {formatPrice(ad.price)}
              </span>
              
              <div className="flex flex-col md:flex-row md:items-center gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 ml-1" />
                    <span>{ad.city?.name || 'غير محدد'}</span>
                  </div>
                  
                  {distance && (
                    <div className="flex items-center">
                      <span>• {distance.toFixed(1)} كم</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  {ad.views && (
                    <div className="flex items-center">
                      <Eye className="h-3 w-3 ml-1" />
                      <span>{ad.views}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 ml-1" />
                    <span>{new Date(ad.created_at).toLocaleDateString('ar-SY')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}
