
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function StatisticsTab() {
  // Mock data for charts
  const viewsData = [
    { name: 'يناير', views: 400 },
    { name: 'فبراير', views: 300 },
    { name: 'مارس', views: 600 },
    { name: 'أبريل', views: 800 },
    { name: 'مايو', views: 500 },
    { name: 'يونيو', views: 900 },
  ];
  
  const adPerformance = [
    { name: 'إعلان 1', views: 400, inquiries: 24 },
    { name: 'إعلان 2', views: 300, inquiries: 13 },
    { name: 'إعلان 3', views: 200, inquiries: 10 },
    { name: 'إعلان 4', views: 100, inquiries: 5 },
  ];
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>الإحصائيات</CardTitle>
          <CardDescription>إحصائيات الإعلانات والمشاهدات والاستفسارات</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground mb-1">
                  المشاهدات
                </div>
                <div className="text-2xl font-bold">2,340</div>
                <div className="text-xs text-green-600 mt-1">+12% من الشهر الماضي</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground mb-1">
                  الاستفسارات
                </div>
                <div className="text-2xl font-bold">85</div>
                <div className="text-xs text-green-600 mt-1">+7% من الشهر الماضي</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground mb-1">
                  الإعلانات النشطة
                </div>
                <div className="text-2xl font-bold">5</div>
                <div className="text-xs text-muted-foreground mt-1">من أصل 10 إعلانات</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground mb-1">
                  معدل التحويل
                </div>
                <div className="text-2xl font-bold">3.6%</div>
                <div className="text-xs text-red-600 mt-1">-2% من الشهر الماضي</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      
      {/* Views Chart */}
      <Card>
        <CardHeader>
          <CardTitle>المشاهدات</CardTitle>
          <CardDescription>إحصائيات المشاهدات خلال الأشهر الماضية</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={viewsData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="views" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Ad Performance */}
      <Card>
        <CardHeader>
          <CardTitle>أداء الإعلانات</CardTitle>
          <CardDescription>مقارنة أداء الإعلانات من حيث المشاهدات والاستفسارات</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={adPerformance}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="views" fill="#8884d8" />
                <Bar dataKey="inquiries" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
