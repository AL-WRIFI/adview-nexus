
import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/auth-context';
import { Loader2 } from 'lucide-react';
import { TokenManager } from '@/context/auth-context';

interface ProtectedRouteProps {
  children: ReactNode;
  isLoggedIn?: boolean;
}

export function ProtectedRoute({ children, isLoggedIn: externalIsLoggedIn }: ProtectedRouteProps) {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  
  // Use either external value or context value
  const isLoggedIn = externalIsLoggedIn !== undefined ? externalIsLoggedIn : isAuthenticated;

  const hasToken = TokenManager.hasToken();
  
  // If still loading authentication status and we have token, show loading spinner
  if (isLoading && hasToken) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    );
  }

  // If not authenticated and no token, redirect to login page
  if (!isLoggedIn && !hasToken) {
    // Save the current location so we can redirect after login
    return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
  }

  // If authenticated or has token, render the protected component
  return <>{children}</>;
}
