
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import * as API from '@/services/api';
import { Listing, ListingDetails, Category, Brand, User, SearchFilters, Comment, PaginatedResponse, ApiResponse } from '@/types';

// Auth Hooks
export function useLogin() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ identifier, password }: { identifier: string; password: string }) => 
      API.authAPI.login(identifier, password),
    onSuccess: (data) => {
      queryClient.setQueryData(['currentUser'], data.data.user);
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: `مرحباً ${data.data.user.first_name} ${data.data.user.last_name}`,
      });
    },
    meta: {
      onError: (error: Error) => {
        toast({
          variant: "destructive",
          title: "خطأ في تسجيل الدخول",
          description: error instanceof Error ? error.message : "خطأ غير معروف",
        });
      }
    }
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: API.authAPI.logout,
    onSuccess: () => {
      queryClient.clear();
      toast({
        title: "تم تسجيل الخروج بنجاح",
      });
    },
    meta: {
      onError: (error: Error) => {
        toast({
          variant: "destructive",
          title: "خطأ في تسجيل الخروج",
          description: error instanceof Error ? error.message : "خطأ غير معروف",
        });
      }
    }
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData: {
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
      password: string;
      password_confirmation: string;
      city_id: number;
      state_id: number;
    }) => API.authAPI.register(userData),
    onSuccess: (data) => {
      queryClient.setQueryData(['currentUser'], data.data.user);
      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: `مرحباً ${data.data.user.first_name} ${data.data.user.last_name}`,
      });
    },
    meta: {
      onError: (error: Error) => {
        toast({
          variant: "destructive",
          title: "خطأ في إنشاء الحساب",
          description: error instanceof Error ? error.message : "خطأ غير معروف",
        });
      }
    }
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await API.authAPI.getCurrentUser();
      return response.data;
    },
    enabled: API.isAuthenticated(),
    retry: 1,
  });
}

// Categories Hooks
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await API.categoriesAPI.getCategories();
      return response.data;
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours - categories don't change often
  });
}

export function useCategory(id: number | undefined) {
  return useQuery({
    queryKey: ['category', id],
    queryFn: async () => {
      if (!id) return Promise.reject('No category ID provided');
      const response = await API.categoriesAPI.getCategory(id);
      return response.data;
    },
    enabled: !!id,
  });
}

// Subcategories Hooks
export function useSubCategories() {
  return useQuery({
    queryKey: ['subcategories'],
    queryFn: async () => {
      const response = await API.categoriesAPI.getSubCategories();
      return response.data;
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours - subcategories don't change often
  });
}

// Child Categories Hooks
export function useChildCategories() {
  return useQuery({
    queryKey: ['childcategories'],
    queryFn: async () => {
      const response = await API.categoriesAPI.getChildCategories();
      return response.data;
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours - child categories don't change often
  });
}

// Brands Hooks
export function useBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const response = await API.brandsAPI.getBrands();
      return response.data;
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours - brands don't change often
  });
}

export function useBrand(id: number | undefined) {
  return useQuery({
    queryKey: ['brand', id],
    queryFn: async () => {
      if (!id) return Promise.reject('No brand ID provided');
      const response = await API.brandsAPI.getBrand(id);
      return response.data;
    },
    enabled: !!id,
  });
}

// States Hook
export function useStates() {
  return useQuery({
    queryKey: ['states'],
    queryFn: async () => {
      const response = await API.locationAPI.getStates();
      return response.data;
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours - states don't change often
  });
}

// Listings Hooks
export function useListings(filters?: SearchFilters) {
  return useQuery({
    queryKey: ['listings', filters],
    queryFn: async () => {
      const response = await API.listingsAPI.getListings(filters);
      return response;
    },
  });
}

export function useListing(id: number | undefined) {
  return useQuery({
    queryKey: ['listing', id],
    queryFn: async () => {
      if (!id) return Promise.reject('No listing ID provided');
      const response = await API.listingsAPI.getListing(id);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useRelatedListings(listingId: number | undefined, limit: number = 4) {
  return useQuery({
    queryKey: ['relatedListings', listingId, limit],
    queryFn: async () => {
      if (!listingId) return Promise.reject('No listing ID provided');
      const response = await API.listingsAPI.getRelatedListings(listingId, limit);
      return response;
    },
    enabled: !!listingId,
  });
}

export function useCreateListing() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (formData: FormData) => API.listingsAPI.createListing(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['userListings'] });
      toast({
        title: "تم إنشاء الإعلان بنجاح",
        description: "سيظهر الإعلان بعد مراجعته",
      });
    },
    meta: {
      onError: (error: Error) => {
        toast({
          variant: "destructive",
          title: "خطأ في إنشاء الإعلان",
          description: error instanceof Error ? error.message : "خطأ غير معروف",
        });
      }
    }
  });
}

