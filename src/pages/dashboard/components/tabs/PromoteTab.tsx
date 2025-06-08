
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, Calendar, Clock, CreditCard, Plus, TrendingUp } from 'lucide-react';
import { useUserListings, useUserPromotions } from '@/hooks/use-api';
import { usePromotionPackages } from '@/hooks/use-promotions';
import { PromoteListingDialog } from '@/components/promotions/PromoteListingDialog';
import { UserPromotionsTab } from '@/components/promotions/UserPromotionsTab';
import { Listing } from '@/types';

export function PromoteTab() {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [promoteDialogOpen, setPromoteDialogOpen] = useState(false);

  const { data: listings, isLoading: listingsLoading } = useUserListings();
  const { data: promotions, isLoading: promotionsLoading } = useUserPromotions();
  const { data: packages, isLoading: packagesLoading } = usePromotionPackages();

  if (listingsLoading || promotionsLoading || packagesLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  const listingsArray = Array.isArray(listings) ? listings : [];
  const promotionsArray = Array.isArray(promotions) ? promotions : [];
  const packagesArray = Array.isArray(packages) ? packages : [];

  const handlePromoteListing = (listing: Listing) => {
    setSelectedListing(listing);
    setPromoteDialogOpen(true);
  };

  // Get active promotions
  const activePromotions = promotionsArray.filter(promotion => 
    promotion.payment_status === 'paid' && 
    new Date(promotion.expires_at) > new Date()
  );

  return (
    <div className="space-y-6">
      {/* Promotion Packages */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-card-foreground">باقات الترقية</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {packagesArray.map((pkg) => (
            <Card key={pkg.id} className="bg-card border-border hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg text-card-foreground">{pkg.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{pkg.description}</p>
                  </div>
                  <Badge variant="secondary" className="shrink-0">
                    {pkg.type === 'featured' ? 'مميز' : 
                     pkg.type === 'urgent' ? 'عاجل' : 
                     pkg.type === 'highlight' ? 'مضيء' : 'أعلى'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-2xl font-bold text-brand">
                    {pkg.price} ريال
                  </div>
                  <div className="text-sm text-muted-foreground">
                    مدة الترقية: {pkg.duration_days} {pkg.duration_days === 1 ? 'يوم' : 'أيام'}
                  </div>
                  <ul className="text-sm space-y-1">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-brand rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* User Listings - Available for Promotion */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-card-foreground">إعلاناتك المتاحة للترقية</h2>
        {listingsArray.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="text-center py-8">
              <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-card-foreground">لا توجد إعلانات</h3>
              <p className="text-muted-foreground">قم بإنشاء إعلان أولاً لتتمكن من ترقيته</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {listingsArray.map((listing) => {
              const hasActivePromotion = promotionsArray.some(promotion => 
                promotion.listing_id === listing.id && 
                promotion.payment_status === 'paid' && 
                new Date(promotion.expires_at) > new Date()
              );

              return (
                <Card key={listing.id} className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
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
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-card-foreground">{listing.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {listing.description}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <span>{listing.price} ريال</span>
                              <span>{listing.views_count || 0} مشاهدة</span>
                              <span>{listing.favorites_count || 0} إعجاب</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {hasActivePromotion && (
                              <Badge className="bg-brand text-brand-foreground">
                                <Star className="w-3 h-3 ml-1" />
                                مُرقى
                              </Badge>
                            )}
                            <Button
                              size="sm"
                              onClick={() => handlePromoteListing(listing)}
                              disabled={hasActivePromotion}
                              className="bg-brand hover:bg-brand/90 text-brand-foreground"
                            >
                              <Plus className="w-4 h-4 ml-1" />
                              {hasActivePromotion ? 'مُرقى حالياً' : 'ترقية'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Active Promotions */}
      <UserPromotionsTab />

      {/* Promote Dialog */}
      <PromoteListingDialog
        open={promoteDialogOpen}
        onOpenChange={setPromoteDialogOpen}
        listing={selectedListing}
      />
    </div>
  );
}
