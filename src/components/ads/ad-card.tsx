
import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, MapPin, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Listing, Ad } from '@/types';

interface AdCardProps {
  ad: Listing | Ad;
  showUser?: boolean;
  featured?: boolean;
  horizontal?: boolean;
  compact?: boolean;
}

export const AdCard = ({ ad, showUser = true, featured = false, horizontal = false, compact = false }: AdCardProps) => {
  // Get the image URL with fallbacks
  const getImage = () => {
    if ('image' in ad && ad.image) {
      return ad.image;
    } else if ('images' in ad && ad.images && ad.images.length > 0) {
      return ad.images[0];
    }
    return '/placeholder.svg';
  };

  // Get the city name with fallbacks
  const getCityName = () => {
    if ('city_name' in ad && ad.city_name) {
      return ad.city_name;
    } else if ('city' in ad && ad.city) {
      return ad.city;
    }
    return '';
  };

  // Get view count with fallbacks
  const getViewCount = () => {
    if ('views_count' in ad && ad.views_count) {
      return ad.views_count;
    } else if ('viewCount' in ad && ad.viewCount) {
      return ad.viewCount;
    }
    return 0;
  };

  // Get the correct seller/user information
  const getSeller = () => {
    if ('seller' in ad && ad.seller) {
      return {
        id: ad.seller.id,
        name: ad.seller.name,
        avatar: ad.seller.avatar,
        verified: ad.seller.verified,
      };
    } else if ('user' in ad && ad.user) {
      return {
        id: ad.user.id,
        name: `${ad.user.first_name} ${ad.user.last_name}`,
        avatar: ad.user.avatar || ad.user.image,
        verified: ad.user.is_verified || ad.user.verified,
      };
    }
    return null;
  };

  // Format the date
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: ar,
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'غير محدد';
    }
  };

  const seller = getSeller();

  // Horizontal card layout for wider screens
  if (horizontal) {
    return (
      <Card className="overflow-hidden transition-all hover:shadow-md dark:bg-gray-800 dark:border-gray-700">
        <div className="flex flex-row">
          <div className="relative w-1/3">
            <Link to={`/ads/${ad.id}`}>
              <img
                src={getImage()}
                alt={ad.title}
                className="object-cover w-full h-full aspect-square"
              />
            </Link>
            {featured && (
              <Badge variant="secondary" className="absolute top-2 right-2">
                مميز
              </Badge>
            )}
          </div>
          <div className="flex flex-col justify-between p-4 w-2/3">
            <div>
              <Link to={`/ads/${ad.id}`}>
                <h3 className="font-bold text-lg line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400">
                  {ad.title}
                </h3>
              </Link>
              <div className="mt-2 text-2xl font-bold text-green-600 dark:text-green-400">
                {ad.price > 0 ? `${ad.price} ريال` : 'اتصل لمعرفة السعر'}
              </div>
              
              <div className="flex items-center mt-2 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3 ml-1" />
                <span>{getCityName()}</span>
              </div>
            </div>
            
            {showUser && seller && (
              <div className="flex justify-between items-center mt-3">
                <Link to={`/user/${seller.id}`} className="flex items-center">
                  <Avatar className="h-6 w-6 ml-2">
                    <AvatarImage src={seller.avatar || ''} alt={seller.name} />
                    <AvatarFallback>{seller.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{seller.name}</span>
                  {seller.verified && (
                    <Badge variant="outline" className="mr-1 px-1 py-0 h-5 border-blue-500 text-blue-500">
                      <span>✓</span>
                    </Badge>
                  )}
                </Link>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Eye className="h-3 w-3 ml-1" />
                  <span>{getViewCount()}</span>
                  <Clock className="h-3 w-3 mr-2 ml-1" />
                  <span>{formatDate(ad.created_at)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  }

  // Compact card layout for smaller spaces
  if (compact) {
    return (
      <Card className="overflow-hidden transition-all hover:shadow-md dark:bg-gray-800 dark:border-gray-700">
        <div className="relative h-32">
          <Link to={`/ads/${ad.id}`}>
            <img
              src={getImage()}
              alt={ad.title}
              className="object-cover w-full h-full"
            />
          </Link>
          {featured && (
            <Badge variant="secondary" className="absolute top-2 right-2">
              مميز
            </Badge>
          )}
        </div>
        <CardContent className="p-3">
          <Link to={`/ads/${ad.id}`}>
            <h3 className="font-semibold text-sm line-clamp-1 hover:text-blue-600 dark:hover:text-blue-400">
              {ad.title}
            </h3>
          </Link>
          <div className="mt-1 text-sm font-bold text-green-600 dark:text-green-400">
            {ad.price > 0 ? `${ad.price} ريال` : 'اتصل لمعرفة السعر'}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default card layout for grid views
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md dark:bg-gray-800 dark:border-gray-700">
      <div className="relative">
        <Link to={`/ads/${ad.id}`}>
          <img
            src={getImage()}
            alt={ad.title}
            className="object-cover w-full h-48"
          />
        </Link>
        {featured && (
          <Badge variant="secondary" className="absolute top-2 right-2">
            مميز
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <Link to={`/ads/${ad.id}`}>
          <h3 className="font-semibold line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400">
            {ad.title}
          </h3>
        </Link>
        <div className="mt-2 text-xl font-bold text-green-600 dark:text-green-400">
          {ad.price > 0 ? `${ad.price} ريال` : 'اتصل لمعرفة السعر'}
        </div>
        
        <div className="flex items-center mt-2 text-sm text-muted-foreground">
          <MapPin className="h-3 w-3 ml-1" />
          <span>{getCityName()}</span>
        </div>
      </CardContent>
      
      {showUser && seller && (
        <CardFooter className="p-4 pt-0 border-t flex justify-between items-center dark:border-gray-700">
          <Link to={`/user/${seller.id}`} className="flex items-center">
            <Avatar className="h-6 w-6 ml-2">
              <AvatarImage src={seller.avatar || ''} alt={seller.name} />
              <AvatarFallback>{seller.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-sm">{seller.name}</span>
          </Link>
          <div className="flex items-center text-xs text-muted-foreground">
            <Eye className="h-3 w-3 ml-1" />
            <span>{getViewCount()}</span>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};
