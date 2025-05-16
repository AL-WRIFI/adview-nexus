
import axios from 'axios';
import { tokenStorage } from '@/context/auth-context';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://api.example.com';

// Create axios instance
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token refreshing if needed
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // In a real app, would call refresh token endpoint
        // const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
        //   refresh_token: localStorage.getItem('refresh_token')
        // });
        
        // setToken(data.token);
        // originalRequest.headers.Authorization = `Bearer ${data.token}`;
        // return api(originalRequest);
        
        // For now, just clear token and let auth flow handle redirect
        clearToken();
      } catch (refreshError) {
        clearToken();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Helper functions for token management
export const setToken = (token: string) => {
  tokenStorage.setToken(token);
};

export const clearToken = () => {
  tokenStorage.clearToken();
};

// Helper function to handle API requests
export const apiRequest = async <T>(
  method: string,
  endpoint: string,
  data?: any,
  options?: any
): Promise<T> => {
  try {
    const response = await api({
      method,
      url: endpoint,
      data,
      ...options,
    });
    return response.data;
  } catch (error) {
    console.error(`API error in ${method} ${endpoint}:`, error);
    throw error;
  }
};
