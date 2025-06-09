import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SearchFilters, Listing, User, Category, Brand, State, City, Comment, Favorite, PaginatedResponse, ApiResponse } from '@/types';
import { 
  authAPI, 
  profileAPI, 
  listingsAPI, 
  userListingsAPI, 
  categoriesAPI, 
  locationAPI,
  settingsAPI,
  promotionAPI
} from '@/services/api';

// Mock API calls - replace with actual API implementations
const mockApiCall = (data: any, delay: number = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

// User Authentication hooks
export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async (): Promise<User | null> => {
      try {
        const response = await profileAPI.getProfile();
        return response.data;
      } catch (error) {
        console.error('Error fetching current user:', error);
        return null;
      }
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ identifier, password }: { identifier: string; password: string }) => {
      const response = await authAPI.login(identifier, password);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userData: any) => {
      const response = await authAPI.register(userData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const response = await authAPI.logout();
      return response.data;
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
}

// User Listings Hook
export function useUserListings() {
  return useQuery({
    queryKey: ['user-listings'],
    queryFn: async (): Promise<Listing[]> => {
      try {
        const response = await userListingsAPI.getUserListings();
        return response.data;
      } catch (error) {
        console.error('Error fetching user listings:', error);
        return [];
      }
    },
  });
}

// Ads Hook  
export function useAds(filters?: SearchFilters) {
  return useQuery({
    queryKey: ['ads', filters],
    queryFn: async (): Promise<PaginatedResponse<Listing>> => {
      try {
        const response = await listingsAPI.getListings(filters);
        return response.data;
      } catch (error) {
        console.error('Error fetching ads:', error);
        return {
          data: [],
          current_page: 1,
          last_page: 1,
          per_page: 10,
          total: 0
        };
      }
    },
  });
}

// Categories Hook
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async (): Promise<Category[]> => {
      try {
        const response = await categoriesAPI.getCategories();
        return response.data;
      } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
      }
    },
  });
}

// Listings Hook
export function useListings(filters?: SearchFilters) {
  return useQuery({
    queryKey: ['listings', filters],
    queryFn: async (): Promise<PaginatedResponse<Listing>> => {
      try {
        const response = await listingsAPI.getListings(filters);
        return response.data;
      } catch (error) {
        console.error('Error fetching listings:', error);
        return {
          data: [],
          current_page: 1,
          last_page: 1,
          per_page: 12,
          total: 0
        };
      }
    },
  });
}

// Favorites Hook
export function useFavorites() {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: async (): Promise<PaginatedResponse<Favorite>> => {
      try {
        const response = await profileAPI.getFavorites();
        return response.data;
      } catch (error) {
        console.error('Error fetching favorites:', error);
        return {
          data: [],
          current_page: 1,
          last_page: 1,
          per_page: 10,
          total: 0
        };
      }
    },
  });
}

// User Analytics Hook
export function useUserAnalytics() {
  return useQuery({
    queryKey: ['user-analytics'],
    queryFn: async () => {
      try {
        const response = await profileAPI.getUserStats();
        return response.data;
      } catch (error) {
        console.error('Error fetching user analytics:', error);
        return {
          totalListings: 0,
          activeListings: 0,
          totalViews: 0,
          totalFavorites: 0,
          totalComments: 0
        };
      }
    },
  });
}

// User Stats Hook
export function useUserStats() {
  return useQuery({
    queryKey: ['user-stats'],
    queryFn: async () => {
      try {
        const response = await profileAPI.getUserStats();
        return response.data;
      } catch (error) {
        console.error('Error fetching user stats:', error);
        return {
          totalListings: 0,
          activeListings: 0,
          totalViews: 0,
          totalFavorites: 0,
          totalComments: 0
        };
      }
    },
  });
}

// Other hooks with real API calls
export function useBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: async (): Promise<Brand[]> => {
      try {
        const response = await categoriesAPI.getBrands();
        return response.data;
      } catch (error) {
        console.error('Error fetching brands:', error);
        return [];
      }
    },
  });
}

export function useStates() {
  return useQuery({
    queryKey: ['states'],
    queryFn: async (): Promise<State[]> => {
      try {
        const response = await locationAPI.getStates();
        return response.data;
      } catch (error) {
        console.error('Error fetching states:', error);
        return [];
      }
    },
  });
}

export function useAllCities() {
  return useQuery({
    queryKey: ['all-cities'],
    queryFn: async (): Promise<City[]> => {
      try {
        const response = await locationAPI.getAllCities();
        return response.data;
      } catch (error) {
        console.error('Error fetching cities:', error);
        return [];
      }
    },
  });
}

export function useCities(stateId?: number) {
  return useQuery({
    queryKey: ['cities', stateId],
    queryFn: async (): Promise<City[]> => {
      if (!stateId) return [];
      try {
        const response = await locationAPI.getCitiesByState(stateId);
        return response.data;
      } catch (error) {
        console.error('Error fetching cities by state:', error);
        return [];
      }
    },
    enabled: !!stateId,
  });
}

export function useCurrentLocation() {
  return useQuery({
    queryKey: ['current-location'],
    queryFn: async () => {
      // This would use browser geolocation API
      return new Promise((resolve) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                lat: position.coords.latitude,
                lon: position.coords.longitude
              });
            },
            () => resolve({ lat: 0, lon: 0 })
          );
        } else {
          resolve({ lat: 0, lon: 0 });
        }
      });
    },
  });
}

