
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SearchFilters, Listing, User, Category, Brand, State, City, Comment, Favorite, PaginatedResponse, ApiResponse } from '@/types';
import { 
  listingsAPI, 
  userAPI, 
  categoriesAPI, 
  brandsAPI, 
  locationAPI, 
  authAPI,
  searchAPI 
} from '@/services/api';

// User Authentication hooks
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => authAPI.getCurrentUser(),
    retry: false,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authAPI.login(email, password),
    onSuccess: (data) => {
      if (data.data?.token) {
        localStorage.setItem('authToken', data.data.token);
      }
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userData: any) => authAPI.register(userData),
    onSuccess: (data) => {
      if (data.data?.token) {
        localStorage.setItem('authToken', data.data.token);
      }
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      queryClient.clear();
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => {
      // Implement forgot password API call
      return Promise.resolve({ success: true, data: null });
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) => {
      // Implement reset password API call
      return Promise.resolve({ success: true, data: null });
    },
  });
};

// Listings hooks
export const useAds = (filters?: SearchFilters) => {
  return useQuery({
    queryKey: ['ads', filters],
    queryFn: () => listingsAPI.getListings(filters),
    select: (data) => data.data,
  });
};

export const useListings = (filters?: SearchFilters) => {
  return useQuery({
    queryKey: ['listings', filters],
    queryFn: () => listingsAPI.getListings(filters),
    select: (data) => data.data,
  });
};

export const useAd = (id: number) => {
  return useQuery({
    queryKey: ['ad', id],
    queryFn: () => listingsAPI.getListing(id),
    select: (data) => data.data,
    enabled: !!id,
  });
};

export const useListing = (id: number) => {
  return useQuery({
    queryKey: ['listing', id],
    queryFn: () => listingsAPI.getListing(id),
    select: (data) => data.data,
    enabled: !!id,
  });
};

export const useRelatedAds = (listingId: number, limit: number = 4) => {
  return useQuery({
    queryKey: ['relatedAds', listingId, limit],
    queryFn: () => listingsAPI.getRelatedListings(listingId, limit),
    select: (data) => data.data,
    enabled: !!listingId,
  });
};

export const useUserListings = () => {
  return useQuery({
    queryKey: ['userListings'],
    queryFn: () => userAPI.getUserListings(),
    select: (data) => data.data,
  });
};

export const useCreateListing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => listingsAPI.createListing(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['userListings'] });
    },
  });
};

export const useUpdateListing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) => 
      listingsAPI.updateListing(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['userListings'] });
    },
  });
};

export const useDeleteListing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => listingsAPI.deleteListing(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['userListings'] });
    },
  });
};

// Categories hooks
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesAPI.getCategories(),
    select: (data) => data.data,
  });
};

export const useCategory = (id: number) => {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => categoriesAPI.getCategory(id),
    select: (data) => data.data,
    enabled: !!id,
  });
};

// Brands hooks
export const useBrands = () => {
  return useQuery({
    queryKey: ['brands'],
    queryFn: () => brandsAPI.getBrands(),
    select: (data) => data.data,
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
    queryKey: ['states'],
    queryFn: () => locationAPI.getStates(),
    select: (data) => data.data,
  });
};

export const useCities = (stateId?: number) => {
  return useQuery({
    queryKey: ['cities', stateId],
    queryFn: () => stateId ? locationAPI.getCities(stateId) : locationAPI.getAllCities(),
    select: (data) => data.data,
  });
};

export const useAllCities = () => {
  return useQuery({
    queryKey: ['allCities'],
    queryFn: () => locationAPI.getAllCities(),
    select: (data) => data.data,
  });
};

export const useCurrentLocation = () => {
  return useQuery({
    queryKey: ['currentLocation'],
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
    queryKey: ['favorites'],
    queryFn: () => listingsAPI.getFavorites(),
    select: (data) => data.data,
  });
};

export const useIsFavorite = (listingId: number) => {
  return useQuery({
    queryKey: ['isFavorite', listingId],
    queryFn: () => listingsAPI.isFavorite(listingId),
    select: (data) => data.data?.is_favorited || false,
    enabled: !!listingId,
  });
};

export const useAddToFavorites = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (listingId: number) => listingsAPI.addToFavorites(listingId),
    onSuccess: (_, listingId) => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['isFavorite', listingId] });
    },
  });
};

export const useRemoveFromFavorites = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (listingId: number) => listingsAPI.removeFromFavorites(listingId),
    onSuccess: (_, listingId) => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['isFavorite', listingId] });
    },
  });
};

// Comments hooks
export const useComments = (listingId: number) => {
  return useQuery({
    queryKey: ['comments', listingId],
    queryFn: () => listingsAPI.getComments(listingId),
    select: (data) => data.data,
    enabled: !!listingId,
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ listingId, content }: { listingId: number; content: string }) =>
      listingsAPI.addComment(listingId, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.listingId] });
    },
  });
};

export const useAddReply = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ listingId, commentId, content }: { listingId: number; commentId: number; content: string }) =>
      listingsAPI.addReply(listingId, commentId, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.listingId] });
    },
  });
};

export const useEditComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ listingId, commentId, content }: { listingId: number; commentId: number; content: string }) =>
      listingsAPI.editComment(listingId, commentId, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.listingId] });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ listingId, commentId }: { listingId: number; commentId: number }) =>
      listingsAPI.deleteComment(listingId, commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.listingId] });
    },
  });
};

export const useEditReply = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ listingId, commentId, replyId, content }: { listingId: number; commentId: number; replyId: number; content: string }) =>
      listingsAPI.editReply(listingId, commentId, replyId, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.listingId] });
    },
  });
};

export const useDeleteReply = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ listingId, commentId, replyId }: { listingId: number; commentId: number; replyId: number }) =>
      listingsAPI.deleteReply(listingId, commentId, replyId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.listingId] });
    },
  });
};

// User profile hooks
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => userAPI.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
};

export const useUserStats = () => {
  return useQuery({
    queryKey: ['userStats'],
    queryFn: () => userAPI.getUserStatistics(),
    select: (data) => data.data,
  });
};

// Search hooks
export const useSearch = (query: string, filters?: SearchFilters) => {
  return useQuery({
    queryKey: ['search', query, filters],
    queryFn: () => searchAPI.searchListings(query, filters),
    select: (data) => data.data,
    enabled: !!query,
  });
};
