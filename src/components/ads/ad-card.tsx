
import { Link } from 'react-router-dom';
import { Clock, MapPin, Star, Eye, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Ad, Listing } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

interface AdCardProps {
  ad: Listing | Ad;
  layout?: 'grid' | 'list';
  className?: string;
  onFavoriteToggle?: (adId: string | number) => void;
  isFavorite?: boolean;
}

export function AdCard({ ad, layout = 'list', className, onFavoriteToggle, isFavorite }: AdCardProps) {
  const timeAgo = formatDistanceToNow(new Date(ad.created_at), { 
    addSuffix: true,
    locale: ar
  });

  const hasValidImage = ad.image || (ad.images && ad.images.length > 0);
  const imageUrl = hasValidImage ? (ad.image || (ad.images && ad.images[0])) : null;

  // Grid view renders a vertical card
  if (layout === 'grid') {
    return (
      <Link
        to={`/ad/${ad.id}`}
        className={cn(
          "ad-card block border border-border hover:shadow-md transition-shadow bg-white",
          ad.featured && "featured-ad border-t-2 border-t-brand",
          className
        )}
      >
        {/* Image section */}
        <div className="relative w-full h-40">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={ad.title} 
              className="w-full h-full object-cover"
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
          {ad.featured && (
            <div className="absolute top-2 left-2 rtl:right-2 rtl:left-auto">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 drop-shadow-md" />
            </div>
          )}
          {onFavoriteToggle && (
            <div 
              className="absolute top-2 right-2 rtl:left-2 rtl:right-auto cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onFavoriteToggle(ad.id);
              }}
            >
              <Star className={`h-5 w-5 ${isFavorite ? 'fill-brand text-brand' : 'text-muted-foreground'}`} />
            </div>
          )}
        </div>
        
        {/* Content section */}
        <div className="p-3">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-sm truncate max-w-[180px]" title={ad.title}>{ad.title}</h3>
            {ad.price > 0 && (
              <span className="font-bold text-brand whitespace-nowrap mr-2 text-sm">
                {ad.price.toLocaleString()} ريال
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs text-muted-foreground">
            <div className="flex items-center">
              <MapPin className="h-3 w-3 ml-1" />
              <span className="truncate max-w-[80px]">{ad.city}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-3 w-3 ml-1" />
              <span>{timeAgo}</span>
            </div>
            <div className="flex items-center">
              <Eye className="h-3 w-3 ml-1" />
              <span>{ad.views_count || ad.viewCount || 0}</span>
            </div>
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
        "ad-card flex border border-border hover:shadow-md transition-shadow bg-white",
        ad.featured && "featured-ad border-r-2 border-r-brand",
        className
      )}
    >
      {/* Image section */}
      <div className="w-28 md:w-36 h-28 flex-shrink-0 relative">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={ad.title} 
            className="w-full h-full object-cover"
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
        {onFavoriteToggle && (
          <div 
            className="absolute top-2 right-2 rtl:left-2 rtl:right-auto cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onFavoriteToggle(ad.id);
            }}
          >
            <Star className={`h-4 w-4 ${isFavorite ? 'fill-brand text-brand' : 'text-muted-foreground'}`} />
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
            <span className="truncate max-w-[80px]">{ad.city}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-3 w-3 ml-1" />
            <span>{timeAgo}</span>
          </div>
          <div className="flex items-center">
            <Eye className="h-3 w-3 ml-1" />
            <span>{ad.views_count || ad.viewCount || 0}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
