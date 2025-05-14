
import React from 'react';
import { Button } from '@/components/ui/button';

export default function NotificationsTab() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">الإشعارات</h2>
      <div className="text-center py-12 bg-gray-50 dark:bg-dark-surface rounded-lg">
        <p className="text-muted-foreground mb-4">لا توجد إشعارات جديدة</p>
        <Button asChild>
          <a href="/">العودة للرئيسية</a>
        </Button>
      </div>
    </div>
  );
}
