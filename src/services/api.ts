
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
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
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

// Authentication related API calls
export const authAPI = {
  // Login user
  login: async (identifier: string, password: string, rememberMe: boolean = true): Promise<ApiResponse<{ token: string; user: User }>> => {
    const response = await fetchAPI<ApiResponse<{ token: string; user: User }>>('/user/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    });
    
    // Store the token in storage if login successful
    if (response.data?.token) {
      if (rememberMe) {
        localStorage.setItem('authToken', response.data.token);
        sessionStorage.removeItem('authToken');
      } else {
        sessionStorage.setItem('authToken', response.data.token);
        localStorage.removeItem('authToken');
      }
    }
    
    return response;
  },
  
  // Logout user
  logout: async (): Promise<void> => {
    try {
      await fetchAPI('/user/logout', { method: 'POST' });
    } finally {
      // Always clear the token
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
    }
  },
  
  // Get the current logged-in user
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    return fetchAPI('/user/profile');
  },
  
  // Register a new user
  register: async (userData: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
    city_id: number;
    state_id: number;
  }): Promise<ApiResponse<{ token: string; user: User }>> => {
    const response = await fetchAPI<ApiResponse<{ token: string; user: User }>>('/user/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    // Store the token in localStorage if registration successful
    if (response.data?.token) {
      localStorage.setItem('authToken', response.data.token);
      sessionStorage.removeItem('authToken');
    }
    
    return response;
  },
};

// Categories related API calls
export const categoriesAPI = {
  // Get all categories
  getCategories: async (): Promise<ApiResponse<Category[]>> => {
    return fetchAPI('/categories');
  },
  
  // Get a single category by ID
  getCategory: async (id: number): Promise<ApiResponse<Category>> => {
    return fetchAPI(`/categories/${id}`);
  },

  // Get all subcategories
  getSubCategories: async (): Promise<ApiResponse<any[]>> => {
    return fetchAPI('/subcategories');
  },

  // Get all child categories
  getChildCategories: async (): Promise<ApiResponse<any[]>> => {
    return fetchAPI('/childcategories');
  },
};

// Brands related API calls
export const brandsAPI = {
  // Get all brands
  getBrands: async (): Promise<ApiResponse<Brand[]>> => {
    return fetchAPI('/brands');
  },
  
  // Get a single brand by ID
  getBrand: async (id: number): Promise<ApiResponse<Brand>> => {
    return fetchAPI(`/brands/${id}`);
  },
};

