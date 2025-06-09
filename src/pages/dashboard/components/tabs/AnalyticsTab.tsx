
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, Heart, MessageCircle, TrendingUp, Package } from 'lucide-react';
import { useUserListings } from '@/hooks/use-api';
import { Listing } from '@/types';

export function AnalyticsTab() {
  const { data: userListings, isLoading } = useUserListings();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  const listings = Array.isArray(userListings) ? userListings : userListings?.data || [];
  
  // Calculate analytics
  const totalViews = listings.reduce((sum: number, listing: Listing) => sum + (listing.views_count || 0), 0);
  const totalListings = listings.length;
  const activeListings = listings.filter((listing: Listing) => listing.status === 'active').length;
  const featuredListings = listings.filter((listing: Listing) => listing.featured).length;

  // Get top performing listings
  const topListings = [...listings]
    .sort((a: Listing, b: Listing) => (b.views_count || 0) - (a.views_count || 0))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">إجمالي الإعلانات</p>
                <p className="text-2xl font-bold">{totalListings}</p>
              </div>
              <Package className="h-8 w-8 text-brand" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">الإعلانات النشطة</p>
                <p className="text-2xl font-bold">{activeListings}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">إجمالي المشاهدات</p>
                <p className="text-2xl font-bold">{totalViews}</p>
              </div>
              <Eye className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">الإعلانات المميزة</p>
                <p className="text-2xl font-bold">{featuredListings}</p>
              </div>
              <Heart className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Listings */}
      <Card>
        <CardHeader>
          <CardTitle>أفضل الإعلانات أداءً</CardTitle>
        </CardHeader>
        <CardContent>
          {topListings.length > 0 ? (
            <div className="space-y-4">
              {topListings.map((listing: Listing, index: number) => (
                <div key={listing.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-brand text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div className="flex items-center gap-3">
                      {listing.main_image_url ? (
                        <img 
                          src={listing.main_image_url} 
                          alt={listing.title}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                          <Package className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium">{listing.title}</h4>
                        <p className="text-sm text-brand font-semibold">{listing.price} ريال</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{listing.views_count || 0}</span>
                    </div>
                    
                    {listing.featured && (
                      <Badge className="bg-brand text-white">
                        مميز
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              لا توجد إعلانات لعرض الإحصائيات
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
