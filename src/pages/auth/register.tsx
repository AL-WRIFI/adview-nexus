
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { listingsAPI } from '@/services/apis';
import { useAuth } from '@/context/auth-context';

const formSchema = z.object({
  first_name: z.string().min(2, {
    message: "الاسم الأول يجب أن يكون على الأقل حرفين.",
  }),
  last_name: z.string().min(2, {
    message: "الاسم الأخير يجب أن يكون على الأقل حرفين.",
  }),
  username: z.string().min(3, {
    message: "اسم المستخدم يجب أن يكون على الأقل 3 حروف.",
  }),
  email: z.string().email({
    message: "الرجاء إدخال بريد إلكتروني صحيح.",
  }),
  phone: z.string().min(9, {
    message: "رقم الهاتف يجب أن يكون على الأقل 9 أرقام.",
  }),
  password: z.string().min(6, {
    message: "كلمة المرور يجب أن تكون على الأقل 6 حروف.",
  }),
});

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (formData: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const response = await listingsAPI.post('/auth/register', formData);

      if (response.success) {
        console.log('Registration successful:', response);
        
        // Check if email verification is required
        if (response.data?.email_verification_required || response.data?.email_sent) {
          // Store user data temporarily for verification
          localStorage.setItem('pendingUser', JSON.stringify({
            email: formData.email,
            token_expires_in_minutes: response.data?.token_expires_in_minutes || 10,
            remaining_attempts: response.data?.remaining_attempts || 5
          }));
          
          // Redirect to verification page
          navigate('/auth/verify-email', { 
            state: { 
              email: formData.email,
              fromRegistration: true 
            } 
          });
        } else {
          // Direct login if no verification needed
          if (response.data?.token && response.data?.user) {
            login(response.data.token, response.data.user);
            navigate('/', { replace: true });
          }
        }
      } else {
        toast({
          title: "فشل التسجيل",
          description: response.message || "حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "فشل التسجيل",
        description: "حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container relative h-[100vh] flex items-center justify-center">
      <Link
        to="/auth/login"
        className="absolute left-4 top-4 md:left-8 md:top-8 rounded-md border bg-popover text-popover-foreground shadow-sm transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed data-[state=open]:bg-secondary/80 dark:border-muted/80 dark:bg-secondary dark:text-secondary-foreground"
      >
        <Button variant="outline">تسجيل الدخول</Button>
      </Link>
      <div className="lg:p-8">
        <Card className="w-[90%] max-w-[500px] shadow-lg dark:bg-dark-card">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">إنشاء حساب جديد</CardTitle>
            <CardDescription className="text-center">أدخل معلوماتك لإنشاء حساب</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first_name">الاسم الأول</Label>
              <Input id="first_name" placeholder="أدخل اسمك الأول" type="text" {...register("first_name")} />
              {errors.first_name && (
                <p className="text-sm text-red-500">{errors.first_name.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last_name">الاسم الأخير</Label>
              <Input id="last_name" placeholder="أدخل اسمك الأخير" type="text" {...register("last_name")} />
              {errors.last_name && (
                <p className="text-sm text-red-500">{errors.last_name.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username">اسم المستخدم</Label>
              <Input id="username" placeholder="أدخل اسم المستخدم" type="text" {...register("username")} />
              {errors.username && (
                <p className="text-sm text-red-500">{errors.username.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input id="email" placeholder="أدخل بريدك الإلكتروني" type="email" {...register("email")} />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input id="phone" placeholder="أدخل رقم هاتفك" type="tel" {...register("phone")} />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input id="password" placeholder="أدخل كلمة مرور قوية" type="password" {...register("password")} />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button disabled={isLoading} onClick={handleSubmit(onSubmit)}>
              {isLoading ? "جاري الإنشاء..." : "إنشاء حساب"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
