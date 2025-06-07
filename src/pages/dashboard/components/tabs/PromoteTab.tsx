
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Clock, Eye, TrendingUp } from 'lucide-react';
import { useUserListings, usePromotionPackages } from '@/hooks/use-api';
import { Listing } from '@/types';

export function PromoteTab() {
  const { data: userListings = [], isLoading } = useUserListings();
  const { data: promotionPackages = [] } = usePromotionPackages();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="w-full h-48 bg-gray-200 animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-gray-200 animate-pulse rounded mb-2" />
              <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const promotableListings = Array.isArray(userListings) ? userListings.filter((listing: Listing) => 
    listing.status === 'active' && !listing.featured
  ) : [];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">ترويج الإعلانات</h3>
        <p className="text-sm text-muted-foreground">
          قم بترويج إعلاناتك لزيادة الوصول والمشاهدات
        </p>
      </div>

      {/* Promotion packages */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="border-2 border-yellow-200 bg-yellow-50">
          <CardHeader className="text-center">
            <Crown className="mx-auto h-8 w-8 text-yellow-600 mb-2" />
            <CardTitle className="text-lg">ترويج مميز</CardTitle>
            <div className="text-2xl font-bold text-yellow-600">99 ريال</div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <TrendingUp className="h-4 w-4 ml-2 text-green-500" />
                ظهور في المقدمة
              </li>
              <li className="flex items-center">
                <Eye className="h-4 w-4 ml-2 text-blue-500" />
                زيادة المشاهدات 5x
              </li>
              <li className="flex items-center">
                <Clock className="h-4 w-4 ml-2 text-purple-500" />
                لمدة 30 يوم
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader className="text-center">
            <TrendingUp className="mx-auto h-8 w-8 text-blue-600 mb-2" />
            <CardTitle className="text-lg">ترويج عادي</CardTitle>
            <div className="text-2xl font-bold text-blue-600">49 ريال</div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <TrendingUp className="h-4 w-4 ml-2 text-green-500" />
                ظهور محسن
              </li>
              <li className="flex items-center">
                <Eye className="h-4 w-4 ml-2 text-blue-500" />
                زيادة المشاهدات 3x
              </li>
              <li className="flex items-center">
                <Clock className="h-4 w-4 ml-2 text-purple-500" />
                لمدة 15 يوم
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 bg-green-50">
          <CardHeader className="text-center">
            <Eye className="mx-auto h-8 w-8 text-green-600 mb-2" />
            <CardTitle className="text-lg">ترويج سريع</CardTitle>
            <div className="text-2xl font-bold text-green-600">19 ريال</div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <TrendingUp className="h-4 w-4 ml-2 text-green-500" />
                ظهور أفضل
              </li>
              <li className="flex items-center">
                <Eye className="h-4 w-4 ml-2 text-blue-500" />
                زيادة المشاهدات 2x
              </li>
              <li className="flex items-center">
                <Clock className="h-4 w-4 ml-2 text-purple-500" />
                لمدة 7 أيام
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* User's listings available for promotion */}
      <div>
        <h4 className="font-medium mb-4">إعلاناتك المتاحة للترويج</h4>
        
        {promotableListings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">لا توجد إعلانات متاحة للترويج</p>
              <p className="text-sm text-muted-foreground mt-2">
                قم بإنشاء إعلان جديد أو تأكد من أن إعلاناتك نشطة
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {promotableListings.map((listing: Listing) => {
              const imageUrl = typeof listing.image === 'string' 
                ? listing.image 
                : listing.main_image_url || '/placeholder.svg';
              
              return (
                <Card key={listing.id}>
                  <CardHeader className="p-0">
                    <img 
                      src={imageUrl} 
                      alt={listing.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  </CardHeader>
                  <CardContent className="p-4">
                    <h5 className="font-medium mb-2 truncate">{listing.title}</h5>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-lg font-bold text-brand">
                        {listing.price} ريال
                      </span>
                      <Badge variant="secondary">{listing.status}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-3">
                      المشاهدات: {listing.views_count || 0}
                    </div>
                    <Button className="w-full" size="sm">
                      ترويج هذا الإعلان
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
