
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { SearchFilters, PaginatedResponse, Listing, ApiResponse, Category, Brand, User } from '@/types';

// Cache time settings
const defaultCacheTime = 5 * 60 * 1000; // 5 minutes
const extendedCacheTime = 15 * 60 * 1000; // 15 minutes

// Add useMyAds function
export const useMyAds = () => {
  return useQuery({
    queryKey: ['myAds'],
    queryFn: async () => {
      try {
        const response = await api.get('/user/listings');
        return response.data;
      } catch (error) {
        console.error('Error fetching my ads:', error);
        throw error;
      }
    },
    staleTime: defaultCacheTime
  });
};

// Add useFavorites function
export const useFavorites = () => {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      try {
        const response = await api.get('/user/favorites');
        return response.data;
      } catch (error) {
        console.error('Error fetching favorites:', error);
        throw error;
      }
    },
    staleTime: defaultCacheTime
  });
};

// Add useRemoveFromFavorites function
export const useRemoveFromFavorites = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (adId: number) => {
      try {
        const response = await api.delete(`/user/favorites/${adId}`);
        return response.data;
      } catch (error) {
        console.error('Error removing from favorites:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    }
  });
};

// Export all the query hooks you might need
export const useAds = (filters: SearchFilters) => {
  return useQuery({
    queryKey: ['ads', filters],
    queryFn: async () => {
      try {
        const response = await api.get('/listings', { params: filters });
        return response.data;
      } catch (error) {
        console.error('Error fetching ads:', error);
        throw error;
      }
    },
    staleTime: defaultCacheTime
  });
};

export const useListings = (filters: SearchFilters) => {
  return useQuery({
    queryKey: ['listings', filters],
    queryFn: async () => {
      try {
        const response = await api.get('/listings', { params: filters });
        return response.data;
      } catch (error) {
        console.error('Error fetching listings:', error);
        throw error;
      }
    },
    staleTime: defaultCacheTime
  });
};

export const useCategory = (categoryId?: number) => {
  return useQuery({
    queryKey: ['category', categoryId],
    queryFn: async () => {
      if (!categoryId) return null;
      try {
        const response = await api.get(`/categories/${categoryId}`);
        return response.data.data;
      } catch (error) {
        console.error('Error fetching category:', error);
        throw error;
      }
    },
    enabled: !!categoryId,
    staleTime: extendedCacheTime // Categories change less frequently
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const response = await api.get('/categories');
        return response.data.data;
      } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }
    },
    staleTime: extendedCacheTime // Categories change less frequently
  });
};

export const useBrands = () => {
  return useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      try {
        const response = await api.get('/brands');
        return response.data.data;
      } catch (error) {
        console.error('Error fetching brands:', error);
        throw error;
      }
    },
    staleTime: extendedCacheTime // Brands change less frequently
  });
};

export const useAllCities = () => {
  return useQuery({
    queryKey: ['cities'],
    queryFn: async () => {
      try {
        const response = await api.get('/cities');
        return response.data.data;
      } catch (error) {
        console.error('Error fetching cities:', error);
        throw error;
      }
    },
    staleTime: extendedCacheTime // Cities change less frequently
  });
};

export const useStates = () => {
  return useQuery({
    queryKey: ['states'],
    queryFn: async () => {
      try {
        const response = await api.get('/states');
        return response.data.data;
      } catch (error) {
        console.error('Error fetching states:', error);
        throw error;
      }
    },
    staleTime: extendedCacheTime // States change less frequently
  });
};

export const useCurrentLocation = () => {
  return useQuery({
    queryKey: ['location'],
    queryFn: async () => {
      return new Promise<{ lat: number; lng: number }>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation is not supported by your browser'));
          return;
        }
        
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          (error) => {
            console.warn('Error getting location:', error);
            reject(error);
          }
        );
      });
    },
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000 // 1 hour - location doesn't change often
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userData: any) => {
      try {
        const response = await api.post('/auth/register', userData);
        return response.data;
      } catch (error) {
        console.error('Error registering user:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    }
  });
};
