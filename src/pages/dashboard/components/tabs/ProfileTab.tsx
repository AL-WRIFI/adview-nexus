
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Phone, Mail, MapPin, Edit2, Save, X } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';

export function ProfileTab() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    bio: user?.bio || '',
    city: user?.city || '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "تم الحفظ",
        description: "تم تحديث بياناتك بنجاح",
      });
      
      setIsEditing(false);
      await refreshUser();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث البيانات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      phone: user?.phone || '',
      email: user?.email || '',
      bio: user?.bio || '',
      city: user?.city || '',
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <User className="h-5 w-5" />
              الملف الشخصي
            </CardTitle>
            {!isEditing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="border-border text-card-foreground hover:bg-accent"
              >
                <Edit2 className="h-4 w-4 ml-2" />
                تعديل
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  className="border-border text-card-foreground hover:bg-accent"
                >
                  <X className="h-4 w-4 ml-2" />
                  إلغاء
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-brand hover:bg-brand/90 text-white"
                >
                  <Save className="h-4 w-4 ml-2" />
                  {loading ? 'جاري الحفظ...' : 'حفظ'}
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Picture */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-muted rounded-full overflow-hidden">
              {user.avatar_url ? (
                <img 
                  src={user.avatar_url} 
                  alt="صورة الملف الشخصي"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground">
                {user.first_name} {user.last_name}
              </h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name" className="text-card-foreground">الاسم الأول</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                disabled={!isEditing}
                className="bg-background border-border text-foreground disabled:bg-muted"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="last_name" className="text-card-foreground">الاسم الأخير</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                disabled={!isEditing}
                className="bg-background border-border text-foreground disabled:bg-muted"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-card-foreground">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={!isEditing}
                className="bg-background border-border text-foreground disabled:bg-muted"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-card-foreground">رقم الهاتف</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={!isEditing}
                className="bg-background border-border text-foreground disabled:bg-muted"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="city" className="text-card-foreground">المدينة</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                disabled={!isEditing}
                className="bg-background border-border text-foreground disabled:bg-muted"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-card-foreground">نبذة عني</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              disabled={!isEditing}
              rows={3}
              className="bg-background border-border text-foreground disabled:bg-muted"
              placeholder="اكتب نبذة قصيرة عنك..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Account Stats */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">إحصائيات الحساب</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-accent/20 rounded-lg border border-border">
              <div className="text-2xl font-bold text-brand">0</div>
              <div className="text-sm text-muted-foreground">إعلان نشط</div>
            </div>
            <div className="text-center p-4 bg-accent/20 rounded-lg border border-border">
              <div className="text-2xl font-bold text-brand">0</div>
              <div className="text-sm text-muted-foreground">مشاهدة</div>
            </div>
            <div className="text-center p-4 bg-accent/20 rounded-lg border border-border">
              <div className="text-2xl font-bold text-brand">0</div>
              <div className="text-sm text-muted-foreground">إعجاب</div>
            </div>
            <div className="text-center p-4 bg-accent/20 rounded-lg border border-border">
              <div className="text-2xl font-bold text-brand">{user.wallet_balance || 0}</div>
              <div className="text-sm text-muted-foreground">رصيد المحفظة</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
