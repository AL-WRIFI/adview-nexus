import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';

const formSchema = z.object({
  first_name: z.string().min(2, 'الاسم الأول يجب أن يكون على الأقل حرفين'),
  last_name: z.string().min(2, 'الاسم الأخير يجب أن يكون على الأقل حرفين'),
  username: z.string().min(3, 'اسم المستخدم يجب أن يكون على الأقل 3 حروف'),
  phone: z.string().min(9, 'رقم الهاتف يجب أن يكون على الأقل 9 أرقام'),
  bio: z.string().optional(),
  location_address: z.string().optional(),
});

export default function AccountSettings() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      username: user?.username || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
      location_address: user?.location_address || '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      // Update user logic here
      toast({
        title: "تم تحديث الملف الشخصي بنجاح",
        description: "تم حفظ التغييرات الخاصة بك",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث الملف الشخصي",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>إعدادات الحساب</CardTitle>
          <CardDescription>قم بتحديث معلومات حسابك الشخصي</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar_url || user.image || ''} alt={user.username} />
              <AvatarFallback>
                {user.first_name?.[0]}{user.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{user.first_name} {user.last_name}</h3>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
              {user.email_verified && (
                <Badge variant="secondary" className="mt-1">
                  تم التحقق من البريد الإلكتروني
                </Badge>
              )}
            </div>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">الاسم الأول</Label>
                <Input
                  id="first_name"
                  {...form.register('first_name')}
                  placeholder="أدخل اسمك الأول"
                />
                {form.formState.errors.first_name && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.first_name.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="last_name">الاسم الأخير</Label>
                <Input
                  id="last_name"
                  {...form.register('last_name')}
                  placeholder="أدخل اسمك الأخير"
                />
                {form.formState.errors.last_name && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.last_name.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="username">اسم المستخدم</Label>
              <Input
                id="username"
                {...form.register('username')}
                placeholder="أدخل اسم المستخدم"
              />
              {form.formState.errors.username && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.username.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input
                id="phone"
                {...form.register('phone')}
                placeholder="أدخل رقم هاتفك"
              />
              {form.formState.errors.phone && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="bio">نبذة شخصية</Label>
              <Textarea
                id="bio"
                {...form.register('bio')}
                placeholder="اكتب نبذة عن نفسك"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="location_address">العنوان</Label>
              <Input
                id="location_address"
                {...form.register('location_address')}
                placeholder="أدخل عنوانك"
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
