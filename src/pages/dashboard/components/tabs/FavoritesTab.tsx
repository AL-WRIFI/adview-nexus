
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function FavoritesTab() {
  // In a real app, fetch favorites from API
  const favorites: any[] = []; // Example empty array
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>المفضلة</CardTitle>
        <CardDescription>الإعلانات المحفوظة في المفضلة</CardDescription>
      </CardHeader>
      <CardContent>
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Favorites would be mapped here */}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <Heart className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">لا توجد إعلانات في المفضلة</h3>
            <p className="text-muted-foreground text-center mt-2 mb-4">
              اضغط على أيقونة القلب في أي إعلان لإضافته إلى المفضلة
            </p>
            <Button asChild>
              <Link to="/">تصفح الإعلانات</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
