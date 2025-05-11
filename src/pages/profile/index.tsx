
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, Settings, Key, AlertTriangle, Check, Camera, X, Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCurrentUser, useUpdateProfile } from '@/hooks/use-api';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  
  const { data: user, isLoading: isLoadingUser } = useCurrentUser();
  const updateProfile = useUpdateProfile();
  
  // Profile state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Set initial values when user data is loaded
  useState(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone);
      setEmail(user.email || '');
      setCity(user.city);
      setBio(user.bio || '');
    }
  });
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatar(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeAvatarPreview = () => {
    setAvatar(null);
    setAvatarPreview(null);
  };
  
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !phone || !city) {
      toast({
        variant: "destructive",
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
      });
      return;
    }
    
    try {
      // This would include logic to upload avatar first, then update profile
      // For now, we'll just simulate updating profile
      updateProfile.mutate({
        name,
        phone,
        city,
        bio,
      });
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ في تحديث الملف الشخصي",
        description: "حدث خطأ أثناء تحديث بياناتك الشخصية. يرجى المحاولة مرة أخرى.",
      });
    }
  };
  
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        variant: "destructive",
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع حقول كلمة المرور",
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "كلمات المرور غير متطابقة",
        description: "كلمة المرور الجديدة وتأكيدها غير متطابقين",
      });
      return;
    }
    
    // In a real app, this would call an API
    setTimeout(() => {
      toast({
        title: "تم تغيير كلمة المرور",
        description: "تم تغيير كلمة المرور الخاصة بك بنجاح",
      });
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 1000);
  };
  
  if (isLoadingUser) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header isLoggedIn={true} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-brand mb-4" />
            <p className="text-muted-foreground">جاري تحميل الملف الشخصي...</p>
          </div>
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} />
      
      <main className="flex-1 pb-20 md:pb-0">
        <div className="bg-gray-50 border-b border-border">
          <div className="container px-4 mx-auto py-6">
            <h1 className="text-2xl font-bold">الملف الشخصي</h1>
            <p className="text-muted-foreground">إدارة معلوماتك الشخصية وإعدادات الحساب</p>
          </div>
        </div>
        
        <div className="container px-4 mx-auto py-6">
          <div className="max-w-4xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="profile" className="flex items-center">
                  <User className="ml-2 h-4 w-4" />
                  <span className="hidden md:inline">الملف الشخصي</span>
                  <span className="md:hidden">الملف</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center">
                  <Key className="ml-2 h-4 w-4" />
                  <span className="hidden md:inline">الأمان والخصوصية</span>
                  <span className="md:hidden">الأمان</span>
                </TabsTrigger>
                <TabsTrigger value="preferences" className="flex items-center">
                  <Settings className="ml-2 h-4 w-4" />
                  <span className="hidden md:inline">تفضيلات الحساب</span>
                  <span className="md:hidden">التفضيلات</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>المعلومات الشخصية</CardTitle>
                    <CardDescription>
                      قم بتحديث معلوماتك الشخصية وصورة ملفك الشخصي
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={handleProfileSubmit}>
                    <CardContent className="space-y-6">
                      <div className="flex flex-col items-center justify-center md:flex-row md:items-start md:justify-start space-y-4 md:space-y-0 md:space-x-4 md:space-x-reverse">
                        <div className="relative">
                          <Avatar className="w-24 h-24 border-2 border-border">
                            <AvatarImage src={avatarPreview || user?.avatar} alt={user?.name} />
                            <AvatarFallback className="text-2xl">
                              {user?.name?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          
                          <label 
                            htmlFor="avatar-upload" 
                            className="absolute bottom-0 right-0 bg-brand text-white rounded-full p-1.5 cursor-pointer hover:bg-brand/90 transition-colors"
                          >
                            <Camera className="h-4 w-4" />
                            <input 
                              type="file" 
                              id="avatar-upload" 
                              accept="image/*"
                              className="hidden"
                              onChange={handleAvatarChange}
                            />
                          </label>
                          
                          {avatarPreview && (
                            <button
                              type="button"
                              onClick={removeAvatarPreview}
                              className="absolute -top-1 -left-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="space-y-2">
                            <Label htmlFor="name">الاسم الكامل</Label>
                            <Input
                              id="name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="أدخل اسمك الكامل"
                            />
                          </div>
                          
                          <div className="mt-4">
                            <Label htmlFor="bio">نبذة عني</Label>
                            <Textarea
                              id="bio"
                              value={bio}
                              onChange={(e) => setBio(e.target.value)}
                              placeholder="اكتب نبذة مختصرة عنك"
                              className="h-24 resize-none"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">رقم الهاتف</Label>
                          <Input
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="أدخل رقم الهاتف"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">البريد الإلكتروني</Label>
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="أدخل البريد الإلكتروني (اختياري)"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="city">المدينة</Label>
                          <Input
                            id="city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="أدخل المدينة"
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/dashboard')}
                      >
                        إلغاء
                      </Button>
                      <Button type="submit" disabled={updateProfile.isPending}>
                        {updateProfile.isPending ? (
                          <>
                            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                            جاري الحفظ...
                          </>
                        ) : (
                          <>
                            <Check className="ml-2 h-4 w-4" />
                            حفظ التغييرات
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
              
              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>تغيير كلمة المرور</CardTitle>
                    <CardDescription>
                      قم بتغيير كلمة المرور الخاصة بك بشكل دوري للحفاظ على أمان حسابك
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={handlePasswordSubmit}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">كلمة المرور الحالية</Label>
                        <Input
                          id="current-password"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="أدخل كلمة المرور الحالية"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="new-password">كلمة المرور الجديدة</Label>
                        <Input
                          id="new-password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="أدخل كلمة المرور الجديدة"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">تأكيد كلمة المرور</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="أعد إدخال كلمة المرور الجديدة"
                        />
                      </div>
                      
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-4">
                        <div className="flex">
                          <AlertTriangle className="h-5 w-5 text-yellow-500 ml-2 flex-shrink-0" />
                          <div className="text-sm text-yellow-700">
                            <p className="font-semibold">نصائح لكلمة مرور قوية:</p>
                            <ul className="list-disc pr-5 mt-1 space-y-1">
                              <li>استخدم 8 أحرف على الأقل</li>
                              <li>استخدم مزيجًا من الأحرف الكبيرة والصغيرة</li>
                              <li>أضف أرقامًا ورموزًا</li>
                              <li>تجنب استخدام معلومات شخصية</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" className="ml-auto">
                        <Key className="ml-2 h-4 w-4" />
                        تغيير كلمة المرور
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>إلغاء الحساب</CardTitle>
                    <CardDescription>
                      إذا قمت بإلغاء حسابك، سيتم حذف جميع بياناتك وإعلاناتك بشكل نهائي
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-red-50 border border-red-200 rounded p-4">
                      <p className="text-red-700 font-medium mb-2">تحذير: هذا الإجراء لا يمكن التراجع عنه</p>
                      <p className="text-sm text-red-600">
                        سيؤدي إلغاء حسابك إلى حذف جميع بياناتك الشخصية وإعلاناتك ومحادثاتك بشكل نهائي.
                        لن تتمكن من استعادة هذه البيانات لاحقًا.
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button variant="destructive">
                      إلغاء الحساب
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="preferences">
                <Card>
                  <CardHeader>
                    <CardTitle>تفضيلات الإشعارات</CardTitle>
                    <CardDescription>
                      تحكم في الإشعارات التي ترغب في تلقيها
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">الرسائل الجديدة</p>
                          <p className="text-sm text-muted-foreground">
                            إشعارات عندما تتلقى رسائل جديدة
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <input type="checkbox" className="toggle" defaultChecked />
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">التعليقات</p>
                            <p className="text-sm text-muted-foreground">
                              إشعارات عندما يعلق شخص ما على إعلاناتك
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <input type="checkbox" className="toggle" defaultChecked />
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">الإعلانات المميزة</p>
                            <p className="text-sm text-muted-foreground">
                              إشعارات حول الإعلانات المميزة
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <input type="checkbox" className="toggle" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">تحديثات التطبيق</p>
                            <p className="text-sm text-muted-foreground">
                              إشعارات حول التحديثات والميزات الجديدة
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <input type="checkbox" className="toggle" defaultChecked />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="ml-auto">
                      حفظ التفضيلات
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>البيانات والخصوصية</CardTitle>
                    <CardDescription>
                      تحكم في كيفية استخدام بياناتك
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">السماح بالتحليلات</p>
                          <p className="text-sm text-muted-foreground">
                            السماح لنا بجمع بيانات مجهولة المصدر لتحسين الخدمة
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <input type="checkbox" className="toggle" defaultChecked />
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">الإعلانات المخصصة</p>
                            <p className="text-sm text-muted-foreground">
                              تخصيص الإعلانات بناءً على اهتماماتك
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <input type="checkbox" className="toggle" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="ml-auto">
                      حفظ التفضيلات
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
      <MobileNav />
    </div>
  );
}
