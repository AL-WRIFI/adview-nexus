
import { ApiResponse, PaginatedResponse, Listing, Comment, User, SearchFilters, Favorite, Category, SubCategory, Brand, State, City } from '@/types';

// Configuration - Update to use the correct API URL
const API_CONFIG = {
  BASE_URL: 'https://haraj-syria.test/api/v1',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// Token management utilities
class TokenManager {
  private static readonly TOKEN_KEY = 'authToken';
  private static readonly SESSION_TOKEN_KEY = 'sessionAuthToken';

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY) || sessionStorage.getItem(this.SESSION_TOKEN_KEY);
  }

  static setToken(token: string, remember: boolean = true): void {
    if (remember) {
      localStorage.setItem(this.TOKEN_KEY, token);
      sessionStorage.removeItem(this.SESSION_TOKEN_KEY);
    } else {
      sessionStorage.setItem(this.SESSION_TOKEN_KEY, token);
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  static removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.SESSION_TOKEN_KEY);
  }

  static hasToken(): boolean {
    return !!this.getToken();
  }
}

// HTTP Client with retry logic and proper error handling
class ApiClient {
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    const token = TokenManager.getToken();
    
    console.log(`API Request: ${options.method || 'GET'} ${url} (attempt 1)`);
    
    const isFormData = options.body instanceof FormData;
    
    const defaultHeaders: Record<string, string> = {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
    };

