
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, Heart, MessageSquare, MoreVertical, Star, Trash2, Edit, Zap } from 'lucide-react';
import { useUserListings } from '@/hooks/use-api';
import { Listing } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AdsTabProps {
  setSelectedAd: (id: number) => void;
  setPromoteDialogOpen: (open: boolean) => void;
}

export function AdsTab({ setSelectedAd, setPromoteDialogOpen }: AdsTabProps) {
  const { data: listings, isLoading } = useUserListings();
  const [selectedListing, setSelectedListing] = useState<number | null>(null);

  const handlePromote = (listingId: number) => {
    setSelectedAd(listingId);
    setSelectedListing(listingId);
    setPromoteDialogOpen(true);
  };

  const handleEdit = (listingId: number) => {
    // Navigate to edit page - implement as needed
    console.log('Edit listing:', listingId);
  };

  const handleDelete = (listingId: number) => {
    // Implement delete functionality
    console.log('Delete listing:', listingId);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const listingsArray = Array.isArray(listings) ? listings : (listings?.data || []);

  if (!listingsArray || listingsArray.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">إعلاناتي</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-card-foreground">لا توجد إعلانات</h3>
            <p className="text-muted-foreground">لم تقم بنشر أي إعلان بعد</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">إعلاناتي ({listingsArray.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {listingsArray.map((listing: Listing) => (
              <Card key={listing.id} className="p-4 bg-card border-border hover:bg-accent/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      {listing.main_image_url ? (
                        <img 
                          src={listing.main_image_url} 
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <span className="text-muted-foreground text-xs">لا توجد صورة</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2 flex-1">
                      <div className="flex items-start justify-between">
                        <h4 className="font-semibold text-card-foreground">{listing.title}</h4>
                        <div className="flex items-center gap-2">
                          {listing.featured && (
                            <Star className="h-4 w-4 text-yellow-500" />
                          )}
                          <Badge 
                            variant={listing.status === 'active' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {listing.status === 'active' ? 'نشط' : 
                             listing.status === 'inactive' ? 'غير نشط' : 'مباع'}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {listing.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{listing.views_count || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          <span>{listing.favorites_count || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>0</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-brand">
                          {listing.price} ريال
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(listing.created_at).toLocaleDateString('ar-SA')}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-card-foreground">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover border-border">
                      <DropdownMenuItem onClick={() => handlePromote(listing.id)} className="text-popover-foreground hover:bg-accent">
                        <Zap className="h-4 w-4 ml-2" />
                        ترقية الإعلان
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(listing.id)} className="text-popover-foreground hover:bg-accent">
                        <Edit className="h-4 w-4 ml-2" />
                        تعديل
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(listing.id)}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4 ml-2" />
                        حذف
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
