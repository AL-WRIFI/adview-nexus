
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, Camera, MapPin, Phone, Mail, Edit3, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { useAuth } from '@/context/auth-context';
import { useUpdateProfile } from '@/hooks/use-api';
import { toast } from 'sonner';
import { Dropzone } from '@/components/dropzone';

const profileSchema = z.object({
  first_name: z.string().min(2, 'الاسم الأول يجب أن يكون أكثر من حرفين'),
  last_name: z.string().min(2, 'الاسم الأخير يجب أن يكون أكثر من حرفين'),
  phone: z.string().optional(),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  bio: z.string().optional(),
  city: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, isLoading: authLoading } = useAuth();
  const updateProfileMutation = useUpdateProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFiles, setAvatarFiles] = useState<File[]>([]);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      phone: '',
      email: '',
      bio: '',
      city: '',
    },
  });

  // Update form values when user data is loaded
  useEffect(() => {
    if (user) {
      form.reset({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        email: user.email || '',
        bio: user.bio || '',
        city: user.city || '',
      });
    }
  }, [user, form]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const formData = new FormData();
      
      // Add form fields
      Object.entries(data).forEach(([key, value]) => {
        if (value) {
          formData.append(key, value);
        }
      });
      
      // Add avatar if selected
      if (avatarFiles.length > 0) {
        formData.append('avatar', avatarFiles[0]);
      }

      await updateProfileMutation.mutateAsync(formData);
      setIsEditing(false);
      setAvatarFiles([]);
      setPreviewAvatar(null);
      toast.success('تم تحديث الملف الشخصي بنجاح');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('حدث خطأ أثناء تحديث الملف الشخصي');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setAvatarFiles([]);
    setPreviewAvatar(null);
    if (user) {
      form.reset({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        email: user.email || '',
        bio: user.bio || '',
        city: user.city || '',
      });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 pb-20 md:pb-0">
          <div className="container px-4 mx-auto py-6">
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand mx-auto mb-4"></div>
                <p>جاري التحميل...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 pb-20 md:pb-0">
          <div className="container px-4 mx-auto py-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">يجب تسجيل الدخول لعرض الملف الشخصي</p>
              <Button asChild>
                <a href="/auth/login">تسجيل الدخول</a>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 pb-20 md:pb-0">
        <div className="container px-4 mx-auto py-6">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <div className="relative mx-auto w-24 h-24 mb-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                    {previewAvatar || user.avatar || user.image ? (
                      <img 
                        src={previewAvatar || user.avatar || user.image} 
                        alt={user.first_name || user.name || 'المستخدم'} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-muted-foreground" />
                    )}
                  </div>
                  {isEditing && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>
                
                <CardTitle className="text-xl">
                  {user.first_name && user.last_name 
                    ? `${user.first_name} ${user.last_name}`
                    : user.name || 'المستخدم'
                  }
                </CardTitle>
                
                <div className="flex justify-center gap-2 mt-4">
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} variant="outline">
                      <Edit3 className="w-4 h-4 ml-2" />
                      تعديل الملف الشخصي
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                        onClick={form.handleSubmit(onSubmit)}
                        disabled={updateProfileMutation.isPending}
                      >
                        <Save className="w-4 h-4 ml-2" />
                        {updateProfileMutation.isPending ? 'جاري الحفظ...' : 'حفظ'}
                      </Button>
                      <Button onClick={handleCancel} variant="outline">
                        <X className="w-4 h-4 ml-2" />
                        إلغاء
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {isEditing && (
                      <div>
                        <FormLabel>صورة الملف الشخصي</FormLabel>
                        <Dropzone
                          value={avatarFiles}
                          onChange={setAvatarFiles}
                          onImageChange={setPreviewAvatar}
                          imageUrl={previewAvatar}
                          multiple={false}
                          accept="image/*"
                        />
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="first_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>الاسم الأول</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={!isEditing} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="last_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>الاسم الأخير</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={!isEditing} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>البريد الإلكتروني</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input {...field} disabled={!isEditing} className="pr-10" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>رقم الهاتف</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input {...field} disabled={!isEditing} className="pr-10" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>المدينة</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input {...field} disabled={!isEditing} className="pr-10" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>نبذة شخصية</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              disabled={!isEditing}
                              placeholder="اكتب نبذة قصيرة عن نفسك..."
                              rows={4}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
      <MobileNav />
    </div>
  );
}
