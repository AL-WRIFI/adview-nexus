
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Mock API functions - replace with actual API calls
const mockApiCall = (data: any) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), 1000);
  });
};

// Types for promotions
export interface ListingPromotion {
  id: number;
  listing_id: number;
  package_id: number;
  payment_status: 'paid' | 'pending' | 'failed';
  amount_paid: number;
  starts_at: string;
  expires_at: string;
  listing?: {
    id: number;
    title: string;
  };
  package?: {
    id: number;
    name: string;
    price: number;
  };
}

export interface PromotionPackage {
  id: number;
  name: string;
  price: number;
  duration: number;
  features: string[];
  type: 'featured' | 'highlight' | 'urgent' | 'top';
}

// Hook to get user promotions
export function useUserPromotions() {
  return useQuery({
    queryKey: ['user-promotions'],
    queryFn: async (): Promise<ListingPromotion[]> => {
      // Mock data - replace with actual API call
      return [
        {
          id: 1,
          listing_id: 1,
          package_id: 1,
          payment_status: 'paid',
          amount_paid: 50,
          starts_at: '2024-01-01',
          expires_at: '2024-02-01',
          listing: { id: 1, title: 'إعلان مميز' },
          package: { id: 1, name: 'باقة مميزة', price: 50 }
        }
      ] as ListingPromotion[];
    },
  });
}

// Hook to get available promotion packages
export function usePromotionPackages() {
  return useQuery({
    queryKey: ['promotion-packages'],
    queryFn: async (): Promise<PromotionPackage[]> => {
      // Mock data - replace with actual API call
      return [
        {
          id: 1,
          name: 'باقة مميزة',
          price: 50,
          duration: 30,
          features: ['إعلان مميز', 'ظهور في المقدمة'],
          type: 'featured'
        },
        {
          id: 2,
          name: 'باقة عاجل',
          price: 30,
          duration: 7,
          features: ['علامة عاجل', 'ألوان مميزة'],
          type: 'urgent'
        }
      ] as PromotionPackage[];
    },
  });
}

// Hook to promote a listing
export function usePromoteListing() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ listingId, packageId }: { listingId: number; packageId: number }) => {
      // Mock API call - replace with actual implementation
      return await mockApiCall({ success: true, listingId, packageId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-promotions'] });
      queryClient.invalidateQueries({ queryKey: ['user-listings'] });
    },
  });
}
