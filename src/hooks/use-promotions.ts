
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
      console.log('Fetching user promotions...');
      const response = await promotionAPI.getUserPromotions();
      console.log('User promotions response:', response);
      return response;
    },
    retry: 3,
    retryDelay: 1000,
  });
}

// Hook to get available promotion packages
export function usePromotionPackages() {
  return useQuery({
    queryKey: ['promotion-packages'],
    queryFn: async () => {
      console.log('Fetching promotion packages...');
      const response = await promotionAPI.getPromotionPackages();
      console.log('Promotion packages response:', response);
      return response.data;
    },
    retry: 3,
    retryDelay: 1000,
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
      console.log('Promoting with bank transfer:', { listingId, data });
      return await promotionAPI.promoteListingWithBankTransfer(listingId, {
        ...data,
        payment_method: 'bank_transfer'
      });
    },
    onSuccess: (response) => {
      console.log('Bank transfer promotion success:', response);
      queryClient.invalidateQueries({ queryKey: ['user-promotions'] });
      queryClient.invalidateQueries({ queryKey: ['user-listings'] });
    },
    onError: (error) => {
      console.error('Bank transfer promotion error:', error);
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
      console.log('Promoting with Stripe:', { listingId, promotionPackageId });
      return await promotionAPI.promoteListingWithStripe(listingId, {
        promotion_package_id: promotionPackageId,
        payment_method: 'stripe'
      });
    },
    onSuccess: (response) => {
      console.log('Stripe promotion success:', response);
      // For Stripe, we might get a checkout URL to redirect to
      if (response.data?.checkout_url) {
        window.open(response.data.checkout_url, '_blank');
      }
      queryClient.invalidateQueries({ queryKey: ['user-promotions'] });
      queryClient.invalidateQueries({ queryKey: ['user-listings'] });
    },
    onError: (error) => {
      console.error('Stripe promotion error:', error);
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
      console.log('Promoting with wallet:', { listingId, promotionPackageId });
      // This would be implemented when wallet API is available
      throw new Error('Wallet payment not yet implemented');
    },
    onSuccess: (response) => {
      console.log('Wallet promotion success:', response);
      queryClient.invalidateQueries({ queryKey: ['user-promotions'] });
      queryClient.invalidateQueries({ queryKey: ['user-listings'] });
    },
    onError: (error) => {
      console.error('Wallet promotion error:', error);
    },
  });
}
