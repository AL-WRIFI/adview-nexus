
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRegister } from '@/hooks/use-api';
import { useAllCities, useStates } from '@/hooks/use-api';
import { isAuthenticated } from '@/services/api';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: states, isLoading: loadingStates } = useStates();
  const { data: cities, isLoading: loadingCities } = useAllCities();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [stateId, setStateId] = useState<number | null>(null);
  const [cityId, setCityId] = useState<number | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  // Filter cities based on selected state
  const filteredCities = stateId 
    ? cities?.filter(city => city.state_id === stateId)
    : [];
  
  // Check if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);
  
  // Register mutation
  const registerMutation = useRegister();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword || !stateId || !cityId) {
      toast({
        variant: 'destructive',
        title: 'خطأ في البيانات',
        description: 'يرجى ملء جميع الحقول المطلوبة',
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'كلمات المرور غير متطابقة',
        description: 'يرجى التأكد من تطابق كلمات المرور',
      });
      return;
    }
    
    if (password.length < 8) {
      toast({
        variant: 'destructive',
        title: 'كلمة المرور ضعيفة',
        description: 'يجب أن تكون كلمة المرور 8 أحرف على الأقل',
      });
      return;
    }
    
    if (!agreeTerms) {
      toast({
        variant: 'destructive',
        title: 'الموافقة على الشروط',
        description: 'يجب الموافقة على شروط الاستخدام وسياسة الخصوصية',
      });
      return;
    }
    
    try {
      await registerMutation.mutateAsync({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        password,
        password_confirmation: confirmPassword,
        city_id: cityId,
        state_id: stateId
      });
      
      // Redirect to dashboard
      navigate('/dashboard', { replace: true });
    } catch (error) {
      // Error is handled in the mutation
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">إنشاء حساب جديد</CardTitle>
            <CardDescription>
              أدخل بياناتك لإنشاء حساب جديد
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">الاسم الأول</Label>
                  <Input
                    id="firstName"
                    placeholder="الاسم الأول"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">الاسم الأخير</Label>
                  <Input
                    id="lastName"
                    placeholder="الاسم الأخير"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="أدخل البريد الإلكتروني"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">رقم الهاتف</Label>
                <Input
                  id="phone"
                  placeholder="أدخل رقم الهاتف"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="state">المنطقة / المحافظة</Label>
                <Select 
                  value={stateId?.toString()} 
                  onValueChange={(value) => {
                    setStateId(parseInt(value, 10));
                    setCityId(null); // Reset city when state changes
                  }}
                >
                  <SelectTrigger id="state">
                    <SelectValue placeholder="اختر المنطقة / المحافظة" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingStates ? (
                      <div className="p-2 text-center text-sm text-muted-foreground">
                        جاري التحميل...
                      </div>
                    ) : (
                      states?.map((state) => (
                        <SelectItem key={state.id} value={state.id.toString()}>
                          {state.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="city">المدينة</Label>
                <Select 
                  value={cityId?.toString()} 
                  onValueChange={(value) => setCityId(parseInt(value, 10))}
                  disabled={!stateId}
                >
                  <SelectTrigger id="city">
                    <SelectValue placeholder={stateId ? "اختر المدينة" : "اختر المنطقة أولاً"} />
                  </SelectTrigger>
                  <SelectContent>
                    {!stateId ? (
                      <div className="p-2 text-center text-sm text-muted-foreground">
                        الرجاء اختيار المنطقة أولاً
                      </div>
                    ) : loadingCities ? (
                      <div className="p-2 text-center text-sm text-muted-foreground">
                        جاري التحميل...
                      </div>
                    ) : filteredCities?.length === 0 ? (
                      <div className="p-2 text-center text-sm text-muted-foreground">
                        لا توجد مدن متوفرة
                      </div>
                    ) : (
                      filteredCities?.map((city) => (
                        <SelectItem key={city.id} value={city.id.toString()}>
                          {city.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="أدخل كلمة المرور (8 أحرف على الأقل)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="أعد إدخال كلمة المرور"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute left-0 top-0 h-full"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 space-x-reverse">
                <input
                  type="checkbox"
                  id="terms"
                  className="rounded border-gray-300"
                  checked={agreeTerms}
                  onChange={() => setAgreeTerms(!agreeTerms)}
                />
                <Label htmlFor="terms" className="text-sm">
                  أوافق على{' '}
                  <Link to="/terms" className="text-brand hover:underline">
                    شروط الاستخدام
                  </Link>{' '}
                  و{' '}
                  <Link to="/privacy" className="text-brand hover:underline">
                    سياسة الخصوصية
                  </Link>
                </Label>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    جاري إنشاء الحساب...
                  </>
                ) : (
                  'إنشاء حساب'
                )}
              </Button>
              
              <div className="text-center text-sm">
                لديك حساب بالفعل؟{' '}
                <Link to="/auth/login" className="text-brand hover:underline">
                  تسجيل الدخول
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
