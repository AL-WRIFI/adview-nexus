import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SearchFilters, Listing, Category, PaginatedResponse, Favorite } from '@/types';

// Mock API calls - replace with actual API implementations
const mockApiCall = (data: any, delay: number = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

// User Listings Hook
export function useUserListings() {
  return useQuery({
    queryKey: ['user-listings'],
    queryFn: async (): Promise<PaginatedResponse<Listing>> => {
      return {
        data: [],
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
      };
    },
  });
}

// Ads Hook  
export function useAds(filters: SearchFilters & { page?: number; per_page?: number }) {
  return useQuery({
    queryKey: ['ads', filters],
    queryFn: async (): Promise<PaginatedResponse<Listing>> => {
      return {
        data: [],
        current_page: filters.page || 1,
        last_page: 1,
        per_page: filters.per_page || 10,
        total: 0
      };
    },
  });
}

// Categories Hook
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async (): Promise<Category[]> => {
      return [];
    },
  });
}

// Listings Hook
export function useListings(filters: SearchFilters) {
  return useQuery({
    queryKey: ['listings', filters],
    queryFn: async (): Promise<PaginatedResponse<Listing>> => {
      return {
        data: [],
        current_page: 1,
        last_page: 1,
        per_page: 12,
        total: 0
      };
    },
  });
}

// Favorites Hook
export function useFavorites() {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: async (): Promise<PaginatedResponse<Favorite>> => {
      return {
        data: [],
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
      };
    },
  });
}

// User Analytics Hook
export function useUserAnalytics() {
  return useQuery({
    queryKey: ['user-analytics'],
    queryFn: async () => {
      return {
        totalListings: 0,
        activeListings: 0,
        totalViews: 0,
        totalFavorites: 0,
        totalComments: 0
      };
    },
  });
}

// Other hooks with proper return types
export function useBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: async () => [],
  });
}

export function useStates() {
  return useQuery({
    queryKey: ['states'],
    queryFn: async () => [],
  });
}

export function useAllCities() {
  return useQuery({
    queryKey: ['all-cities'],
    queryFn: async () => [],
  });
}

export function useCities(stateId?: number) {
  return useQuery({
    queryKey: ['cities', stateId],
    queryFn: async () => [],
    enabled: !!stateId,
  });
}

export function useCurrentLocation() {
  return useQuery({
    queryKey: ['current-location'],
    queryFn: async () => ({ lat: 0, lon: 0 }),
  });
}

export function useComments(listingId: number) {
  return useQuery({
    queryKey: ['comments', listingId],
    queryFn: async () => [],
  });
}

export function useAd(id: string) {
  return useQuery({
    queryKey: ['ad', id],
    queryFn: async () => null,
  });
}

export function useRelatedAds(categoryId?: number) {
  return useQuery({
    queryKey: ['related-ads', categoryId],
    queryFn: async () => [],
    enabled: !!categoryId,
  });
}

export function useListing(id: string) {
  return useQuery({
    queryKey: ['listing', id],
    queryFn: async () => null,
  });
}

// Mutation hooks
export function useAddToFavorites() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (listingId: number) => {
      return await mockApiCall({ success: true });
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
      return await mockApiCall({ success: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}

export function useIsFavorite(listingId: number) {
  return useQuery({
    queryKey: ['is-favorite', listingId],
    queryFn: async () => false,
  });
}

export function useAddComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ listingId, content }: { listingId: number; content: string }) => {
      return await mockApiCall({ success: true });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.listingId] });
    },
  });
}

export function useEditComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ commentId, content }: { commentId: number; content: string }) => {
      return await mockApiCall({ success: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (commentId: number) => {
      return await mockApiCall({ success: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
}

export function useAddReply() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ commentId, content }: { commentId: number; content: string }) => {
      return await mockApiCall({ success: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
}

export function useEditReply() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ replyId, content }: { replyId: number; content: string }) => {
      return await mockApiCall({ success: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
}

export function useDeleteReply() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (replyId: number) => {
      return await mockApiCall({ success: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
}

export function useCreateListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      return await mockApiCall({ success: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-listings'] });
    },
  });
}

export function useUpdateListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return await mockApiCall({ success: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-listings'] });
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      return await mockApiCall({ success: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}
