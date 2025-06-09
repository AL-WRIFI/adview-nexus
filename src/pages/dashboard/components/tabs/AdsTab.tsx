
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUserListings } from '@/hooks/use-api';
import { 
  Eye, 
  Heart, 
  MessageCircle, 
  Edit, 
  Trash2, 
  Star,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

interface AdsTabProps {
  setSelectedAd: (id: number) => void;
  setPromoteDialogOpen: (open: boolean) => void;
}

export function AdsTab({ setSelectedAd, setPromoteDialogOpen }: AdsTabProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'sold'>('all');
  
  const { data: userListingsResponse, isLoading, error } = useUserListings();

  // Handle both array and paginated response structures
  const userListings = Array.isArray(userListingsResponse) 
    ? userListingsResponse 
    : userListingsResponse?.data || [];

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-24 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <p className="text-muted-foreground">حدث خطأ في تحميل الإعلانات</p>
        </div>
      </Card>
    );
  }

  const filteredListings = userListings.filter(listing => {
    if (filter === 'all') return true;
    return listing.status === filter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'inactive':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'sold':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'نشط';
      case 'inactive':
        return 'غير نشط';
      case 'sold':
        return 'مباع';
      default:
        return 'غير محدد';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إعلاناتي</h2>
        <Link to="/add-ad">
          <Button>إضافة إعلان جديد</Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b">
        {[
          { key: 'all', label: 'الكل' },
          { key: 'active', label: 'نشط' },
          { key: 'inactive', label: 'غير نشط' },
          { key: 'sold', label: 'مباع' }
        ].map(({ key, label }) => (
          <Button
            key={key}
            variant={filter === key ? 'default' : 'ghost'}
            onClick={() => setFilter(key as any)}
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Listings */}
      <div className="space-y-4">
        {filteredListings.length === 0 ? (
          <Card className="p-6">
            <div className="text-center">
              <p className="text-muted-foreground">لا توجد إعلانات</p>
              <Link to="/add-ad">
                <Button className="mt-4">إضافة إعلان جديد</Button>
              </Link>
            </div>
          </Card>
        ) : (
          filteredListings.map((listing) => (
            <Card key={listing.id} className="p-4">
              <div className="flex gap-4">
                {/* Image */}
                <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                  {listing.main_image_url ? (
                    <img
                      src={listing.main_image_url}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      لا توجد صورة
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg truncate">{listing.title}</h3>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(listing.status)}
                      <span className="text-sm">{getStatusText(listing.status)}</span>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                    {listing.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{listing.views_count || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span>{listing.favorites_count || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>0</span>
                    </div>
                    <div className="mr-auto">
                      {formatDistanceToNow(new Date(listing.created_at), { 
                        addSuffix: true,
                        locale: ar 
                      })}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-brand">
                        {listing.price.toLocaleString()} ريال
                      </span>
                      {listing.featured && (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          <Star className="w-3 h-3 ml-1" />
                          مميز
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {listing.status === 'active' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedAd(listing.id);
                            setPromoteDialogOpen(true);
                          }}
                        >
                          <TrendingUp className="h-4 w-4 ml-1" />
                          ترقية
                        </Button>
                      )}
                      
                      <Link to={`/edit-ad/${listing.id}`}>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 ml-1" />
                          تعديل
                        </Button>
                      </Link>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => setSelectedAd(listing.id)}
                      >
                        <Trash2 className="h-4 w-4 ml-1" />
                        حذف
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
