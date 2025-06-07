import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SearchFilters, Listing, User, Category, Brand, State, City, Comment, Favorite, PaginatedResponse, ApiResponse } from '@/types';

// Mock API functions
const api = {
  getCurrentUser: (): Promise<ApiResponse<User>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            id: 1,
            first_name: 'أحمد',
            last_name: 'محمد',
            email: 'ahmed@example.com',
            phone: '+966501234567',
            bio: 'مطور تطبيقات',
            city: 'الرياض'
          }
        });
      }, 1000);
    });
  },

  login: (email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            user: {
              id: 1,
              first_name: 'أحمد',
              last_name: 'محمد',
              email: email,
              phone: '+966501234567'
            },
            token: 'mock-token'
          }
        });
      }, 1000);
    });
  },

  register: (userData: any): Promise<ApiResponse<{ user: User; token: string }>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            user: {
              id: Date.now(),
              first_name: userData.first_name,
              last_name: userData.last_name,
              email: userData.email,
              phone: userData.phone
            },
            token: 'mock-token'
          }
        });
      }, 1000);
    });
  },

  logout: (): Promise<ApiResponse<null>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, data: null });
      }, 500);
    });
  },

  forgotPassword: (email: string): Promise<ApiResponse<null>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, data: null });
      }, 1000);
    });
  },

  resetPassword: (token: string, password: string): Promise<ApiResponse<null>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, data: null });
      }, 1000);
    });
  }
};

// Hook implementations
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: api.getCurrentUser,
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      api.login(email, password),
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (userData: any) => api.register(userData),
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: api.logout,
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => api.forgotPassword(email),
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      api.resetPassword(token, password),
  });
};

export const useAds = (filters?: SearchFilters) => {
  return useQuery({
    queryKey: ['ads', filters],
    queryFn: async (): Promise<PaginatedResponse<Listing>> => {
      return {
        data: [],
        current_page: 1,
        per_page: 12,
        total: 0,
        last_page: 1
      };
    },
  });
};

export const useAd = (id: number) => {
  return useQuery({
    queryKey: ['ad', id],
    queryFn: async (): Promise<Listing | null> => {
      return null;
    },
  });
};

export const useRelatedAds = (categoryId: number, excludeId: number) => {
  return useQuery({
    queryKey: ['relatedAds', categoryId, excludeId],
    queryFn: async (): Promise<Listing[]> => {
      return [];
    },
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async (): Promise<Category[]> => {
      return [];
    },
  });
};

export const useCategory = (id: number) => {
  return useQuery({
    queryKey: ['category', id],
    queryFn: async (): Promise<Category | null> => {
      return null;
    },
  });
};

export const useBrands = () => {
  return useQuery({
    queryKey: ['brands'],
    queryFn: async (): Promise<Brand[]> => {
      return [];
    },
  });
};

export const useBrand = (id: number) => {
  return useQuery({
    queryKey: ['brand', id],
    queryFn: async (): Promise<Brand | null> => {
      return null;
    },
  });
};

export const useStates = () => {
  return useQuery({
    queryKey: ['states'],
    queryFn: async (): Promise<State[]> => {
      return [];
    },
  });
};

export const useCities = (stateId?: number) => {
  return useQuery({
    queryKey: ['cities', stateId],
    queryFn: async (): Promise<City[]> => {
      return [];
    },
  });
};

export const useAllCities = () => {
  return useQuery({
    queryKey: ['allCities'],
    queryFn: async (): Promise<City[]> => {
      return [];
    },
  });
};

export const useCurrentLocation = () => {
  return useQuery({
    queryKey: ['currentLocation'],
    queryFn: async () => {
      return { lat: 0, lon: 0 };
    },
  });
};

export const useFavorites = () => {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: async (): Promise<PaginatedResponse<Favorite>> => {
      return {
        data: [],
        current_page: 1,
        per_page: 12,
        total: 0,
        last_page: 1,
        length: 0,
        slice: (start: number, end: number) => []
      };
    },
  });
};

export const useIsFavorite = (listingId: number) => {
  return useQuery({
    queryKey: ['isFavorite', listingId],
    queryFn: async (): Promise<boolean> => {
      return false;
    },
  });
};

export const useAddToFavorites = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (listingId: number) => {
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
};

export const useRemoveFromFavorites = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (listingId: number) => {
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
};

export const useComments = (listingId: number) => {
  return useQuery({
    queryKey: ['comments', listingId],
    queryFn: async (): Promise<Comment[]> => {
      return [];
    },
  });
};

export const useCreateListing = () => {
  return useMutation({
    mutationFn: async (data: FormData) => {
      return { success: true };
    },
  });
};

export const useUpdateListing = () => {
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormData }) => {
      return { success: true };
    },
  });
};

export const useListing = (id: number) => {
  return useQuery({
    queryKey: ['listing', id],
    queryFn: async (): Promise<Listing | null> => {
      return null;
    },
  });
};

export const useListings = (filters?: SearchFilters) => {
  return useQuery({
    queryKey: ['listings', filters],
    queryFn: async (): Promise<PaginatedResponse<Listing>> => {
      return {
        data: [],
        current_page: 1,
        per_page: 12,
        total: 0,
        last_page: 1
      };
    },
  });
};

export const useUserListings = () => {
  return useQuery({
    queryKey: ['userListings'],
    queryFn: async (): Promise<PaginatedResponse<Listing>> => {
      return {
        data: [],
        current_page: 1,
        per_page: 12,
        total: 0,
        last_page: 1
      };
    },
  });
};

export const useDeleteListing = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      return { success: true };
    },
  });
};

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: async (data: Partial<User>) => {
      return { success: true };
    },
  });
};

// Fix the comment hooks to accept proper parameters
export const useAddComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ listingId: id, content }: { listingId: number; content: string }) => {
      return { success: true };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.listingId] });
    },
  });
};

export const useAddReply = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ commentId, content }: { commentId: number; content: string }) => {
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
};

export const useEditComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ commentId, content }: { commentId: number; content: string }) => {
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (commentId: number) => {
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
};

export const useEditReply = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ commentId, replyId, content }: { commentId: number; replyId: number; content: string }) => {
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
};

export const useDeleteReply = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ commentId, replyId }: { commentId: number; replyId: number }) => {
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
};
