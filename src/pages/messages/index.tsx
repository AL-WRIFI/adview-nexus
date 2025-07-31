// Path: C:\Users\Zainon\Herd\MixSyria\src\pages\messages\index.tsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { chatAPI } from '@/services/apis';
import { Chat, ChatMessage, ApiResponse, PaginatedResponse } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/layout/header'; // You can remove this for a fully immersive page
import { FocusChatHeader, FocusMessageBubble, FocusMessageInput } from './components';
import { Loader2 } from 'lucide-react';


const BackgroundEffect = () => (
    <div className="absolute inset-0 z-[-1] overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-purple-200/30 dark:bg-purple-900/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-2/3 h-2/3 bg-indigo-200/30 dark:bg-indigo-900/20 rounded-full filter blur-3xl animate-pulse animation-delay-4000"></div>
    </div>
);

export default function InnovativeMessagesPage() {
    const { chatId } = useParams<{ chatId: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { ref: loadMoreRef, inView: isLoadMoreVisible } = useInView({ rootMargin: '100px 0px 0px 0px' });
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [newMessage, setNewMessage] = useState('');

    const numChatId = Number(chatId);
    if (isNaN(numChatId)) {
        useEffect(() => navigate('/dashboard/messages', { replace: true }), [navigate]);
        return null;
    }

    // --- Data Fetching ---
    const cachedChatsData = queryClient.getQueryData<ApiResponse<PaginatedResponse<Chat>>>(['chats']);
    const participant = cachedChatsData?.data?.find(c => c.id === numChatId)?.other_participant;

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useInfiniteQuery({
        queryKey: ['chat', numChatId],
        queryFn: ({ pageParam = 1 }) => chatAPI.getChatMessages(numChatId, pageParam),
        getNextPageParam: (lastPage) => lastPage.current_page < lastPage.last_page ? lastPage.current_page + 1 : undefined,
        refetchOnWindowFocus: false, // Prevents aggressive refetching
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
    
    useEffect(() => {
        if (isLoadMoreVisible && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [isLoadMoreVisible, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const allMessages = data?.pages.flatMap(page => page.data).filter(Boolean) ?? [];

    // --- Mutation ---
    const mutation = useMutation({
        mutationFn: (formData: FormData) => chatAPI.sendMessage(numChatId, formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chat', numChatId] });
            queryClient.invalidateQueries({ queryKey: ['chats'] });
        },
        onError: () => toast({ title: 'فشل الإرسال', description: 'لم نتمكن من إرسال رسالتك.', variant: 'destructive' }),
    });

    // --- Handlers & Effects ---
    const handleSendMessage = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            const formData = new FormData();
            formData.append('message', newMessage);
            mutation.mutate(formData);
            setNewMessage('');
        }
    }, [newMessage, mutation]);

    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    }, [allMessages]);

    if (isLoading) {
        return <div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-purple-500" /></div>;
    }
    if (isError) {
        return <div className="flex h-screen w-full items-center justify-center text-red-500">حدث خطأ ما.</div>;
    }

    return (
        <div className="flex flex-col h-screen bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
            <BackgroundEffect />
            <FocusChatHeader participant={participant} />
            
            <main className="flex-1 flex flex-col-reverse p-3 sm:p-4 gap-2 overflow-y-auto">
                <div ref={messagesEndRef} />
                <AnimatePresence>
                    {allMessages.map(msg => <FocusMessageBubble key={msg.id} message={msg} />)}
                </AnimatePresence>
                 {hasNextPage && (
                     <div ref={loadMoreRef} className="text-center py-4">
                        {isFetchingNextPage && <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />}
                    </div>
                )}
            </main>

            <FocusMessageInput
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onSubmit={handleSendMessage}
                isSending={mutation.isPending}
            />
        </div>
    );
}