
import React from 'react';
import { Button } from '@/components/ui/button';

export default function PromoteTab() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">ترقية الإعلانات</h2>
      <div className="text-center py-12 bg-gray-50 dark:bg-dark-surface rounded-lg">
        <p className="text-muted-foreground mb-4">قم باختيار إعلان للترقية من صفحة الإعلانات</p>
        <Button asChild>
          <a href="/dashboard">العودة للوحة التحكم</a>
        </Button>
      </div>
    </div>
  );
}
