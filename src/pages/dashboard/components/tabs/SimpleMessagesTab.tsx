import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messagesAPI } from '@/services/apis';
import { useAuth } from '@/context/auth-context';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Inbox, User, AlertCircle, MessageSquareText, Send, Check, CheckCheck, MapPin, Phone } from 'lucide-react';
import { WhatsAppButton } from '@/components/messages/WhatsAppButton';

interface Message {
  id: number;
  sender_id: number;
  recipient_id: number;
  message: string;
  listing_id?: number;
  read_at?: string;
  created_at: string;
  sender?: {
    id: number;
    first_name: string;
    last_name: string;
    phone?: string;
    image?: string;
    location_address?: string;
  };
  recipient?: {
    id: number;
    first_name: string;
    last_name: string;
    phone?: string;
    image?: string;
    location_address?: string;
  };
  listing?: {
    id: number;
    title: string;
  };
}

const MessageListItem = ({ message, type }: { message: Message; type: 'sent' | 'received' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const markAsReadMutation = useMutation({
    mutationFn: (messageId: number) => messagesAPI.markMessageAsRead(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-messages'] });
    },
  });

  const handleClick = () => {
    if (!message.read_at && type === 'received') {
      markAsReadMutation.mutate(message.id);
    }
    setIsExpanded(!isExpanded);
  };

  const isUnread = !message.read_at && type === 'received';
  const otherUser = type === 'sent' ? message.recipient : message.sender;

  return (
    <div 
      className={`group flex items-start gap-4 p-4 mx-2 rounded-lg transition-all duration-200 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 border-b border-neutral-100 dark:border-neutral-700 last:border-b-0 ${
        isUnread ? 'bg-blue-50 dark:bg-blue-900/20' : ''
      }`}
      onClick={handleClick}
    >
      <div className="relative">
        <Avatar className="w-12 h-12">
          <AvatarImage src={otherUser?.image} alt={`${otherUser?.first_name} ${otherUser?.last_name}`} />
          <AvatarFallback className="bg-neutral-200 dark:bg-neutral-700">
            <User className="text-neutral-500" />
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm text-neutral-800 dark:text-neutral-100">
              {type === 'sent' ? 'أنت' : (otherUser ? `${otherUser.first_name} ${otherUser.last_name}` : 'مستخدم')}
            </p>
            {type === 'sent' && (
              <Badge variant="secondary" className="text-xs">
                <Send className="w-3 h-3 mr-1" />
                مرسلة
              </Badge>
            )}
            {isUnread && (
              <Badge variant="destructive" className="text-xs animate-pulse">
                جديدة
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <time className="text-xs text-muted-foreground whitespace-nowrap">
              {new Date(message.created_at).toLocaleDateString('ar-SA')}
            </time>
            {type === 'sent' && (
              <div className="text-muted-foreground">
                {message.read_at ? (
                  <CheckCheck className="w-4 h-4 text-blue-500" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
              </div>
            )}
          </div>
        </div>
        
        {message.listing && (
          <div className="text-xs text-blue-600 dark:text-blue-400 mb-1">
            بخصوص: {message.listing.title}
          </div>
        )}
        
        <p className={`text-sm text-muted-foreground mb-2 ${isExpanded ? '' : 'line-clamp-2'}`}>
          {message.message}
        </p>

        {isExpanded && otherUser && (
          <div className="mt-3 pt-3 border-t border-border space-y-2">
            {otherUser.location_address && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span>{otherUser.location_address}</span>
              </div>
            )}
            {otherUser.phone && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Phone className="w-3 h-3" />
                  <span>{otherUser.phone}</span>
                </div>
                <WhatsAppButton 
                  phoneNumber={otherUser.phone}
                  message={`مرحباً ${otherUser.first_name}، بخصوص ${type === 'sent' ? 'إعلانك' : 'رسالتك'}: "${message.message.substring(0, 50)}..."`}
                  size="sm"
                  className="h-6 px-2 text-xs"
                />
              </div>
            )}
          </div>
        )}

        {isUnread && (
          <div className="flex items-center gap-1 mt-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-blue-600 dark:text-blue-400">غير مقروءة</span>
          </div>
        )}
      </div>
    </div>
  );
};

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
  const { user } = useAuth();
  const { data: messages, isLoading, isError, error } = useQuery({
    queryKey: ['user-messages'],
    queryFn: () => messagesAPI.getMessages(),
    retry: 1,
  });

  const messagesList: Message[] = messages?.data || [];
  
  // تصنيف الرسائل
  const sentMessages = messagesList.filter(msg => msg.sender_id === user?.id);
  const receivedMessages = messagesList.filter(msg => msg.recipient_id === user?.id);
  const unreadReceivedMessages = receivedMessages.filter(msg => !msg.read_at);

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
      <Tabs defaultValue="received" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="received" className="relative">
            <Inbox className="w-4 h-4 mr-2" />
            المستقبلة
            {unreadReceivedMessages.length > 0 && (
              <Badge variant="destructive" className="ml-2 h-4 w-4 p-0 text-xs">
                {unreadReceivedMessages.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="sent">
            <Send className="w-4 h-4 mr-2" />
            المرسلة
          </TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="py-2">
          {receivedMessages.length === 0 ? (
            <div className="text-center py-8">
              <Inbox className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">لا توجد رسائل مستقبلة</p>
            </div>
          ) : (
            receivedMessages.map(message => (
              message && message.id ? (
                <MessageListItem key={message.id} message={message} type="received" />
              ) : null
            ))
          )}
        </TabsContent>

        <TabsContent value="sent" className="py-2">
          {sentMessages.length === 0 ? (
            <div className="text-center py-8">
              <Send className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">لا توجد رسائل مرسلة</p>
            </div>
          ) : (
            sentMessages.map(message => (
              message && message.id ? (
                <MessageListItem key={message.id} message={message} type="sent" />
              ) : null
            ))
          )}
        </TabsContent>
      </Tabs>
    );
  }

  return (
    <Card className="shadow-lg shadow-black/5 border-none rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between border-b dark:border-neutral-800 p-4">
        <div className='flex items-center justify-between w-full'>
          <div className='flex items-center gap-3'>
            <MessageSquareText className="h-6 w-6 text-brand" />
            <div>
              <CardTitle className="text-lg">الرسائل</CardTitle>
              <CardDescription className="text-xs">رسائل العملاء بخصوص إعلاناتك</CardDescription>
            </div>
          </div>
          {unreadReceivedMessages.length > 0 && (
            <Badge variant="destructive" className="animate-pulse">
              {unreadReceivedMessages.length} غير مقروءة
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <CardBody />
      </CardContent>
    </Card>
  );
}