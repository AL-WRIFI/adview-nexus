
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Zap, Star, Clock, TrendingUp, CheckCircle } from 'lucide-react';
import { usePromotionPackages, usePromoteListing } from '@/hooks/use-promotions';
import { useUserListings } from '@/hooks/use-api';
import { UserPromotionsTab } from '@/components/promotions/UserPromotionsTab';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export function PromoteTab() {
  const { data: packages, isLoading: packagesLoading } = usePromotionPackages();
  const { data: listings, isLoading: listingsLoading } = useUserListings();
  const promoteMutation = usePromoteListing();
  const { toast } = useToast();
  
  const [selectedListing, setSelectedListing] = useState<string>('');
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);

  const handlePromote = async () => {
    if (!selectedListing || !selectedPackage) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار الإعلان والباقة",
        variant: "destructive",
      });
      return;
    }

    try {
      await promoteMutation.mutateAsync({
        listingId: parseInt(selectedListing),
        packageId: selectedPackage,
      });
      
      toast({
        title: "تم بنجاح",
        description: "تم ترقية الإعلان بنجاح",
      });
      
      setSelectedListing('');
      setSelectedPackage(null);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء ترقية الإعلان",
        variant: "destructive",
      });
    }
  };

  const listingsArray = Array.isArray(listings) ? listings : (listings?.data || []);

  if (packagesLoading || listingsLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Promotion Form */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <Zap className="h-5 w-5 text-brand" />
            ترقية إعلان جديد
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-card-foreground">اختر الإعلان</label>
              <Select value={selectedListing} onValueChange={setSelectedListing}>
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue placeholder="اختر إعلانًا للترقية" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {listingsArray.map((listing) => (
                    <SelectItem key={listing.id} value={listing.id.toString()} className="text-popover-foreground">
                      {listing.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedListing && (
            <Button 
              onClick={handlePromote}
              disabled={!selectedPackage || promoteMutation.isPending}
              className="bg-brand hover:bg-brand/90 text-white"
            >
              {promoteMutation.isPending ? 'جاري الترقية...' : 'ترقية الإعلان'}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Promotion Packages */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">باقات الترقية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {packages?.map((pkg) => (
              <Card 
                key={pkg.id} 
                className={`p-4 cursor-pointer transition-all border-2 ${
                  selectedPackage === pkg.id 
                    ? 'border-brand bg-brand/5' 
                    : 'border-border bg-card hover:border-brand/50'
                }`}
                onClick={() => setSelectedPackage(pkg.id)}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-card-foreground">{pkg.name}</h3>
                    {pkg.type === 'featured' && <Star className="h-5 w-5 text-yellow-500" />}
                    {pkg.type === 'urgent' && <TrendingUp className="h-5 w-5 text-red-500" />}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{pkg.duration} يوم</span>
                    </div>
                    
                    <div className="space-y-1">
                      {pkg.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span className="text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-border">
                    <span className="text-2xl font-bold text-brand">{pkg.price} ريال</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Promotions */}
      <UserPromotionsTab />
    </div>
  );
}