    const requestOptions: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options.headers || {}),
      },
      mode: 'cors', // Enable CORS
      credentials: 'include', // Include credentials
    };

    for (let attempt = 1; attempt <= API_CONFIG.RETRY_ATTEMPTS; attempt++) {
      try {
        if (attempt > 1) {
          console.log(`API Request: ${options.method || 'GET'} ${url} (attempt ${attempt})`);
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

        const response = await fetch(url, {
          ...requestOptions,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          
          if (response.status === 401) {
            TokenManager.removeToken();
            window.location.href = '/auth/login';
            throw new Error('Authentication required');
          }

          throw new Error(
            errorData.message || 
            `API Error: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        return data as T;

      } catch (error) {
        console.error(`API request attempt ${attempt} failed:`, error);
        
        if (attempt === API_CONFIG.RETRY_ATTEMPTS) {
          throw error;
        }
        
        await new Promise(resolve => 
          setTimeout(resolve, API_CONFIG.RETRY_DELAY * attempt)
        );
      }
    }

    throw new Error('Max retry attempts exceeded');
  }

  static get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  static post<T>(endpoint: string, data?: any): Promise<T> {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return this.request<T>(endpoint, { method: 'POST', body });
  }

  static put<T>(endpoint: string, data?: any): Promise<T> {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return this.request<T>(endpoint, { method: 'PUT', body });
  }

  static delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Categories API
export const categoriesAPI = {
  getCategories: (): Promise<ApiResponse<Category[]>> => 
    ApiClient.get('/categories'),

  getCategory: (id: number): Promise<ApiResponse<Category>> => 
    ApiClient.get(`/categories/${id}`),

  getSubCategories: (): Promise<ApiResponse<SubCategory[]>> => 
    ApiClient.get('/subcategories'),

  getChildCategories: (): Promise<ApiResponse<SubCategory[]>> => 
    ApiClient.get('/childcategories'),

  getBrands: (): Promise<ApiResponse<Brand[]>> => 
    ApiClient.get('/brands'),

  getBrandsByCategory: (categoryId: number): Promise<ApiResponse<Brand[]>> => 
    ApiClient.get(`/brands/${categoryId}`),
};

// Location API
export const locationAPI = {
  getStates: (): Promise<ApiResponse<State[]>> => 
    ApiClient.get('/states'),

  getCitiesByState: (stateId: number): Promise<ApiResponse<City[]>> => 
    ApiClient.get(`/states/${stateId}/cities`),

  getAllCities: (): Promise<ApiResponse<City[]>> => 
    ApiClient.get('/cities'),
};

// Listings API
export const listingsAPI = {
  getListings: (params?: SearchFilters): Promise<ApiResponse<PaginatedResponse<Listing>>> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    return ApiClient.get(`/listings${queryString ? `?${queryString}` : ''}`);
  },

  getListing: (id: number): Promise<ApiResponse<Listing>> => 
    ApiClient.get(`/listing/${id}`),

  getRelatedListings: (listingId: number, limit: number = 4): Promise<ApiResponse<Listing[]>> => 
    ApiClient.get(`/listing/${listingId}/related?limit=${limit}`),

  incrementViews: (listingId: number): Promise<ApiResponse<void>> => 
    ApiClient.get(`/listing/${listingId}/increment-views`),

  getFeaturedListings: (): Promise<ApiResponse<Listing[]>> => 
    ApiClient.get('/featured-listings'),

  getLatestListings: (): Promise<ApiResponse<Listing[]>> => 
    ApiClient.get('/latest-listings'),

  getMostViewedListings: (): Promise<ApiResponse<Listing[]>> => 
    ApiClient.get('/most-viewed-listings'),

  getComments: (listingId: number): Promise<ApiResponse<Comment[]>> => 
    ApiClient.get(`/listings/${listingId}/comments`),
};

// User Listings API (Protected routes)
export const userListingsAPI = {
  getUserListings: (): Promise<ApiResponse<Listing[]>> => 
    ApiClient.get('/user/listings'),

  createListing: (listingData: FormData): Promise<ApiResponse<Listing>> => 
    ApiClient.post('/user/listings', listingData),

  updateListing: (id: number, listingData: FormData): Promise<ApiResponse<Listing>> => 
    ApiClient.put(`/user/listings/${id}`, listingData),

  deleteListing: (id: number): Promise<ApiResponse<void>> => 
    ApiClient.delete(`/user/listings/${id}`),

  addComment: (listingId: number, content: string): Promise<ApiResponse<Comment>> => 
    ApiClient.post(`/user/listings/${listingId}/comments`, { content }),

  editComment: (listingId: number, commentId: number, content: string): Promise<ApiResponse<Comment>> => 
    ApiClient.put(`/user/listings/${listingId}/comments/${commentId}`, { content }),

  deleteComment: (listingId: number, commentId: number): Promise<ApiResponse<void>> => 
    ApiClient.delete(`/user/listings/${listingId}/comments/${commentId}`),

  addReply: (listingId: number, commentId: number, content: string): Promise<ApiResponse<Comment>> => 
    ApiClient.post(`/user/listings/${listingId}/comments/${commentId}/replies`, { content }),

  editReply: (listingId: number, commentId: number, replyId: number, content: string): Promise<ApiResponse<Comment>> => 
    ApiClient.put(`/user/listings/${listingId}/comments/${commentId}/replies/${replyId}`, { content }),

  deleteReply: (listingId: number, commentId: number, replyId: number): Promise<ApiResponse<void>> => 
    ApiClient.delete(`/user/listings/${listingId}/comments/${commentId}/replies/${replyId}`),
};

// Auth API
export const authAPI = {
  login: (identifier: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> => 
    ApiClient.post('/user/login', { identifier, password }),

  register: (userData: {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    phone: string;
    city_id: number;
    state_id: number;
    password: string;
    password_confirmation: string;
  }): Promise<ApiResponse<{ user: User; token: string }>> => 
    ApiClient.post('/user/register', userData),

  logout: (): Promise<ApiResponse<void>> => 
    ApiClient.post('/user/logout'),

  sendVerificationCode: (identifier: string): Promise<ApiResponse<void>> => 
    ApiClient.post('/user/send-verification-code', { identifier }),

  verifyCode: (identifier: string, code: string): Promise<ApiResponse<void>> => 
    ApiClient.post('/user/verify-code', { identifier, code }),

  resetPassword: (data: { token: string; password: string; password_confirmation: string }): Promise<ApiResponse<void>> => 
    ApiClient.post('/user/reset-password', data),

  changePassword: (data: { 
    current_password: string; 
    new_password: string; 
    new_password_confirmation: string; 
  }): Promise<ApiResponse<void>> => 
    ApiClient.post('/user/change-password', data),
};

// Profile API
export const profileAPI = {
  getProfile: (): Promise<ApiResponse<User>> => 
    ApiClient.get('/user/profile'),

  updateProfile: (data: FormData): Promise<ApiResponse<User>> => 
    ApiClient.post('/user/profile', data),

  getUserStats: (): Promise<ApiResponse<any>> => 
    ApiClient.get('/user/stats'),

  getFavorites: (): Promise<ApiResponse<PaginatedResponse<Favorite>>> => 
    ApiClient.get('/user/favorites'),

  addToFavorites: (listingId: number): Promise<ApiResponse<void>> => 
    ApiClient.post(`/user/listings/${listingId}/favorite`),

  removeFromFavorites: (listingId: number): Promise<ApiResponse<void>> => 
    ApiClient.delete(`/user/listings/${listingId}/favorite`),

  checkIsFavorite: (listingId: number): Promise<ApiResponse<{ is_favorite: boolean }>> => 
    ApiClient.get(`/user/listings/${listingId}/is-favorite`),
};

// Settings API - Updated with real API endpoints
export const settingsAPI = {
  getSiteIdentity: (): Promise<ApiResponse<{
    site_logo: string;
    site_white_logo: string;
    site_favicon: string;
  }>> => 
    ApiClient.get('/settings/site-identity'),

  getBasicSettings: (): Promise<ApiResponse<{
    site_title: string;
    site_tag_line: string;
    site_footer_copyright: string;
    user_email_verify_enable_disable: boolean | null;
    user_otp_verify_enable_disable: boolean | null;
  }>> => 
    ApiClient.get('/settings/basic'),

  getColorSettings: (): Promise<ApiResponse<{
    site_main_color_one: string;
    site_main_color_two: string;
    site_main_color_three: string;
    heading_color: string;
    light_color: string;
    extra_light_color: string;
  }>> => 
    ApiClient.get('/settings/colors'),

  getListingSettings: (): Promise<ApiResponse<{
    listing_create_settings: string;
    listing_create_status_settings: string;
    updated_at: string;
  }>> => 
    ApiClient.get('/settings/listing-settings'),

  // Keep legacy methods for backward compatibility
  getNavbarVariant: (): Promise<ApiResponse<any>> => 
    ApiClient.get('/settings/navbar-variant'),

  getFooterVariant: (): Promise<ApiResponse<any>> => 
    ApiClient.get('/settings/footer-variant'),

  getSeoSettings: (): Promise<ApiResponse<any>> => 
    ApiClient.get('/settings/seo'),

  getLanguages: (): Promise<ApiResponse<any>> => 
    ApiClient.get('/settings/languages'),

  getAllSettings: (): Promise<ApiResponse<any>> => 
    ApiClient.get('/settings/all'),
};

// Promotion API - Updated with real API endpoints
export const promotionAPI = {
  getPromotionPackages: (): Promise<ApiResponse<{
    id: number;
    name: string;
    description: string;
    price: number;
    duration_days: number;
    is_active: boolean;
    stripe_price_id: string | null;
  }[]>> => 
    ApiClient.get('/promotion-packages'),

  promoteListingWithBankTransfer: (listingId: number, data: {
    promotion_package_id: number;
    payment_method: 'bank_transfer';
    bank_transfer_proof: File;
  }): Promise<ApiResponse<{
    id: number;
    payment_method: string;
    payment_status: string;
    transaction_id: string | null;
    bank_transfer_proof_url: string;
    payment_confirmed_at: string | null;
    starts_at: string | null;
    expires_at: string | null;
    amount_paid: number;
    admin_notes: string | null;
    created_at: string;
    package: any;
    user_id: number;
  }>> => {
    const formData = new FormData();
    formData.append('promotion_package_id', data.promotion_package_id.toString());
    formData.append('payment_method', data.payment_method);
    formData.append('bank_transfer_proof', data.bank_transfer_proof);
    
    return ApiClient.post(`/user/listings/${listingId}/promote`, formData);
  },

  promoteListingWithStripe: (listingId: number, data: {
    promotion_package_id: number;
    payment_method: 'stripe';
  }): Promise<ApiResponse<any>> => 
    ApiClient.post(`/user/listings/${listingId}/promote`, data),

  getUserPromotions: (): Promise<ApiResponse<PaginatedResponse<{
    id: number;
    payment_method: string;
    payment_status: string;
    transaction_id: string | null;
    bank_transfer_proof_url: string;
    payment_confirmed_at: string | null;
    starts_at: string | null;
    expires_at: string | null;
    amount_paid: number;
    admin_notes: string | null;
    created_at: string;
    package: {
      id: number;
      name: string;
      description: string;
      price: number;
      duration_days: number;
      is_active: boolean;
      stripe_price_id: string | null;
    };
    listing: {
      id: number;
      title: string;
      slug: string;
      image: {
        image_id: string;
        image_url: string;
      };
      is_currently_promoted: boolean;
      promoted_until: string | null;
    };
    user_id: number;
  }>>> => 
    ApiClient.get('/user/listing-promotions'),
};

// Account Settings API
export const accountAPI = {
  getAccountSettings: (): Promise<ApiResponse<any>> => 
    ApiClient.get('/user/account/settings'),

  deactivateAccount: (data: { reason: string; description: string }): Promise<ApiResponse<void>> => 
    ApiClient.post('/user/account/deactivate', data),

  deleteAccount: (data: { reason: string; description: string }): Promise<ApiResponse<void>> => 
    ApiClient.post('/user/account/delete', data),

  cancelDeactivation: (): Promise<ApiResponse<void>> => 
    ApiClient.delete('/user/account/cancel-deactivation'),

  getVerificationStatus: (): Promise<ApiResponse<any>> => 
    ApiClient.get('/user/account/verification-status'),

  verifyProfile: (data: FormData): Promise<ApiResponse<any>> => 
    ApiClient.post('/user/account/verify-profile', data),
};

// Export Token Manager for external use
export { TokenManager };

// Legacy API object for backward compatibility
export const api = {
  // Auth
  login: authAPI.login,
  register: authAPI.register,
  logout: authAPI.logout,
  getCurrentUser: profileAPI.getProfile,

  // Listings
  getListings: listingsAPI.getListings,
  getListing: listingsAPI.getListing,
  createListing: userListingsAPI.createListing,
  updateListing: userListingsAPI.updateListing,
  deleteListing: userListingsAPI.deleteListing,
  getUserListings: userListingsAPI.getUserListings,

  // Comments
  getComments: listingsAPI.getComments,
  addComment: userListingsAPI.addComment,
  addReply: userListingsAPI.addReply,
  editReply: userListingsAPI.editReply,
  deleteReply: userListingsAPI.deleteReply,

  // Favorites
  getFavorites: profileAPI.getFavorites,
  addToFavorites: profileAPI.addToFavorites,
  removeFromFavorites: profileAPI.removeFromFavorites,
  isFavorite: profileAPI.checkIsFavorite,
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => TokenManager.hasToken();