// Listings related API calls
export const listingsAPI = {
  // Get all listings with filters
  getListings: async (params?: SearchFilters): Promise<ApiResponse<PaginatedResponse<Listing>>> => {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.set(key, value.toString());
        }
      });
    }
    
    return fetchAPI(`/listings?${queryParams.toString()}`);
  },
  
  // Get a single listing by ID
  getListing: async (id: number): Promise<ApiResponse<ListingDetails>> => {
    return fetchAPI(`/listing/${id}`);
  },
  
  // Create a new listing
  createListing: async (listingData: FormData): Promise<ApiResponse<Listing>> => {
    return fetchAPI('/user/listings', {
      method: 'POST',
      body: listingData,
    });
  },
  
  // Update an existing listing
  updateListing: async (id: number, listingData: FormData): Promise<ApiResponse<Listing>> => {
    // Make sure to add the _method field for Laravel to recognize this as a PUT request
    listingData.append('_method', 'PUT');
    
    return fetchAPI(`/user/listings/${id}`, {
      method: 'POST', 
      body: listingData,
    });
  },
  
  // Delete a listing
  deleteListing: async (id: number): Promise<ApiResponse<void>> => {
    return fetchAPI(`/user/listings/${id}`, {
      method: 'DELETE',
    });
  },
  
  // Add a comment to a listing
  addComment: async (listingId: number, content: string): Promise<ApiResponse<Comment>> => {
    return fetchAPI(`/user/listings/${listingId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },
  
  // Add a reply to a comment
  addReply: async (listingId: number, commentId: number, content: string): Promise<ApiResponse<Comment>> => {
    return fetchAPI(`/user/listings/${listingId}/comments/${commentId}/replies`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },
  
  // Delete a comment
  deleteComment: async (listingId: number, commentId: number): Promise<ApiResponse<void>> => {
    return fetchAPI(`/user/listings/${listingId}/comments/${commentId}`, {
      method: 'DELETE',
    });
  },
  
  // Get listing comments
  getComments: async (listingId: number): Promise<ApiResponse<Comment[]>> => {
    return fetchAPI(`/listings/${listingId}/comments`);
  },
  
  // Get related listings
  getRelatedListings: async (listingId: number, limit: number = 4): Promise<ApiResponse<Listing[]>> => {
    return fetchAPI(`/listings/${listingId}/related?limit=${limit}`);
  },
  
  // Add listing to favorites
  addToFavorites: async (listingId: number): Promise<ApiResponse<void>> => {
    return fetchAPI(`/user/listings/${listingId}/favorite`, {
      method: 'POST',
    });
  },
  
  // Remove listing from favorites
  removeFromFavorites: async (listingId: number): Promise<ApiResponse<void>> => {
    return fetchAPI(`/user/listings/${listingId}/favorite`, {
      method: 'DELETE',
    });
  },
  
  // Get user favorites
  getFavorites: async (): Promise<ApiResponse<Listing[]>> => {
    return fetchAPI('/user/favorites');
  },
  
  // Check if listing is favorited
  isFavorite: async (listingId: number): Promise<ApiResponse<boolean>> => {
    try {
      await fetchAPI(`/user/listings/${listingId}/is-favorite`);
      return { success: true, data: true, message: 'Is favorite' };
    } catch (error) {
      return { success: true, data: false, message: 'Not favorite' };
    }
  },
};

// Location related API calls
export const locationAPI = {
  // Get states/provinces
  getStates: async (): Promise<ApiResponse<{ id: number; name: string }[]>> => {
    return fetchAPI('/states');
  },
  
  // Get cities for a state
  getCities: async (stateId: number): Promise<ApiResponse<{ id: number; name: string }[]>> => {
    return fetchAPI(`/states/${stateId}/cities`);
  },
  
  // Get all cities
  getAllCities: async (): Promise<ApiResponse<{ id: number; name: string; state_id: number }[]>> => {
    return fetchAPI('/cities');
  },
  
  // Get user's current location
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
};

// User related API calls
export const userAPI = {
  // Update user profile
  updateProfile: async (userData: FormData): Promise<ApiResponse<User>> => {
    return fetchAPI('/user/profile/update', {
      method: 'POST',
      body: userData,
    });
  },
  
  // Get user listings
  getUserListings: async (userId?: number): Promise<ApiResponse<Listing[]>> => {
    const endpoint = userId ? `/users/${userId}/listings` : '/user/listings';
    return fetchAPI(endpoint);
  },
  
  // Change password
  changePassword: async (data: { current_password: string; password: string; password_confirmation: string }): Promise<ApiResponse<void>> => {
    return fetchAPI('/user/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  // Get user statistics
  getUserStatistics: async (): Promise<ApiResponse<any>> => {
    return fetchAPI('/user/statistics');
  },
};

// Search related API calls
export const searchAPI = {
  // Search listings
  searchListings: async (query: string, filters?: SearchFilters): Promise<ApiResponse<PaginatedResponse<Listing>>> => {
    const queryParams = new URLSearchParams({ query });
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.set(key, String(value));
        }
      });
    }
    
    return fetchAPI(`/search?${queryParams.toString()}`);
  },
};

// For backward compatibility
export const useAds = listingsAPI.getListings;
export const useAd = listingsAPI.getListing;
export const useRelatedAds = listingsAPI.getRelatedListings;
export const useCreateAd = listingsAPI.createListing;
export const useUpdateAd = listingsAPI.updateListing;
export const useDeleteAd = listingsAPI.deleteListing;
