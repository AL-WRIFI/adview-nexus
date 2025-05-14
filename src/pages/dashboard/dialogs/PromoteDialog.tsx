
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Ad } from '@/types';
import { Loader2, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PromoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ad: Ad | null;
}

const promotionPackages = [
  { id: 1, name: 'باقة أساسية', days: 7, price: 50, features: ['تثبيت الإعلان لمدة 7 أيام', 'ظهور في نتائج البحث المميزة', 'زيادة مشاهدات الإعلان بنسبة 70%'] },
  { id: 2, name: 'باقة فضية', days: 14, price: 100, features: ['تثبيت الإعلان لمدة 14 يوم', 'ظهور في نتائج البحث المميزة', 'إضافة علامة مميزة للإعلان', 'زيادة مشاهدات الإعلان بنسبة 120%'] },
  { id: 3, name: 'باقة ذهبية', days: 30, price: 200, features: ['تثبيت الإعلان لمدة 30 يوم', 'ظهور في الصفحة الرئيسية', 'ظهور في نتائج البحث المميزة', 'إضافة علامة مميزة للإعلان', 'زيادة مشاهدات الإعلان بنسبة 200%'] },
];

export function PromoteDialog({ open, onOpenChange, ad }: PromoteDialogProps) {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handlePromote = async () => {
    if (!selectedPackage) {
      toast({
        title: "يرجى اختيار باقة",
        description: "يجب اختيار إحدى الباقات للاستمرار",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "تمت ترقية الإعلان بنجاح",
        description: `تم ترقية الإعلان "${ad?.title}" بنجاح`,
      });
      
      onOpenChange(false);
      setSelectedPackage(null);
    } catch (error) {
      console.error('Error promoting ad:', error);
      
      toast({
        title: "فشل ترقية الإعلان",
        description: "حدث خطأ أثناء محاولة ترقية الإعلان، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!ad) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle>ترقية الإعلان</DialogTitle>
          <DialogDescription>
            اختر إحدى الباقات المميزة لتعزيز ظهور إعلانك وزيادة المبيعات
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <h3 className="text-sm font-medium">إعلان: {ad.title}</h3>
          
          <RadioGroup value={selectedPackage?.toString()} onValueChange={(value) => setSelectedPackage(parseInt(value))}>
            <div className="space-y-4">
              {promotionPackages.map(pkg => (
                <div
                  key={pkg.id}
                  className={`relative border rounded-lg p-4 transition-all ${
                    selectedPackage === pkg.id
                      ? 'border-primary bg-primary/5 dark:border-primary/70 dark:bg-primary/10'
                      : 'border-border hover:border-primary/30 dark:border-gray-700 dark:hover:border-gray-600'
                  }`}
                >
                  <RadioGroupItem
                    value={pkg.id.toString()}
                    id={`package-${pkg.id}`}
                    className="absolute top-4 left-4"
                  />
                  <div className="pl-6">
                    <div className="flex justify-between items-center">
                      <Label htmlFor={`package-${pkg.id}`} className="font-bold text-base cursor-pointer">
                        {pkg.name}
                      </Label>
                      <div className="text-lg font-bold">{pkg.price} ر.س</div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-1">مدة الترقية: {pkg.days} يوم</p>
                    
                    <ul className="mt-3 space-y-2">
                      {pkg.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <Check className="h-4 w-4 ml-2 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            إلغاء
          </Button>
          <Button onClick={handlePromote} disabled={isLoading || !selectedPackage}>
            {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
            ترقية الإعلان
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
