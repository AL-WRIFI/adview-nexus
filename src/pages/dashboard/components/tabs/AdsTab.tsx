
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Edit, Trash2, Eye, ArrowUpRight, Clipboard, PlusCircle, Loader2 } from 'lucide-react';
import { useUserListings, useDeleteListing } from '@/hooks/use-api';
import { toast } from '@/hooks/use-toast';

interface AdsTabProps {
  setSelectedAd: (id: number | null) => void;
  setDeleteConfirmOpen: (open: boolean) => void;
  setPromoteDialogOpen: (open: boolean) => void;
}

export function AdsTab({ setSelectedAd, setDeleteConfirmOpen, setPromoteDialogOpen }: AdsTabProps) {
  // Fetch user's ads
  const { data: listings, isLoading, error, refetch } = useUserListings();
  const userAds = listings?.data || [];
  
  // Delete ad mutation
  const deleteMutation = useDeleteListing();
  
  const handleDeleteClick = (adId: number) => {
    setSelectedAd(adId);
    setDeleteConfirmOpen(true);
  };
  
  const handlePromoteClick = (adId: number) => {
    setSelectedAd(adId);
    setPromoteDialogOpen(true);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">نشط</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">قيد المراجعة</Badge>;
      case 'sold':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">تم البيع</Badge>;
      case 'deleted':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">محذوف</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">{status}</Badge>;
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>إعلاناتي</CardTitle>
          <CardDescription>إدارة الإعلانات التي قمت بنشرها</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-brand" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>إعلاناتي</CardTitle>
          <CardDescription>إدارة الإعلانات التي قمت بنشرها</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 bg-gray-50 rounded-lg dark:bg-gray-800">
            <p className="text-red-500 mb-4">حدث خطأ أثناء تحميل الإعلانات</p>
            <Button onClick={() => refetch()}>إعادة المحاولة</Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="dark:bg-gray-900 dark:border-gray-800">
      <CardHeader>
        <CardTitle>إعلاناتي</CardTitle>
        <CardDescription>إدارة الإعلانات التي قمت بنشرها</CardDescription>
      </CardHeader>
      <CardContent>
        {userAds.length > 0 ? (
          <div className="rounded-md border dark:border-gray-800">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                    <th className="py-3 px-4 text-right font-medium">الإعلان</th>
                    <th className="py-3 px-4 text-right font-medium hidden md:table-cell">السعر</th>
                    <th className="py-3 px-4 text-right font-medium hidden md:table-cell">المشاهدات</th>
                    <th className="py-3 px-4 text-right font-medium hidden md:table-cell">التاريخ</th>
                    <th className="py-3 px-4 text-right font-medium">الحالة</th>
                    <th className="py-3 px-4 text-center font-medium">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {userAds.map((ad) => (
                    <tr key={ad.id} className="border-b dark:border-gray-800">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded overflow-hidden ml-3 bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                            {ad.image ? (
                              <img 
                                src={ad.image} 
                                alt={ad.title} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                                لا توجد صورة
                              </div>
                            )}
                          </div>
                          <div className="truncate max-w-[150px] md:max-w-none">
                            <div className="font-medium truncate">{ad.title}</div>
                            <div className="text-xs text-muted-foreground truncate md:hidden">
                              {ad.price?.toLocaleString()} ريال
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        {ad.price?.toLocaleString()} ريال
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">{ad.views_count || 0}</td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        {formatDistanceToNow(new Date(ad.created_at), { 
                          addSuffix: true,
                          locale: ar
                        })}
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(ad.status || 'active')}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/ad/${ad.id}`}>
                              <Eye className="h-4 w-4 text-blue-600" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/edit-ad/${ad.id}`}>
                              <Edit className="h-4 w-4 text-amber-600" />
                            </Link>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteClick(ad.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handlePromoteClick(ad.id)}
                          >
                            <ArrowUpRight className="h-4 w-4 text-green-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 dark:bg-gray-800/50 rounded-lg">
            <Clipboard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">لا توجد إعلانات</h3>
            <p className="text-muted-foreground mb-4">لم تقم بإضافة أي إعلانات حتى الآن</p>
            <Button asChild>
              <Link to="/add-ad">
                <PlusCircle className="ml-2 h-4 w-4" />
                إضافة إعلان جديد
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
