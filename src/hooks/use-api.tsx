
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SearchFilters, Listing, User, Category, Brand, State, City, Comment, Favorite, PaginatedResponse, ApiResponse } from '@/types';
import { 
  listingsAPI, 
  userListingsAPI,
  profileAPI, 
  categoriesAPI, 
  locationAPI, 
  authAPI,
  promotionAPI,
  accountAPI,
  settingsAPI,
  TokenManager
} from '@/services/api';

// Query Keys
const QUERY_KEYS = {
  currentUser: ['currentUser'],
  ads: (filters?: SearchFilters) => ['ads', filters],
  listings: (filters?: SearchFilters) => ['listings', filters],
  listing: (id: number) => ['listing', id],
  userListings: ['userListings'],
  categories: ['categories'],
  category: (id: number) => ['category', id],
  subCategories: ['subCategories'],
  childCategories: ['childCategories'],
  brands: ['brands'],
  brandsByCategory: (categoryId: number) => ['brands', 'category', categoryId],
  states: ['states'],
  cities: (stateId?: number) => ['cities', stateId],
  allCities: ['allCities'],
  favorites: ['favorites'],
  isFavorite: (listingId: number) => ['isFavorite', listingId],
  comments: (listingId: number) => ['comments', listingId],
  relatedAds: (listingId: number, limit: number) => ['relatedAds', listingId, limit],
  currentLocation: ['currentLocation'],
  promotionPackages: ['promotionPackages'],
  userPromotions: ['userPromotions'],
  accountSettings: ['accountSettings'],
  verificationStatus: ['verificationStatus'],
  siteSettings: ['siteSettings'],
  basicSettings: ['basicSettings'],
  colorSettings: ['colorSettings'],
  listingSettings: ['listingSettings'],
} as const;

// User Authentication hooks
export const useCurrentUser = () => {
  return useQuery({
    queryKey: QUERY_KEYS.currentUser,
    queryFn: () => profileAPI.getProfile(),
    retry: (failureCount, error: any) => {
      // Don't retry on 401 errors
      if (error?.message?.includes('401') || error?.message?.includes('Authentication')) {
        return false;
      }
      return failureCount < 2;
    },
    enabled: TokenManager.hasToken(),
    select: (data) => data.data,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ identifier, password }: { identifier: string; password: string }) =>
      authAPI.login(identifier, password),
    onSuccess: (data) => {
      if (data.data?.token) {
        TokenManager.setToken(data.data.token);
      }
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.currentUser });
    },
    onError: (error) => {
      console.error('Login error:', error);
      TokenManager.removeToken();
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userData: {
      first_name: string;
      last_name: string;
      username: string;
      email: string;
      phone: string;
      city_id: number;
      state_id: number;
      password: string;
      password_confirmation: string;
    }) => authAPI.register(userData),
    onSuccess: (data) => {
      if (data.data?.token) {
        TokenManager.setToken(data.data.token);
      }
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.currentUser });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      TokenManager.removeToken();
      queryClient.clear();
    },
    onError: () => {
      // Even if logout fails on server, clear local state
      TokenManager.removeToken();
      queryClient.clear();
    },
  });
};

// Listings hooks
export const useAds = (filters?: SearchFilters) => {
  return useQuery({
    queryKey: QUERY_KEYS.ads(filters),
    queryFn: () => listingsAPI.getListings(filters),
    select: (data) => data.data,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useListings = (filters?: SearchFilters) => {
  return useQuery({
    queryKey: QUERY_KEYS.listings(filters),
    queryFn: () => listingsAPI.getListings(filters),
    select: (data) => data.data,
    staleTime: 5 * 60 * 1000,
  });
};

export const useListing = (id: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.listing(id),
    queryFn: () => listingsAPI.getListing(id),
    select: (data) => data.data,
    enabled: !!id,
  });
};

export const useAd = (id: number) => {
  return useListing(id); // Alias for useListing
};

export const useRelatedAds = (listingId: number, limit: number = 4) => {
  return useQuery({
    queryKey: QUERY_KEYS.relatedAds(listingId, limit),
    queryFn: () => listingsAPI.getRelatedListings(listingId, limit),
    select: (data) => data.data,
    enabled: !!listingId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useUserListings = () => {
  return useQuery({
    queryKey: QUERY_KEYS.userListings,
    queryFn: () => userListingsAPI.getUserListings(),
    select: (data) => data.data,
    enabled: TokenManager.hasToken(),
  });
};

export const useCreateListing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => userListingsAPI.createListing(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.listings() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userListings });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ads() });
    },
  });
};

