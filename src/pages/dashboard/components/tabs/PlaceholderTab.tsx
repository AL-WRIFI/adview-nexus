
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface PlaceholderTabProps {
  tabName: string;
}

export function PlaceholderTab({ tabName }: PlaceholderTabProps) {
  const getTabTitle = () => {
    switch (tabName) {
      case 'favorites':
        return 'المفضلة';
      case 'messages':
        return 'الرسائل';
      case 'notifications':
        return 'الإشعارات';
      case 'settings':
        return 'الإعدادات';
      default:
        return tabName;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{getTabTitle()}</CardTitle>
        <CardDescription>
          هذه الصفحة قيد الإنشاء
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center py-12">
        <div className="max-w-sm mx-auto">
          <h3 className="text-lg font-medium mb-2">نعمل على هذه الميزة حالياً</h3>
          <p className="text-muted-foreground mb-4">سيتم إطلاق هذه الميزة قريباً. تابعنا للحصول على التحديثات.</p>
        </div>
      </CardContent>
    </Card>
  );
}
