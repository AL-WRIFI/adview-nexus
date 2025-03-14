
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageGalleryProps {
  mainImage: string;
  galleryImages?: string[];
  videoUrl?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ 
  mainImage, 
  galleryImages = [], 
  videoUrl 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([]);

  // Combine main image with gallery images
  const allImages = [mainImage, ...galleryImages];

  useEffect(() => {
    setImagesLoaded(new Array(allImages.length).fill(false));
  }, [allImages.length]);

  const handleImageLoad = (index: number) => {
    const newImagesLoaded = [...imagesLoaded];
    newImagesLoaded[index] = true;
    setImagesLoaded(newImagesLoaded);
    
    if (index === currentIndex) {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setLoading(true);
    setCurrentIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setLoading(true);
    setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleThumbnailClick = (index: number) => {
    if (index !== currentIndex) {
      setLoading(true);
      setCurrentIndex(index);
    }
  };

  useEffect(() => {
    if (imagesLoaded[currentIndex]) {
      setLoading(false);
    }
  }, [currentIndex, imagesLoaded]);

  return (
    <div className="w-full">
      {/* Main image container */}
      <div className="relative w-full aspect-[4/3] bg-secondary overflow-hidden rounded-xl mb-4">
        {allImages.map((image, index) => (
          <div 
            key={`main-${index}`}
            className={cn(
              "absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out",
              currentIndex === index ? "opacity-100 z-10" : "opacity-0 z-0"
            )}
          >
            <div className={cn(
              "absolute inset-0",
              loading && currentIndex === index ? "image-loading-effect" : ""
            )} />
            <img
              src={image || '/placeholder.svg'}
              alt={`Product image ${index + 1}`}
              className="w-full h-full object-cover"
              onLoad={() => handleImageLoad(index)}
              loading="lazy"
            />
          </div>
        ))}
        
        {/* Navigation arrows */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 backdrop-blur-sm text-gray-800 p-2 rounded-full shadow-md hover:bg-white transition-all duration-200"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 backdrop-blur-sm text-gray-800 p-2 rounded-full shadow-md hover:bg-white transition-all duration-200"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
        
        {/* Image counter */}
        <div className="absolute bottom-4 right-4 z-20 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
          {currentIndex + 1} / {allImages.length}
        </div>
      </div>
      
      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto py-2 scrollbar-thin">
          {allImages.map((image, index) => (
            <button
              key={`thumb-${index}`}
              onClick={() => handleThumbnailClick(index)}
              className={cn(
                "flex-shrink-0 w-20 h-20 rounded-md overflow-hidden transition-all duration-200",
                currentIndex === index 
                  ? "ring-2 ring-primary ring-offset-2" 
                  : "opacity-70 hover:opacity-100"
              )}
            >
              <img
                src={image || '/placeholder.svg'}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
          
          {videoUrl && (
            <button
              className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden bg-black flex items-center justify-center"
              aria-label="Play video"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="w-8 h-8 text-white" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