export function useUpdateListing(id: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await API.listingsAPI.updateListing(id, formData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listing', id] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['userListings'] });
      toast({
        title: "تم تحديث الإعلان بنجاح",
        description: "تم تحديث بيانات الإعلان",
      });
    },
    meta: {
      onError: (error: Error) => {
        toast({
          variant: "destructive",
          title: "خطأ في تحديث الإعلان",
          description: error instanceof Error ? error.message : "خطأ غير معروف",
        });
      }
    }
  });
}

export function useDeleteListing() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => API.listingsAPI.deleteListing(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['userListings'] });
      toast({
        title: "تم حذف الإعلان بنجاح",
      });
    },
    meta: {
      onError: (error: Error) => {
        toast({
          variant: "destructive",
          title: "خطأ في حذف الإعلان",
          description: error instanceof Error ? error.message : "خطأ غير معروف",
        });
      }
    }
  });
}

// Comments Hooks
export function useAddComment(listingId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (content: string) => API.listingsAPI.addComment(listingId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listing', listingId] });
      toast({
        title: "تم إضافة التعليق بنجاح",
      });
    },
    meta: {
      onError: (error: Error) => {
        toast({
          variant: "destructive",
          title: "خطأ في إضافة التعليق",
          description: error instanceof Error ? error.message : "خطأ غير معروف",
        });
      }
    }
  });
}

export function useDeleteComment(listingId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (commentId: number) => API.listingsAPI.deleteComment(listingId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listing', listingId] });
      toast({
        title: "تم حذف التعليق بنجاح",
      });
    },
    meta: {
      onError: (error: Error) => {
        toast({
          variant: "destructive",
          title: "خطأ في حذف التعليق",
          description: error instanceof Error ? error.message : "خطأ غير معروف",
        });
      }
    }
  });
}

export function useDeleteReply(listingId: number, commentId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (replyId: number) => API.listingsAPI.deleteReply(listingId, replyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listing', listingId] });
      toast({
        title: "تم حذف الرد بنجاح",
      });
    },
    meta: {
      onError: (error: Error) => {
        toast({
          variant: "destructive",
          title: "خطأ في حذف الرد",
          description: error instanceof Error ? error.message : "خطأ غير معروف",
        });
      }
    }
  });
}

export function useEditComment(listingId: number, commentId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (content: string) => API.listingsAPI.editComment(listingId, commentId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listing', listingId] });
      toast({
        title: "تم تحديث التعليق بنجاح",
      });
    },
    meta: {
      onError: (error: Error) => {
        toast({
          variant: "destructive",
          title: "خطأ في تحديث التعليق",
          description: error instanceof Error ? error.message : "خطأ غير معروف",
        });
      }
    }
  });
}

export function useAddReply(listingId: number, commentId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (content: string) => API.listingsAPI.addReply(listingId, commentId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listing', listingId] });
      toast({
        title: "تم إضافة الرد بنجاح",
      });
    },
    meta: {
      onError: (error: Error) => {
        toast({
          variant: "destructive",
          title: "خطأ في إضافة الرد",
          description: error instanceof Error ? error.message : "خطأ غير معروف",
        });
      }
    }
  });
}

export function useEditReply(listingId: number, commentId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (content: string) => API.listingsAPI.editReply(listingId, commentId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listing', listingId] });
      toast({
        title: "تم تحديث الرد بنجاح",
      });
    },
    meta: {
      onError: (error: Error) => {
        toast({
          variant: "destructive",
          title: "خطأ في تحديث الرد",
          description: error instanceof Error ? error.message : "خطأ غير معروف",
        });
      }
    }
  });
}

