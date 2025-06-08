
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
  userStats: ['userStats'],
} as const;

// Mock API functions - replace with actual API calls
const mockApiCall = (data: any) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), 1000);
  });
};

// User Authentication hooks
export const useCurrentUser = () => {
  return useQuery({
    queryKey: QUERY_KEYS.currentUser,
    queryFn: async (): Promise<User | null> => {
      // Mock user data - replace with actual API call
      return {
        id: 1,
        first_name: 'محمد',
        last_name: 'أحمد',
        email: 'user@example.com',
        phone: '+966501234567',
        wallet_balance: 150,
        verified: true,
        created_at: new Date().toISOString(),
      } as User;
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ identifier, password }: { identifier: string; password: string }) => {
      return await mockApiCall({ success: true, token: 'mock-token' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.currentUser });
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userData: any) => {
      return await mockApiCall({ success: true, user: userData });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.currentUser });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      return await mockApiCall({ success: true });
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
};

// Listings hooks
export const useAds = (filters?: SearchFilters) => {
  return useQuery({
    queryKey: QUERY_KEYS.ads(filters),
    queryFn: async (): Promise<Listing[]> => {
      // Mock listings data - replace with actual API call
      return [
        {
          id: 1,
          title: 'سيارة تويوتا كامري 2020',
          description: 'سيارة في حالة ممتازة، مستعملة بحذر',
          price: 85000,
          location: 'الرياض',
          category: 'سيارات',
          status: 'active',
          user_id: 1,
          created_at: new Date().toISOString(),
          views_count: 45,
          favorites_count: 8,
          main_image_url: 'https://example.com/car.jpg',
        },
      ] as Listing[];
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useListings = (filters?: SearchFilters) => {
  return useQuery({
    queryKey: QUERY_KEYS.listings(filters),
    queryFn: async (): Promise<Listing[]> => {
      // Mock listings data - replace with actual API call
      return [
        {
          id: 1,
          title: 'سيارة تويوتا كامري 2020',
          description: 'سيارة في حالة ممتازة، مستعملة بحذر',
          price: 85000,
          location: 'الرياض',
          category: 'سيارات',
          status: 'active',
          user_id: 1,
          created_at: new Date().toISOString(),
          views_count: 45,
          favorites_count: 8,
          main_image_url: 'https://example.com/car.jpg',
        },
      ] as Listing[];
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useListing = (id: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.listing(id),
    queryFn: async (): Promise<Listing> => {
      // Mock listing data - replace with actual API call
      return {
        id: id,
        title: 'سيارة تويوتا كامري 2020',
        description: 'سيارة في حالة ممتازة، مستعملة بحذر',
        price: 85000,
        location: 'الرياض',
        category: 'سيارات',
        status: 'active',
        user_id: 1,
        created_at: new Date().toISOString(),
        views_count: 45,
        favorites_count: 8,
        main_image_url: 'https://example.com/car.jpg',
      } as Listing;
    },
    enabled: !!id,
  });
};

export const useAd = (id: number) => {
  return useListing(id);
};

export const useRelatedAds = (listingId: number, limit: number = 4) => {
  return useQuery({
    queryKey: QUERY_KEYS.relatedAds(listingId, limit),
    queryFn: async (): Promise<Listing[]> => {
      // Mock related ads data
      return [
        {
          id: 2,
          title: 'سيارة هوندا أكورد 2019',
          description: 'سيارة اقتصادية في الوقود',
          price: 75000,
          location: 'جدة',
          category: 'سيارات',
          status: 'active',
          user_id: 2,
          created_at: new Date().toISOString(),
          views_count: 32,
          favorites_count: 5,
          main_image_url: 'https://example.com/honda.jpg',
        },
      ] as Listing[];
    },
    enabled: !!listingId,
    staleTime: 10 * 60 * 1000,
  });
};

export const useUserListings = () => {
  return useQuery({
    queryKey: QUERY_KEYS.userListings,
    queryFn: async (): Promise<Listing[]> => {
      // Mock user listings data - replace with actual API call
      return [
        {
          id: 1,
          title: 'سيارة تويوتا كامري 2020',
          description: 'سيارة في حالة ممتازة، مستعملة بحذر',
          price: 85000,
          location: 'الرياض',
          category: 'سيارات',
          status: 'active',
          user_id: 1,
          created_at: new Date().toISOString(),
          views_count: 45,
          favorites_count: 8,
          main_image_url: 'https://example.com/car.jpg',
        },
      ] as Listing[];
    },
  });
};

export const useCreateListing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: FormData) => {
      return await mockApiCall({ success: true, listing: data });
    },
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
    mutationFn: async ({ id, data }: { id: number; data: FormData }) => {
      return await mockApiCall({ success: true, id, data });
    },
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
    mutationFn: async (id: number) => {
      return await mockApiCall({ success: true, id });
    },
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
    queryFn: async (): Promise<Category[]> => {
      // Mock categories data - replace with actual API call
      return [
        {
          id: 1,
          name: 'سيارات',
          icon: 'Car',
          subcategories: [
            { id: 11, name: 'سيارات للبيع', category_id: 1 },
            { id: 12, name: 'قطع غيار', category_id: 1 },
          ],
        },
      ] as Category[];
    },
    staleTime: 30 * 60 * 1000,
  });
};

export const useCategory = (id?: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.category(id!),
    queryFn: async (): Promise<Category> => {
      return {
        id: id!,
        name: 'سيارات',
        icon: 'Car',
        subcategories: [],
      } as Category;
    },
    enabled: !!id,
    staleTime: 30 * 60 * 1000,
  });
};

