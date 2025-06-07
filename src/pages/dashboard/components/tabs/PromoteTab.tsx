import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp } from 'lucide-react';
import { usePromotionPackages } from '@/hooks/use-promotions';
import { useUserListings } from '@/hooks/use-api';
import { PromoteListingDialog } from '@/components/promotions/PromoteListingDialog';
import { UserPromotionsTab } from '@/components/promotions/UserPromotionsTab';
import { ActivePromotionsDisplay } from '@/components/promotions/ActivePromotionsDisplay';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Listing } from '@/types';

export function PromoteTab() {
  const [promoteDialogOpen, setPromoteDialogOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  const { data: packages, isLoading: packagesLoading } = usePromotionPackages();
  const { data: listings, isLoading: listingsLoading } = useUserListings();

  const listingsData = Array.isArray(listings?.data) ? listings.data : [];

  const handlePromoteListing = (listing: Listing) => {
    setSelectedListing(listing);
    setPromoteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Active Promotions Section */}
      <ActivePromotionsDisplay />

      <Tabs defaultValue="packages" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="packages">باقات الترقية</TabsTrigger>
          <TabsTrigger value="my-listings">إعلاناتي</TabsTrigger>
          <TabsTrigger value="my-promotions">تاريخ الترقيات</TabsTrigger>
        </TabsList>

        <TabsContent value="packages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>باقات ترقية الإعلانات</CardTitle>
              <CardDescription>اجعل إعلاناتك تظهر في المقدمة للحصول على مزيد من المشاهدات</CardDescription>
            </CardHeader>
            <CardContent>
              {packagesLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">جاري تحميل الباقات...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {packages?.map((pkg) => (
                    <Card key={pkg.id} className="border-2 hover:border-primary transition-colors">
                      <CardHeader className="pb-2">
                        <CardTitle>{pkg.name}</CardTitle>
                        <CardDescription>{pkg.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold text-primary">{pkg.price} ريال</p>
                        <p className="text-muted-foreground mt-1">
                          لمدة {pkg.duration_days} {pkg.duration_days === 1 ? 'يوم' : pkg.duration_days > 10 ? 'يوم' : 'أيام'}
                        </p>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button 
                          className="w-full"
                          onClick={() => setPromoteDialogOpen(true)}
                          disabled={!pkg.is_active}
                        >
                          <DollarSign className="ml-2 h-4 w-4" />
                          اختر الباقة
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
              
              <div className="mt-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="font-bold mb-2">مميزات الإعلانات المدفوعة</h3>
                <ul className="list-disc pr-5 space-y-1">
                  <li>ظهور في الصفحة الرئيسية</li>
                  <li>ظهور في أعلى نتائج البحث</li>
                  <li>تمييز الإعلان بعلامة مميزة</li>
                  <li>زيادة عدد المشاهدات بنسبة تصل إلى 300%</li>
                  <li>زيادة فرص البيع السريع</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-listings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>إعلاناتي</CardTitle>
              <CardDescription>اختر الإعلان الذي تريد ترقيته</CardDescription>
            </CardHeader>
            <CardContent>
              {listingsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">جاري تحميل الإعلانات...</p>
                </div>
              ) : listingsData && listingsData.length > 0 ? (
                <div className="grid gap-4">
                  {listingsData.map((listing) => (
                    <Card key={listing.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {listing.image && (
                              <img 
                                src={typeof listing.image === 'string' ? listing.image : listing.image?.image_url || '/placeholder.svg'} 
                                alt={listing.title}
                                className="w-16 h-16 object-cover rounded"
                              />
                            )}
                            <div>
                              <h3 className="font-semibold">{listing.title}</h3>
                              <p className="text-sm text-muted-foreground">{listing.price} ريال</p>
                              <div className="flex items-center gap-2 mt-1">
                                {listing.featured && (
                                  <Badge variant="default" className="text-xs">
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    مُرقى
                                  </Badge>
                                )}
                                <Badge variant="outline" className="text-xs">
                                  {listing.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <Button
                            onClick={() => handlePromoteListing(listing)}
                            disabled={listing.status !== 'active'}
                          >
                            ترقية الإعلان
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">لا توجد إعلانات لترقيتها</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-promotions">
          <UserPromotionsTab />
        </TabsContent>
      </Tabs>

      <PromoteListingDialog
        open={promoteDialogOpen}
        onOpenChange={setPromoteDialogOpen}
        listing={selectedListing}
      />
    </div>
  );
}
