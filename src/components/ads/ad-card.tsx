
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, Clock, Eye, Star, Phone, MessageCircle } from 'lucide-react';
import { Listing } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';

interface AdCardProps {
  ad: Listing;
  layout?: 'grid' | 'list';
  showFavorite?: boolean;
  className?: string;
}

export function AdCard({ ad, layout = 'grid', showFavorite = true, className = '' }: AdCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "تسجيل الدخول مطلوب",
        description: "يجب تسجيل الدخول لإضافة الإعلانات للمفضلة",
        variant: "destructive",
      });
      return;
    }

    try {
      // Add to favorites logic here
      toast({
        title: "تمت الإضافة",
        description: "تم إضافة الإعلان إلى المفضلة",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إضافة الإعلان للمفضلة",
        variant: "destructive",
      });
    }
  };

  const getImageUrl = () => {
    if (ad.main_image_url) {
      return typeof ad.main_image_url === 'string' ? ad.main_image_url : ad.main_image_url;
    }
    if (ad.image) {
      if (typeof ad.image === 'string') return ad.image;
      if (typeof ad.image === 'object' && 'url' in ad.image) {
        return (ad.image as any).url;
      }
    }
    if (ad.images && ad.images.length > 0) {
      const firstImage = ad.images[0];
      if (!firstImage) return null;
      if (typeof firstImage === 'string') return firstImage;
      if (typeof firstImage === 'object' && 'url' in firstImage) {
        return (firstImage as any).url;
      }
    }
    return null;
  };

  const imageUrl = getImageUrl();

  if (layout === 'list') {
    return (
      <Link to={`/ad/${ad.id}`} className={`block ${className}`}>
        <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-dark-border p-4">
          <div className="flex gap-4">
            <div className="w-32 h-24 flex-shrink-0 bg-gray-100 dark:bg-dark-surface rounded-lg overflow-hidden">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={ad.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="text-xs">لا توجد صورة</span>
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {ad.title}
                </h3>
                {showFavorite && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleFavorite}
                    className="text-gray-500 hover:text-red-500 flex-shrink-0"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                {ad.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-brand">
                    {formatCurrency(ad.price)}
                  </span>
                  {ad.featured && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      مميز
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span>{ad.views_count || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(ad.created_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/ad/${ad.id}`} className={`block ${className}`}>
      <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-dark-border overflow-hidden">
        <div className="relative">
          <div className="aspect-video bg-gray-100 dark:bg-dark-surface">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={ad.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span className="text-sm">لا توجد صورة</span>
              </div>
            )}
          </div>
          
          {showFavorite && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFavorite}
              className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-700 hover:text-red-500"
            >
              <Heart className="h-4 w-4" />
            </Button>
          )}
          
          {ad.featured && (
            <Badge className="absolute top-2 left-2 bg-yellow-500 text-white">
              مميز
            </Badge>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
            {ad.title}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
            {ad.description}
          </p>
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-bold text-brand">
              {formatCurrency(ad.price)}
            </span>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Eye className="h-3 w-3" />
              <span>{ad.views_count || 0}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{ad.address || 'غير محدد'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{formatDate(ad.created_at)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
