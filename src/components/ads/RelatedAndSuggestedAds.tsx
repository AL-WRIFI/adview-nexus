
import React from 'react';
import { AdCard } from './ad-card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Listing } from '@/types';
import { useRelatedAds, useAds } from '@/hooks/use-api';

interface RelatedAndSuggestedAdsProps {
  categoryId?: number;
  excludeId?: number;
  currentAd?: Listing;
}

interface HorizontalAdsSectionProps {
  title: string;
  ads: Listing[];
  sectionId: string;
}

function HorizontalAdsSection({ title, ads, sectionId }: HorizontalAdsSectionProps) {
  const scrollContainer = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainer.current) {
      const scrollAmount = 320; // Width of one card plus gap
      const currentScroll = scrollContainer.current.scrollLeft;
      const targetScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      scrollContainer.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  if (ads.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl lg:text-2xl font-bold text-foreground">{title}</h2>
        <div className="hidden md:flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('left')}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('right')}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Desktop Horizontal Scroll */}
      <div className="hidden md:block relative">
        <div
          ref={scrollContainer}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{ 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {ads.map((ad) => (
            <div key={ad.id} className="flex-shrink-0 w-80">
              <AdCard ad={ad} layout="grid" />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Grid */}
      <div className="md:hidden">
        <div className="grid grid-cols-3 gap-3">
          {ads.slice(0, 6).map((ad) => (
            <div key={ad.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-border overflow-hidden">
              <div className="aspect-square overflow-hidden">
                <img
                  src={
                    typeof ad.main_image_url === 'string' 
                      ? ad.main_image_url 
                      : (ad.main_image_url && typeof ad.main_image_url === 'object' && 'image_url' in ad.main_image_url 
                          ? ad.main_image_url.image_url 
                          : ad.image || 'https://placehold.co/200x200'
                        )
                  }
                  alt={ad.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-2">
                <h3 className="font-semibold text-xs line-clamp-2 mb-1 text-foreground">
                  {ad.title}
                </h3>
                <p className="text-brand font-bold text-xs">
                  {ad.price.toLocaleString()} ريال
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {ad.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function RelatedAndSuggestedAds({ 
  categoryId, 
  excludeId, 
  currentAd 
}: RelatedAndSuggestedAdsProps) {
  const { data: relatedAds } = useRelatedAds(categoryId, excludeId);
  const { data: suggestedAdsResponse } = useAds({ 
    category_id: categoryId, 
    per_page: 12,
    sort_by: 'newest'
  });

  // Extract suggested ads from response
  const suggestedAds = React.useMemo(() => {
    if (!suggestedAdsResponse) return [];
    
    if (Array.isArray(suggestedAdsResponse)) {
      return suggestedAdsResponse;
    }
    
    if (suggestedAdsResponse && typeof suggestedAdsResponse === 'object') {
      if ('data' in suggestedAdsResponse && Array.isArray(suggestedAdsResponse.data)) {
        return suggestedAdsResponse.data;
      }
    }
    
    return [];
  }, [suggestedAdsResponse]);

  // Filter out current ad from suggested ads
  const filteredSuggestedAds = suggestedAds.filter(ad => ad.id !== excludeId);
  const filteredRelatedAds = relatedAds?.filter(ad => ad.id !== excludeId) || [];

  return (
    <div className="space-y-8">
      {/* Related Ads */}
      {filteredRelatedAds.length > 0 && (
        <HorizontalAdsSection
          title="إعلانات مشابهة"
          ads={filteredRelatedAds}
          sectionId="related-ads"
        />
      )}
      
      {/* Suggested Ads */}
      {filteredSuggestedAds.length > 0 && (
        <HorizontalAdsSection
          title="إعلانات مقترحة"
          ads={filteredSuggestedAds}
          sectionId="suggested-ads"
        />
      )}
    </div>
  );
}
