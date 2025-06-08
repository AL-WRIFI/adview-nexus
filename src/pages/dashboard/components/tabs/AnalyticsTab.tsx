
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Eye, 
  MessageSquare, 
  Heart,
  ShoppingBag,
  Calendar
} from 'lucide-react';
import { useUserListings, useUserAnalytics } from '@/hooks/use-api';

export function AnalyticsTab() {
  const { data: userListings, isLoading: loadingListings } = useUserListings();
  const { data: analytics, isLoading: loadingAnalytics } = useUserAnalytics();

  if (loadingListings || loadingAnalytics) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  // Handle both array and paginated response structures  
  const listings = Array.isArray(userListings) ? userListings : userListings?.data || [];
  const analyticsData = analytics || {
    totalListings: 0,
    activeListings: 0,
    totalViews: 0,
    totalComments: 0,
    totalFavorites: 0
  };

  const statCards = [
    {
      title: 'إجمالي الإعلانات',
      value: analyticsData.totalListings || listings.length,
      icon: ShoppingBag,
      color: 'text-blue-600'
    },
    {
      title: 'الإعلانات النشطة',
      value: analyticsData.activeListings || listings.filter(ad => ad.status === 'active').length,
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'إجمالي المشاهدات',
      value: analyticsData.totalViews || listings.reduce((sum, ad) => sum + (ad.views_count || 0), 0),
      icon: Eye,
      color: 'text-purple-600'
    },
    {
      title: 'إجمالي التعليقات',
      value: analyticsData.totalComments || listings.reduce((sum, ad) => sum + (ad.comments_count || 0), 0),
      icon: MessageSquare,
      color: 'text-orange-600'
    }
  ];

  // Mock data for charts - in real app this would come from API
  const viewsData = [
    { name: 'الاثنين', views: 120 },
    { name: 'الثلاثاء', views: 190 },
    { name: 'الأربعاء', views: 300 },
    { name: 'الخميس', views: 250 },
    { name: 'الجمعة', views: 180 },
    { name: 'السبت', views: 220 },
    { name: 'الأحد', views: 160 }
  ];

  const categoryData = [
    { name: 'إلكترونيات', value: 35, color: '#8884d8' },
    { name: 'سيارات', value: 25, color: '#82ca9d' },
    { name: 'عقارات', value: 20, color: '#ffc658' },
    { name: 'أخرى', value: 20, color: '#ff7300' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">الإحصائيات والتحليلات</h2>
        <p className="text-muted-foreground">تتبع أداء إعلاناتك وإحصائيات المشاهدة</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              المشاهدات الأسبوعية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={viewsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              توزيع التصنيفات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            النشاط الأخير
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {listings.slice(0, 5).map((ad) => (
              <div key={ad.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                    <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{ad.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {ad.views_count || 0} مشاهدة • {ad.favorites_count || 0} إعجاب
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{ad.price} ريال</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(ad.created_at || Date.now()).toLocaleDateString('ar-SA')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
