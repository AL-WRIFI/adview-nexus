
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Loader2, CheckCircle, AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { authAPI } from '@/services/auth-api';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [waitMinutes, setWaitMinutes] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(0);
  
  // الحصول على البريد الإلكتروني من state المرسل من صفحة التسجيل
  const email = location.state?.email || '';
  
  // إذا لم يكن هناك بريد إلكتروني، ارجع لصفحة التسجيل
  useEffect(() => {
    if (!email) {
      navigate('/auth/register', { replace: true });
    }
  }, [email, navigate]);

  // عداد تنازلي للانتظار قبل إعادة الإرسال
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  const handleVerify = async () => {
    if (verificationCode.length !== 6) {
      toast({
        variant: 'destructive',
        title: 'رمز غير مكتمل',
        description: 'يرجى إدخال رمز التحقق المكون من 6 أرقام',
      });
      return;
    }

    setIsVerifying(true);
    
    try {
      const response = await authAPI.verifyEmail({
        email,
        token: verificationCode
      });

      if (response.success && response.data?.token) {
        // حفظ الرمز المميز وبيانات المستخدم
        localStorage.setItem('authToken', response.data.token);
        
        toast({
          title: 'تم تفعيل الحساب بنجاح',
          description: 'مرحباً بك! سيتم توجيهك للوحة التحكم',
        });

        // التوجه للوحة التحكم
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 1500);
      } else {
        throw new Error(response.message || 'رمز التحقق غير صحيح');
      }
    } catch (error: any) {
      console.error('Error verifying email:', error);
      toast({
        variant: 'destructive',
        title: 'خطأ في التحقق',
        description: error.message || 'رمز التحقق غير صحيح',
      });
      
      // مسح رمز التحقق في حالة الخطأ
      setVerificationCode('');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) {
      toast({
        variant: 'destructive',
        title: 'انتظر قليلاً',
        description: `يجب الانتظار ${Math.ceil(countdown / 60)} دقيقة قبل إعادة الإرسال`,
      });
      return;
    }

    setIsResending(true);
    
    try {
      const response = await authAPI.resendVerificationCode({ email });

      if (response.success) {
        setRemainingAttempts(response.data?.remaining_attempts || null);
        
        toast({
          title: 'تم إرسال الرمز بنجاح',
          description: `تم إرسال رمز جديد إلى ${email}`,
        });
        
        // مسح الرمز المدخل سابقاً
        setVerificationCode('');
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      console.error('Error resending code:', error);
      
      // التعامل مع أخطاء الانتظار
      if (error.message.includes('الانتظار')) {
        const errorData = error.errors;
        if (errorData?.wait_minutes) {
          setWaitMinutes(errorData.wait_minutes);
          setCountdown(errorData.wait_minutes * 60);
        }
        if (errorData?.remaining_attempts) {
          setRemainingAttempts(errorData.remaining_attempts);
        }
      }
      
      toast({
        variant: 'destructive',
        title: 'خطأ في إعادة الإرسال',
        description: error.message || 'حدث خطأ أثناء إعادة إرسال الرمز',
      });
    } finally {
      setIsResending(false);
    }
  };

  const formatCountdown = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!email) {
    return null; // سيتم التوجيه لصفحة التسجيل
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">تفعيل الحساب</CardTitle>
            <CardDescription>
              تم إرسال رمز التحقق إلى البريد الإلكتروني
              <br />
              <span className="font-medium text-foreground">{email}</span>
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center">
              <label className="text-sm font-medium">أدخل رمز التحقق المكون من 6 أرقام</label>
              <div className="mt-3 flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={verificationCode}
                  onChange={(value) => setVerificationCode(value)}
                  disabled={isVerifying}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>

            {remainingAttempts !== null && (
              <div className="text-center text-sm text-muted-foreground">
                <AlertCircle className="inline h-4 w-4 ml-1" />
                المحاولات المتبقية: {remainingAttempts}
              </div>
            )}

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">
                لم تستلم الرمز؟
              </p>
              
              <Button
                variant="outline"
                onClick={handleResendCode}
                disabled={isResending || countdown > 0}
                className="w-full"
              >
                {isResending ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    جاري الإرسال...
                  </>
                ) : countdown > 0 ? (
                  <>
                    <RefreshCw className="ml-2 h-4 w-4" />
                    إعادة الإرسال خلال {formatCountdown(countdown)}
                  </>
                ) : (
                  <>
                    <RefreshCw className="ml-2 h-4 w-4" />
                    إعادة إرسال الرمز
                  </>
                )}
              </Button>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              onClick={handleVerify}
              className="w-full"
              disabled={isVerifying || verificationCode.length !== 6}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري التحقق...
                </>
              ) : (
                'تفعيل الحساب'
              )}
            </Button>

            <div className="flex items-center justify-center gap-4 text-sm">
              <Link 
                to="/auth/register" 
                className="text-muted-foreground hover:text-primary flex items-center gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                العودة للتسجيل
              </Link>
              
              <span className="text-muted-foreground">|</span>
              
              <Link 
                to="/auth/login" 
                className="text-primary hover:underline"
              >
                تسجيل الدخول
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
