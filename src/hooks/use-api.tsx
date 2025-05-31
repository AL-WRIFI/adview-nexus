
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  categoriesAPI, 
  brandsAPI, 
  listingsAPI, 
  locationAPI, 
  userAPI, 
  searchAPI,
  authAPI,
  api
} from '@/services/api';
import { SearchFilters } from '@/types';
import { toast } from '@/hooks/use-toast';

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

// Alias for backward compatibility
export const useAds = useListings;

export function useListing(id: number) {
  return useQuery({
    queryKey: ['listings', id],
    queryFn: () => listingsAPI.getListing(id),
    select: (data) => data.data,
    enabled: !!id,
  });
}

// Alias for backward compatibility
export const useAd = useListing;

export function useRelatedListings(listingId: number, limit: number = 4) {
  return useQuery({
    queryKey: ['related', listingId, limit],
    queryFn: () => listingsAPI.getRelatedListings(listingId, limit),
    select: (data) => data.data,
    enabled: !!listingId,
  });
}

// Alias for backward compatibility
export const useRelatedAds = useRelatedListings;

export function useCreateListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => listingsAPI.createListing(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['user-listings'] });
      toast({
        title: "تم إنشاء الإعلان بنجاح",
        description: "سيتم مراجعة إعلانك وعرضه قريباً",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "خطأ في إنشاء الإعلان",
        description: error.message,
      });
    },
  });
}

export function useUpdateListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) => 
      listingsAPI.updateListing(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['user-listings'] });
      toast({
        title: "تم تحديث الإعلان بنجاح",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "خطأ في تحديث الإعلان",
        description: error.message,
      });
    },
  });
}

export function useDeleteListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => listingsAPI.deleteListing(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['user-listings'] });
      toast({
        title: "تم حذف الإعلان بنجاح",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "خطأ في حذف الإعلان",
        description: error.message,
      });
    },
  });
}

export function useAddComment(listingId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => listingsAPI.addComment(listingId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings', listingId, 'comments'] });
      toast({
        title: "تم إضافة التعليق بنجاح",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "خطأ في إضافة التعليق",
        description: error.message,
      });
    },
  });
}

export function useAddReply(listingId: number, commentId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => listingsAPI.addReply(listingId, commentId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings', listingId, 'comments'] });
      toast({
        title: "تم إضافة الرد بنجاح",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "خطأ في إضافة الرد",
        description: error.message,
      });
    },
  });
}

export function useDeleteComment(listingId: number, commentId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => listingsAPI.deleteComment(listingId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings', listingId, 'comments'] });
      toast({
        title: "تم حذف التعليق بنجاح",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "خطأ في حذف التعليق",
        description: error.message,
      });
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

// Alias for backward compatibility
export const useComments = useListingComments;

export function useAddToFavorites() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (listingId: number) => listingsAPI.addToFavorites(listingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "خطأ في إدارة المفضلة",
        description: error.message,
      });
    },
  });
}

export function useRemoveFromFavorites() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (listingId: number) => listingsAPI.removeFromFavorites(listingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "خطأ في إدارة المفضلة",
        description: error.message,
      });
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

export function useToggleFavorite() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ listingId, isFavorited }: { listingId: number; isFavorited: boolean }) => {
      if (isFavorited) {
        return listingsAPI.removeFromFavorites(listingId);
      } else {
        return listingsAPI.addToFavorites(listingId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "خطأ في إدارة المفضلة",
        description: error.message,
      });
    },
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

export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await userAPI.getCurrentUser();
      return response.data;
    },
    retry: false,
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

// Comment editing hooks
export function useEditComment(listingId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ commentId, content }: { commentId: number; content: string }) => 
      listingsAPI.editComment(listingId, commentId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings', listingId, 'comments'] });
      toast({
        title: "تم تعديل التعليق بنجاح",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "خطأ في تعديل التعليق",
        description: error.message,
      });
    },
  });
}

export function useDeleteReply(listingId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ commentId, replyId }: { commentId: number; replyId: number }) => 
      listingsAPI.deleteReply(listingId, commentId, replyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings', listingId, 'comments'] });
      toast({
        title: "تم حذف الرد بنجاح",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "خطأ في حذف الرد",
        description: error.message,
      });
    },
  });
}

export function useEditReply(listingId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ commentId, replyId, content }: { commentId: number; replyId: number; content: string }) => 
      listingsAPI.editReply(listingId, commentId, replyId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings', listingId, 'comments'] });
      toast({
        title: "تم تعديل الرد بنجاح",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "خطأ في تعديل الرد",
        description: error.message,
      });
    },
  });
}

// Auth hooks
export function useLogin() {
  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) => 
      authAPI.login(credentials),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (userData: any) => authAPI.register(userData),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => authAPI.logout(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authAPI.forgotPassword(email),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (data: { token: string; password: string; password_confirmation: string }) => 
      authAPI.resetPassword(data),
  });
}
