
import { ApiClient } from './apis';
import { 
  AuthResponse, 
  VerifyEmailRequest, 
  VerifyEmailResponse, 
  ResendCodeRequest, 
  ResendCodeResponse,
  PasswordResetRequest,
  RegisterData,
  LoginCredentials,
  UserSettings,
  VerificationInfo
} from '@/types';

export const authAPI = {
  // تسجيل الدخول
  login: (credentials: LoginCredentials): Promise<AuthResponse> => 
    ApiClient.post('/auth/login', credentials),

  // إنشاء حساب جديد
  register: (userData: RegisterData): Promise<AuthResponse> => 
    ApiClient.post('/user/register', userData),

  // تفعيل الحساب بالرمز
  verifyEmail: (data: VerifyEmailRequest): Promise<VerifyEmailResponse> => 
    ApiClient.post('/user/verify-email', data),

  // إعادة إرسال رمز التفعيل
  resendVerificationCode: (data: ResendCodeRequest): Promise<ResendCodeResponse> => 
    ApiClient.post('/user/resend-verification-code', data),

  // إرسال رمز إعادة تعيين كلمة المرور
  sendPasswordResetCode: (data: ResendCodeRequest): Promise<ResendCodeResponse> => 
    ApiClient.post('/user/send-verification-code', data),

  // إعادة تعيين كلمة المرور
  resetPassword: (data: PasswordResetRequest): Promise<AuthResponse> => 
    ApiClient.post('/user/reset-password', data),

  // تسجيل الخروج
  logout: (): Promise<AuthResponse> => 
    ApiClient.post('/auth/logout'),

  // الحصول على بيانات المستخدم الحالي
  getCurrentUser: (): Promise<AuthResponse> => 
    ApiClient.get('/user/profile'),
};

export const userAccountAPI = {
  // تغيير كلمة المرور
  changePassword: (data: {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
  }): Promise<AuthResponse> => 
    ApiClient.post('/user/account/change-password', data),

  // حذف الحساب
  deleteAccount: (data: {
    reason: string;
    description?: string;
  }): Promise<AuthResponse> => 
    ApiClient.post('/user/account/delete', data),

  // الحصول على إعدادات الحساب
  getAccountSettings: (): Promise<{
    success: boolean;
    message: string;
    data: {
      account_info: any;
      verify_info: VerificationInfo | null;
      business_hours: any;
      user_settings: UserSettings;
    };
  }> => 
    ApiClient.get('/user/account/account-settings'),

  // الحصول على إعدادات المستخدم
  getUserSettings: (): Promise<{
    success: boolean;
    message: string;
    data: UserSettings;
  }> => 
    ApiClient.get('/user/account/settings'),

  // تحديث إعدادات المستخدم
  updateUserSettings: (settings: Partial<UserSettings['security'] & UserSettings['notifications'] & UserSettings['general']>): Promise<{
    success: boolean;
    message: string;
    data: UserSettings;
  }> => 
    ApiClient.put('/user/account/settings', settings),

  // إعادة تعيين الإعدادات للافتراضية
  resetUserSettings: (): Promise<{
    success: boolean;
    message: string;
    data: UserSettings;
  }> => 
    ApiClient.post('/user/account/reset-settings'),

  // الحصول على حالة التحقق
  getVerificationStatus: (): Promise<{
    success: boolean;
    message: string;
    data: VerificationInfo;
  }> => 
    ApiClient.get('/user/account/verification-status'),

  // تقديم طلب التحقق من الهوية
  submitVerification: (formData: FormData): Promise<{
    success: boolean;
    message: string;
    data: VerificationInfo;
  }> => 
    ApiClient.post('/user/account/verify-profile', formData),
};
