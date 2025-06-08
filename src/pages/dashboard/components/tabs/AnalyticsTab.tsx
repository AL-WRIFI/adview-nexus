
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Eye, Heart, MessageSquare, Star, Zap } from 'lucide-react';
import { useUserStats, useUserListings } from '@/hooks/use-api';
import { useUserPromotions } from '@/hooks/use-promotions';

export function AnalyticsTab() {
  const { data: stats, isLoading } = useUserStats();
  const { data: userListings } = useUserListings();
  const { data: promotions } = useUserPromotions();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">جاري التحميل...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalViews = userListings?.reduce((sum, listing) => sum + (listing.views_count || 0), 0) || 0;
  const totalFavorites = userListings?.reduce((sum, listing) => sum + (listing.favorites_count || 0), 0) || 0;
  
  // Handle both array and paginated response for promotions
  const promotionsList = Array.isArray(promotions) ? promotions : (promotions?.data || []);
  const activePromotions = promotionsList.filter((p: any) => p.payment_status === 'paid').length;

  const analyticsData = [
    {
      title: "إجمالي الإعلانات",
      value: stats?.totalListings || userListings?.length || 0,
      icon: TrendingUp,
      description: "عدد الإعلانات الكلي"
    },
    {
      title: "الإعلانات النشطة",
      value: stats?.activeListings || userListings?.filter(l => l.status === 'active').length || 0,
      icon: Eye,
      description: "الإعلانات المنشورة حالياً"
    },
    {
      title: "إجمالي المشاهدات",
      value: stats?.totalViews || totalViews,
      icon: Eye,
      description: "مشاهدات جميع الإعلانات"
    },
    {
      title: "إجمالي التعليقات",
      value: stats?.totalComments || 0,
      icon: MessageSquare,
      description: "تعليقات جميع الإعلانات"
    },
    {
      title: "الإعجابات",
      value: stats?.totalFavorites || totalFavorites,
      icon: Heart,
      description: "إجمالي الإعجابات"
    },
    {
      title: "الترقيات النشطة",
      value: activePromotions,
      icon: Zap,
      description: "عدد الإعلانات المُرقاة"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">إحصائيات الحساب</h3>
        <p className="text-sm text-muted-foreground">
          نظرة عامة على أداء إعلاناتك
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {analyticsData.map((item, index) => {
          const Icon = item.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {item.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.value}</div>
                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>أداء الإعلانات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userListings && userListings.length > 0 ? (
              <div className="space-y-2">
                {userListings.slice(0, 5).map((listing) => (
                  <div key={listing.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <h4 className="font-medium">{listing.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {listing.views_count || 0} مشاهدة • {listing.favorites_count || 0} إعجاب
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {listing.featured && (
                        <Star className="h-4 w-4 text-yellow-500" />
                      )}
                      <span className="text-sm font-medium">{listing.price} ريال</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="mx-auto h-12 w-12 mb-4" />
                <p>لا توجد إعلانات لعرض الإحصائيات</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
