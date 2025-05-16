
import { PaginatedResponse, Ad, Comment, User, Category, Brand, Listing, ListingDetails, SearchFilters, ApiResponse } from '@/types';

// Base API URL for the application
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://haraj-syria.test/api/v1';

// Helper function to get the auth token from storage (localStorage or sessionStorage)
const getAuthToken = () => {
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Set and clear token functions
export const setToken = (token: string, rememberMe = true) => {
  if (rememberMe) {
    localStorage.setItem('authToken', token);
    sessionStorage.removeItem('authToken');
  } else {
    sessionStorage.setItem('authToken', token);
    localStorage.removeItem('authToken');
  }
};

export const clearToken = () => {
  localStorage.removeItem('authToken');
  sessionStorage.removeItem('authToken');
};

// Helper function for making API requests with error handling
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

      if (response.status === 401) {
        clearToken();
        if (!window.location.pathname.includes('/auth/login')) {
          window.location.href = '/auth/login';
        }
      }

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

// Export main API object for use in components
export const api = {
  auth: {
    login: async (identifier: string, password: string, rememberMe = true) => {
      const response = await fetchAPI<ApiResponse<{ token: string; user: User }>>('/user/login', {
        method: 'POST',
        body: JSON.stringify({ identifier, password }),
      });
      
      if (response.data?.token) {
        setToken(response.data.token, rememberMe);
      }
      
      return response;
    },
    
    logout: async () => {
      try {
        await fetchAPI('/user/logout', { method: 'POST' });
      } finally {
        clearToken();
      }
    },
    
    getCurrentUser: async () => {
      return fetchAPI<ApiResponse<User>>('/user/profile');
    },
    
    register: async (userData: {
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
      password: string;
      password_confirmation: string;
      city_id: number;
      state_id: number;
    }) => {
      const response = await fetchAPI<ApiResponse<{ token: string; user: User }>>('/user/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      
      if (response.data?.token) {
        setToken(response.data.token, true);
      }
      
      return response;
    },
  },
  
  // Categories related API calls
  categories: {
    getAll: async () => {
      return fetchAPI<ApiResponse<Category[]>>('/categories');
    },
    
    getOne: async (id: number) => {
      return fetchAPI<ApiResponse<Category>>(`/categories/${id}`);
    },
  
    getSubcategories: async () => {
      return fetchAPI<ApiResponse<any[]>>('/subcategories');
    },
  
    getChildCategories: async () => {
      return fetchAPI<ApiResponse<any[]>>('/childcategories');
    }
  },
  
  // Brands related API calls
  brands: {
    getAll: async () => {
      return fetchAPI<ApiResponse<Brand[]>>('/brands');
    },
    
    getOne: async (id: number) => {
      return fetchAPI<ApiResponse<Brand>>(`/brands/${id}`);
    }
  },
  
  // Listings related API calls
  listings: {
    getAll: async (params?: SearchFilters) => {
      const queryParams = new URLSearchParams();
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.set(key, value.toString());
          }
        });
      }
      
      return fetchAPI<ApiResponse<PaginatedResponse<Listing>>>(`/listings?${queryParams.toString()}`);
    },
    
    getOne: async (id: number) => {
      return fetchAPI<ApiResponse<ListingDetails>>(`/listing/${id}`);
    },
    
    create: async (listingData: FormData) => {
      console.log("Form Data => :", listingData);
      return fetchAPI<ApiResponse<Listing>>('/user/listings', {
        method: 'POST',
        body: listingData,
      });
    },
    
    update: async (id: number, listingData: FormData) => {
      return fetchAPI<ApiResponse<Listing>>(`/user/listings/${id}`, {
        method: 'POST', // Most APIs use POST for form-data with a _method field for PUT
        body: listingData,
      });
    },
    
    delete: async (id: number) => {
      return fetchAPI<ApiResponse<void>>(`/user/listings/${id}`, {
        method: 'DELETE',
      });
    },
    
    getRelated: async (listingId: number, limit = 4) => {
      return fetchAPI<ApiResponse<Listing[]>>(`/listings/${listingId}/related?limit=${limit}`);
    },
    
    addToFavorites: async (listingId: number) => {
      return fetchAPI<ApiResponse<void>>(`/listings/${listingId}/favorite`, {
        method: 'POST',
      });
    },
    
    removeFromFavorites: async (listingId: number) => {
      return fetchAPI<ApiResponse<void>>(`/listings/${listingId}/favorite`, {
        method: 'DELETE',
      });
    },
    
    getFavorites: async () => {
      return fetchAPI<ApiResponse<Listing[]>>('/user/favorites');
    },
    
    isFavorite: async (listingId: number) => {
      try {
        await fetchAPI(`/listings/${listingId}/is-favorite`);
        return { success: true, data: true, message: 'Is favorite' };
      } catch (error) {
        return { success: true, data: false, message: 'Not favorite' };
      }
    },
  },
  
  // Comments related API calls
  comments: {
    getAll: async (listingId: number) => {
      return fetchAPI<ApiResponse<Comment[]>>(`/listings/${listingId}/comments`);
    },
    
    add: async (listingId: number, content: string) => {
      return fetchAPI<ApiResponse<Comment>>(`/user/listings/${listingId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content }),
      });
    },
    
    addReply: async (listingId: number, commentId: number, content: string) => {
      return fetchAPI<ApiResponse<Comment>>(`/user/listings/${listingId}/comments/${commentId}/replies`, {
        method: 'POST',
        body: JSON.stringify({ content }),
      });
    },
    
    delete: async (listingId: number, commentId: number) => {
      return fetchAPI<ApiResponse<void>>(`/listings/${listingId}/comments/${commentId}`, {
        method: 'DELETE',
      });
    },
  },
  
  // Location related API calls
  location: {
    getStates: async () => {
      return fetchAPI<ApiResponse<{ id: number; name: string }[]>>('/states');
    },
    
    getCities: async (stateId: number) => {
      return fetchAPI<ApiResponse<{ id: number; name: string }[]>>(`/states/${stateId}/cities`);
    },
    
    getAllCities: async () => {
      return fetchAPI<ApiResponse<{ id: number; name: string; state_id: number }[]>>('/cities');
    },
    
    getCurrentLocation: async (): Promise<{ lat: number; lng: number }> => {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation is not supported by your browser'));
          return;
        }
        
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            reject(error);
          }
        );
      });
    },
  },

  // User related API calls
  user: {
    updateProfile: async (userData: FormData) => {
      return fetchAPI<ApiResponse<User>>('/user/profile/update', {
        method: 'POST',
        body: userData,
      });
    },
    
    getListings: async (userId?: number) => {
      const endpoint = userId ? `/users/${userId}/listings` : '/user/listings';
      return fetchAPI<ApiResponse<Listing[]>>(endpoint);
    },
    
    changePassword: async (data: { current_password: string; password: string; password_confirmation: string }) => {
      return fetchAPI<ApiResponse<void>>('/user/change-password', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    
    getStatistics: async () => {
      return fetchAPI<ApiResponse<any>>('/user/statistics');
    },
  },
  
  // Search related API calls
  search: {
    searchListings: async (query: string, filters?: SearchFilters) => {
      const queryParams = new URLSearchParams({ query });
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.set(key, String(value));
          }
        });
      }
      
      return fetchAPI<ApiResponse<PaginatedResponse<Listing>>>(`/search?${queryParams.toString()}`);
    },
  },
};

// For backward compatibility - these will be used by existing components
export const useAds = api.listings.getAll;
export const useAd = api.listings.getOne;
export const useRelatedAds = api.listings.getRelated;
export const useAddComment = api.comments.add;
export const useIsFavorite = api.listings.isFavorite;
export const useAddToFavorites = api.listings.addToFavorites;
export const useRemoveFromFavorites = api.listings.removeFromFavorites;
export const useCreateAd = api.listings.create;
export const useUpdateAd = api.listings.update;
export const useDeleteAd = api.listings.delete;
export const useListing = api.listings.getOne;
export const listingsAPI = api.listings;
export const categoriesAPI = api.categories;
export const userAPI = api.user;
