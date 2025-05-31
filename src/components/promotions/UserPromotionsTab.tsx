
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, DollarSign, Eye } from 'lucide-react';
import { useUserPromotions } from '@/hooks/use-promotions';
import { ListingPromotion } from '@/types/promotions';
import { formatDate } from 'date-fns';
import { ar } from 'date-fns/locale';

export function UserPromotionsTab() {
  const { data: promotionsData, isLoading, refetch } = useUserPromotions();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">قيد المراجعة</Badge>;
      case 'paid':
        return <Badge variant="default">مفعل</Badge>;
      case 'failed':
        return <Badge variant="destructive">فشل</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'stripe':
        return 'دفع إلكتروني';
      case 'bank_transfer':
        return 'تحويل بنكي';
      case 'wallet':
        return 'رصيد المحفظة';
      default:
        return method;
    }
  };

  const isActive = (promotion: ListingPromotion) => {
    if (promotion.payment_status !== 'paid') return false;
    if (!promotion.expires_at) return false;
    return new Date(promotion.expires_at) > new Date();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">جاري تحميل الترقيات...</p>
        </div>
      </div>
    );
  }

  const promotions = promotionsData?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">ترقيات الإعلانات</h2>
          <p className="text-muted-foreground">تتبع حالة ترقيات إعلاناتك</p>
        </div>
        <Button variant="outline" onClick={() => refetch()}>
          تحديث
        </Button>
      </div>

      {promotions.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">لا توجد ترقيات</h3>
            <p className="text-muted-foreground">لم تقم بترقية أي إعلان بعد</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {promotions.map((promotion: ListingPromotion) => (
            <Card key={promotion.id} className={isActive(promotion) ? 'border-green-500 bg-green-50/50' : ''}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{promotion.listing.title}</CardTitle>
                    <CardDescription>
                      باقة: {promotion.package.name} • طريقة الدفع: {getPaymentMethodText(promotion.payment_method)}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(promotion.payment_status)}
                    {isActive(promotion) && (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        نشط الآن
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Package Details */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>المبلغ المدفوع: {promotion.amount_paid} ريال</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>المدة: {promotion.package.duration_days} أيام</span>
                    </div>
                  </div>

                  {/* Timing Details */}
                  <div className="space-y-2">
                    {promotion.payment_confirmed_at && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          تاريخ التأكيد: {formatDate(new Date(promotion.payment_confirmed_at), 'dd/MM/yyyy', { locale: ar })}
                        </span>
                      </div>
                    )}
                    {promotion.expires_at && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          تاريخ الانتهاء: {formatDate(new Date(promotion.expires_at), 'dd/MM/yyyy', { locale: ar })}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Transaction Details */}
                  <div className="space-y-2">
                    {promotion.transaction_id && (
                      <div className="text-xs text-muted-foreground">
                        رقم المعاملة: {promotion.transaction_id.substring(0, 20)}...
                      </div>
                    )}
                    {promotion.bank_transfer_proof_url && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(promotion.bank_transfer_proof_url, '_blank')}
                      >
                        عرض إثبات التحويل
                      </Button>
                    )}
                  </div>
                </div>

                {/* Status Messages */}
                {promotion.payment_status === 'pending' && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-800">
                      {promotion.payment_method === 'bank_transfer' 
                        ? 'في انتظار مراجعة إثبات التحويل البنكي'
                        : 'في انتظار تأكيد الدفع'
                      }
                    </p>
                  </div>
                )}
                
                {promotion.payment_status === 'failed' && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-800">
                      فشل في معالجة الدفع. يرجى المحاولة مرة أخرى أو التواصل مع الدعم.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
