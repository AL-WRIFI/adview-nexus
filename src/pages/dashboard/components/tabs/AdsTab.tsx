
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, PlusCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserListings, useDeleteListing } from '@/hooks/use-api';
import { Ad } from '@/types';
import { toast } from '@/hooks/use-toast';

interface AdsTabProps {
  onPromote?: (ad: Ad) => void;
  onDelete?: (ad: Ad) => void;
}

export default function AdsTab({ onPromote, onDelete }: AdsTabProps) {
  const { data: listings, isLoading, error, refetch } = useUserListings();
  
  useEffect(() => {
    // Refetch on mount
    refetch();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">جاري تحميل الإعلانات...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 mb-4">حدث خطأ أثناء تحميل الإعلانات</p>
        <Button onClick={() => refetch()}>إعادة المحاولة</Button>
      </div>
    );
  }

  const handlePromote = (ad: Ad) => {
    if (onPromote) {
      onPromote(ad);
    }
  };
  
  const handleDelete = (ad: Ad) => {
    if (onDelete) {
      onDelete(ad);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">إعلاناتي</h2>
        <Button asChild>
          <Link to="/add-ad">
            <PlusCircle className="ml-2 h-4 w-4" />
            إضافة إعلان جديد
          </Link>
        </Button>
      </div>
      
      {!listings || listings.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-muted-foreground mb-4">ليس لديك إعلانات حالياً</p>
          <Button asChild>
            <Link to="/add-ad">إضافة إعلان جديد</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map((ad) => (
              <div 
                key={ad.id} 
                className="bg-white dark:bg-gray-800 border border-border dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                  {ad.featured && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-sm">
                      مميز
                    </div>
                  )}
                  {ad.images && ad.images.length > 0 ? (
                    <img 
                      src={ad.images[0]} 
                      alt={ad.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                      لا توجد صورة
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-bold line-clamp-1">{ad.title}</h3>
                  <p className="text-primary-brand font-bold mt-1">{ad.price} ر.س</p>
                  <div className="flex items-center mt-2">
                    <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">
                      {ad.category || ad.category_name}
                    </span>
                    <span className="text-xs text-muted-foreground mr-2">
                      {new Date(ad.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" asChild className="flex-1">
                      <Link to={`/edit-ad/${ad.id}`}>
                        تعديل
                      </Link>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 text-yellow-600 border-yellow-600 hover:bg-yellow-50 dark:text-yellow-400 dark:border-yellow-400 dark:hover:bg-yellow-900/20"
                      onClick={() => handlePromote(ad)}
                    >
                      ترقية
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 text-destructive border-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(ad)}
                    >
                      حذف
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {listings.length >= 10 && (
            <div className="mt-6 flex justify-center">
              <Button variant="outline">
                عرض المزيد
                <ChevronLeft className="h-4 w-4 mr-1" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
