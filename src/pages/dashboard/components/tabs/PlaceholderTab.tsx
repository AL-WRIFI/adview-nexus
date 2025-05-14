
import React from 'react';
import { Button } from '@/components/ui/button';

interface PlaceholderTabProps {
  title?: string;
}

export default function PlaceholderTab({ title = 'القسم' }: PlaceholderTabProps) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="text-center py-12 bg-gray-50 dark:bg-dark-surface rounded-lg">
        <p className="text-muted-foreground mb-4">هذا القسم قيد التطوير</p>
        <Button asChild>
          <a href="/">العودة للرئيسية</a>
        </Button>
      </div>
    </div>
  );
}