export function useComments(listingId: number) {
  return useQuery({
    queryKey: ['comments', listingId],
    queryFn: async (): Promise<Comment[]> => {
      try {
        const response = await listingsAPI.getComments(listingId);
        return response.data;
      } catch (error) {
        console.error('Error fetching comments:', error);
        return [];
      }
    },
  });
}

export function useAd(id: string | number) {
  return useQuery({
    queryKey: ['ad', id],
    queryFn: async (): Promise<Listing | null> => {
      try {
        const response = await listingsAPI.getListing(Number(id));
        return response.data;
      } catch (error) {
        console.error('Error fetching ad:', error);
        return null;
      }
    },
  });
}

export function useRelatedAds(categoryId?: number, excludeId?: number) {
  return useQuery({
    queryKey: ['related-ads', categoryId, excludeId],
    queryFn: async (): Promise<Listing[]> => {
      if (!excludeId) return [];
      try {
        const response = await listingsAPI.getRelatedListings(excludeId);
        return response.data;
      } catch (error) {
        console.error('Error fetching related ads:', error);
        return [];
      }
    },
    enabled: !!categoryId,
  });
}

export function useListing(id: string | number) {
  return useQuery({
    queryKey: ['listing', id],
    queryFn: async (): Promise<Listing | null> => {
      try {
        const response = await listingsAPI.getListing(Number(id));
        return response.data;
      } catch (error) {
        console.error('Error fetching listing:', error);
        return null;
      }
    },
  });
}

// Mutation hooks
export function useAddToFavorites() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (listingId: number) => {
      const response = await profileAPI.addToFavorites(listingId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}

export function useRemoveFromFavorites() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (listingId: number) => {
      const response = await profileAPI.removeFromFavorites(listingId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}

export function useIsFavorite(listingId: number) {
  return useQuery({
    queryKey: ['is-favorite', listingId],
    queryFn: async () => {
      try {
        const response = await profileAPI.checkIsFavorite(listingId);
        return response.data.is_favorite;
      } catch (error) {
        console.error('Error checking favorite status:', error);
        return false;
      }
    },
  });
}

export function useAddComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ listingId, content }: { listingId: number; content: string }) => {
      const response = await userListingsAPI.addComment(listingId, content);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.listingId] });
    },
  });
}

export function useEditComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ listingId, commentId, content }: { listingId: number; commentId: number; content: string }) => {
      const response = await userListingsAPI.editComment(listingId, commentId, content);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ listingId, commentId }: { listingId: number; commentId: number }) => {
      const response = await userListingsAPI.deleteComment(listingId, commentId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
}

export function useAddReply() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ listingId, commentId, content }: { listingId: number; commentId: number; content: string }) => {
      const response = await userListingsAPI.addReply(listingId, commentId, content);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
}

export function useEditReply() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ listingId, commentId, replyId, content }: { listingId: number; commentId: number; replyId: number; content: string }) => {
      const response = await userListingsAPI.editReply(listingId, commentId, replyId, content);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
}

export function useDeleteReply() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ listingId, commentId, replyId }: { listingId: number; commentId: number; replyId: number }) => {
      const response = await userListingsAPI.deleteReply(listingId, commentId, replyId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
}

export function useCreateListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: FormData) => {
      const response = await userListingsAPI.createListing(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-listings'] });
    },
  });
}

export function useUpdateListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string | number; data: FormData }) => {
      const response = await userListingsAPI.updateListing(Number(id), data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-listings'] });
    },
  });
}

export function useDeleteListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await userListingsAPI.deleteListing(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-listings'] });
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: FormData) => {
      const response = await profileAPI.updateProfile(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
}

// Settings hooks
export function useSiteIdentity() {
  return useQuery({
    queryKey: ['site-identity'],
    queryFn: async () => {
      try {
        const response = await settingsAPI.getSiteIdentity();
        return response.data;
      } catch (error) {
        console.error('Error fetching site identity:', error);
        return {
          site_logo: '',
          site_white_logo: '',
          site_favicon: ''
        };
      }
    },
  });
}

export function useBasicSettings() {
  return useQuery({
    queryKey: ['basic-settings'],
    queryFn: async () => {
      try {
        const response = await settingsAPI.getBasicSettings();
        return response.data;
      } catch (error) {
        console.error('Error fetching basic settings:', error);
        return {
          site_title: 'Listocean',
          site_tag_line: 'Classifieds ads',
          site_footer_copyright: 'All copyright (C) 2024 Reserved',
          user_email_verify_enable_disable: null,
          user_otp_verify_enable_disable: null
        };
      }
    },
  });
}

export function useColorSettings() {
  return useQuery({
    queryKey: ['color-settings'],
    queryFn: async () => {
      try {
        const response = await settingsAPI.getColorSettings();
        return response.data;
      } catch (error) {
        console.error('Error fetching color settings:', error);
        return {
          site_main_color_one: '#f50a0a',
          site_main_color_two: '#eb1414',
          site_main_color_three: '#f60909',
          heading_color: '#ed0c0c',
          light_color: '#da0b0b',
          extra_light_color: '#e10e0e'
        };
      }
    },
  });
}

export function useListingSettings() {
  return useQuery({
    queryKey: ['listing-settings'],
    queryFn: async () => {
      try {
        const response = await settingsAPI.getListingSettings();
        return response.data;
      } catch (error) {
        console.error('Error fetching listing settings:', error);
        return {
          listing_create_settings: 'all_user',
          listing_create_status_settings: 'pending',
          updated_at: new Date().toISOString()
        };
      }
    },
  });
}