export const useSubCategories = () => {
  return useQuery({
    queryKey: QUERY_KEYS.subCategories,
    queryFn: async () => {
      return await mockApiCall([]);
    },
    staleTime: 30 * 60 * 1000,
  });
};

export const useChildCategories = () => {
  return useQuery({
    queryKey: QUERY_KEYS.childCategories,
    queryFn: async () => {
      return await mockApiCall([]);
    },
    staleTime: 30 * 60 * 1000,
  });
};

// Brands hooks
export const useBrands = () => {
  return useQuery({
    queryKey: QUERY_KEYS.brands,
    queryFn: async (): Promise<Brand[]> => {
      return [
        { id: 1, name: 'تويوتا' },
        { id: 2, name: 'هوندا' },
      ] as Brand[];
    },
    staleTime: 30 * 60 * 1000,
  });
};

export const useBrandsByCategory = (categoryId?: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.brandsByCategory(categoryId!),
    queryFn: async (): Promise<Brand[]> => {
      return [
        { id: 1, name: 'تويوتا' },
        { id: 2, name: 'هوندا' },
      ] as Brand[];
    },
    enabled: !!categoryId,
    staleTime: 30 * 60 * 1000,
  });
};

export const useBrand = (id: number) => {
  return useQuery({
    queryKey: ['brand', id],
    queryFn: async () => {
      return { data: null };
    },
    enabled: !!id,
  });
};

// Location hooks
export const useStates = () => {
  return useQuery({
    queryKey: QUERY_KEYS.states,
    queryFn: async (): Promise<State[]> => {
      return [
        { id: 1, name: 'الرياض' },
        { id: 2, name: 'مكة المكرمة' },
      ] as State[];
    },
    staleTime: 60 * 60 * 1000,
  });
};

export const useCities = (stateId?: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.cities(stateId),
    queryFn: async (): Promise<City[]> => {
      return [
        { id: 1, name: 'الرياض', state_id: 1 },
        { id: 2, name: 'جدة', state_id: 2 },
      ] as City[];
    },
    enabled: stateId !== undefined,
    staleTime: 60 * 60 * 1000,
  });
};