export const useUpdateListing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) => 
      userListingsAPI.updateListing(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.listings() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userListings });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ads() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.listing(variables.id) });
    },
  });
};

export const useDeleteListing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => userListingsAPI.deleteListing(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.listings() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userListings });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ads() });
    },
  });
};

// Categories hooks
export const useCategories = () => {
  return useQuery({
    queryKey: QUERY_KEYS.categories,
    queryFn: () => categoriesAPI.getCategories(),
    select: (data) => data.data,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useCategory = (id?: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.category(id!),
    queryFn: () => categoriesAPI.getCategory(id!),
    select: (data) => data.data,
    enabled: !!id,
    staleTime: 30 * 60 * 1000,
  });
};

export const useSubCategories = () => {
  return useQuery({
    queryKey: QUERY_KEYS.subCategories,
    queryFn: () => categoriesAPI.getSubCategories(),
    select: (data) => data.data,
    staleTime: 30 * 60 * 1000,
  });
};

export const useChildCategories = () => {
  return useQuery({
    queryKey: QUERY_KEYS.childCategories,
    queryFn: () => categoriesAPI.getChildCategories(),
    select: (data) => data.data,
    staleTime: 30 * 60 * 1000,
  });
};

// Brands hooks
export const useBrands = () => {
  return useQuery({
    queryKey: QUERY_KEYS.brands,
    queryFn: () => categoriesAPI.getBrands(),
    select: (data) => data.data,
    staleTime: 30 * 60 * 1000,
  });
};

export const useBrandsByCategory = (categoryId?: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.brandsByCategory(categoryId!),
    queryFn: () => categoriesAPI.getBrandsByCategory(categoryId!),
    select: (data) => data.data,
    enabled: !!categoryId,
    staleTime: 30 * 60 * 1000,
  });
};

export const useBrand = (id: number) => {
  return useQuery({
    queryKey: ['brand', id],
    queryFn: () => Promise.resolve({ data: null }),
    enabled: !!id,
  });
};

// Location hooks
export const useStates = () => {
  return useQuery({
    queryKey: QUERY_KEYS.states,
    queryFn: () => locationAPI.getStates(),
    select: (data) => data.data,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

export const useCities = (stateId?: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.cities(stateId),
    queryFn: () => stateId ? locationAPI.getCitiesByState(stateId) : locationAPI.getAllCities(),
    select: (data) => data.data,
    enabled: stateId !== undefined,
    staleTime: 60 * 60 * 1000,
  });
};

export const useAllCities = () => {
  return useQuery({
    queryKey: QUERY_KEYS.allCities,
    queryFn: () => locationAPI.getAllCities(),
    select: (data) => data.data,
    staleTime: 60 * 60 * 1000,
  });
};

export const useCurrentLocation = () => {
  return useQuery({
    queryKey: QUERY_KEYS.currentLocation,
    queryFn: () => {
      return new Promise<{ lat: number; lon: number }>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation is not supported'));
          return;
        }
        
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            });
          },
          (error) => reject(error),
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
        );
      });
    },
    retry: false,
    staleTime: 300000, // 5 minutes
  });
};

// Favorites hooks
export const useFavorites = () => {
  return useQuery({
    queryKey: QUERY_KEYS.favorites,
    queryFn: () => profileAPI.getFavorites(),
    select: (data) => data.data,
    enabled: TokenManager.hasToken(),
  });
};

