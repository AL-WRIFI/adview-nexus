
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listingsAPI, categoriesAPI, brandsAPI, locationAPI, userAPI } from '@/services/api';
import { SearchFilters, PaginatedResponse, Listing, ApiResponse, Category, Brand } from '@/types';

// Cache time settings
const defaultCacheTime = 5 * 60 * 1000; // 5 minutes
const extendedCacheTime = 15 * 60 * 1000; // 15 minutes

// Listings related hooks
export const useListings = (filters: SearchFilters) => {
  return useQuery({
    queryKey: ['listings', filters],
    queryFn: () => listingsAPI.getListings(filters),
    staleTime: defaultCacheTime
  });
};

export const useListing = (id: number | undefined) => {
  return useQuery({
    queryKey: ['listing', id],
    queryFn: () => id ? listingsAPI.getListing(id) : Promise.reject('No listing ID provided'),
    enabled: !!id,
    staleTime: defaultCacheTime
  });
};

export const useRelatedListings = (listingId: number | undefined, limit: number = 4) => {
  return useQuery({
    queryKey: ['relatedListings', listingId, limit],
    queryFn: () => listingId ? listingsAPI.getRelatedListings(listingId, limit) : Promise.reject('No listing ID provided'),
    enabled: !!listingId,
    staleTime: defaultCacheTime
  });
};

export const useCreateListing = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (listingData: FormData) => listingsAPI.createListing(listingData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['myListings'] });
    }
  });
};

export const useUpdateListing = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) => listingsAPI.updateListing(id, formData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['listing', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['myListings'] });
    }
  });
};

export const useDeleteListing = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => listingsAPI.deleteListing(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['myListings'] });
    }
  });
};

// User listings hooks
export const useMyListings = () => {
  return useQuery({
    queryKey: ['myListings'],
    queryFn: () => userAPI.getUserListings(),
    staleTime: defaultCacheTime
  });
};

// Favorites related hooks
export const useFavorites = () => {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: () => listingsAPI.getFavorites(),
    staleTime: defaultCacheTime
  });
};

export const useAddToFavorites = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (listingId: number) => listingsAPI.addToFavorites(listingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    }
  });
};

export const useRemoveFromFavorites = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (listingId: number) => listingsAPI.removeFromFavorites(listingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    }
  });
};

export const useIsFavorite = (listingId: number | undefined) => {
  return useQuery({
    queryKey: ['isFavorite', listingId],
    queryFn: () => listingId ? listingsAPI.isFavorite(listingId) : Promise.reject('No listing ID provided'),
    enabled: !!listingId,
    staleTime: defaultCacheTime
  });
};

// Category related hooks
export const useCategory = (categoryId: number | undefined) => {
  return useQuery({
    queryKey: ['category', categoryId],
    queryFn: () => categoryId ? categoriesAPI.getCategory(categoryId) : Promise.reject('No category ID provided'),
    enabled: !!categoryId,
    staleTime: extendedCacheTime
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesAPI.getCategories(),
    staleTime: extendedCacheTime
  });
};

export const useSubCategories = () => {
  return useQuery({
    queryKey: ['subcategories'],
    queryFn: () => categoriesAPI.getSubCategories(),
    staleTime: extendedCacheTime
  });
};

export const useChildCategories = () => {
  return useQuery({
    queryKey: ['childcategories'],
    queryFn: () => categoriesAPI.getChildCategories(),
    staleTime: extendedCacheTime
  });
};

// Brand related hooks
export const useBrands = () => {
  return useQuery({
    queryKey: ['brands'],
    queryFn: () => brandsAPI.getBrands(),
    staleTime: extendedCacheTime
  });
};

// Location related hooks
export const useStates = () => {
  return useQuery({
    queryKey: ['states'],
    queryFn: () => locationAPI.getStates(),
    staleTime: extendedCacheTime
  });
};

export const useCities = (stateId: number | undefined) => {
  return useQuery({
    queryKey: ['cities', stateId],
    queryFn: () => stateId ? locationAPI.getCities(stateId) : Promise.reject('No state ID provided'),
    enabled: !!stateId,
    staleTime: extendedCacheTime
  });
};

export const useAllCities = () => {
  return useQuery({
    queryKey: ['allCities'],
    queryFn: () => locationAPI.getAllCities(),
    staleTime: extendedCacheTime
  });
};

export const useCurrentLocation = () => {
  return useQuery({
    queryKey: ['currentLocation'],
    queryFn: locationAPI.getCurrentLocation,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000 // 1 hour - location doesn't change often
  });
};

// For backward compatibility
export const useAds = useListings;
export const useAd = useListing;
export const useCreateAd = useCreateListing;
export const useUpdateAd = useUpdateListing;
export const useDeleteAd = useDeleteListing;
export const useRelatedAds = useRelatedListings;
