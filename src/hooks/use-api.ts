
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, Listing, Category, Favorite, Comment } from '@/types';

// Mock API functions - replace with actual API calls
const mockApiCall = (data: any) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), 1000);
  });
};

// User hooks
export function useCurrentUser() {
  return useQuery({
    queryKey: ['current-user'],
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
}

export function useLogin() {
  return useMutation({
    mutationFn: async ({ identifier, password }: { identifier: string; password: string }) => {
      return await mockApiCall({ success: true, token: 'mock-token' });
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: async (userData: any) => {
      return await mockApiCall({ success: true, user: userData });
    },
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      return await mockApiCall({ success: true });
    },
  });
}

export function useUserStats() {
  return useQuery({
    queryKey: ['user-stats'],
    queryFn: async () => {
      return await mockApiCall({
        totalListings: 5,
        activeListings: 3,
        totalViews: 150,
        totalComments: 12,
        totalFavorites: 8,
      });
    },
  });
}

// Listings hooks
export function useUserListings() {
  return useQuery({
    queryKey: ['user-listings'],
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
        {
          id: 2,
          title: 'شقة للإيجار في حي الملز',
          description: 'شقة 3 غرف وصالة في موقع مميز',
          price: 2500,
          location: 'الرياض',
          category: 'عقارات',
          status: 'active',
          user_id: 1,
          created_at: new Date().toISOString(),
          views_count: 23,
          favorites_count: 5,
          main_image_url: 'https://example.com/apartment.jpg',
        },
      ] as Listing[];
    },
  });
}

// Categories hooks
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
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
        {
          id: 2,
          name: 'عقارات',
          icon: 'Home',
          subcategories: [
            { id: 21, name: 'شقق للإيجار', category_id: 2 },
            { id: 22, name: 'فلل للبيع', category_id: 2 },
          ],
        },
      ] as Category[];
    },
  });
}

// Favorites hooks
export function useFavorites() {
  return useQuery({
    queryKey: ['favorites'],
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
}

// Comments hooks
export function useComments(listingId: number) {
  return useQuery({
    queryKey: ['comments', listingId],
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
  });
}
