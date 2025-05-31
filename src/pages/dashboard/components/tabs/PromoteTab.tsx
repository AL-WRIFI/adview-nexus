
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign } from 'lucide-react';
import { FEATURED_PACKAGES } from '@/data/mock-data';

interface PromoteTabProps {
  setPromoteDialogOpen: (open: boolean) => void;
}

export function PromoteTab({ setPromoteDialogOpen }: PromoteTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>ترقية الإعلانات</CardTitle>
        <CardDescription>اجعل إعلاناتك تظهر في المقدمة للحصول على مزيد من المشاهدات</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FEATURED_PACKAGES.map((pkg) => (
            <Card key={pkg.id} className="border-2 hover:border-brand transition-colors">
              <CardHeader className="pb-2">
                <CardTitle>{pkg.name}</CardTitle>
                <CardDescription>{pkg.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-brand">{pkg.price} ريال</p>
                <p className="text-muted-foreground mt-1">لمدة {pkg.duration} {pkg.duration === 1 ? 'يوم' : pkg.duration > 10 ? 'يوم' : 'أيام'}</p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button 
                  className="w-full"
                  onClick={() => setPromoteDialogOpen(true)}
                >
                  <DollarSign className="ml-2 h-4 w-4" />
                  اختر الباقة
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
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
  );
}
