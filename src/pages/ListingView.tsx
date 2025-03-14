
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Listing } from '@/types/listing';
import { getMockListing } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner'; // Fixed import for toast
import { Share, Heart, ArrowLeft, User, Bookmark, Flag } from 'lucide-react';
import ImageGallery from '@/components/listing/ImageGallery';
import ListingInfo from '@/components/listing/ListingInfo';
import LocationMap from '@/components/listing/LocationMap';

const ListingView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  
  const { data: listing, isLoading, error } = useQuery({
    queryKey: ['listing', id],
    queryFn: () => getMockListing(Number(id)),
    enabled: !!id && !isNaN(Number(id)),
  });
  
  useEffect(() => {
    // Reset page position when viewing a new listing
    window.scrollTo(0, 0);
  }, [id]);
  
  const handleBackClick = () => {
    navigate(-1);
  };
  
  const handleShareClick = () => {
    if (navigator.share) {
      navigator.share({
        title: listing?.title,
        text: listing?.description?.substring(0, 100) + '...',
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };
  
  const handleFavoriteClick = () => {
    setIsFavorite(prev => !prev);
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };
  
  const handleReportClick = () => {
    toast.info('Reporting feature will be available soon');
  };
  
  const handleContactSellerClick = () => {
    // Implement contact seller logic
    toast.success('Message sent to seller');
  };
  
  // Parse gallery images
  const getGalleryImages = (listing?: Listing): string[] => {
    if (!listing?.gallery_images) return [];
    try {
      return JSON.parse(listing.gallery_images);
    } catch (error) {
      console.error('Error parsing gallery images:', error);
      return [];
    }
  };
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold mb-4">Listing Not Found</h1>
          <p className="text-muted-foreground mb-6">The listing you're looking for might have been removed or is temporarily unavailable.</p>
          <Button onClick={handleBackClick}>Go Back</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header with back button */}
      <div className="bg-card border-b sticky top-0 z-50 backdrop-blur-lg bg-opacity-80">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
              onClick={handleBackClick}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={handleShareClick}
                aria-label="Share"
              >
                <Share className="h-5 w-5" />
              </Button>
              
              <Button
                variant={isFavorite ? "default" : "ghost"}
                size="icon"
                className={`rounded-full ${isFavorite ? 'bg-red-500 hover:bg-red-600' : ''}`}
                onClick={handleFavoriteClick}
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-white text-white' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Images */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="w-full aspect-[4/3] rounded-xl" />
                <div className="flex space-x-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="w-20 h-20 rounded-md" />
                  ))}
                </div>
              </div>
            ) : (
              <ImageGallery
                mainImage={listing?.image || ''}
                galleryImages={getGalleryImages(listing)}
                videoUrl={listing?.video_url}
              />
            )}
          </div>
          
          {/* Right column - Info */}
          <div className="lg:col-span-1">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-24 w-full" />
                <Separator />
                <Skeleton className="h-6 w-1/3" />
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                  ))}
                </div>
              </div>
            ) : listing ? (
              <div className="space-y-6">
                <ListingInfo listing={listing} />
                
                <div className="space-y-3">
                  <Button className="w-full button-hover-effect" size="lg" onClick={handleContactSellerClick}>
                    Contact Seller
                  </Button>
                  
                  <div className="flex items-center gap-2 justify-center text-sm text-muted-foreground">
                    <button 
                      onClick={handleReportClick}
                      className="flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                      <Flag className="h-4 w-4" />
                      <span>Report Ad</span>
                    </button>
                    <span>•</span>
                    <a href="#" className="flex items-center gap-1 hover:text-foreground transition-colors">
                      <Bookmark className="h-4 w-4" />
                      <span>Save Ad</span>
                    </a>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
        
        {/* Location Map */}
        {!isLoading && listing && (
          <div className="mt-8">
            <LocationMap 
              lat={listing.lat} 
              lon={listing.lon} 
              address={listing.address} 
            />
          </div>
        )}
        
        {/* Similar Listings - Placeholder */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Similar Listings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-xl border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-[4/3] bg-muted relative">
                  <img 
                    src={`https://picsum.photos/seed/${i + 1000}/400/300`} 
                    alt="Similar listing" 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium line-clamp-1">Similar Product {i}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">Brief description here</p>
                  <p className="text-primary font-bold mt-2">${(Math.floor(Math.random() * 1000) + 100).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingView;
