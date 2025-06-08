
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Eye, Heart, MessageCircle, TrendingUp, Package, Activity } from 'lucide-react';
import { useUserListings, useUserAnalytics } from '@/hooks/use-api';
import { useUserPromotions } from '@/hooks/use-promotions';

export function AnalyticsTab() {
  const { data: userListings, isLoading: loadingListings } = useUserListings();
  const { data: analytics, isLoading: loadingAnalytics } = useUserAnalytics();
  const { data: promotions, isLoading: loadingPromotions } = useUserPromotions();

  if (loadingListings || loadingAnalytics || loadingPromotions) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const listings = userListings?.data || [];
  const promotionsList = Array.isArray(promotions) ? promotions : [];

  // Calculate statistics
  const totalListings = listings.length;
  const activeListings = listings.filter(listing => listing.status === 'active').length;
  const soldListings = listings.filter(listing => listing.status === 'sold').length;
  const inactiveListings = listings.filter(listing => listing.status === 'inactive').length;
  
  const totalViews = listings.reduce((sum, listing) => sum + (listing.views_count || 0), 0);
  const totalComments = 0; // This would come from comments API
  const totalFavorites = 0; // This would come from favorites API

  // Chart data
  const statusData = [
    { name: 'نشط', value: activeListings, color: '#10b981' },
    { name: 'مباع', value: soldListings, color: '#3b82f6' },
    { name: 'غير نشط', value: inactiveListings, color: '#f59e0b' },
  ];

  const viewsData = listings.slice(0, 5).map(listing => ({
    name: listing.title.slice(0, 20) + '...',
    views: listing.views_count || 0,
  }));

  const statsCards = [
    {
      title: 'إجمالي الإعلانات',
      value: analytics?.totalListings || totalListings,
      icon: Package,
      color: 'text-blue-600'
    },
    {
      title: 'الإعلانات النشطة',
      value: analytics?.activeListings || activeListings,
      icon: Activity,
      color: 'text-green-600'
    },
    {
      title: 'إجمالي المشاهدات',
      value: analytics?.totalViews || totalViews,
      icon: Eye,
      color: 'text-purple-600'
    },
    {
      title: 'إجمالي الإعجابات',
      value: analytics?.totalFavorites || totalFavorites,
      icon: Heart,
      color: 'text-red-600'
    },
    {
      title: 'إجمالي التعليقات',
      value: analytics?.totalComments || totalComments,
      icon: MessageCircle,
      color: 'text-orange-600'
    },
    {
      title: 'الترقيات النشطة',
      value: promotionsList.filter(p => p.payment_status === 'paid').length,
      icon: TrendingUp,
      color: 'text-indigo-600'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>توزيع حالة الإعلانات</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Views Chart */}
        <Card>
          <CardHeader>
            <CardTitle>أكثر الإعلانات مشاهدة</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={viewsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>النشاط الأخير</CardTitle>
        </CardHeader>
        <CardContent>
          {listings.length > 0 ? (
            <div className="space-y-4">
              {listings.slice(0, 5).map((listing) => (
                <div key={listing.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                      <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium">{listing.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(listing.created_at).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{listing.price} ريال</p>
                    <p className="text-sm text-muted-foreground">{listing.views_count || 0} مشاهدة</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              لا توجد بيانات لعرضها
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
