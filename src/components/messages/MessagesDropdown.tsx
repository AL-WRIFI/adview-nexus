import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Check, User, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messagesAPI } from '@/services/apis';
import { useAuth } from '@/context/auth-context';
import { WhatsAppButton } from './WhatsAppButton';
import { toast } from '@/hooks/use-toast';

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
  listing?: {
    id: number;
    title: string;
  };
}

export function MessagesDropdown() {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: messagesResponse, isLoading } = useQuery({
    queryKey: ['user-messages'],
    queryFn: () => messagesAPI.getMessages(),
    enabled: isAuthenticated,
    refetchInterval: 30000, // تحديث كل 30 ثانية
  });

  const markAsReadMutation = useMutation({
    mutationFn: (messageId: number) => messagesAPI.markMessageAsRead(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-messages'] });
      // تشغيل صوت الإشعار عند قراءة الرسالة
      playNotificationSound();
    },
  });

  const messages: Message[] = messagesResponse?.data || [];
  const unreadMessages = messages.filter(msg => !msg.read_at);
  const unreadCount = unreadMessages.length;

  // تشغيل صوت الإشعار
  const playNotificationSound = () => {
    try {
      const audio = new Audio('/notification.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {
        // فشل في التشغيل - قد يكون المستخدم لم يتفاعل مع الصفحة بعد
      });
    } catch (error) {
      console.log('لا يمكن تشغيل صوت الإشعار');
    }
  };

  // مراقبة الرسائل الجديدة
  useEffect(() => {
    const prevCount = localStorage.getItem('messageCount');
    const currentCount = unreadCount.toString();
    
    if (prevCount && parseInt(prevCount) < unreadCount) {
      playNotificationSound();
      toast({
        title: 'رسالة جديدة',
        description: `لديك ${unreadCount} رسالة غير مقروءة`,
      });
    }
    
    localStorage.setItem('messageCount', currentCount);
  }, [unreadCount]);

  const handleMessageClick = (message: Message) => {
    if (!message.read_at) {
      markAsReadMutation.mutate(message.id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('ar-SA', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else {
      return date.toLocaleDateString('ar-SA');
    }
  };

  const MessageItem = ({ message }: { message: Message }) => {
    const isUnread = !message.read_at;
    const isSent = message.sender_id === user?.id;
    
    return (
      <Card 
        className={`mb-2 transition-all cursor-pointer hover:shadow-md ${
          isUnread ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700' : ''
        }`}
        onClick={() => handleMessageClick(message)}
      >
        <CardContent className="p-3">
          <div className="flex items-start gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={message.sender?.image} />
              <AvatarFallback className="bg-muted">
                <User className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm truncate">
                    {isSent ? 'أنت' : `${message.sender?.first_name} ${message.sender?.last_name}`}
                  </p>
                  {isSent && <Badge variant="outline" className="text-xs">مرسلة</Badge>}
                  {isUnread && !isSent && <Badge variant="destructive" className="text-xs">جديدة</Badge>}
                </div>
                <time className="text-xs text-muted-foreground">
                  {formatDate(message.created_at)}
                </time>
              </div>

              {message.listing && (
                <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">
                  بخصوص: {message.listing.title}
                </p>
              )}

              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {message.message}
              </p>

              {!isSent && message.sender?.phone && (
                <div className="flex items-center gap-2">
                  {message.sender.location_address && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{message.sender.location_address}</span>
                    </div>
                  )}
                  <WhatsAppButton 
                    phoneNumber={message.sender.phone}
                    message={`مرحباً ${message.sender.first_name}، بخصوص رسالتك: "${message.message.substring(0, 50)}..."`}
                    size="sm"
                    className="h-6 px-2 text-xs"
                  />
                </div>
              )}

              {isUnread && !isSent && (
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-blue-600 dark:text-blue-400">غير مقروءة</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (!isAuthenticated) return null;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <MessageSquare className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs rounded-full bg-red-500 text-white border-2 border-white dark:border-gray-900"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">الرسائل</h3>
            <Link to="/messages" onClick={() => setIsOpen(false)}>
              <Button variant="ghost" size="sm">عرض الكل</Button>
            </Link>
          </div>
          {unreadCount > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              {unreadCount} رسالة غير مقروءة
            </p>
          )}
        </div>

        <ScrollArea className="h-96">
          <div className="p-3">
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">لا توجد رسائل</p>
              </div>
            ) : (
              <div className="space-y-1">
                {messages.slice(0, 10).map(message => (
                  <MessageItem key={message.id} message={message} />
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}