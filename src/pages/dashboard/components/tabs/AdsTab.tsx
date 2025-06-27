
import React, { useState } from 'react';
import { AdCard } from '@/components/ads/ad-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Search,
  Plus,
} from 'lucide-react';
import { useListings } from '@/hooks/use-api';
import { Listing } from '@/types';

export function AdsTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const {
    data: adsData,
    isLoading,
    error,
    refetch
  } = useListings({
    page,
    per_page: itemsPerPage,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search logic here
  };

  const handleCreateAd = () => {
    // Implement create ad logic here
  };

  const getImageUrl = (ad: Listing) => {
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
      if (typeof firstImage === 'string') return firstImage;
      if (typeof firstImage === 'object' && 'url' in firstImage) {
        return (firstImage as any).url;
      }
    }
    return null;
  };

  if (isLoading) {
    return <div>Loading ads...</div>;
  }

  if (error) {
    return <div>Error loading ads. Please try again.</div>;
  }

  // Handle different response formats - ensure we get an array
  const ads = Array.isArray(adsData) ? adsData : (adsData?.data || []);
  const totalCount = Array.isArray(adsData) ? adsData.length : (adsData?.total || 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Label htmlFor="search">بحث:</Label>
          <div className="relative">
            <Search className="absolute top-1/2 left-3 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              type="search"
              placeholder="ابحث عن إعلان..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button onClick={handleSearch}>بحث</Button>
        </div>
        <Button onClick={handleCreateAd}>
          <Plus className="ml-2 h-4 w-4" />
          إضافة إعلان
        </Button>
      </div>
      
      {!Array.isArray(ads) || ads.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg font-medium">لا يوجد لديك إعلانات.</p>
          <p className="text-muted-foreground">ابدأ في إضافة إعلانات الآن!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {ads.map((ad) => (
            <Card key={ad.id} className="p-4">
              <div className="flex items-center space-x-4">
                <div className="w-24 h-24 relative overflow-hidden rounded-md">
                  {getImageUrl(ad) ? (
                    <img
                      src={getImageUrl(ad)}
                      alt={ad.title}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="bg-muted w-full h-full flex items-center justify-center">
                      No Image
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{ad.title}</h3>
                  <p className="text-sm text-muted-foreground">{ad.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          إجمالي الإعلانات: {totalCount}
        </p>
        <div className="flex items-center space-x-2">
          <Label htmlFor="itemsPerPage">إعلانات لكل صفحة:</Label>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => setItemsPerPage(parseInt(value))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select items" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="30">30</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              variant="outline"
              size="sm"
            >
              السابق
            </Button>
            <Button
              onClick={() => setPage(page + 1)}
              disabled={Array.isArray(ads) && ads.length < itemsPerPage}
              variant="outline"
              size="sm"
            >
              التالي
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
