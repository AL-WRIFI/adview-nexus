
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, DollarSign, TrendingUp, Crown, Zap } from 'lucide-react';
import { useUserPromotions } from '@/hooks/use-promotions';
import { ListingPromotion } from '@/types/promotions';
import { formatDate } from 'date-fns';
import { ar } from 'date-fns/locale';

export function ActivePromotionsDisplay() {
  const { data: promotionsData, isLoading } = useUserPromotions();
  
  const activePromotions = promotionsData?.data?.filter((promotion: ListingPromotion) => {
    if (promotion.payment_status !== 'paid') return false;
    if (!promotion.expires_at) return false;
    return new Date(promotion.expires_at) > new Date();
  }) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">جاري تحميل الترقيات النشطة...</p>
        </div>
      </div>
    );
  }

  if (activePromotions.length === 0) {
    return (
      <Card className="border-2 border-dashed border-gray-200 dark:border-gray-700">
        <CardContent className="py-8 text-center">
          <Crown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-gray-600 dark:text-gray-300">لا توجد ترقيات نشطة</h3>
          <p className="text-gray-500 dark:text-gray-400">قم بترقية إعلاناتك للحصول على مزيد من المشاهدات</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Zap className="h-6 w-6 text-yellow-500" />
        <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
          الترقيات النشطة
        </h2>
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
          {activePromotions.length} نشط
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {activePromotions.map((promotion: ListingPromotion) => (
          <Card 
            key={promotion.id} 
            className="relative overflow-hidden border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {/* Premium Badge */}
            <div className="absolute top-3 right-3">
              <Badge className="bg-green-600 hover:bg-green-700 text-white shadow-lg">
                <Crown className="w-3 h-3 mr-1" />
                مُرقى
              </Badge>
            </div>

            <CardHeader className="pb-3 pt-12">
              <CardTitle className="text-lg line-clamp-2 text-green-800 dark:text-green-200">
                {promotion.listing.title}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Package Info */}
              <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800 dark:text-green-200">
                    {promotion.package.name}
                  </span>
                </div>
                <Badge variant="outline" className="border-green-600 text-green-700 dark:text-green-300">
                  {promotion.package.duration_days} يوم
                </Badge>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-2 bg-white/30 dark:bg-black/10 rounded-md">
                  <div className="flex items-center justify-center gap-1 text-sm text-green-700 dark:text-green-300">
                    <DollarSign className="h-3 w-3" />
                    <span className="font-semibold">{promotion.amount_paid}</span>
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-400">المبلغ المدفوع</p>
                </div>
                
                <div className="text-center p-2 bg-white/30 dark:bg-black/10 rounded-md">
                  <div className="flex items-center justify-center gap-1 text-sm text-green-700 dark:text-green-300">
                    <Calendar className="h-3 w-3" />
                    <span className="font-semibold">
                      {Math.ceil((new Date(promotion.expires_at!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                    </span>
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-400">يوم متبقي</p>
                </div>
              </div>

              {/* Expiry Date */}
              <div className="flex items-center gap-2 p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-md">
                <Clock className="h-4 w-4 text-yellow-600" />
                <div className="text-sm">
                  <span className="text-yellow-800 dark:text-yellow-200">ينتهي في: </span>
                  <span className="font-medium text-yellow-700 dark:text-yellow-300">
                    {formatDate(new Date(promotion.expires_at!), 'dd/MM/yyyy', { locale: ar })}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-green-600 dark:text-green-400">
                  <span>التقدم</span>
                  <span>
                    {Math.round(
                      ((new Date().getTime() - new Date(promotion.starts_at!).getTime()) / 
                       (new Date(promotion.expires_at!).getTime() - new Date(promotion.starts_at!).getTime())) * 100
                    )}%
                  </span>
                </div>
                <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.round(
                        ((new Date().getTime() - new Date(promotion.starts_at!).getTime()) / 
                         (new Date(promotion.expires_at!).getTime() - new Date(promotion.starts_at!).getTime())) * 100
                      )}%` 
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
