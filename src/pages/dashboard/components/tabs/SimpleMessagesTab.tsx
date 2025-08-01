import React, { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messagesAPI } from '@/services/apis';
import { useAuth } from '@/context/auth-context';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Inbox, User, AlertCircle, MessageSquareText, Send, Check, CheckCheck, MapPin, Phone, Clock, MessageCircle } from 'lucide-react';
import { WhatsAppButton } from '@/components/messages/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

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

const MessageListItem = ({ message, type, expandedId, setExpandedId }: { 
  message: Message; 
  type: 'sent' | 'received';
  expandedId: number | null;
  setExpandedId: (id: number | null) => void;
}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const markAsReadMutation = useMutation({
    mutationFn: (messageId: number) => messagesAPI.markMessageAsRead(messageId),
    onSuccess: (_, messageId) => {
      // تحديث البيانات بدون إعادة تحميل كامل
      queryClient.setQueryData(['user-messages'], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: oldData.data.map((msg: Message) =>
            msg.id === messageId ? { ...msg, read_at: new Date().toISOString() } : msg
          ),
        };
      });
    },
  });

  const handleClick = useCallback(() => {
    const isExpanded = expandedId === message.id;
    
    if (!message.read_at && type === 'received' && !isExpanded) {
      markAsReadMutation.mutate(message.id);
    }
    
    setExpandedId(isExpanded ? null : message.id);
  }, [expandedId, message.id, message.read_at, type, markAsReadMutation, setExpandedId]);

  const isExpanded = expandedId === message.id;
  const isUnread = !message.read_at && type === 'received';
  const otherUser = type === 'sent' ? message.recipient : message.sender;

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('ar-SA', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else {
      return date.toLocaleDateString('ar-SA', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  return (
    <Card 
      className={`mb-3 transition-all duration-300 cursor-pointer hover:shadow-md border-l-4 ${
        isUnread 
          ? 'bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-900/20 border-l-blue-500' 
          : type === 'sent' 
            ? 'border-l-green-400 hover:border-l-green-500' 
            : 'border-l-gray-300 hover:border-l-gray-400'
      } ${isExpanded ? 'ring-2 ring-primary/20 shadow-lg' : ''}`}
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="relative">
            <Avatar className={`transition-all duration-200 ${isExpanded ? 'w-14 h-14' : 'w-12 h-12'}`}>
              <AvatarImage 
                src={otherUser?.image} 
                alt={`${otherUser?.first_name} ${otherUser?.last_name}`} 
              />
              <AvatarFallback className={`${type === 'sent' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'}`}>
                {type === 'sent' ? <Send className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </AvatarFallback>
            </Avatar>
            
            {type === 'sent' && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                {message.read_at ? (
                  <CheckCheck className="w-3 h-3 text-white" />
                ) : (
                  <Check className="w-3 h-3 text-white" />
                )}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-semibold text-base text-foreground">
                  {type === 'sent' ? 'أنت' : (otherUser ? `${otherUser.first_name} ${otherUser.last_name}` : 'مستخدم')}
                </h4>
                
                <div className="flex items-center gap-1">
                  {type === 'sent' && (
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300">
                      <Send className="w-3 h-3 mr-1" />
                      مرسلة
                    </Badge>
                  )}
                  
                  {isUnread && (
                    <Badge variant="destructive" className="text-xs animate-pulse bg-red-500">
                      <MessageCircle className="w-3 h-3 mr-1" />
                      جديدة
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <time className="whitespace-nowrap">
                  {formatTime(message.created_at)}
                </time>
              </div>
            </div>
            
            {message.listing && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 mb-3 border-l-4 border-blue-400">
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  📋 بخصوص الإعلان: {message.listing.title}
                </p>
              </div>
            )}
            
            <div className={`transition-all duration-300 ${isExpanded ? 'max-h-full' : 'max-h-16 overflow-hidden'}`}>
              <p className="text-sm text-foreground leading-relaxed bg-muted/30 p-3 rounded-lg">
                {message.message}
              </p>
            </div>

            {!isExpanded && message.message.length > 100 && (
              <Button variant="ghost" size="sm" className="mt-2 h-auto p-1 text-xs text-primary hover:text-primary/80">
                اقرأ المزيد...
              </Button>
            )}

            {isExpanded && (
              <div className="mt-4 space-y-3">
                <Separator />
                
                {otherUser && (
                  <div className="bg-muted/20 rounded-lg p-3 space-y-2">
                    <h5 className="font-medium text-sm text-foreground mb-2">معلومات المرسل:</h5>
                    
                    <div className="grid grid-cols-1 gap-2">
                      {otherUser.location_address && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{otherUser.location_address}</span>
                        </div>
                      )}
                      
                      {otherUser.phone && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{otherUser.phone}</span>
                          </div>
                          
                          <WhatsAppButton 
                            phoneNumber={otherUser.phone}
                            message={`مرحباً ${otherUser.first_name}، بخصوص ${type === 'sent' ? 'إعلانك' : 'رسالتك'}: "${message.message.substring(0, 50)}..."`}
                            size="sm"
                            className="h-8 px-3 text-xs"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => setExpandedId(null)}
                >
                  إخفاء التفاصيل
                </Button>
              </div>
            )}

            {isUnread && (
              <div className="flex items-center gap-2 mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400">رسالة غير مقروءة</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
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
  const [expandedMessageId, setExpandedMessageId] = useState<number | null>(null);
  
  const { data: messages, isLoading, isError, error } = useQuery({
    queryKey: ['user-messages'],
    queryFn: () => messagesAPI.getMessages(),
    retry: 1,
    refetchInterval: 30000, // تحديث كل 30 ثانية
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

        <TabsContent value="received" className="py-2 space-y-2">
          {receivedMessages.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-muted/30 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Inbox className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-lg mb-2">لا توجد رسائل مستقبلة</h3>
              <p className="text-sm text-muted-foreground">عندما يرسل لك أحد رسالة، ستظهر هنا</p>
            </div>
          ) : (
            receivedMessages.map(message => (
              message && message.id ? (
                <MessageListItem 
                  key={message.id} 
                  message={message} 
                  type="received"
                  expandedId={expandedMessageId}
                  setExpandedId={setExpandedMessageId}
                />
              ) : null
            ))
          )}
        </TabsContent>

        <TabsContent value="sent" className="py-2 space-y-2">
          {sentMessages.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-muted/30 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Send className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-lg mb-2">لا توجد رسائل مرسلة</h3>
              <p className="text-sm text-muted-foreground">الرسائل التي ترسلها ستظهر هنا</p>
            </div>
          ) : (
            sentMessages.map(message => (
              message && message.id ? (
                <MessageListItem 
                  key={message.id} 
                  message={message} 
                  type="sent"
                  expandedId={expandedMessageId}
                  setExpandedId={setExpandedMessageId}
                />
              ) : null
            ))
          )}
        </TabsContent>
      </Tabs>
    );
  }

  return (
    <Card className="shadow-xl border-0 rounded-3xl overflow-hidden bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-blue-500/5 border-b border-primary/10 p-6">
        <div className='flex items-center justify-between w-full'>
          <div className='flex items-center gap-4'>
            <div className="bg-primary/10 p-3 rounded-2xl">
              <MessageSquareText className="h-7 w-7 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                الرسائل
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                رسائل العملاء بخصوص إعلاناتك
              </CardDescription>
            </div>
          </div>
          {unreadReceivedMessages.length > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="destructive" className="animate-pulse shadow-lg">
                <MessageCircle className="w-3 h-3 mr-1" />
                {unreadReceivedMessages.length} غير مقروءة
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <CardBody />
      </CardContent>
    </Card>
  );
}