
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdCard } from './ad-card';
import { Listing } from '@/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface SuggestedAdsSectionProps {
  ads: Listing[];
  title?: string;
}

export function SuggestedAdsSection({ 
  ads, 
  title = "إعلانات مقترحة"
}: SuggestedAdsSectionProps) {
  if (!ads || ads.length === 0) return null;
  
  return (
    <div className="mt-12 border-t border-neutral-200 dark:border-neutral-700 pt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">{title}</h2>
        <Button variant="ghost" className="text-brand hover:text-brand hover:bg-brand/10" asChild>
          <Link to="/search">
            عرض المزيد
            <ChevronLeft className="mr-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
      
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {ads.map((ad) => (
            <CarouselItem key={ad.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
              <AdCard ad={ad} layout="grid" className="h-full" />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-end gap-2 mt-4">
          <CarouselPrevious className="relative inset-auto transform-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700" />
          <CarouselNext className="relative inset-auto transform-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700" />
        </div>
      </Carousel>
    </div>
  );
}
