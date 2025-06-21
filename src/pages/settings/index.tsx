
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/auth-context';
import { useAccountSettings, useUpdateAccountSettings, useChangePassword } from '@/hooks/use-verification';
import { useToast } from '@/hooks/use-toast';
import { User, Settings, Shield, Bell, Key, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const { data: settings } = useAccountSettings();
  const updateSettings = useUpdateAccountSettings();
  const changePassword = useChangePassword();
  const { toast } = useToast();
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  });

  const handlePasswordChange = async () => {
    if (passwordForm.new_password !== passwordForm.new_password_confirmation) {
      toast({
        variant: 'destructive',
        title: 'خطأ',
        description: 'كلمة المرور الجديدة وتأكيدها غير متطابقتين'
      });
      return;
    }

    if (passwordForm.new_password.length < 8) {
      toast({
        variant: 'destructive',
        title: 'خطأ',
        description: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'
      });
      return;
    }

    changePassword.mutate(passwordForm, {
      onSuccess: () => {
        setPasswordForm({
          current_password: '',
          new_password: '',
          new_password_confirmation: ''
        });
      }
    });
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">الإعدادات</h1>
        <p className="text-muted-foreground">إدارة حسابك وتفضيلاتك</p>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="account" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            الحساب
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            الأمان
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            الإشعارات
          </TabsTrigger>
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            عام
          </TabsTrigger>
        </TabsList>

        {/* Account Tab */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>معلومات الحساب</CardTitle>
              <CardDescription>
                معلومات حسابك الأساسية
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>الاسم الأول</Label>
                  <Input value={user?.first_name || ''} disabled />
                </div>
                <div>
                  <Label>الاسم الأخير</Label>
                  <Input value={user?.last_name || ''} disabled />
                </div>
              </div>
              
              <div>
                <Label>البريد الإلكتروني</Label>
                <div className="flex items-center gap-2">
                  <Input value={user?.email || ''} disabled className="flex-1" />
                  {user?.email_verified ? (
                    <Badge variant="secondary">مُفعل</Badge>
                  ) : (
                    <Badge variant="destructive">غير مُفعل</Badge>
                  )}
                </div>
              </div>
              
              <div>
                <Label>رقم الهاتف</Label>
                <Input value={user?.phone || ''} disabled />
              </div>
              
              <p className="text-sm text-muted-foreground">
                لتعديل هذه المعلومات، يرجى الذهاب إلى صفحة الملف الشخصي.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <div className="space-y-6">
            {/* Change Password */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  تغيير كلمة المرور
                </CardTitle>
                <CardDescription>
                  تحديث كلمة مرورك لتأمين حسابك
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="current_password">كلمة المرور الحالية</Label>
                  <div className="relative">
                    <Input
                      id="current_password"
                      type={showPasswords.current ? 'text' : 'password'}
                      value={passwordForm.current_password}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, current_password: e.target.value }))}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute left-0 top-0 h-full"
                      onClick={() => togglePasswordVisibility('current')}
                    >
                      {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="new_password">كلمة المرور الجديدة</Label>
                  <div className="relative">
                    <Input
                      id="new_password"
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwordForm.new_password}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, new_password: e.target.value }))}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute left-0 top-0 h-full"
                      onClick={() => togglePasswordVisibility('new')}
                    >
                      {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="confirm_password">تأكيد كلمة المرور</Label>
                  <div className="relative">
                    <Input
                      id="confirm_password"
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwordForm.new_password_confirmation}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, new_password_confirmation: e.target.value }))}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute left-0 top-0 h-full"
                      onClick={() => togglePasswordVisibility('confirm')}
                    >
                      {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <Button 
                  onClick={handlePasswordChange}
                  disabled={changePassword.isPending || !passwordForm.current_password || !passwordForm.new_password}
                >
                  {changePassword.isPending ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      جاري التحديث...
                    </>
                  ) : (
                    'تحديث كلمة المرور'
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card>
              <CardHeader>
                <CardTitle>إعدادات الخصوصية</CardTitle>
                <CardDescription>
                  تحكم في خصوصيتك ومن يمكنه رؤية معلوماتك
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {settings && (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>إظهار رقم الهاتف للمشترين</Label>
                        <p className="text-sm text-muted-foreground">
                          السماح للمشترين برؤية رقم هاتفك في الإعلانات
                        </p>
                      </div>
                      <Switch
                        checked={settings.security.show_phone_to_buyers}
                        onCheckedChange={(value) => updateSettings.mutate({ show_phone_to_buyers: value })}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>تتبع الموقع</Label>
                        <p className="text-sm text-muted-foreground">
                          السماح بتتبع موقعك لعرض إعلانات أقرب إليك
                        </p>
                      </div>
                      <Switch
                        checked={settings.security.enable_location_tracking}
                        onCheckedChange={(value) => updateSettings.mutate({ enable_location_tracking: value })}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات الإشعارات</CardTitle>
              <CardDescription>
                اختر الإشعارات التي تريد استلامها
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {settings && (
                <>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="flex items-center gap-2">
                        تفعيل جميع الإشعارات
                        <Badge variant="secondary">رئيسي</Badge>
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        تفعيل أو إلغاء جميع الإشعارات دفعة واحدة
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.enable_all_notifications}
                      onCheckedChange={(value) => updateSettings.mutate({ enable_all_notifications: value })}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>إشعارات الرسائل الجديدة</Label>
                      <p className="text-sm text-muted-foreground">
                        استلام إشعار عند وصول رسالة جديدة
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.new_message_notifications}
                      onCheckedChange={(value) => updateSettings.mutate({ new_message_notifications: value })}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>إشعارات التعليقات</Label>
                      <p className="text-sm text-muted-foreground">
                        استلام إشعار عند التعليق على إعلاناتك
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.listing_comment_notifications}
                      onCheckedChange={(value) => updateSettings.mutate({ listing_comment_notifications: value })}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* General Tab */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>الإعدادات العامة</CardTitle>
              <CardDescription>
                تخصيص تجربتك في استخدام التطبيق
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {settings && (
                <>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>المظهر</Label>
                      <p className="text-sm text-muted-foreground">
                        اختر مظهر التطبيق
                      </p>
                    </div>
                    <Select 
                      value={settings.general.theme}
                      onValueChange={(value: 'light' | 'dark') => updateSettings.mutate({ theme: value })}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">فاتح</SelectItem>
                        <SelectItem value="dark">داكن</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>إظهار الإعلانات القريبة</Label>
                      <p className="text-sm text-muted-foreground">
                        عرض الإعلانات القريبة من موقعك أولاً
                      </p>
                    </div>
                    <Switch
                      checked={settings.general.show_nearby_listings}
                      onCheckedChange={(value) => updateSettings.mutate({ show_nearby_listings: value })}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>تخزين الصور مؤقتاً</Label>
                      <p className="text-sm text-muted-foreground">
                        تحسين سرعة التحميل بحفظ الصور مؤقتاً
                      </p>
                    </div>
                    <Switch
                      checked={settings.general.enable_image_caching}
                      onCheckedChange={(value) => updateSettings.mutate({ enable_image_caching: value })}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
