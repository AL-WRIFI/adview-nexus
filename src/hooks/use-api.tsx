
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  categoriesAPI, 
  brandsAPI, 
  listingsAPI, 
  locationAPI, 
  userAPI, 
  searchAPI 
} from '@/services/api';
import { SearchFilters } from '@/types';

// Category hooks
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesAPI.getCategories(),
    select: (data) => data.data,
  });
}

export function useCategory(id: number) {
  return useQuery({
    queryKey: ['categories', id],
    queryFn: () => categoriesAPI.getCategory(id),
    select: (data) => data.data,
    enabled: !!id,
  });
}

export function useSubCategories() {
  return useQuery({
    queryKey: ['subcategories'],
    queryFn: () => categoriesAPI.getSubCategories(),
    select: (data) => data.data,
  });
}

export function useChildCategories() {
  return useQuery({
    queryKey: ['childcategories'],
    queryFn: () => categoriesAPI.getChildCategories(),
    select: (data) => data.data,
  });
}

// Brand hooks
export function useBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: () => brandsAPI.getBrands(),
    select: (data) => data.data,
  });
}

export function useBrand(categoryId?: number) {
  return useQuery({
    queryKey: ['brands', { categoryId }],
    queryFn: () => brandsAPI.getBrands(),
    select: (data) => data.data,
    enabled: !!categoryId,
  });
}

// Listing hooks
export function useListings(filters?: SearchFilters) {
  return useQuery({
    queryKey: ['listings', filters],
    queryFn: () => listingsAPI.getListings(filters),
    select: (data) => data.data,
  });
}

export function useListing(id: number) {
  return useQuery({
    queryKey: ['listings', id],
    queryFn: () => listingsAPI.getListing(id),
    select: (data) => data.data,
    enabled: !!id,
  });
}

export function useRelatedListings(listingId: number, limit: number = 4) {
  return useQuery({
    queryKey: ['related', listingId, limit],
    queryFn: () => listingsAPI.getRelatedListings(listingId, limit),
    select: (data) => data.data,
    enabled: !!listingId,
  });
}

export function useCreateListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => listingsAPI.createListing(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['user-listings'] });
    },
  });
}

export function useUpdateListing(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => listingsAPI.updateListing(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings', id] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['user-listings'] });
    },
  });
}

export function useDeleteListing(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => listingsAPI.deleteListing(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['user-listings'] });
    },
  });
}

export function useAddComment(listingId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => listingsAPI.addComment(listingId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings', listingId, 'comments'] });
    },
  });
}

export function useAddReply(listingId: number, commentId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => listingsAPI.addReply(listingId, commentId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings', listingId, 'comments'] });
    },
  });
}

export function useDeleteComment(listingId: number, commentId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => listingsAPI.deleteComment(listingId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings', listingId, 'comments'] });
    },
  });
}

export function useListingComments(listingId: number) {
  return useQuery({
    queryKey: ['listings', listingId, 'comments'],
    queryFn: () => listingsAPI.getComments(listingId),
    select: (data) => data.data,
    enabled: !!listingId,
  });
}

export function useAddToFavorites() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (listingId: number) => listingsAPI.addToFavorites(listingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}

export function useRemoveFromFavorites() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (listingId: number) => listingsAPI.removeFromFavorites(listingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}

export function useFavorites() {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: () => listingsAPI.getFavorites(),
    select: (data) => data.data,
  });
}

export function useIsFavorite(listingId: number) {
  return useQuery({
    queryKey: ['is-favorite', listingId],
    queryFn: () => listingsAPI.isFavorite(listingId),
    select: (data) => data.data,
    enabled: !!listingId,
  });
}

// Location hooks
export function useStates() {
  return useQuery({
    queryKey: ['states'],
    queryFn: () => locationAPI.getStates(),
    select: (data) => data.data,
  });
}

export function useCities(stateId?: number) {
  return useQuery({
    queryKey: ['cities', stateId],
    queryFn: () => stateId ? locationAPI.getCities(stateId) : locationAPI.getAllCities(),
    select: (data) => data.data,
    enabled: !!stateId,
  });
}

export function useAllCities() {
  return useQuery({
    queryKey: ['all-cities'],
    queryFn: () => locationAPI.getAllCities(),
    select: (data) => data.data,
  });
}

export function useCurrentLocation() {
  return useQuery({
    queryKey: ['current-location'],
    queryFn: async () => {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation is not supported'));
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
    enabled: false,
  });
}

// User hooks
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => userAPI.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
  });
}

export function useUserListings(userId?: number) {
  return useQuery({
    queryKey: ['user-listings', userId],
    queryFn: () => userAPI.getUserListings(userId),
    select: (data) => data.data,
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: { current_password: string; password: string; password_confirmation: string }) => 
      userAPI.changePassword(data),
  });
}

export function useUserStatistics() {
  return useQuery({
    queryKey: ['user-statistics'],
    queryFn: () => userAPI.getUserStatistics(),
    select: (data) => data.data,
  });
}

// Search hooks
export function useSearchListings(query: string, filters?: SearchFilters) {
  return useQuery({
    queryKey: ['search', query, filters],
    queryFn: () => searchAPI.searchListings(query, filters),
    select: (data) => data.data,
    enabled: !!query,
  });
}
