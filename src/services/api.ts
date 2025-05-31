
import { ApiResponse, PaginatedResponse, Listing, Comment, User, SearchFilters, Favorite, Category, SubCategory, Brand, State, City } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://admin2.mixsyria.com/api/v1';

const getAuthToken = () => {
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
};

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
    return data as T;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Categories API
export const categoriesAPI = {
  getCategories: async (): Promise<ApiResponse<Category[]>> => {
    return fetchAPI('/categories');
  },

  getCategory: async (id: number): Promise<ApiResponse<Category>> => {
    return fetchAPI(`/categories/${id}`);
  },

  getSubCategories: async (): Promise<ApiResponse<SubCategory[]>> => {
    return fetchAPI('/subcategories');
  },

  getChildCategories: async (): Promise<ApiResponse<SubCategory[]>> => {
    return fetchAPI('/childcategories');
  },
};

// Brands API
export const brandsAPI = {
  getBrands: async (): Promise<ApiResponse<Brand[]>> => {
    return fetchAPI('/brands');
  },
};

// Location API
export const locationAPI = {
  getStates: async (): Promise<ApiResponse<State[]>> => {
    return fetchAPI('/states');
  },

  getCities: async (stateId: number): Promise<ApiResponse<City[]>> => {
    return fetchAPI(`/states/${stateId}/cities`);
  },

  getAllCities: async (): Promise<ApiResponse<City[]>> => {
    return fetchAPI('/cities');
  },
};

// Listings API
export const listingsAPI = {
  getListings: async (params?: SearchFilters): Promise<ApiResponse<PaginatedResponse<Listing>>> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    return fetchAPI(`/listings${queryString ? `?${queryString}` : ''}`);
  },

  getListing: async (id: number): Promise<ApiResponse<Listing>> => {
    return fetchAPI(`/listings/${id}`);
  },

  createListing: async (listingData: FormData): Promise<ApiResponse<Listing>> => {
    return fetchAPI('/listings', {
      method: 'POST',
      body: listingData,
    });
  },

  updateListing: async (id: number, listingData: FormData): Promise<ApiResponse<Listing>> => {
    return fetchAPI(`/listings/${id}`, {
      method: 'POST',
      body: listingData,
    });
  },

  deleteListing: async (id: number): Promise<ApiResponse<void>> => {
    return fetchAPI(`/listings/${id}`, {
      method: 'DELETE',
    });
  },

  getRelatedListings: async (listingId: number, limit: number = 4): Promise<ApiResponse<Listing[]>> => {
    return fetchAPI(`/listings/${listingId}/related?limit=${limit}`);
  },

  getComments: async (listingId: number): Promise<ApiResponse<Comment[]>> => {
    return fetchAPI(`/listings/${listingId}/comments`);
  },

  addComment: async (listingId: number, content: string): Promise<ApiResponse<Comment>> => {
    return fetchAPI(`/listings/${listingId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },

  addReply: async (listingId: number, commentId: number, content: string): Promise<ApiResponse<Comment>> => {
    return fetchAPI(`/listings/${listingId}/comments/${commentId}/replies`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },

  deleteComment: async (listingId: number, commentId: number): Promise<ApiResponse<void>> => {
    return fetchAPI(`/listings/${listingId}/comments/${commentId}`, {
      method: 'DELETE',
    });
  },

  editComment: async (listingId: number, commentId: number, content: string): Promise<ApiResponse<Comment>> => {
    return fetchAPI(`/listings/${listingId}/comments/${commentId}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
  },

  deleteReply: async (listingId: number, commentId: number, replyId: number): Promise<ApiResponse<void>> => {
    return fetchAPI(`/listings/${listingId}/comments/${commentId}/replies/${replyId}`, {
      method: 'DELETE',
    });
  },

  editReply: async (listingId: number, commentId: number, replyId: number, content: string): Promise<ApiResponse<Comment>> => {
    return fetchAPI(`/listings/${listingId}/comments/${commentId}/replies/${replyId}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
  },

  addToFavorites: async (listingId: number): Promise<ApiResponse<void>> => {
    return fetchAPI('/user/favorites', {
      method: 'POST',
      body: JSON.stringify({ listing_id: listingId }),
    });
  },

  removeFromFavorites: async (listingId: number): Promise<ApiResponse<void>> => {
    return fetchAPI(`/user/favorites/${listingId}`, {
      method: 'DELETE',
    });
  },

  getFavorites: async (): Promise<ApiResponse<PaginatedResponse<Favorite>>> => {
    return fetchAPI('/user/favorites');
  },

  isFavorite: async (listingId: number): Promise<ApiResponse<{ is_favorited: boolean }>> => {
    return fetchAPI(`/listings/${listingId}/favorite-status`);
  },
};

// User API
export const userAPI = {
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    return fetchAPI('/user');
  },

  getUserListings: async (userId?: number): Promise<ApiResponse<Listing[]>> => {
    const endpoint = userId ? `/users/${userId}/listings` : '/user/listings';
    return fetchAPI(endpoint);
  },

  updateProfile: async (data: FormData): Promise<ApiResponse<User>> => {
    return fetchAPI('/user/profile', {
      method: 'POST',
      body: data,
    });
  },

  changePassword: async (data: { current_password: string; password: string; password_confirmation: string }): Promise<ApiResponse<void>> => {
    return fetchAPI('/user/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getUserStatistics: async (): Promise<ApiResponse<any>> => {
    return fetchAPI('/user/statistics');
  },
};

// Search API
export const searchAPI = {
  searchListings: async (query: string, filters?: SearchFilters): Promise<ApiResponse<PaginatedResponse<Listing>>> => {
    const queryParams = new URLSearchParams({ search: query });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    return fetchAPI(`/listings?${queryParams.toString()}`);
  },
};

// Auth API
export const authAPI = {
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    return fetchAPI('/user');
  },

  login: async (email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> => {
    return fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (userData: any): Promise<ApiResponse<{ user: User; token: string }>> => {
    return fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  logout: async (): Promise<ApiResponse<void>> => {
    return fetchAPI('/auth/logout', {
      method: 'POST',
    });
  },
};

// Legacy API object for backward compatibility
export const api = {
  // Listings
  getListings: listingsAPI.getListings,
  getListing: listingsAPI.getListing,
  createListing: listingsAPI.createListing,
  updateListing: listingsAPI.updateListing,
  deleteListing: listingsAPI.deleteListing,
  getUserListings: userAPI.getUserListings,

  // Comments
  getComments: listingsAPI.getComments,
  addComment: listingsAPI.addComment,
  addReply: listingsAPI.addReply,
  deleteComment: listingsAPI.deleteComment,
  editComment: listingsAPI.editComment,
  deleteReply: listingsAPI.deleteReply,
  editReply: listingsAPI.editReply,

  // Favorites
  getFavorites: listingsAPI.getFavorites,
  addToFavorites: listingsAPI.addToFavorites,
  removeFromFavorites: listingsAPI.removeFromFavorites,
  isFavorite: listingsAPI.isFavorite,

  // Auth
  getCurrentUser: authAPI.getCurrentUser,
  login: authAPI.login,
  register: authAPI.register,
  logout: authAPI.logout,
};
