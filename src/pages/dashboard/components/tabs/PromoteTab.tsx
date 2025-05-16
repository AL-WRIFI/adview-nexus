
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Define feature packages
const FEATURED_PACKAGES = [
  {
    id: 1,
    title: "باقة أساسية",
    price: 50,
    features: [
      "ظهور مميز لمدة 7 أيام",
      "أولوية في نتائج البحث",
      "شارة مميزة على الإعلان",
    ],
    recommended: false,
  },
  {
    id: 2,
    title: "باقة احترافية",
    price: 100,
    features: [
      "ظهور مميز لمدة 30 يوم",
      "أولوية قصوى في نتائج البحث",
      "شارة مميزة على الإعلان",
      "ظهور في قسم الإعلانات المميزة",
    ],
    recommended: true,
  },
  {
    id: 3,
    title: "باقة بريميوم",
    price: 200,
    features: [
      "ظهور مميز لمدة 90 يوم",
      "أولوية قصوى في نتائج البحث",
      "شارة مميزة على الإعلان",
      "ظهور في قسم الإعلانات المميزة",
      "تجديد تلقائي للإعلان",
      "دعم فني خاص",
    ],
    recommended: false,
  },
];

export function PromoteTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>ترقية الإعلانات</CardTitle>
        <CardDescription>اختر باقة ترقية لزيادة ظهور إعلاناتك وجذب المزيد من المشترين</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURED_PACKAGES.map((pkg) => (
            <div 
              key={pkg.id}
              className={`border rounded-md p-6 hover:shadow-md transition-shadow ${
                pkg.recommended ? 'border-brand bg-brand/5' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg">{pkg.title}</h3>
                {pkg.recommended && (
                  <Badge className="bg-brand">موصى به</Badge>
                )}
              </div>
              
              <p className="text-3xl font-bold my-4">{pkg.price} <span className="text-sm font-normal">ريال</span></p>
              
              <ul className="my-6 space-y-2">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <Check className="h-4 w-4 mr-2 text-green-600" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className={`w-full ${pkg.recommended ? '' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
                variant={pkg.recommended ? "default" : "outline"}
              >
                <ArrowUpRight className="h-4 w-4 mr-2" />
                اختر الباقة
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
