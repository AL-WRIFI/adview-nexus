
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { toast } from '@/hooks/use-toast';
import { SearchFilters } from '@/types';

export function useListings(filters?: SearchFilters) {
  return useQuery({
    queryKey: ['listings', filters],
    queryFn: async () => {
      const response = await api.getListings(filters);
      return response.data;
    },
    staleTime: 30000,
  });
}

export function useListing(id: number) {
  return useQuery({
    queryKey: ['listing', id],
    queryFn: async () => {
      const response = await api.getListing(id);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useUserListings() {
  return useQuery({
    queryKey: ['user-listings'],
    queryFn: async () => {
      const response = await api.getUserListings();
      return response.data;
    },
  });
}

export function useCreateListing() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: FormData) => api.createListing(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['user-listings'] });
      toast({
        title: "تم إنشاء الإعلان بنجاح",
        description: "سيتم مراجعة إعلانك وعرضه قريباً",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "خطأ في إنشاء الإعلان",
        description: error.message,
      });
    },
  });
}

export function useUpdateListing() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) => 
      api.updateListing(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['user-listings'] });
      toast({
        title: "تم تحديث الإعلان بنجاح",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "خطأ في تحديث الإعلان",
        description: error.message,
      });
    },
  });
}

export function useDeleteListing() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => api.deleteListing(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['user-listings'] });
      toast({
        title: "تم حذف الإعلان بنجاح",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "خطأ في حذف الإعلان",
        description: error.message,
      });
    },
  });
}

// Comments hooks
export function useComments(listingId: number) {
  return useQuery({
    queryKey: ['comments', listingId],
    queryFn: async () => {
      const response = await api.getComments(listingId);
      return response.data;
    },
    enabled: !!listingId,
  });
}

export function useAddComment(listingId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (content: string) => api.addComment(listingId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', listingId] });
      toast({
        title: "تم إضافة التعليق بنجاح",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "خطأ في إضافة التعليق",
        description: error.message,
      });
    },
  });
}

export function useAddReply(listingId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ commentId, content }: { commentId: number; content: string }) => 
      api.addReply(listingId, commentId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', listingId] });
      toast({
        title: "تم إضافة الرد بنجاح",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "خطأ في إضافة الرد",
        description: error.message,
      });
    },
  });
}

export function useDeleteComment(listingId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (commentId: number) => api.deleteComment(listingId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', listingId] });
      toast({
        title: "تم حذف التعليق بنجاح",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "خطأ في حذف التعليق",
        description: error.message,
      });
    },
  });
}

export function useEditComment(listingId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ commentId, content }: { commentId: number; content: string }) => 
      api.editComment(listingId, commentId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', listingId] });
      toast({
        title: "تم تعديل التعليق بنجاح",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "خطأ في تعديل التعليق",
        description: error.message,
      });
    },
  });
}

export function useDeleteReply(listingId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ commentId, replyId }: { commentId: number; replyId: number }) => 
      api.deleteReply(listingId, commentId, replyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', listingId] });
      toast({
        title: "تم حذف الرد بنجاح",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "خطأ في حذف الرد",
        description: error.message,
      });
    },
  });
}

export function useEditReply(listingId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ commentId, replyId, content }: { commentId: number; replyId: number; content: string }) => 
      api.editReply(listingId, commentId, replyId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', listingId] });
      toast({
        title: "تم تعديل الرد بنجاح",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "خطأ في تعديل الرد",
        description: error.message,
      });
    },
  });
}

// Favorites hooks
export function useFavorites() {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const response = await api.getFavorites();
      return response.data;
    },
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ listingId, isFavorited }: { listingId: number; isFavorited: boolean }) => {
      if (isFavorited) {
        return api.removeFromFavorites(listingId);
      } else {
        return api.addToFavorites(listingId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "خطأ في إدارة المفضلة",
        description: error.message,
      });
    },
  });
}

// Auth hooks
export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await api.getCurrentUser();
      return response.data;
    },
    retry: false,
  });
}
