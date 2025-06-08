
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { promotionsAPI } from '@/services/promotions-api';
import { useToast } from '@/hooks/use-toast';

export const usePromotionPackages = () => {
  return useQuery({
    queryKey: ['promotion-packages'],
    queryFn: () => promotionsAPI.getPromotionPackages(),
    select: (data) => data.data,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const usePromoteWithBankTransfer = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ listingId, data }: { 
      listingId: number; 
      data: { promotion_package_id: number; bank_transfer_proof: File } 
    }) => promotionsAPI.promoteListingWithBankTransfer(listingId, data),
    onSuccess: () => {
      toast({
        title: 'تم إرسال الطلب',
        description: 'تم إرسال طلب الترقية بنجاح، سيتم مراجعته قريباً',
      });
      queryClient.invalidateQueries({ queryKey: ['user-promotions'] });
      queryClient.invalidateQueries({ queryKey: ['userListings'] });
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ في إرسال الطلب',
        description: error.message || 'حدث خطأ أثناء إرسال طلب الترقية',
        variant: 'destructive',
      });
    },
  });
};

export const usePromoteWithStripe = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ listingId, promotionPackageId }: { 
      listingId: number; 
      promotionPackageId: number 
    }) => promotionsAPI.promoteListingWithStripe(listingId, promotionPackageId),
    onSuccess: (data) => {
      if (data.data?.checkout_url) {
        window.open(data.data.checkout_url, '_blank');
        toast({
          title: 'تم توجيهك للدفع',
          description: 'تم فتح صفحة الدفع في نافذة جديدة',
        });
      }
      queryClient.invalidateQueries({ queryKey: ['user-promotions'] });
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ في عملية الدفع',
        description: error.message || 'حدث خطأ أثناء عملية الدفع',
        variant: 'destructive',
      });
    },
  });
};

export const usePromoteWithWallet = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ listingId, promotionPackageId }: { 
      listingId: number; 
      promotionPackageId: number 
    }) => promotionsAPI.promoteListingWithWallet(listingId, promotionPackageId),
    onSuccess: () => {
      toast({
        title: 'تم الدفع بنجاح',
        description: 'تم ترقية الإعلان باستخدام رصيد المحفظة',
      });
      queryClient.invalidateQueries({ queryKey: ['user-promotions'] });
      queryClient.invalidateQueries({ queryKey: ['userListings'] });
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ في الدفع',
        description: error.message || 'حدث خطأ أثناء الدفع من المحفظة',
        variant: 'destructive',
      });
    },
  });
};

export const useUserPromotions = () => {
  return useQuery({
    queryKey: ['user-promotions'],
    queryFn: () => promotionsAPI.getUserPromotions(),
    select: (data) => data.data,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
