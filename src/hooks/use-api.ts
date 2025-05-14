
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { SearchFilters, Listing, User } from '@/types';

// Categories
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/categories');
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Brands
export const useBrands = () => {
  return useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const response = await api.get('/brands');
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Locations
export const useStates = () => {
  return useQuery({
    queryKey: ['states'],
    queryFn: async () => {
      const response = await api.get('/states');
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAllCities = () => {
  return useQuery({
    queryKey: ['cities'],
    queryFn: async () => {
      const response = await api.get('/cities');
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCities = (stateId?: number) => {
  return useQuery({
    queryKey: ['cities', stateId],
    queryFn: async () => {
      if (!stateId) return [];
      const response = await api.get(`/cities?state_id=${stateId}`);
      return response.data.data;
    },
    enabled: !!stateId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Current user location
export const useCurrentLocation = () => {
  return useQuery({
    queryKey: ['user-location'],
    queryFn: async () => {
      return new Promise((resolve) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              });
            },
            () => {
              resolve(null); // Error or denied permission
            }
          );
        } else {
          resolve(null); // Geolocation not supported
        }
      });
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: false,
  });
};

// Ads/Listings
export const useAds = (filters?: SearchFilters) => {
  return useQuery({
    queryKey: ['ads', filters],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, String(value));
          }
        });
      }
      
      const response = await api.get(`/listings?${queryParams.toString()}`);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAd = (id?: string | number) => {
  return useQuery({
    queryKey: ['ad', id],
    queryFn: async () => {
      if (!id) throw new Error('Ad ID is required');
      const response = await api.get(`/listings/${id}`);
      return response.data.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// User listings
export const useUserListings = () => {
  return useQuery({
    queryKey: ['user-listings'],
    queryFn: async () => {
      const response = await api.get('/user/listings');
      return response.data.data;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// User favorites
export const useFavorites = () => {
  return useQuery({
    queryKey: ['user-favorites'],
    queryFn: async () => {
      const response = await api.get('/user/favorites');
      return response.data;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// CRUD operations
export const useCreateListing = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/listings', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-listings'] });
      queryClient.invalidateQueries({ queryKey: ['ads'] });
    },
  });
};

export const useUpdateListing = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await api.put(`/listings/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user-listings'] });
      queryClient.invalidateQueries({ queryKey: ['ads'] });
      queryClient.invalidateQueries({ queryKey: ['ad', variables.id] });
    },
  });
};

export const useDeleteListing = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/listings/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-listings'] });
      queryClient.invalidateQueries({ queryKey: ['ads'] });
    },
  });
};

// Favorites management
export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (listingId: number) => {
      const response = await api.post(`/listings/${listingId}/favorite`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-favorites'] });
    },
  });
};
