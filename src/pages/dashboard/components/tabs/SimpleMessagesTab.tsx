import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { messagesAPI } from '@/services/apis';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Inbox, User, AlertCircle, MessageSquareText } from 'lucide-react';
import { WhatsAppButton } from '@/components/messages/WhatsAppButton';

interface Message {
  id: number;
  sender_id: number;
  recipient_id: number;
  message: string;
  listing_id?: number;
  created_at: string;
  sender?: {
    id: number;
    first_name: string;
    last_name: string;
    phone?: string;
    image?: string;
  };
  listing?: {
    id: number;
    title: string;
  };
}

const MessageListItem = ({ message }: { message: Message }) => (
  <div className="group flex items-start gap-4 p-4 mx-2 rounded-lg transition-all duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 border-b border-neutral-100 dark:border-neutral-700 last:border-b-0">
    <div className="relative">
      <Avatar className="w-12 h-12">
        <AvatarImage src={message.sender?.image} alt={`${message.sender?.first_name} ${message.sender?.last_name}`} />
        <AvatarFallback className="bg-neutral-200 dark:bg-neutral-700">
          <User className="text-neutral-500" />
        </AvatarFallback>
      </Avatar>
    </div>
    <div className="flex-1 overflow-hidden">
      <div className="flex items-start justify-between mb-2">
        <p className="font-semibold text-sm text-neutral-800 dark:text-neutral-100">
          {message.sender ? `${message.sender.first_name} ${message.sender.last_name}` : 'مستخدم'}
        </p>
        <time className="text-xs text-muted-foreground whitespace-nowrap">
          {new Date(message.created_at).toLocaleDateString('ar-SA')}
        </time>
      </div>
      
      {message.listing && (
        <div className="text-xs text-blue-600 dark:text-blue-400 mb-1">
          بخصوص: {message.listing.title}
        </div>
      )}
      
      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
        {message.message}
      </p>
      
      {message.sender?.phone && (
        <WhatsAppButton 
          phoneNumber={message.sender.phone}
          message={`مرحباً ${message.sender.first_name}، بخصوص رسالتك: "${message.message.substring(0, 50)}..."`}
          size="sm"
          className="h-7 w-auto px-3 text-xs"
        />
      )}
    </div>
  </div>
);

const MessagesSkeleton = () => (
  <div className="space-y-1 p-2">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center gap-4 p-4 rounded-lg">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4 rounded-md" />
          <Skeleton className="h-4 w-1/2 rounded-md" />
          <Skeleton className="h-4 w-2/3 rounded-md" />
        </div>
        <div className="flex flex-col items-end space-y-2">
          <Skeleton className="h-3 w-12 rounded-md" />
          <Skeleton className="h-6 w-16 rounded-md" />
        </div>
      </div>
    ))}
  </div>
);

export function SimpleMessagesTab() {
  const { data: messages, isLoading, isError, error } = useQuery({
    queryKey: ['user-messages'],
    queryFn: () => messagesAPI.getMessages(),
    retry: 1,
  });

  const messagesList: Message[] = messages?.data || [];

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
            عذراً، لم نتمكن من جلب رسائلك في الوقت الحالي. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.
          </p>
          {error && <pre className="mt-4 text-xs text-left bg-neutral-100 dark:bg-neutral-800 p-2 rounded-md overflow-x-auto">{(error as Error).message}</pre>}
        </div>
      );
    }
    
    if (messagesList.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Inbox className="h-20 w-20 text-muted-foreground mb-4 opacity-70" />
          <h3 className="text-xl font-medium">صندوق الرسائل فارغ</h3>
          <p className="text-muted-foreground mt-2 max-w-xs">
            عندما يرسل لك أحد رسالة بخصوص إعلاناتك، ستظهر هنا.
          </p>
        </div>
      );
    }

    return (
      <div className="py-2">
        {messagesList.map(message => (
          message && message.id ? <MessageListItem key={message.id} message={message} /> : null
        ))}
      </div>
    );
  }

  return (
    <Card className="shadow-lg shadow-black/5 border-none rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between border-b dark:border-neutral-800 p-4">
        <div className='flex items-center gap-3'>
          <MessageSquareText className="h-6 w-6 text-brand" />
          <div>
            <CardTitle className="text-lg">الرسائل</CardTitle>
            <CardDescription className="text-xs">رسائل العملاء بخصوص إعلاناتك</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <CardBody />
      </CardContent>
    </Card>
  );
}