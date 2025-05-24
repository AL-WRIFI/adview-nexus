
import { Link } from 'react-router-dom';
import { Clock, MapPin, Star, Eye, Image as ImageIcon, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Ad, Listing } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useState } from 'react';
import { useAddToFavorites, useRemoveFromFavorites } from '@/hooks/use-api';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';

interface AdCardProps {
  ad: Listing | Ad;
  layout?: 'grid' | 'list';
  className?: string;
  onFavoriteToggle?: (adId: string | number) => void;
  isFavorite?: boolean;
  distance?: number;
}

export function AdCard({ 
  ad, 
  layout = 'list', 
  className, 
  onFavoriteToggle, 
  isFavorite: externalIsFavorite,
  distance
}: AdCardProps) {
  const [localIsFavorite, setLocalIsFavorite] = useState(false);
  const { isAuthenticated } = useAuth();
  const addToFavorites = useAddToFavorites();
  const removeFromFavorites = useRemoveFromFavorites();
  
  const timeAgo = formatDistanceToNow(new Date(ad.created_at), { 
    addSuffix: true,
    locale: ar
  });

  const isFavorite = externalIsFavorite !== undefined ? externalIsFavorite : localIsFavorite;

  // Handle favorite toggle independently if no external handler is provided
  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast({
        title: "تسجيل الدخول مطلوب",
        description: "يجب عليك تسجيل الدخول لإضافة للمفضلة",
        variant: "destructive"
      });
      return;
    }

    if (onFavoriteToggle) {
      onFavoriteToggle(ad.id);
    } else {
      // Handle internally if no external handler
      setLocalIsFavorite(!localIsFavorite);
      if (localIsFavorite) {
        removeFromFavorites.mutate(ad.id);
      } else {
        addToFavorites.mutate(ad.id);
      }
    }
  };

  // Handle the new image format
  const getImageUrl = () => {
    // Check if we have image object with image_url
    if (ad.image && typeof ad.image === 'object' && ad.image.image_url) {
      return ad.image.image_url;
    }
    
    // For backwards compatibility, check if image is a string
    if (typeof ad.image === 'string' && ad.image) {
      return ad.image;
    }
    
    // If we have images array with url property
    if (ad.images && Array.isArray(ad.images) && ad.images.length > 0) {
      if (typeof ad.images[0] === 'object' && 'url' in ad.images[0] && ad.images[0].url) {
        return ad.images[0].url;
      } else if (typeof ad.images[0] === 'string') {
        return ad.images[0];
      }
    }
    
    return null;
  };

  const imageUrl = getImageUrl();
  const hasValidImage = !!imageUrl;

  // Grid view renders a vertical card
  if (layout === 'grid') {
    return (
      <Link
        to={`/ad/${ad.id}`}
        className={cn(
          "ad-card block border border-border hover:shadow-md transition-shadow bg-white relative h-80",
          ad.featured && "featured-ad border-t-2 border-t-brand",
          className
        )}
      >
        {/* Favorite button */}
        <button 
          className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center shadow-sm"
          onClick={handleFavoriteToggle}
        >
          <Heart 
            className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`}
          />
        </button>

        {/* Image section with fixed height */}
        <div className="relative w-full h-40">
          {hasValidImage ? (
            <img 
              src={imageUrl} 
              alt={ad.title} 
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  parent.classList.add('flex', 'items-center', 'justify-center', 'bg-muted');
                  const icon = document.createElement('div');
                  icon.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><rect x="2" y="2" width="20" height="20" rx="0" ry="0"></rect><circle cx="12" cy="9" r="3"></circle><path d="M12 12v3"></path><line x1="5" y1="19" x2="19" y2="19"></line></svg>';
                  parent.appendChild(icon);
                }
              }}
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center flex-col text-muted-foreground">
              <ImageIcon className="h-8 w-8" />
              <span className="text-xs mt-1">لا توجد صورة</span>
            </div>
          )}

          {ad.featured ? (
            <div className="absolute top-2 left-2 rtl:right-2 rtl:left-auto">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 drop-shadow-md" />
            </div>
          ) : null}
        </div>
        
        {/* Content section */}
        <div className="p-3 flex flex-col h-40">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-sm truncate max-w-[180px]" title={ad.title}>{ad.title}</h3>
            {ad.price > 0 && (
              <span className="font-bold text-brand whitespace-nowrap mr-2 text-sm">
                {ad.price.toLocaleString()} ريال
              </span>
            )}
          </div>
          
          <p className="text-muted-foreground text-xs line-clamp-2 mt-1">
            {ad.description}
          </p>
          
          <div className="mt-auto flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <div className="flex items-center">
              <MapPin className="h-3 w-3 ml-1" />
              <span className="truncate max-w-[80px]">{ad.city || ad.address || 'غير محدد'}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-3 w-3 ml-1" />
              <span>{timeAgo}</span>
            </div>
            <div className="flex items-center">
              <Eye className="h-3 w-3 ml-1" />
              <span>{ad.views_count || ad.viewCount || 0}</span>
            </div>
            
            {distance !== undefined && (
              <div className="flex items-center ml-auto text-xs bg-brand/10 text-brand px-2 py-0.5 rounded-full">
                <MapPin className="h-3 w-3 ml-1" />
                <span>{distance < 1 ? `${Math.round(distance * 1000)} متر` : `${distance.toFixed(1)} كم`}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  }

  // List view renders a horizontal card
  return (
    <Link 
      to={`/ad/${ad.id}`}
      className={cn(
        "ad-card flex border border-border hover:shadow-md transition-shadow bg-white relative",
        ad.featured && "featured-ad border-r-2 border-r-brand",
        className
      )}
    >
      {/* Favorite  */}
      <button 
        className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/80 flex items-center justify-center shadow-sm"
        onClick={handleFavoriteToggle}
      >
        <Heart 
          className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`}
        />
      </button>

      <div className="w-28 md:w-36 h-28 flex-shrink-0 relative">
        {hasValidImage ? (
          <img 
            src={imageUrl} 
            alt={ad.title} 
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent.classList.add('flex', 'items-center', 'justify-center', 'bg-muted');
                const icon = document.createElement('div');
                icon.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><rect x="2" y="2" width="20" height="20" rx="0" ry="0"></rect><circle cx="12" cy="9" r="3"></circle><path d="M12 12v3"></path><line x1="5" y1="19" x2="19" y2="19"></line></svg>';
                parent.appendChild(icon);
              }
            }}
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
            <ImageIcon className="h-6 w-6" />
          </div>
        )}
        {ad.featured && (
          <div className="absolute top-2 left-2 rtl:right-2 rtl:left-auto">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 drop-shadow-md" />
          </div>
        )}
      </div>
      
      {/* Content section */}
      <div className="p-3 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-base truncate max-w-[180px] md:max-w-xs" title={ad.title}>{ad.title}</h3>
            {ad.price > 0 && (
              <span className="font-bold text-brand whitespace-nowrap mr-2 text-sm">
                {ad.price.toLocaleString()} ريال
              </span>
            )}
          </div>
          
          <p className="text-muted-foreground text-xs line-clamp-2 mt-1">
            {ad.description}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs text-muted-foreground">
          <div className="flex items-center">
            <MapPin className="h-3 w-3 ml-1" />
            <span className="truncate max-w-[80px]">{ad.city || ad.address || 'غير محدد'}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-3 w-3 ml-1" />
            <span>{timeAgo}</span>
          </div>
          <div className="flex items-center">
            <Eye className="h-3 w-3 ml-1" />
            <span>{ad.views_count || ad.viewCount || 0}</span>
          </div>
          
          {distance !== undefined && (
            <div className="flex items-center ml-auto text-xs bg-brand/10 text-brand px-2 py-0.5 rounded-full">
              <MapPin className="h-3 w-3 ml-1" />
              <span>{distance < 1 ? `${Math.round(distance * 1000)} متر` : `${distance.toFixed(1)} كم`}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
