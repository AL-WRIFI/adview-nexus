
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, Heart, MessageSquare, Edit, Trash2, TrendingUp, Calendar, MapPin } from 'lucide-react';
import { useUserListings, useDeleteListing } from '@/hooks/use-api';
import { Listing } from '@/types';

interface AdsTabProps {
  setSelectedAd: (id: string | null) => void;
  setPromoteDialogOpen: (open: boolean) => void;
}

export function AdsTab({ setSelectedAd, setPromoteDialogOpen }: AdsTabProps) {
  const { data: userListings, isLoading } = useUserListings();
  const deleteListingMutation = useDeleteListing();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const userListingsData = userListings?.data || [];

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await deleteListingMutation.mutateAsync(id);
    } finally {
      setDeletingId(null);
    }
  };

  const getImageSrc = (image: string | { image_url: string } | null | undefined): string => {
    if (!image) return '/placeholder.svg';
    if (typeof image === 'string') return image;
    return image.image_url || '/placeholder.svg';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">إعلاناتي</h3>
          <p className="text-sm text-muted-foreground">
            إدارة وتعديل إعلاناتك المنشورة
          </p>
        </div>
        <Button asChild>
          <Link to="/add-ad">إضافة إعلان جديد</Link>
        </Button>
      </div>

      {userListingsData.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">لا توجد إعلانات</h3>
              <p className="text-muted-foreground mb-4">لم تقم بنشر أي إعلانات بعد</p>
              <Button asChild>
                <Link to="/add-ad">إضافة إعلان جديد</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userListingsData.map((listing: Listing) => (
            <Card key={listing.id} className="overflow-hidden">
              <div className="relative">
                <img
                  src={getImageSrc(listing.image)}
                  alt={listing.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant={listing.status === 'active' ? 'default' : 'secondary'}>
                    {listing.status === 'active' ? 'نشط' : 'غير نشط'}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-4">
                <h4 className="font-medium text-lg mb-2 line-clamp-2">{listing.title}</h4>
                <p className="text-2xl font-bold text-primary mb-2">{listing.price} ريال</p>
                
                <div className="flex items-center text-sm text-muted-foreground mb-3">
                  <MapPin className="h-4 w-4 ml-1" />
                  <span>{listing.location}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 ml-1" />
                    <span>{listing.views || 0}</span>
                  </div>
                  <div className="flex items-center">
                    <Heart className="h-4 w-4 ml-1" />
                    <span>{listing.favorites_count || 0}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 ml-1" />
                    <span>{new Date(listing.created_at).toLocaleDateString('ar-SA')}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild className="flex-1">
                    <Link to={`/edit-ad/${listing.id}`}>
                      <Edit className="h-4 w-4 ml-1" />
                      تعديل
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setSelectedAd(String(listing.id));
                      setPromoteDialogOpen(true);
                    }}
                    className="flex-1"
                  >
                    <TrendingUp className="h-4 w-4 ml-1" />
                    ترويج
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDelete(listing.id)}
                    disabled={deletingId === listing.id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
