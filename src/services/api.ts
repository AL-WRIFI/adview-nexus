
import { ApiResponse, PaginatedResponse, Listing, Comment, User, SearchFilters, Favorite } from '@/types';

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

export const api = {
  // Listings
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

  getUserListings: async (): Promise<ApiResponse<Listing[]>> => {
    return fetchAPI('/user/listings');
  },

  // Comments
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

  // Favorites
  getFavorites: async (): Promise<ApiResponse<PaginatedResponse<Favorite>>> => {
    return fetchAPI('/user/favorites');
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

  isFavorite: async (listingId: number): Promise<ApiResponse<{ is_favorited: boolean }>> => {
    return fetchAPI(`/listings/${listingId}/favorite-status`);
  },

  // Auth
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    return fetchAPI('/user');
  },

  login: async (credentials: { email: string; password: string }): Promise<ApiResponse<{ user: User; token: string }>> => {
    return fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
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
