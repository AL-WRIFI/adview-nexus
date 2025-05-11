
import { tokenStorage } from "@/context/auth-context";

/**
 * Helper functions for authentication
 */

/**
 * Checks if there is an authentication token stored
 */
export const hasAuthToken = (): boolean => {
  return !!tokenStorage.getToken();
};

/**
 * Redirects to login page with return URL
 */
export const redirectToLogin = (from: string, formData?: any): void => {
  const state = { from };
  
  if (formData) {
    state.formData = formData;
  }
  
  window.location.href = `/auth/login?redirect=${encodeURIComponent(from)}`;
};

/**
 * Parse redirect URL from location
 */
export const getRedirectUrl = (location: Location): string => {
  const params = new URLSearchParams(location.search);
  return params.get('redirect') || '/';
};

/**
 * Handle unauthorized API response
 */
export const handleUnauthorized = (): void => {
  // Clear token
  tokenStorage.clearToken();
  
  // Save current path
  const currentPath = window.location.pathname;
  
  // Redirect to login
  if (!currentPath.includes('/auth/login')) {
    redirectToLogin(currentPath);
  }
};
