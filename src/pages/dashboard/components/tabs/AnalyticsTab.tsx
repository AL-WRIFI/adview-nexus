
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Eye, Heart, MessageSquare } from 'lucide-react';
import { useUserStats } from '@/hooks/use-api';

export function AnalyticsTab() {
  const { data: stats, isLoading } = useUserStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
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

  const analyticsData = [
    {
      title: "إجمالي الإعلانات",
      value: stats?.totalListings || 0,
      icon: TrendingUp,
      description: "عدد الإعلانات الكلي"
    },
    {
      title: "الإعلانات النشطة",
      value: stats?.activeListings || 0,
      icon: Eye,
      description: "الإعلانات المنشورة حالياً"
    },
    {
      title: "إجمالي المشاهدات",
      value: stats?.totalViews || 0,
      icon: Eye,
      description: "مشاهدات جميع الإعلانات"
    },
    {
      title: "الإعجابات",
      value: stats?.totalFavorites || 0,
      icon: Heart,
      description: "إجمالي الإعجابات"
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="mx-auto h-12 w-12 mb-4" />
            <p>ستظهر هنا تفاصيل أداء إعلاناتك قريباً</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
