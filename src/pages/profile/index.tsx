
import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/auth-context';
import { useUpdateProfile } from '@/hooks/use-api';
import { useToast } from '@/hooks/use-toast';
import { User, Camera, MapPin, Phone, Mail, Calendar } from 'lucide-react';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const updateProfileMutation = useUpdateProfile();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = new FormData();
    submitData.append('first_name', formData.first_name);
    submitData.append('last_name', formData.last_name);
    submitData.append('email', formData.email);
    submitData.append('phone', formData.phone);
    submitData.append('bio', formData.bio);
    
    if (avatarFile) {
      submitData.append('avatar', avatarFile);
    }

    try {
      await updateProfileMutation.mutateAsync(submitData);
      refreshUser();
      setIsEditing(false);
      setAvatarFile(null);
      toast({
        title: 'تم تحديث الملف الشخصي',
        description: 'تم حفظ التغييرات بنجاح',
      });
    } catch (error: any) {
      toast({
        title: 'خطأ في التحديث',
        description: error.message || 'حدث خطأ، يرجى المحاولة مرة أخرى',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
    });
    setAvatarFile(null);
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400">يرجى تسجيل الدخول لعرض الملف الشخصي</p>
          </div>
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Avatar */}
                <div className="relative">
                  <Avatar className="h-32 w-32">
                    <AvatarImage 
                      src={avatarFile ? URL.createObjectURL(avatarFile) : (user.avatar_url || user.avatar || user.image)} 
                      alt={`${user.first_name} ${user.last_name}`} 
                    />
                    <AvatarFallback className="text-2xl">
                      <User className="h-16 w-16" />
                    </AvatarFallback>
                  </Avatar>
                  
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors">
                      <Camera className="h-4 w-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 text-center md:text-right">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {user.first_name} {user.last_name}
                      </h1>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-2 justify-center md:justify-start">
                        <Mail className="h-4 w-4" />
                        <span>{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-2 justify-center md:justify-start">
                          <Phone className="h-4 w-4" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                      {user.created_at && (
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 justify-center md:justify-start">
                          <Calendar className="h-4 w-4" />
                          <span>عضو منذ {new Date(user.created_at).toLocaleDateString('ar-SA')}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-center md:items-end gap-2 mt-4 md:mt-0">
                      {user.verified && (
                        <Badge variant="default" className="bg-green-500">
                          حساب موثق
                        </Badge>
                      )}
                      
                      {!isEditing ? (
                        <Button onClick={() => setIsEditing(true)}>
                          تعديل الملف الشخصي
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button type="submit" form="profile-form" disabled={updateProfileMutation.isPending}>
                            {updateProfileMutation.isPending ? 'جاري الحفظ...' : 'حفظ'}
                          </Button>
                          <Button variant="outline" onClick={handleCancel}>
                            إلغاء
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {user.bio && (
                    <p className="text-gray-700 dark:text-gray-300">
                      {user.bio}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Edit Profile Form */}
          {isEditing && (
            <Card>
              <CardHeader>
                <CardTitle>تعديل المعلومات الشخصية</CardTitle>
              </CardHeader>
              <CardContent>
                <form id="profile-form" onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">الاسم الأول</Label>
                      <Input
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="last_name">الاسم الأخير</Label>
                      <Input
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">نبذة شخصية</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="اكتب نبذة مختصرة عنك..."
                      rows={4}
                    />
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