export const useAllCities = () => {
  return useQuery({
    queryKey: QUERY_KEYS.allCities,
    queryFn: async (): Promise<City[]> => {
      return [
        { id: 1, name: 'الرياض', state_id: 1 },
        { id: 2, name: 'جدة', state_id: 2 },
      ] as City[];
    },
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
    staleTime: 300000,
  });
};

// Favorites hooks
export const useFavorites = () => {
  return useQuery({
    queryKey: QUERY_KEYS.favorites,
    queryFn: async (): Promise<Favorite[]> => {
      // Mock favorites data - replace with actual API call
      return [
        {
          id: 1,
          user_id: 1,
          listing_id: 1,
          created_at: new Date().toISOString(),
          listing: {
            id: 1,
            title: 'iPhone 14 Pro',
            description: 'هاتف في حالة ممتازة',
            price: 3500,
            location: 'جدة',
            category: 'إلكترونيات',
            status: 'active',
            user_id: 2,
            created_at: new Date().toISOString(),
            views_count: 67,
            favorites_count: 12,
            main_image_url: 'https://example.com/iphone.jpg',
          },
        },
      ] as Favorite[];
    },
  });
};

export const useIsFavorite = (listingId: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.isFavorite(listingId),
    queryFn: async (): Promise<boolean> => {
      return false;
    },
    enabled: !!listingId,
  });
};

export const useAddToFavorites = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (listingId: number) => {
      return await mockApiCall({ success: true, listingId });
    },
    onSuccess: (_, listingId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.favorites });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.isFavorite(listingId) });
    },
  });
};

export const useRemoveFromFavorites = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (listingId: number) => {
      return await mockApiCall({ success: true, listingId });
    },
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
    queryFn: async (): Promise<Comment[]> => {
      // Mock comments data - replace with actual API call
      return [
        {
          id: 1,
          content: 'هل السعر قابل للتفاوض؟',
          created_at: new Date().toISOString(),
          user: {
            id: 2,
            first_name: 'أحمد',
            last_name: 'محمد',
            email: 'ahmed@example.com',
          },
          user_id: 2,
          listing_id: listingId,
        },
      ] as Comment[];
    },
    enabled: !!listingId,
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ listingId, content }: { listingId: number; content: string }) => {
      return await mockApiCall({ success: true, listingId, content });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.comments(variables.listingId) });
    },
  });
};

export const useEditComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ listingId, commentId, content }: { listingId: number; commentId: number; content: string }) => {
      return await mockApiCall({ success: true, listingId, commentId, content });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.comments(variables.listingId) });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ listingId, commentId }: { listingId: number; commentId: number }) => {
      return await mockApiCall({ success: true, listingId, commentId });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.comments(variables.listingId) });
    },
  });
};

export const useAddReply = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ listingId, commentId, content }: { listingId: number; commentId: number; content: string }) => {
      return await mockApiCall({ success: true, listingId, commentId, content });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.comments(variables.listingId) });
    },
  });
};

export const useEditReply = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ listingId, commentId, replyId, content }: { listingId: number; commentId: number; replyId: number; content: string }) => {
      return await mockApiCall({ success: true, listingId, commentId, replyId, content });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.comments(variables.listingId) });
    },
  });
};

export const useDeleteReply = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ listingId, commentId, replyId }: { listingId: number; commentId: number; replyId: number }) => {
      return await mockApiCall({ success: true, listingId, commentId, replyId });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.comments(variables.listingId) });
    },
  });
};

// User profile hooks
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: FormData) => {
      return await mockApiCall({ success: true, data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.currentUser });
    },
  });
};

// User Stats hook
export const useUserStats = () => {
  return useQuery({
    queryKey: QUERY_KEYS.userStats,
    queryFn: async () => {
      return await mockApiCall({
        totalListings: 5,
        activeListings: 3,
        totalViews: 150,
        totalComments: 12,
        totalFavorites: 8,
      });
    },
    staleTime: 5 * 60 * 1000,
  });
};
