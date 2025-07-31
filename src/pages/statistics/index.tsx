
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Eye, Heart, MessageCircle, DollarSign } from 'lucide-react';

const mockData = [
  { name: 'يناير', views: 120, favorites: 15, messages: 8 },
  { name: 'فبراير', views: 190, favorites: 25, messages: 12 },
  { name: 'مارس', views: 280, favorites: 35, messages: 18 },
  { name: 'أبريل', views: 220, favorites: 28, messages: 14 },
  { name: 'مايو', views: 340, favorites: 42, messages: 22 },
  { name: 'يونيو', views: 310, favorites: 38, messages: 20 },
];

export default function StatisticsPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">الإحصائيات</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المشاهدات</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,760</div>
            <p className="text-xs text-muted-foreground">
              +12% من الشهر الماضي
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المفضلة</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">183</div>
            <p className="text-xs text-muted-foreground">
              +8% من الشهر الماضي
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الرسائل</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94</div>
            <p className="text-xs text-muted-foreground">
              +15% من الشهر الماضي
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المبيعات</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45,230 ل.س</div>
            <p className="text-xs text-muted-foreground">
              +20% من الشهر الماضي
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Card>
        <CardHeader>
          <CardTitle>الإحصائيات الشهرية</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="views" fill="#8884d8" name="المشاهدات" />
              <Bar dataKey="favorites" fill="#82ca9d" name="المفضلة" />
              <Bar dataKey="messages" fill="#ffc658" name="الرسائل" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
