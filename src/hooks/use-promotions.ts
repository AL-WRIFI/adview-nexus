
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
  description: string;
  price: number;
  duration_days: number;
  features: string[];
  type: 'featured' | 'highlight' | 'urgent' | 'top';
  is_active: boolean;
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
          description: 'إعلان مميز يظهر في المقدمة',
          price: 50,
          duration_days: 30,
          features: ['إعلان مميز', 'ظهور في المقدمة'],
          type: 'featured',
          is_active: true
        },
        {
          id: 2,
          name: 'باقة عاجل',
          description: 'إعلان عاجل بألوان مميزة',
          price: 30,
          duration_days: 7,
          features: ['علامة عاجل', 'ألوان مميزة'],
          type: 'urgent',
          is_active: true
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

// New promotion payment hooks
export function usePromoteWithBankTransfer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ listingId, data }: { listingId: number; data: any }) => {
      // Mock API call - replace with actual implementation
      return await mockApiCall({ success: true, listingId, data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-promotions'] });
      queryClient.invalidateQueries({ queryKey: ['user-listings'] });
    },
  });
}

export function usePromoteWithStripe() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ listingId, promotionPackageId }: { listingId: number; promotionPackageId: number }) => {
      // Mock API call - replace with actual implementation
      // This would normally redirect to Stripe
      window.open('https://checkout.stripe.com/mock-url', '_blank');
      return await mockApiCall({ success: true, listingId, promotionPackageId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-promotions'] });
      queryClient.invalidateQueries({ queryKey: ['user-listings'] });
    },
  });
}

export function usePromoteWithWallet() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ listingId, promotionPackageId }: { listingId: number; promotionPackageId: number }) => {
      // Mock API call - replace with actual implementation
      return await mockApiCall({ success: true, listingId, promotionPackageId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-promotions'] });
      queryClient.invalidateQueries({ queryKey: ['user-listings'] });
    },
  });
}
