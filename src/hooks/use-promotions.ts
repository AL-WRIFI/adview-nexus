
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { promotionsAPI } from '@/services/api';

export function usePromotionPackages() {
  return useQuery({
    queryKey: ['promotion-packages'],
    queryFn: async () => {
      try {
        const response = await promotionsAPI.getPromotionPackages();
        return response.data;
      } catch (error) {
        console.error('Error fetching promotion packages:', error);
        return [];
      }
    },
  });
}

export function usePromoteWithBankTransfer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ listingId, data }: { listingId: number; data: { promotion_package_id: number; bank_transfer_proof: File } }) => {
      const formData = new FormData();
      formData.append('promotion_package_id', data.promotion_package_id.toString());
      formData.append('bank_transfer_proof', data.bank_transfer_proof);
      
      const response = await promotionsAPI.promoteWithBankTransfer(listingId, formData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-listings'] });
    },
  });
}

export function usePromoteWithStripe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ listingId, promotionPackageId }: { listingId: number; promotionPackageId: number }) => {
      const response = await promotionsAPI.promoteWithStripe(listingId, promotionPackageId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-listings'] });
    },
  });
}
