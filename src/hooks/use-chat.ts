// src/hooks/use-chat.ts

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { chatAPI } from '@/services/apis';
import { toast } from '@/hooks/use-toast';

// Hook لجلب قائمة المحادثات (مع دعم Pagination)
export const useChats = () => {
  return useQuery({
    queryKey: ['chats'],
    queryFn: () => chatAPI.getChats(),
  });
};

// Hook لجلب رسائل محادثة معينة (مع دعم Infinite Scroll)
export const useChatMessages = (chatId: number | null) => {
  return useInfiniteQuery({
    queryKey: ['chat', chatId],
    queryFn: ({ pageParam = 1 }) => chatAPI.getChatMessages(chatId!, pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.data.current_page < lastPage.data.last_page) {
        return lastPage.data.current_page + 1;
      }
      return undefined;
    },
    enabled: !!chatId, // لا تقم بتشغيل الكويري إذا كان chatId غير موجود
  });
};

// Hook لبدء محادثة جديدة
export const useStartConversation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => chatAPI.startConversation(data),
    onSuccess: (response) => {
      // تحديث قائمة المحادثات والمحادثة الجديدة
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      queryClient.setQueryData(['chat', response.data.chat_id], (oldData: any) => {
          // يمكنك هنا تحديث الكاش مباشرة بالرسالة الجديدة
          return oldData;
      });
      toast({ title: 'نجاح', description: 'تم إرسال رسالتك بنجاح.' });
    },
    onError: (error: Error) => {
      toast({
        title: 'خطأ',
        description: error.message || 'فشل في بدء المحادثة.',
        variant: 'destructive',
      });
    },
  });
};

// Hook لإرسال رسالة في محادثة موجودة
export const useSendMessage = (chatId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => chatAPI.sendMessageInChat(chatId, data),
    onSuccess: () => {
      // تحديث قائمة المحادثات والمحادثة الحالية
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      queryClient.invalidateQueries({ queryKey: ['chat', chatId] });
      toast({ title: 'نجاح', description: 'تم إرسال الرسالة.' });
    },
    onError: (error: Error) => {
      toast({
        title: 'خطأ',
        description: error.message || 'فشل في إرسال الرسالة.',
        variant: 'destructive',
      });
    },
  });
};