export const useIsFavorite = (listingId: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.isFavorite(listingId),
    queryFn: () => profileAPI.checkIsFavorite(listingId),
    select: (data) => data.data?.is_favorite || false,
    enabled: !!listingId && TokenManager.hasToken(),
  });
};

export const useAddToFavorites = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (listingId: number) => profileAPI.addToFavorites(listingId),
    onSuccess: (_, listingId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.favorites });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.isFavorite(listingId) });
    },
  });
};

export const useRemoveFromFavorites = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (listingId: number) => profileAPI.removeFromFavorites(listingId),
    onSuccess: (_, listingId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.favorites });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.isFavorite(listingId) });
    },
  });
};

// Comments hooks
export const useComments = (listingId: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.comments(listingId),
    queryFn: () => listingsAPI.getComments(listingId),
    select: (data) => data.data,
    enabled: !!listingId,
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ listingId, content }: { listingId: number; content: string }) =>
      userListingsAPI.addComment(listingId, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.comments(variables.listingId) });
    },
  });
};

export const useAddReply = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ listingId, commentId, content }: { listingId: number; commentId: number; content: string }) =>
      userListingsAPI.addReply(listingId, commentId, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.comments(variables.listingId) });
    },
  });
};

export const useEditReply = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ listingId, commentId, replyId, content }: { listingId: number; commentId: number; replyId: number; content: string }) =>
      userListingsAPI.editReply(listingId, commentId, replyId, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.comments(variables.listingId) });
    },
  });
};

export const useDeleteReply = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ listingId, commentId, replyId }: { listingId: number; commentId: number; replyId: number }) =>
      userListingsAPI.deleteReply(listingId, commentId, replyId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.comments(variables.listingId) });
    },
  });
};

// User profile hooks
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => profileAPI.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.currentUser });
    },
  });
};

// Settings hooks
export const useBasicSettings = () => {
  return useQuery({
    queryKey: QUERY_KEYS.basicSettings,
    queryFn: () => settingsAPI.getBasicSettings(),
    select: (data) => data.data,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

export const useColorSettings = () => {
  return useQuery({
    queryKey: QUERY_KEYS.colorSettings,
    queryFn: () => settingsAPI.getColorSettings(),
    select: (data) => data.data,
    staleTime: 60 * 60 * 1000,
  });
};

export const useListingSettings = () => {
  return useQuery({
    queryKey: QUERY_KEYS.listingSettings,
    queryFn: () => settingsAPI.getListingSettings(),
    select: (data) => data.data,
    staleTime: 60 * 60 * 1000,
  });
};

// Promotion hooks
export const usePromotionPackages = () => {
  return useQuery({
    queryKey: QUERY_KEYS.promotionPackages,
    queryFn: () => promotionAPI.getPromotionPackages(),
    select: (data) => data.data,
    staleTime: 30 * 60 * 1000,
  });
};

export const useUserPromotions = () => {
  return useQuery({
    queryKey: QUERY_KEYS.userPromotions,
    queryFn: () => promotionAPI.getUserPromotions(),
    select: (data) => data.data,
    enabled: TokenManager.hasToken(),
  });
};

// Utility hooks
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => authAPI.sendVerificationCode(email),
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ token, password, password_confirmation }: { 
      token: string; 
      password: string; 
      password_confirmation: string; 
    }) => authAPI.resetPassword({ token, password, password_confirmation }),
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: { 
      current_password: string; 
      new_password: string; 
      new_password_confirmation: string; 
    }) => authAPI.changePassword(data),
  });
};

// Search hooks
export const useSearch = (query: string, filters?: SearchFilters) => {
  return useQuery({
    queryKey: ['search', query, filters],
    queryFn: () => listingsAPI.getListings({ search: query, ...filters }),
    select: (data) => data.data,
    enabled: !!query,
  });
};
