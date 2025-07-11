
import { ApiResponse } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://haraj-syria.test/api/v1';
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://haraj-syria.test/api/v1';

// Helper function to get the auth token from storage
const getAuthToken = () => {
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
};

// Helper function for making API requests
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const token = getAuthToken();
    const isFormData = options?.body instanceof FormData;
    
    const defaultHeaders: Record<string, string> = {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
    };
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options?.headers || {}),
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.success === false) {
      throw new Error(data.message || 'Unknown API error');
    }
    
    return data as T;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Site Identity interface
export interface SiteIdentity {
  site_logo: string;
  site_white_logo: string;
  site_favicon: string;
}

// Basic Settings interface
export interface BasicSettings {
  site_title: string;
  site_tag_line: string;
  site_footer_copyright: string;
  user_email_verify_enable_disable: boolean | null;
  user_otp_verify_enable_disable: boolean | null;
}

// Color Settings interface - محدثة لتشمل ألوان الوضع الداكن
export interface ColorSettings {
  // ألوان الوضع الفاتح
  site_main_color_one: string;
  site_main_color_two: string;
  site_main_color_three: string;
  heading_color: string;
  light_color: string;
  extra_light_color: string;
  
  // ألوان الوضع الداكن (اختيارية)
  dark_site_main_color_one?: string;
  dark_site_main_color_two?: string;
  dark_site_main_color_three?: string;
  dark_heading_color?: string;
  dark_light_color?: string;
  dark_extra_light_color?: string;
  dark_background_color?: string;
  dark_surface_color?: string;
  dark_text_color?: string;
  dark_border_color?: string;
}

// Listing Settings interface
export interface ListingSettings {
  listing_create_settings: string;
  listing_create_status_settings: string;
  updated_at: string;
}

// Settings API calls
export const settingsAPI = {
  // Get site identity (logo, favicon, etc.)
  getSiteIdentity: async (): Promise<ApiResponse<SiteIdentity>> => {
    return fetchAPI('/settings/site-identity');
  },
  
  // Get basic site settings
  getBasicSettings: async (): Promise<ApiResponse<BasicSettings>> => {
    return fetchAPI('/settings/basic');
  },
  
  // Get color settings
  getColorSettings: async (): Promise<ApiResponse<ColorSettings>> => {
    return fetchAPI('/settings/colors');
  },
  
  // Get listing settings
  getListingSettings: async (): Promise<ApiResponse<ListingSettings>> => {
    return fetchAPI('/settings/listing-settings');
  },
};
