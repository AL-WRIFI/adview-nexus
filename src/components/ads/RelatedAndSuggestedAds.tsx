
import React from 'react';
import { RelatedAdsCarousel } from './related-ads-carousel';
import { SuggestedAdsSection } from './SuggestedAdsSection';
import { Listing } from '@/types';
import { useRelatedAds, useAds } from '@/hooks/use-api';

interface RelatedAndSuggestedAdsProps {
  categoryId?: number;
  excludeId?: number;
  currentAd?: Listing;
}

export function RelatedAndSuggestedAds({ 
  categoryId, 
  excludeId, 
  currentAd 
}: RelatedAndSuggestedAdsProps) {
  const { data: relatedAds } = useRelatedAds(categoryId, excludeId);
  const { data: suggestedAdsResponse } = useAds({ 
    category_id: categoryId, 
    per_page: 10,
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

  return (
    <div className="space-y-8">
      {/* Related Ads */}
      {relatedAds && relatedAds.length > 0 && (
        <RelatedAdsCarousel 
          ads={relatedAds} 
          categoryId={categoryId}
          title="إعلانات مشابهة"
        />
      )}
      
      {/* Suggested Ads */}
      {filteredSuggestedAds.length > 0 && (
        <SuggestedAdsSection 
          ads={filteredSuggestedAds}
          title="إعلانات مقترحة"
        />
      )}
    </div>
  );
}
