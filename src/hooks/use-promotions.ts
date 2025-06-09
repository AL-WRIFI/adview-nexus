
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { promotionAPI } from '@/services/api';

export function usePromotionPackages() {
  return useQuery({
    queryKey: ['promotion-packages'],
    queryFn: async () => {
      try {
        const response = await promotionAPI.getPromotionPackages();
        return response.data;
      } catch (error) {
        console.error('Error fetching promotion packages:', error);
        return [];
      }
    },
  });
}

export function useUserPromotions() {
  return useQuery({
    queryKey: ['user-promotions'],
    queryFn: async () => {
      try {
        const response = await promotionAPI.getUserPromotions();
        return response.data;
      } catch (error) {
        console.error('Error fetching user promotions:', error);
        return { data: [] };
      }
    },
  });
}

export function usePromoteWithBankTransfer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ listingId, data }: { listingId: number; data: { promotion_package_id: number; bank_transfer_proof: File } }) => {
      const response = await promotionAPI.promoteListingWithBankTransfer(listingId, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-listings'] });
      queryClient.invalidateQueries({ queryKey: ['user-promotions'] });
    },
  });
}

export function usePromoteWithStripe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ listingId, promotionPackageId }: { listingId: number; promotionPackageId: number }) => {
      const response = await promotionAPI.promoteListingWithStripe(listingId, promotionPackageId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-listings'] });
      queryClient.invalidateQueries({ queryKey: ['user-promotions'] });
    },
  });
}

export function usePromoteWithWallet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ listingId, promotionPackageId }: { listingId: number; promotionPackageId: number }) => {
      const response = await promotionAPI.promoteListingWithStripe(listingId, promotionPackageId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-listings'] });
      queryClient.invalidateQueries({ queryKey: ['user-promotions'] });
    },
  });
}

export interface PromotionPackage {
  id: number;
  name: string;
  description: string;
  price: number;
  duration_days: number;
  is_active: boolean;
  stripe_price_id: string | null;
}
