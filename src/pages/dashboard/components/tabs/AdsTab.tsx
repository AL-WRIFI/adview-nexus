
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { listingsAPI } from '@/services/apis';
import { Listing, ListingImage } from '@/types';
import { Eye, Edit, Trash2, TrendingUp, Calendar, DollarSign, Search, RefreshCw, Filter, MapPin, Clock } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUserListings } from '@/hooks/use-api';

interface AdsTabProps {
  onPromote: (id: number) => void;
  onDelete: (id: number) => void;
}

export function AdsTab({ onPromote, onDelete }: AdsTabProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'popular'>('newest');
  const itemsPerPage = 8;
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const { data: userListingsResponse, isLoading, error, refetch } = useUserListings();

  // const { data: userListingsResponse, isLoading, error, refetch } = useQuery({
  //   queryKey: ['userListings', currentPage, selectedStatus, searchQuery, sortBy],
  //   queryFn: () => listingsAPI.getListings({ 
  //     user_id: 'current' as any,
  //     page: currentPage,
  //     per_page: itemsPerPage,
  //     search: searchQuery || undefined,
  //     sort: sortBy
  //   }),
  // });

  const listings = userListingsResponse?.data || [];
  const totalPages = Math.ceil((userListingsResponse?.total || 0) / itemsPerPage);

  const handleRefreshAd = async (adId: number) => {
    try {
      console.log('Refreshing ad:', adId);
      await refetch();
    } catch (error) {
      console.error('Error refreshing ad:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500 text-white">نشط</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-500 text-white">في الانتظار</Badge>;
      case 'rejected':
        return <Badge variant="destructive">مرفوض</Badge>;
      case 'expired':
        return <Badge variant="outline" className="border-gray-400 text-gray-600">منتهي الصلاحية</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getAdImage = (listing: Listing) => {
    // Check for a specific main image URL first
    if (listing.main_image_url) {
      return listing.main_image_url;
    }

    // Check if the 'image' property is an object with 'image_url'
    if (listing.image && typeof listing.image === 'object' && 'image_url' in listing.image) {
      return (listing.image as ListingImage).image_url;
    }
    
    // Check if 'image' is a direct URL string
    if (typeof listing.image === 'string' && listing.image) {
      return listing.image;
    }
    
    // Check the 'images' array for the first available image
    if (listing.images && Array.isArray(listing.images) && listing.images.length > 0) {
      const firstImage = listing.images[0];
      if (firstImage) {
        if (typeof firstImage === 'object') {
          // It's a ListingImage object, check for 'url' or 'image_url'
          return (firstImage as ListingImage).url || (firstImage as ListingImage).image_url;
        }
        if (typeof firstImage === 'string') {
          // It's a URL string
          return firstImage;
        }
      }
    }
    
    // Fallback to a default placeholder if no image is found
    return 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">حدث خطأ في تحميل الإعلانات</p>
        <Button onClick={() => refetch()} className="mt-4">
          <RefreshCw className="h-4 w-4 ml-1" />
          إعادة المحاولة
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">إعلاناتي</h2>
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 ml-1" />
            تحديث
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="البحث في إعلاناتي..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="pending">في الانتظار</SelectItem>
                <SelectItem value="rejected">مرفوض</SelectItem>
                <SelectItem value="expired">منتهي الصلاحية</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="الترتيب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">الأحدث</SelectItem>
                <SelectItem value="oldest">الأقدم</SelectItem>
                <SelectItem value="price_asc">السعر: من الأقل</SelectItem>
                <SelectItem value="price_desc">السعر: من الأعلى</SelectItem>
                <SelectItem value="popular">الأكثر مشاهدة</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Ads List */}
      {listings.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground text-lg">لا توجد إعلانات تطابق المعايير المحددة</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {listings.map((listing: Listing) => {
            const timeAgo = formatDistanceToNow(new Date(listing.created_at), { 
              addSuffix: true,
              locale: ar
            });

            return (
              <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="flex">
                  {/* Ad Image */}
                  <div className="relative w-24 sm:w-32 flex-shrink-0">
                    <img
                      src={getAdImage(listing)}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop';
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      {getStatusBadge(listing.status || 'active')}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-bold text-base sm:text-lg line-clamp-1 flex-1">
                          {listing.title}
                        </h3>
                        {listing.price && (
                          <span className="font-bold text-brand text-base sm:text-lg shrink-0">
                            {Number(listing.price).toLocaleString()} ل.س
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {listing.description}
                      </p>
                    </div>

                    <div className="flex flex-col items-stretch gap-y-2 mt-3 sm:flex-row sm:items-center sm:justify-between">
                      {/* Stats */}
                      <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {timeAgo}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {listing.views_count || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {listing.city}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-1 self-end sm:self-auto">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onPromote(listing.id)}
                          className="text-xs p-2 h-8"
                          title="ترويج"
                        >
                          <TrendingUp className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRefreshAd(listing.id)}
                          className="text-xs p-2 h-8"
                          title="تحديث"
                        >
                          <RefreshCw className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/edit-ad/${listing.id}`)}
                          className="text-xs p-2 h-8"
                          title="تعديل"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onDelete(listing.id)}
                          className="text-xs p-2 h-8 text-red-600 hover:text-red-700"
                          title="حذف"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    onClick={() => setCurrentPage(pageNum)}
                    isActive={currentPage === pageNum}
                    className="cursor-pointer"
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            
            {totalPages > 5 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
