import React, { useState } from 'react';
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CalendarDateRangePicker } from "@/components/ui/calendar"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { DotsHorizontalIcon, Plus, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAds } from '@/hooks/use-api';
import { useAuth } from '@/context/auth-context';
import { Listing } from '@/types';

interface Filter {
  label: string;
  value: string;
}

export function AdsTab() {
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useAuth();
  
  const { data: adsResponse, isLoading, refetch } = useAds({
    page: currentPage,
    per_page: 10,
    user_id: user?.id?.toString() || '',
    ...filters
  });

  const ads = adsResponse?.data?.data || adsResponse?.data || [];
  const totalAds = adsResponse?.data?.total || 0;

  const handleFilterChange = (filterName: string, filterValue: string) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: filterValue
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Get image URL helper function
  const getImageUrl = (ad: Listing) => {
    if (ad.main_image_url) {
      return ad.main_image_url;
    }
    
    if (ad.images && Array.isArray(ad.images) && ad.images.length > 0) {
      const firstImage = ad.images[0];
      if (typeof firstImage === 'string') {
        return firstImage;
      } else if (typeof firstImage === 'object' && firstImage !== null && 'url' in firstImage) {
        return (firstImage as any).url;
      } else if (typeof firstImage === 'object' && firstImage !== null && 'image_url' in firstImage) {
        return (firstImage as any).image_url;
      }
    }
    
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Example Filters - Replace with your actual filters */}
        <div>
          <Label htmlFor="status">Status</Label>
          <Select onValueChange={(value) => handleFilterChange('status', value)}>
            <SelectTrigger id="status">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              {/* Add more status options as needed */}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="category">Category</Label>
          <Select onValueChange={(value) => handleFilterChange('category', value)}>
            <SelectTrigger id="category">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="clothing">Clothing</SelectItem>
              {/* Add more category options as needed */}
            </SelectContent>
          </Select>
        </div>
        
        {/* Add more filters as needed */}
      </div>
      
      {/* Ads Grid */}
      <div className="space-y-4">
        {isLoading ? (
          <div>Loading ads...</div>
        ) : Array.isArray(ads) && ads.length > 0 ? (
          <div className="grid gap-4">
            {ads.map((ad) => {
              const imageUrl = getImageUrl(ad);
              
              return (
                <Card key={ad.id} className="overflow-hidden">
                  <div className="flex gap-4">
                    <div className="w-32 h-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                      {imageUrl ? (
                        <img 
                          src={imageUrl} 
                          alt={ad.title} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <span className="text-gray-400 text-xs">لا توجد صورة</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold">{ad.title}</h3>
                        <p className="text-sm text-gray-500">{ad.description}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-brand font-bold">{ad.price} SAR</span>
                        <div className="flex items-center space-x-2">
                          <Link to={`/edit-ad/${ad.id}`}>
                            <Button variant="outline" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button variant="destructive" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div>No ads found.</div>
        )}
      </div>
      
      {/* Pagination */}
      {adsResponse?.data?.last_page > 1 && (
        <div className="flex justify-center">
          <div className="join">
            <button 
              className="join-item btn" 
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              «
            </button>
            
            {Array.from({ length: adsResponse.data.last_page }, (_, i) => i + 1).map(page => (
              <button 
                key={page}
                className={`join-item btn ${currentPage === page ? 'btn-active' : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
            
            <button 
              className="join-item btn"
              disabled={currentPage === adsResponse.data.last_page}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