// Favorites Hooks
export function useAddToFavorites() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (listingId: number) => API.listingsAPI.addToFavorites(listingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      toast({
        title: "تمت الإضافة للمفضلة",
      });
    },
    meta: {
      onError: (error: Error) => {
        toast({
          variant: "destructive",
          title: "خطأ في الإضافة للمفضلة",
          description: error instanceof Error ? error.message : "خطأ غير معروف",
        });
      }
    }
  });
}

export function useRemoveFromFavorites() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (listingId: number) => API.listingsAPI.removeFromFavorites(listingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      toast({
        title: "تمت الإزالة من المفضلة",
      });
    },
    meta: {
      onError: (error: Error) => {
        toast({
          variant: "destructive",
          title: "خطأ في الإزالة من المفضلة",
          description: error instanceof Error ? error.message : "خطأ غير معروف",
        });
      }
    }
  });
}

export function useFavorites() {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const response = await API.listingsAPI.getFavorites();
      return response.data;
    },
    enabled: API.isAuthenticated(),
  });
}

export function useIsFavorite(listingId: number | undefined) {
  return useQuery({
    queryKey: ['favorite', listingId],
    queryFn: async () => {
      if (!listingId) return Promise.reject('No listing ID provided');
      const response = await API.listingsAPI.isFavorite(listingId);
      return response.data;
    },
    enabled: !!listingId && API.isAuthenticated(),
  });
}

// Location Hooks
export function useCities(stateId: number | undefined) {
  return useQuery({
    queryKey: ['cities', stateId],
    queryFn: async () => {
      if (!stateId) return Promise.reject('No state ID provided');
      const response = await API.locationAPI.getCities(stateId);
      return response.data;
    },
    enabled: !!stateId,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours - cities don't change often
  });
}

export function useAllCities() {
  return useQuery({
    queryKey: ['allCities'],
    queryFn: async () => {
      const response = await API.locationAPI.getAllCities();
      return response.data;
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours - cities don't change often
  });
}

export function useCurrentLocation() {
  return useQuery({
    queryKey: ['currentLocation'],
    queryFn: API.locationAPI.getCurrentLocation,
    retry: false,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

// User Hooks
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (formData: FormData) => API.userAPI.updateProfile(formData),
    onSuccess: (data) => {
      queryClient.setQueryData(['currentUser'], data.data);
      toast({
        title: "تم تحديث الملف الشخصي بنجاح",
      });
    },
    meta: {
      onError: (error: Error) => {
        toast({
          variant: "destructive",
          title: "خطأ في تحديث الملف الشخصي",
          description: error instanceof Error ? error.message : "خطأ غير معروف",
        });
      }
    }
  });
}

export function useUserListings(userId?: number) {
  return useQuery({
    queryKey: ['userListings', userId],
    queryFn: async () => {
      const response = await API.userAPI.getUserListings(userId);
      return response.data;
    },
    enabled: API.isAuthenticated(),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: { current_password: string; password: string; password_confirmation: string }) => 
      API.userAPI.changePassword(data),
    onSuccess: () => {
      toast({
        title: "تم تغيير كلمة المرور بنجاح",
      });
    },
    meta: {
      onError: (error: Error) => {
        toast({
          variant: "destructive",
          title: "خطأ في تغيير كلمة المرور",
          description: error instanceof Error ? error.message : "خطأ غير معروف",
        });
      }
    }
  });
}

// User Statistics Hook
export function useUserStats() {
  return useQuery({
    queryKey: ['user-stats'],
    queryFn: async () => {
      const response = await API.userAPI.getUserStatistics();
      return response.data;
    },
    enabled: API.isAuthenticated(),
    meta: {
      onError: (error: Error) => {
        toast({
          title: "خطأ في تحميل إحصائيات المستخدم",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  });
}

// Search Hooks
export function useSearchListings(query: string, filters?: SearchFilters) {
  return useQuery({
    queryKey: ['search', query, filters],
    queryFn: async () => {
      const response = await API.searchAPI.searchListings(query, filters);
      return response;
    },
    enabled: query !== '',
  });
}

// For backward compatibility
export const useAds = useListings;
export const useAd = useListing;
export const useRelatedAds = useRelatedListings;
export const useCreateAd = useCreateListing;
export const useUpdateAd = useUpdateListing;
export const useDeleteAd = useDeleteListing;
