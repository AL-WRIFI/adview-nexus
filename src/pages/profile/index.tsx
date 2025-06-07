
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { useCurrentUser, useUpdateProfile } from '@/hooks/use-api';
import { User, Camera, Phone, Mail, MapPin, Calendar, Shield } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const formSchema = z.object({
  first_name: z.string().min(2, 'الاسم الأول يجب أن يكون على الأقل حرفين'),
  last_name: z.string().min(2, 'الاسم الأخير يجب أن يكون على الأقل حرفين'),
  phone: z.string().optional(),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  city: z.string().optional(),
  bio: z.string().optional(),
});

export default function ProfilePage() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  const { data: currentUserResponse, isLoading } = useCurrentUser();
  const updateProfileMutation = useUpdateProfile();

  // Extract user data from API response
  const currentUser = currentUserResponse?.data;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: currentUser?.first_name || "",
      last_name: currentUser?.last_name || "",
      phone: currentUser?.phone || "",
      email: currentUser?.email || "",
      city: currentUser?.city || "",
      bio: currentUser?.bio || "",
    },
  });

  useEffect(() => {
    if (currentUser) {
      form.reset({
        first_name: currentUser.first_name || "",
        last_name: currentUser.last_name || "",
        phone: currentUser.phone || "",
        email: currentUser.email || "",
        city: currentUser.city || "",
        bio: currentUser.bio || "",
      });
    }
  }, [currentUser, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await updateProfileMutation.mutateAsync(values);
      setIsEditing(false);
      toast({
        title: "تم تحديث الملف الشخصي",
        description: "تم حفظ التغييرات بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث الملف الشخصي",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">جاري التحميل...</div>
          </div>
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">لم يتم العثور على بيانات المستخدم</div>
          </div>
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 pb-20 md:pb-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Profile Header */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="relative">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={currentUser.avatar || currentUser.image} />
                    <AvatarFallback className="text-2xl">
                      {currentUser.name || `${currentUser.first_name?.[0]}${currentUser.last_name?.[0]}`}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute bottom-0 right-0 rounded-full"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex-1 text-center md:text-right">
                  <h1 className="text-2xl font-bold">
                    {currentUser.name || `${currentUser.first_name} ${currentUser.last_name}`}
                  </h1>
                  {currentUser.bio && (
                    <p className="text-muted-foreground mt-2">{currentUser.bio}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
                    {currentUser.email && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>{currentUser.email}</span>
                      </div>
                    )}
                    {currentUser.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{currentUser.phone}</span>
                      </div>
                    )}
                    {currentUser.city && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{currentUser.city}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 mt-4 justify-center md:justify-start">
                    {currentUser.verified && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        موثق
                      </Badge>
                    )}
                    {currentUser.created_at && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        عضو منذ {new Date(currentUser.created_at).getFullYear()}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)}>
                      تعديل الملف الشخصي
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      إلغاء
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Edit Form */}
          {isEditing && (
            <Card>
              <CardHeader>
                <CardTitle>تعديل المعلومات الشخصية</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="first_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>الاسم الأول</FormLabel>
                            <FormControl>
                              <Input placeholder="الاسم الأول" {...field} />
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
                              <Input placeholder="الاسم الأخير" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>البريد الإلكتروني</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="example@domain.com" {...field} />
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
                              <Input placeholder="+966xxxxxxxxx" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>المدينة</FormLabel>
                          <FormControl>
                            <Input placeholder="الرياض" {...field} />
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
                              placeholder="اكتب نبذة مختصرة عنك..."
                              className="resize-none"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            نبذة مختصرة تظهر في ملفك الشخصي
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-4">
                      <Button type="submit" disabled={updateProfileMutation.isPending}>
                        {updateProfileMutation.isPending ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                        إلغاء
                      </Button>
                    </div>
                  </form>
                </Form>
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
