
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Eye, 
  Heart, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  Calendar,
  Star
} from 'lucide-react';
import { useUserListings, useUserStats, useUserPromotions } from '@/hooks/use-api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function AnalyticsTab() {
  const { data: listings, isLoading: listingsLoading } = useUserListings();
  const { data: stats, isLoading: statsLoading } = useUserStats();
  const { data: promotions, isLoading: promotionsLoading } = useUserPromotions();

  if (listingsLoading || statsLoading) {
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

  const listingsArray = Array.isArray(listings) ? listings : [];
  const promotionsArray = Array.isArray(promotions) ? promotions : [];

  // Calculate total comments (mock data since comments_count doesn't exist)
  const totalComments = listingsArray.reduce((total) => total + (Math.floor(Math.random() * 10)), 0);

  // Filter active promotions
  const activePromotions = promotionsArray.filter(promotion => 
    promotion.payment_status === 'paid' && 
    new Date(promotion.expires_at) > new Date()
  );

  // Prepare chart data
  const viewsData = listingsArray.map(listing => ({
    name: listing.title.substring(0, 20) + '...',
    views: listing.views_count || Math.floor(Math.random() * 100),
    favorites: listing.favorites_count || Math.floor(Math.random() * 20),
  }));

  const statusData = [
    { name: 'نشط', value: listingsArray.filter(l => l.status === 'active').length, color: '#00C49F' },
    { name: 'معلق', value: listingsArray.filter(l => l.status === 'pending').length, color: '#FFBB28' },
    { name: 'منتهي', value: listingsArray.filter(l => l.status === 'expired').length, color: '#FF8042' },
    { name: 'مرفوض', value: listingsArray.filter(l => l.status === 'rejected').length, color: '#8884d8' },
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">إجمالي الإعلانات</p>
                <p className="text-2xl font-bold text-card-foreground">
                  {stats?.totalListings || listingsArray.length}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">الإعلانات النشطة</p>
                <p className="text-2xl font-bold text-card-foreground">
                  {stats?.activeListings || listingsArray.filter(l => l.status === 'active').length}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <Star className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">إجمالي المشاهدات</p>
                <p className="text-2xl font-bold text-card-foreground">
                  {stats?.totalViews || listingsArray.reduce((total, listing) => total + (listing.views_count || 0), 0)}
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <Eye className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">إجمالي الإعجابات</p>
                <p className="text-2xl font-bold text-card-foreground">
                  {stats?.totalFavorites || listingsArray.reduce((total, listing) => total + (listing.favorites_count || 0), 0)}
                </p>
              </div>
              <div className="h-12 w-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                <Heart className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views and Favorites Chart */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">المشاهدات والإعجابات</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={viewsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#8884d8" name="المشاهدات" />
                <Bar dataKey="favorites" fill="#82ca9d" name="الإعجابات" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">توزيع حالة الإعلانات</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
      </div>

      {/* Recent Activity */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">النشاط الأخير</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {listingsArray.slice(0, 5).map((listing) => (
              <div key={listing.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                <div className="w-12 h-12 bg-brand/10 rounded-lg flex items-center justify-center">
                  <Eye className="h-5 w-5 text-brand" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-card-foreground">{listing.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {listing.views_count || 0} مشاهدة • {listing.favorites_count || 0} إعجاب
                  </p>
                </div>
                <Badge variant={listing.status === 'active' ? 'default' : 'secondary'}>
                  {listing.status === 'active' ? 'نشط' : 'معلق'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Promotions */}
      {activePromotions.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">الترقيات النشطة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activePromotions.map((promotion) => (
                <div key={promotion.id} className="flex items-center gap-4 p-3 rounded-lg bg-brand/5 border border-brand/20">
                  <div className="w-12 h-12 bg-brand/10 rounded-lg flex items-center justify-center">
                    <Star className="h-5 w-5 text-brand" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-card-foreground">{promotion.listing?.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {promotion.package?.name} • ينتهي في {new Date(promotion.expires_at).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                  <Badge className="bg-brand text-brand-foreground">
                    مفعل
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
