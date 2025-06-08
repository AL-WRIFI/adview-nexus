import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { promotionAPI } from '@/services/api';

// Types for promotions
export interface ListingPromotion {
  id: number;
  payment_method: string;
  payment_status: 'pending' | 'paid' | 'failed';
  transaction_id?: string | null;
  bank_transfer_proof_url?: string;
  payment_confirmed_at?: string | null;
  starts_at?: string | null;
  expires_at?: string | null;
  amount_paid: number;
  admin_notes?: string | null;
  created_at: string;
  package: PromotionPackage;
  listing: {
    id: number;
    title: string;
    slug: string;
    image: {
      image_id: string;
      image_url: string;
    };
    is_currently_promoted: boolean;
    promoted_until: string | null;
  };
  user_id: number;
}

export interface PromotionPackage {
  id: number;
  name: string;
  description: string;
  price: number;
  duration_days: number;
  is_active: boolean;
  stripe_price_id?: string | null;
}

// Hook to get user promotions
export function useUserPromotions() {
  return useQuery({
    queryKey: ['user-promotions'],
    queryFn: async () => {
      const response = await promotionAPI.getUserPromotions();
      return response.data;
    },
  });
}

// Hook to get available promotion packages
export function usePromotionPackages() {
  return useQuery({
    queryKey: ['promotion-packages'],
    queryFn: async () => {
      const response = await promotionAPI.getPromotionPackages();
      return response.data;
    },
  });
}

// Hook to promote with bank transfer
export function usePromoteWithBankTransfer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ listingId, data }: { 
      listingId: number; 
      data: { 
        promotion_package_id: number; 
        bank_transfer_proof: File;
      } 
    }) => {
      return await promotionAPI.promoteListingWithBankTransfer(listingId, {
        ...data,
        payment_method: 'bank_transfer'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-promotions'] });
      queryClient.invalidateQueries({ queryKey: ['user-listings'] });
    },
  });
}

// Hook to promote with Stripe
export function usePromoteWithStripe() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ listingId, promotionPackageId }: { 
      listingId: number; 
      promotionPackageId: number;
    }) => {
      return await promotionAPI.promoteListingWithStripe(listingId, {
        promotion_package_id: promotionPackageId,
        payment_method: 'stripe'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-promotions'] });
      queryClient.invalidateQueries({ queryKey: ['user-listings'] });
    },
  });
}

// Hook to promote with wallet (placeholder for future implementation)
export function usePromoteWithWallet() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ listingId, promotionPackageId }: { 
      listingId: number; 
      promotionPackageId: number;
    }) => {
      // This would be implemented when wallet API is available
      throw new Error('Wallet payment not yet implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-promotions'] });
      queryClient.invalidateQueries({ queryKey: ['user-listings'] });
    },
  });
}
