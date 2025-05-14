
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Eye, Edit, Trash2, MoreVertical, Loader2, Clock, CheckCircle2, AlertTriangle, XCircle, Sparkles } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useUserListings } from '@/hooks/use-api';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { Ad } from '@/types';

interface AdsTabProps {
  onPromote: (ad: Ad) => void;
  onDelete: (ad: Ad) => void;
}

export default function AdsTab({ onPromote, onDelete }: AdsTabProps) {
  const { data: userAds, isLoading, error } = useUserListings();
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  
  const formatDate = (dateStr: string) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { locale: ar, addSuffix: true });
    } catch (e) {
      return 'غير معروف';
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">نشط</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">قيد المراجعة</Badge>;
      case 'suspended':
        return <Badge variant="destructive">محظور</Badge>;
      case 'expired':
        return <Badge variant="outline" className="text-gray-500 border-gray-500">منتهي</Badge>;
      default:
        return <Badge variant="outline">غير معروف</Badge>;
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'suspended':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'expired':
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold dark:text-white">إعلاناتي</h2>
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
        
        <div className="space-y-4">
          {Array(3).fill(null).map((_, i) => (
            <div key={i} className="border rounded-lg p-4 flex items-center dark:border-gray-700">
              <Skeleton className="h-16 w-16 rounded mr-4" />
              <div className="flex-1">
                <Skeleton className="h-5 w-1/3 mb-2" />
                <Skeleton className="h-4 w-1/4 mb-1" />
                <Skeleton className="h-4 w-1/5" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <div className="p-6 border rounded-lg dark:border-gray-700 dark:text-white">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold">حدث خطأ أثناء تحميل الإعلانات</h3>
          <p className="text-muted-foreground mt-2">يرجى المحاولة مرة أخرى لاحقاً</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

  const ads = userAds || [];

  if (ads.length === 0) {
    return (
      <div className="p-4 text-center">
        <div className="p-8 border rounded-lg my-8 dark:border-gray-700">
          <h3 className="text-xl font-bold dark:text-white">لا توجد إعلانات حتى الآن</h3>
          <p className="text-muted-foreground mt-2 mb-6">لم تقم بإضافة أي إعلانات بعد</p>
          <Button asChild>
            <Link to="/add-ad">إضافة إعلان جديد</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold dark:text-white">إعلاناتي</h2>
        <div className="flex items-center gap-3">
          <Button asChild variant="outline">
            <Link to="/add-ad">إضافة إعلان جديد</Link>
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className={viewMode === 'grid' ? 'bg-muted' : ''}
            onClick={() => setViewMode('grid')}
          >
            <Grid2X2 className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            className={viewMode === 'table' ? 'bg-muted' : ''}
            onClick={() => setViewMode('table')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {viewMode === 'table' ? (
        <div className="overflow-x-auto rounded-lg border dark:border-gray-700">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 dark:bg-gray-800">
                <TableHead>الإعلان</TableHead>
                <TableHead>السعر</TableHead>
                <TableHead className="hidden md:table-cell">الحالة</TableHead>
                <TableHead className="hidden md:table-cell">المشاهدات</TableHead>
                <TableHead className="hidden md:table-cell">تاريخ الإضافة</TableHead>
                <TableHead className="text-left">خيارات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="dark:text-gray-300">
              {ads.map((ad) => (
                <TableRow key={ad.id} className="dark:border-gray-700 dark:hover:bg-gray-700/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img 
                        src={ad.image || ad.images?.[0] || '/placeholder.svg'} 
                        alt={ad.title} 
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div className="truncate max-w-[200px]">
                        <p className="truncate font-medium dark:text-white">{ad.title}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{ad.price ? `${ad.price} ريال` : 'غير محدد'}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {getStatusBadge(ad.status || 'active')}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{ad.views_count || 0}</TableCell>
                  <TableCell className="hidden md:table-cell">{formatDate(ad.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        asChild
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Link to={`/ads/${ad.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        asChild
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Link to={`/edit-ad/${ad.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-muted-foreground hover:text-red-500"
                        onClick={() => onDelete(ad)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-muted-foreground"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="dark:bg-gray-900 dark:border-gray-700">
                          <DropdownMenuItem onClick={() => onPromote(ad)} className="cursor-pointer">
                            <Sparkles className="mr-2 h-4 w-4 text-amber-500" />
                            <span>ترقية الإعلان</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="dark:border-gray-700" />
                          <DropdownMenuItem className="cursor-pointer">
                            تعليق الإعلان مؤقتاً
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            عمل نسخة مكررة
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ads.map((ad) => (
            <Card key={ad.id} className="overflow-hidden border dark:border-gray-700 dark:bg-gray-800">
              <div className="relative">
                <img 
                  src={ad.image || ad.images?.[0] || '/placeholder.svg'} 
                  alt={ad.title} 
                  className="w-full h-40 object-cover"
                />
                <div className="absolute top-2 right-2">
                  {getStatusIcon(ad.status || 'active')}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2 truncate dark:text-white">{ad.title}</h3>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-brand font-bold">{ad.price ? `${ad.price} ريال` : 'غير محدد'}</span>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Eye className="h-3 w-3 mr-1" />
                    <span>{ad.views_count || 0}</span>
                  </div>
                </div>
                <div className="border-t pt-3 flex items-center justify-between dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      asChild
                      className="h-8 w-8 p-0"
                    >
                      <Link to={`/ads/${ad.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      asChild
                      className="h-8 w-8 p-0"
                    >
                      <Link to={`/edit-ad/${ad.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => onDelete(ad)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onPromote(ad)}
                    className="text-xs dark:border-gray-600"
                  >
                    <Sparkles className="h-3 w-3 mr-1 text-amber-500" />
                    ترقية
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
