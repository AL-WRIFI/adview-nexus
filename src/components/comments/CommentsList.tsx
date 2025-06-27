import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Edit3, MessageCircle, MoreVertical, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

import { Comment } from '@/types';

interface CommentsListProps {
  listingId: number | string;
  isAuthenticated: boolean;
  currentUser: { id: string } | null;
}

async function fetchComments(listingId: number) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments?listing_id=${listingId}`);
  if (!res.ok) {
    throw new Error('Failed to fetch comments');
  }
  return res.json();
}

async function createCommentRequest(data: { listing_id: number, content: string, parent_id?: number }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error('Failed to create comment');
  }
  return res.json();
}

async function updateCommentRequest(data: { id: number, content: string }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/${data.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content: data.content }),
  });
  if (!res.ok) {
    throw new Error('Failed to update comment');
  }
  return res.json();
}

async function deleteCommentRequest(commentId: number) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/${commentId}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error('Failed to delete comment');
  }
  return res.json();
}

export function CommentsList({ 
  listingId, 
  isAuthenticated, 
  currentUser 
}: CommentsListProps) {
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  
  const createComment = useMutation({
    mutationFn: (data: { listing_id: number, content: string, parent_id?: number }) => createCommentRequest(data),
    onSuccess: () => {
      // Invalidate the query to refetch comments
      queryClient.invalidateQueries(['comments', listingId]);
      setNewComment('');
      setReplyingTo(null);
    },
  });

  const updateComment = useMutation({
    mutationFn: (data: { id: number, content: string }) => updateCommentRequest(data),
    onSuccess: () => {
      // Invalidate the query to refetch comments
      queryClient.invalidateQueries(['comments', listingId]);
      setEditingComment(null);
      setNewComment('');
    },
  });

  const deleteComment = useMutation({
    mutationFn: (commentId: number) => deleteCommentRequest(commentId),
    onSuccess: () => {
      // Invalidate the query to refetch comments
      queryClient.invalidateQueries(['comments', listingId]);
    },
  });
  
  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['comments', listingId],
    queryFn: () => fetchComments(Number(listingId)),
    enabled: !!listingId
  });

  const handleSubmit = (commentId?: number) => {
    if (!newComment.trim()) return;

    if (commentId) {
      // Updating existing comment
      updateComment.mutate({ id: commentId, content: newComment });
    } else {
      // Creating a new comment or reply
      createComment.mutate({
        listing_id: Number(listingId),
        content: newComment,
        parent_id: replyingTo || undefined,
      });
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? "text-yellow-500" : "text-gray-300"}>
          ★
        </span>
      );
    }
    return stars;
  };

  const handleReply = (parentId: number | string) => {
    setReplyingTo(Number(parentId));
    setNewComment('');
  };

  const handleEdit = (comment: Comment) => {
    setEditingComment(Number(comment.id));
    setNewComment(comment.content);
  };

  const handleDelete = (commentId: number | string) => {
    deleteComment.mutate(Number(commentId));
  };

  const renderComment = (comment: Comment, depth = 0) => {
    const isCurrentUser = currentUser && String(currentUser.id) === String(comment.user_id);
    const isEditing = editingComment === Number(comment.id);
    const isReplying = replyingTo === Number(comment.id);

    return (
      <div key={comment.id} className={cn("space-y-3", depth > 0 && "ml-8 border-l border-gray-200 pl-4")}>
        <div className="flex items-start space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage 
              src={comment.user?.avatar_url || comment.user?.avatar || comment.user?.image || '/placeholder.svg'} 
              alt={comment.user?.username || comment.user?.name || comment.user?.first_name || 'مستخدم'} 
            />
            <AvatarFallback>
              {(comment.user?.username || comment.user?.name || comment.user?.first_name || 'م')[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-sm">
                  {comment.user?.username || comment.user?.name || 
                   `${comment.user?.first_name || ''} ${comment.user?.last_name || ''}`.trim() || 'مستخدم مجهول'}
                </span>
                {comment.user?.verified && (
                  <Badge variant="secondary" className="text-xs">موثق</Badge>
                )}
                {comment.rating && (
                  <div className="flex items-center space-x-1">
                    {renderStars(comment.rating)}
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span>{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: ar })}</span>
                {isCurrentUser && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(comment)}>
                        <Edit3 className="h-3 w-3 mr-1" />
                        تعديل
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(comment.id)} 
                        className="text-red-600"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        حذف
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
            
            {isEditing ? (
              <div className="space-y-2">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="اكتب تعليقك..."
                  className="min-h-[60px]"
                />
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setEditingComment(null);
                      setNewComment('');
                    }}
                  >
                    إلغاء
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => handleSubmit(Number(comment.id))}
                    disabled={!newComment.trim() || updateComment.isPending}
                  >
                    {updateComment.isPending ? 'جاري الحفظ...' : 'حفظ'}
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-700">{comment.content}</p>
            )}
            
            {isAuthenticated && !isEditing && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => handleReply(comment.id)}
              >
                <MessageCircle className="h-3 w-3 mr-1" />
                رد
              </Button>
            )}
            
            {isReplying && (
              <div className="space-y-2 mt-3">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="اكتب ردك..."
                  className="min-h-[60px]"
                />
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setReplyingTo(null);
                      setNewComment('');
                    }}
                  >
                    إلغاء
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => handleSubmit(Number(comment.id))}
                    disabled={!newComment.trim() || createComment.isPending}
                  >
                    {createComment.isPending ? 'جاري الإرسال...' : 'إرسال'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Render replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="space-y-3">
            {comment.replies.map(reply => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const queryClient = useQueryClient();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">التعليقات</h3>
        {isAuthenticated && (
          <Button variant="secondary" size="sm" onClick={() => setReplyingTo(0)}>
            أضف تعليق
          </Button>
        )}
      </div>
      
      {/* Main Comment Form */}
      {isAuthenticated && replyingTo === 0 && (
        <div className="space-y-2">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="اكتب تعليقك..."
            className="min-h-[80px]"
          />
          <div className="flex justify-end">
            <Button 
              size="sm"
              onClick={() => handleSubmit()}
              disabled={!newComment.trim() || createComment.isPending}
            >
              {createComment.isPending ? 'جاري الإرسال...' : 'إرسال'}
            </Button>
          </div>
        </div>
      )}
      
      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>لا توجد تعليقات بعد. كن أول من يعلق!</p>
          </div>
        ) : (
          comments
            .filter(comment => !comment.parent_id)
            .map(comment => renderComment(comment))
        )}
      </div>
    </div>
  );
}
