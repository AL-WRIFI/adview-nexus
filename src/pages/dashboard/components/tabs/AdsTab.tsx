
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2, TrendingUp, Calendar } from 'lucide-react';
import { useUserListings } from '@/hooks/use-api';
import { Listing } from '@/types';

interface AdsTabProps {
  setSelectedAd: (id: number) => void;
  setPromoteDialogOpen?: (open: boolean) => void;
}

export function AdsTab({ setSelectedAd, setPromoteDialogOpen }: AdsTabProps) {
  const { data: userListings = [], isLoading } = useUserListings();

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

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">إعلاناتي</h3>
        <p className="text-sm text-muted-foreground">
          إدارة جميع إعلاناتك من مكان واحد
        </p>
      </div>

      {userListings.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">لا توجد إعلانات</p>
            <p className="text-sm text-muted-foreground mt-2">
              قم بإنشاء إعلانك الأول لتبدأ البيع
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userListings.map((listing: Listing) => {
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
                    <Badge variant={listing.status === 'active' ? 'default' : 'secondary'}>
                      {listing.status === 'active' ? 'نشط' : 'غير نشط'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Eye className="h-4 w-4" />
                    <span>{listing.views_count || 0} مشاهدة</span>
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{new Date(listing.created_at).toLocaleDateString('ar-SA')}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setSelectedAd(listing.id)}
                    >
                      <Edit className="h-4 w-4 ml-1" />
                      تعديل
                    </Button>
                    {setPromoteDialogOpen && (
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => {
                          setSelectedAd(listing.id);
                          setPromoteDialogOpen(true);
                        }}
                      >
                        <TrendingUp className="h-4 w-4 ml-1" />
                        ترويج
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
