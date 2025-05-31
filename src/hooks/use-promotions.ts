
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { promotionsAPI } from '@/services/promotions-api';
import { toast } from '@/hooks/use-toast';

export function usePromotionPackages() {
  return useQuery({
    queryKey: ['promotion-packages'],
    queryFn: async () => {
      const response = await promotionsAPI.getPromotionPackages();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function usePromoteWithBankTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listingId, data }: { 
      listingId: number; 
      data: { promotion_package_id: number; bank_transfer_proof: File } 
    }) => promotionsAPI.promoteListingWithBankTransfer(listingId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-promotions'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      toast({
        title: "طلب الترقية مُرسل",
        description: "تم إرسال طلب ترقية الإعلان وسيتم مراجعته قريباً",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "خطأ في ترقية الإعلان",
        description: error.message,
      });
    },
  });
}

export function usePromoteWithStripe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listingId, promotionPackageId }: { 
      listingId: number; 
      promotionPackageId: number 
    }) => promotionsAPI.promoteListingWithStripe(listingId, promotionPackageId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user-promotions'] });
      // Redirect to Stripe
      window.open(data.data.checkout_url, '_blank');
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "خطأ في الدفع",
        description: error.message,
      });
    },
  });
}

export function usePromoteWithWallet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listingId, promotionPackageId }: { 
      listingId: number; 
      promotionPackageId: number 
    }) => promotionsAPI.promoteListingWithWallet(listingId, promotionPackageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-promotions'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      toast({
        title: "تم ترقية الإعلان",
        description: "تم ترقية الإعلان بنجاح باستخدام رصيد المحفظة",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "خطأ في ترقية الإعلان",
        description: error.message,
      });
    },
  });
}

export function useUserPromotions() {
  return useQuery({
    queryKey: ['user-promotions'],
    queryFn: async () => {
      const response = await promotionsAPI.getUserPromotions();
      return response.data;
    },
  });
}
