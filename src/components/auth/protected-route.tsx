
import { Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth, tokenStorage } from '@/context/auth-context';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({ children, redirectTo = "/auth/login" }: ProtectedRouteProps) {
  const { isAuthenticated, loading, refreshUser } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  // Check token existence
  const token = tokenStorage.getToken();
  const hasToken = !!token;

  useEffect(() => {
    // If there's a token but user is not authenticated, try refreshing user data
    if (hasToken && !isAuthenticated && !loading) {
      refreshUser();
    }
  }, [hasToken, isAuthenticated, loading, refreshUser]);

  // While checking authentication, show nothing
  if (loading) {
    return <div className="h-screen flex items-center justify-center">جاري التحميل...</div>;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    // Show toast only when redirected from a non-auth page
    if (!location.pathname.startsWith("/auth/")) {
      toast({
        title: "يجب تسجيل الدخول",
        description: "يرجى تسجيل الدخول للوصول إلى هذه الصفحة",
        variant: "destructive",
      });
    }

    // Redirect with the current location so we can return after login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
