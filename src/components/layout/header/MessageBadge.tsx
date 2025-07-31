import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { chatAPI } from '@/services/apis';
import { useAuth } from '@/context/auth-context';

export function MessageBadge() {
  const { isAuthenticated } = useAuth();
  
  const { data: chatsResponse } = useQuery({
    queryKey: ['chats'],
    queryFn: () => chatAPI.getChats(),
    enabled: isAuthenticated,
    refetchInterval: 30000, // تحديث كل 30 ثانية
  });

  const chats = chatsResponse?.data?.data || [];
  const unreadCount = chats.reduce((total: number, chat: any) => total + (chat.unread_messages_count || 0), 0);

  if (!isAuthenticated) return null;

  return (
    <Button variant="ghost" size="icon" asChild className="relative">
      <Link to="/dashboard/messages">
        <MessageSquare className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs rounded-full bg-red-500 text-white border-2 border-white dark:border-gray-900"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Link>
    </Button>
  );
}