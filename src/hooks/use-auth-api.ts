
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { authAPI, userAccountAPI } from '@/services/auth-api';
import { 
  RegisterData, 
  LoginCredentials, 
  VerifyEmailRequest, 
  ResendCodeRequest,
  PasswordResetRequest,
  UserSettings 
} from '@/types';

// Auth hooks
export function useRegister() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (userData: RegisterData) => authAPI.register(userData),
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'خطأ في إنشاء الحساب',
        description: error.message || 'حدث خطأ أثناء إنشاء الحساب',
      });
    }
  });
}

export function useVerifyEmail() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (data: VerifyEmailRequest) => authAPI.verifyEmail(data),
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'خطأ في التحقق',
        description: error.message || 'رمز التحقق غير صحيح',
      });
    }
  });
}

export function useResendVerificationCode() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (data: ResendCodeRequest) => authAPI.resendVerificationCode(data),
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'خطأ في إعادة الإرسال',
        description: error.message || 'حدث خطأ أثناء إعادة إرسال الرمز',
      });
    }
  });
}

export function useSendPasswordResetCode() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (data: ResendCodeRequest) => authAPI.sendPasswordResetCode(data),
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'خطأ في إرسال رمز الاستعادة',
        description: error.message || 'حدث خطأ أثناء إرسال رمز الاستعادة',
      });
    }
  });
}

export function useResetPassword() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (data: PasswordResetRequest) => authAPI.resetPassword(data),
    onSuccess: () => {
      toast({
        title: 'تم تغيير كلمة المرور بنجاح',
        description: 'يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة',
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'خطأ في تغيير كلمة المرور',
        description: error.message || 'حدث خطأ أثناء تغيير كلمة المرور',
      });
    }
  });
}

// User account hooks
export function useChangePassword() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (data: {
      current_password: string;
      new_password: string;
      new_password_confirmation: string;
    }) => userAccountAPI.changePassword(data),
    onSuccess: () => {
      toast({
        title: 'تم تغيير كلمة المرور بنجاح',
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'خطأ في تغيير كلمة المرور',
        description: error.message || 'كلمة المرور الحالية غير صحيحة',
      });
    }
  });
}

export function useDeleteAccount() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (data: { reason: string; description?: string }) => 
      userAccountAPI.deleteAccount(data),
    onSuccess: () => {
      toast({
        title: 'تم حذف الحساب بنجاح',
      });
      // مسح البيانات المحلية
      localStorage.removeItem('authToken');
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'خطأ في حذف الحساب',
        description: error.message || 'حدث خطأ أثناء حذف الحساب',
      });
    }
  });
}

export function useUserSettings() {
  return useQuery({
    queryKey: ['userSettings'],
    queryFn: () => userAccountAPI.getUserSettings(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUpdateUserSettings() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (settings: Partial<UserSettings['security'] & UserSettings['notifications'] & UserSettings['general']>) => 
      userAccountAPI.updateUserSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSettings'] });
      queryClient.invalidateQueries({ queryKey: ['accountSettings'] });
      toast({
        title: 'تم حفظ الإعدادات بنجاح',
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'خطأ في حفظ الإعدادات',
        description: error.message || 'حدث خطأ أثناء حفظ الإعدادات',
      });
    }
  });
}

export function useResetUserSettings() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: () => userAccountAPI.resetUserSettings(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSettings'] });
      queryClient.invalidateQueries({ queryKey: ['accountSettings'] });
      toast({
        title: 'تم إعادة تعيين الإعدادات بنجاح',
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'خطأ في إعادة تعيين الإعدادات',
        description: error.message || 'حدث خطأ أثناء إعادة تعيين الإعدادات',
      });
    }
  });
}

export function useAccountSettings() {
  return useQuery({
    queryKey: ['accountSettings'],
    queryFn: () => userAccountAPI.getAccountSettings(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useVerificationStatus() {
  return useQuery({
    queryKey: ['verificationStatus'],
    queryFn: () => userAccountAPI.getVerificationStatus(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useSubmitVerification() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (formData: FormData) => userAccountAPI.submitVerification(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['verificationStatus'] });
      queryClient.invalidateQueries({ queryKey: ['accountSettings'] });
      toast({
        title: 'تم تقديم طلب التحقق بنجاح',
        description: 'سيتم مراجعة طلبك خلال 24-48 ساعة',
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'خطأ في تقديم طلب التحقق',
        description: error.message || 'حدث خطأ أثناء تقديم طلب التحقق',
      });
    }
  });
}
