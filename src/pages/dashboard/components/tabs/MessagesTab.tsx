
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

export function MessagesTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>الرسائل</CardTitle>
        <CardDescription>إدارة الرسائل والمحادثات</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">لا توجد رسائل</h3>
        <p className="text-muted-foreground text-center mt-2 mb-4">
          لا توجد رسائل في صندوق الوارد حالياً
        </p>
        <Button>إرسال رسالة جديدة</Button>
      </CardContent>
    </Card>
  );
}
