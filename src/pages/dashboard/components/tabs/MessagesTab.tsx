// Path: MixSyria\src/pages\dashboard\components\tabs\MessagesTab.tsx

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { chatAPI } from '@/services/apis';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Inbox, User, AlertCircle, MessageSquareText } from 'lucide-react';
import { Chat } from '@/types';
import { WhatsAppButton } from '@/components/chat/WhatsAppButton';

// --- تصميم جديد ومحسّن لعرض عنصر المحادثة ---
const ChatListItem = ({ chat }: { chat: Chat }) => (
    <Link
        to={`/messages/${chat.id}`}
        // group: لتفعيل تأثيرات على العناصر الداخلية عند التمرير على العنصر الأب
        className="group flex items-center gap-4 p-3 mx-2 rounded-lg transition-all duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
    >
        <div className="relative">
            <Avatar className="w-12 h-12">
                <AvatarImage src={chat.other_participant?.image} alt={chat.other_participant?.full_name} />
                <AvatarFallback className="bg-neutral-200 dark:bg-neutral-700">
                    <User className="text-neutral-500" />
                </AvatarFallback>
            </Avatar>
            {/* يمكنك إضافة مؤشر الحالة (أونلاين) هنا إذا توفرت البيانات */}
            {/* <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-neutral-900" /> */}
        </div>
        <div className="flex-1 overflow-hidden">
            <p className="font-semibold text-sm text-neutral-800 dark:text-neutral-100 truncate">
                {chat.other_participant?.full_name || 'مستخدم'}
            </p>
            <p className="text-sm text-muted-foreground truncate">
                {chat.last_message?.message?.text || 'لا توجد رسائل بعد'}
            </p>
        </div>
        <div className="flex flex-col items-end justify-between h-full gap-2 text-xs">
            <time className="text-muted-foreground whitespace-nowrap">{chat.updated_at}</time>
            <div className="flex items-center gap-2">
                {chat.unread_messages_count > 0 && (
                    <span className="bg-brand text-white font-bold rounded-full h-5 w-5 flex items-center justify-center text-[10px] transform transition-transform group-hover:scale-110">
                        {chat.unread_messages_count}
                    </span>
                )}
                {chat.other_participant && (
                    <WhatsAppButton 
                        phoneNumber={chat.other_participant.phone || ''}
                        message={`مرحباً ${chat.other_participant.full_name}`}
                        size="sm"
                        className="h-6 w-6 p-1"
                    />
                )}
            </div>
        </div>
    </Link>
);

// --- هيكل عظمي (Skeleton) محدّث ليطابق التصميم الجديد ---
const MessagesSkeleton = () => (
    <div className="space-y-1 p-2">
        {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-lg">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4 rounded-md" />
                    <Skeleton className="h-4 w-1/2 rounded-md" />
                </div>
                <div className="flex flex-col items-end space-y-2">
                    <Skeleton className="h-3 w-12 rounded-md" />
                    <Skeleton className="h-5 w-5 rounded-full" />
                </div>
            </div>
        ))}
    </div>
);

export function MessagesTab() {
    const { data: apiResponse, isLoading, isError, error } = useQuery({
        queryKey: ['chats'],
        queryFn: () => chatAPI.getChats(),
        retry: 1,
    });

    const chats: Chat[] = apiResponse?.data?.data || [];

    const CardBody = () => {
        if (isLoading) {
            return <MessagesSkeleton />;
        }
        
        if (isError) {
            return (
                <div className="text-center text-red-600 dark:text-red-400 py-16 px-4 flex flex-col items-center justify-center">
                    <AlertCircle className="mx-auto h-16 w-16 mb-4 opacity-80" />
                    <h3 className="text-xl font-semibold">حدث خطأ ما</h3>
                    <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                        عذراً، لم نتمكن من جلب محادثاتك في الوقت الحالي. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.
                    </p>
                    {error && <pre className="mt-4 text-xs text-left bg-neutral-100 dark:bg-neutral-800 p-2 rounded-md overflow-x-auto">{error.message}</pre>}
                </div>
            );
        }
        
        if (chats.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Inbox className="h-20 w-20 text-muted-foreground mb-4 opacity-70" />
                    <h3 className="text-xl font-medium">صندوق الوارد الخاص بك فارغ</h3>
                    <p className="text-muted-foreground mt-2 max-w-xs">
                        عندما تبدأ محادثة جديدة مع مستخدم آخر، ستظهر هنا.
                    </p>
                </div>
            );
        }

        return (
            // إضافة فاصل بين العناصر لمظهر أنظف
            <div className="space-y-1 py-2">
                {chats.map(chat => (
                    chat && chat.id ? <ChatListItem key={chat.id} chat={chat} /> : null
                ))}
            </div>
        );
    }

    return (
        // --- تصميم جديد للبطاقة الرئيسية ---
        <Card className="shadow-lg shadow-black/5 border-none rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between border-b dark:border-neutral-800 p-4">
                <div className='flex items-center gap-3'>
                    <MessageSquareText className="h-6 w-6 text-brand" />
                    <div>
                        <CardTitle className="text-lg">الرسائل</CardTitle>
                        <CardDescription className="text-xs">آخر المحادثات الخاصة بك</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <CardBody />
            </CardContent>
        </Card>
    );
}