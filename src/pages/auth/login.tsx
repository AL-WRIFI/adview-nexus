
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { tokenStorage } from '@/context/auth-context';
import { isAuthenticated } from '@/services/api';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const auth = useAuth();
  
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
  
  // Get the redirect path from location state or default to dashboard
  const from = location.state?.from || '/dashboard';
  const previousFormData = location.state?.formData;
  const autoSubmit = location.state?.autoSubmit;
  
  // Check if already authenticated
  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [auth.isAuthenticated, navigate, from]);
  
  // Auto-submit after login if needed
  useEffect(() => {
    if (auth.isAuthenticated && previousFormData && autoSubmit) {
      // This might be handled by the receiving component based on state
      navigate(from, { 
        replace: true, 
        state: { formData: previousFormData, autoSubmit: true }
      });
    }
  }, [auth.isAuthenticated, navigate, from, previousFormData, autoSubmit]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs and set field errors
    const errors: {[key: string]: string} = {};
    
    if (!identifier) errors.identifier = 'هذا الحقل مطلوب';
    if (!password) errors.password = 'هذا الحقل مطلوب';
    
    setFieldErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      toast({
        variant: 'destructive',
        title: 'خطأ في البيانات',
        description: 'يرجى ملء جميع الحقول المطلوبة',
      });
      return;
    }
    
    try {
      setIsPending(true);
      await auth.login(identifier, password);
      
      // The token will be saved by the login function
      // But we need to set the rememberMe option
      const token = tokenStorage.getToken();
      if (token) {
        tokenStorage.setToken(token, rememberMe);
      }
      
      // After successful login
      if (previousFormData) {
        navigate(from, { 
          replace: true, 
          state: { formData: previousFormData, autoSubmit: true }
        });
      } else {
        navigate(from, { replace: true });
      }
    } catch (error) {
      // Error is handled in the auth context
      console.error('Login failed:', error);
    } finally {
      setIsPending(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              تسجيل الدخول
            </CardTitle>
            <CardDescription>
              أدخل بيانات حسابك للوصول إلى لوحة التحكم
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="identifier">
                  البريد الإلكتروني أو رقم الهاتف أو اسم المستخدم
                </Label>
                 <Input
                   id="identifier"
                   type="text"
                   placeholder="أدخل البريد الإلكتروني أو رقم الهاتف أو اسم المستخدم"
                   value={identifier}
                   onChange={(e) => setIdentifier(e.target.value)}
                   className={fieldErrors.identifier ? 'border-red-500' : ''}
                 />
                 {fieldErrors.identifier && (
                   <p className="text-sm text-red-500 mt-1">{fieldErrors.identifier}</p>
                 )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">
                    كلمة المرور
                  </Label>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-xs"
                    type="button"
                    onClick={() => navigate('/auth/forgot-password')}
                  >
                    نسيت كلمة المرور؟
                  </Button>
                </div>
                <div className="relative">
                   <Input
                     id="password"
                     type={showPassword ? 'text' : 'password'}
                     placeholder="أدخل كلمة المرور"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     className={fieldErrors.password ? 'border-red-500' : ''}
                   />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute left-0 top-0 h-full"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                 </div>
                 {fieldErrors.password && (
                   <p className="text-sm text-red-500 mt-1">{fieldErrors.password}</p>
                 )}
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <input
                  type="checkbox"
                  id="remember"
                  className="rounded"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <Label htmlFor="remember" className="text-sm">
                  تذكرني
                </Label>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    جاري تسجيل الدخول...
                  </>
                ) : (
                  'تسجيل الدخول'
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                ليس لديك حساب؟{' '}
                <Link to="/auth/register" className="text-primary hover:underline">
                  إنشاء حساب جديد
                </Link>
              </div>

              <div className="text-center">
                <Button
                  variant="link"
                  className="p-0 h-auto text-sm text-muted-foreground"
                  onClick={() => navigate('/')}
                >
                  العودة إلى الصفحة الرئيسية
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
