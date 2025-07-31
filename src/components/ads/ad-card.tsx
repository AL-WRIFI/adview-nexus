import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge, Button } from '@/components/ui/button';
import { MapPin, Clock, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Listing } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/components/ui/use-toast';

interface AdCardProps {
  ad: Listing;
  layout?: 'grid' | 'list';
}

export function AdCard({ ad, layout = 'grid' }: AdCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  
  // Image handling with null safety
  const getFirstImage = () => {
    if (ad.main_image_url) return ad.main_image_url;
    if (ad.image) {
      if (typeof ad.image === 'string') return ad.image;
      if (typeof ad.image === 'object' && ad.image?.image_url) return ad.image.image_url;
    }
    if (ad.gallery_images && Array.isArray(ad.gallery_images) && ad.gallery_images.length > 0) {
      const firstImg = ad.gallery_images[0];
      return typeof firstImg === 'string' ? firstImg : firstImg?.url;
    }
    return null;
  };
  
  const firstImage = getFirstImage();
  const defaultImage = 'https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=300&fit=crop';

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      addToast({
        title: 'تسجيل الدخول مطلوب',
        description: 'يرجى تسجيل الدخول لحفظ الإعلان في المفضلة.',
      });
      return;
    }
    // Placeholder for favorite logic
    addToast({
      title: 'تمت الإضافة إلى المفضلة',
      description: 'يمكنك عرض قائمتك في صفحة المفضلة.',
    });
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Placeholder for share logic
    addToast({
      title: 'تم نسخ رابط الإعلان',
      description: 'يمكنك الآن مشاركة الرابط مع أصدقائك.',
    });
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('ar-SA', {
      style: 'currency',
      currency: 'SAR',
    });
  };

  if (layout === 'list') {
    return (
      <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex gap-4 p-4" onClick={() => navigate(`/ad/${ad.id}`)}>
          <div className="w-32 h-24 flex-shrink-0">
            <img
              src={firstImage || defaultImage}
              alt={ad.title}
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=300&fit=crop';
              }}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-sm line-clamp-2 text-foreground">
                {ad.title}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => handleFavorite(e)}
                className="flex-shrink-0 ml-2"
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
              {ad.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="text-brand font-bold text-lg">
                {formatPrice(ad.price)}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 ml-1" />
                <span>{ad.city_name || ad.city || ad.location || 'غير محدد'}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
      <div onClick={() => navigate(`/ad/${ad.id}`)}>
        <div className="aspect-video relative">
          <img
            src={firstImage || defaultImage}
            alt={ad.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=300&fit=crop';
            }}
          />
          {ad.featured && (
            <Badge className="absolute top-2 right-2 bg-brand text-white">
              مميز
            </Badge>
          )}
        </div>
        
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-sm line-clamp-2 text-foreground flex-1">
              {ad.title}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => handleFavorite(e)}
              className="flex-shrink-0 ml-2"
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="text-brand font-bold text-lg mb-2">
            {formatPrice(ad.price)}
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center">
              <MapPin className="h-3 w-3 ml-1" />
              <span>{ad.city_name || ad.city || ad.location || 'غير محدد'}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-3 w-3 ml-1" />
              <span>{formatDistanceToNow(new Date(ad.created_at || ''))}</span>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
