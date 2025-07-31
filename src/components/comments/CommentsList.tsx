
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { User, MessageSquare, Edit, Trash2, Reply, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Comment } from '@/types';
import { useAuth } from '@/context/auth-context';
import { useQueryClient } from '@tanstack/react-query';

interface CommentsListProps {
  listingId: number;
  onAddComment: (text: string) => void;
  onAddReply: (commentId: number, text: string) => void;
  onDeleteComment: (commentId: number) => void;
  onEditComment: (commentId: number, text: string) => void;
  onDeleteReply: (commentId: number, replyId: number) => void;
  onEditReply: (commentId: number, replyId: number, text: string) => void;
  isLoading?: boolean;
}

export function CommentsList({
  listingId,
  onAddComment,
  onAddReply,
  onDeleteComment,
  onEditComment,
  onDeleteReply,
  onEditReply,
  isLoading,
}: CommentsListProps) {
  const [commentText, setCommentText] = useState('');
  const [replyText, setReplyText] = useState('');
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [editingReply, setEditingReply] = useState<number | null>(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const handleAddComment = () => {
    if (commentText.trim()) {
      onAddComment(commentText);
      setCommentText('');
    }
  };

  const handleAddReply = (commentId: number) => {
    if (replyText.trim()) {
      onAddReply(commentId, replyText);
      setReplyText('');
    }
  };

  const renderComment = (comment: Comment) => {
    const isCurrentUserComment = comment.user_id === user?.id;
    const [isReplying, setIsReplying] = useState(false);

    return (
      <div key={comment.id} className="mb-4 border-b pb-4 last:border-b-0">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={comment.user?.avatar_url || comment.user?.avatar} />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">
                {comment.user?.first_name} {comment.user?.last_name}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(comment.created_at || ''), {
                  addSuffix: true,
                  locale: ar,
                })}
              </p>
            </div>
          </div>

          {(isCurrentUserComment) && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingComment(Number(comment.id))}
                className="h-6 px-2 text-xs"
              >
                تعديل
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDeleteComment(Number(comment.id))}
                className="h-6 px-2 text-xs text-red-500 hover:text-red-700"
              >
                حذف
              </Button>
            </div>
          )}
        </div>

        {editingComment === Number(comment.id) ? (
          <div className="mt-2 flex flex-col gap-2">
            <Textarea
              defaultValue={comment.content}
              onChange={(e) => setCommentText(e.target.value)}
              className="text-sm"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingComment(null)}
                className="h-8 px-3 text-xs"
              >
                إلغاء
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  onEditComment(Number(comment.id), commentText);
                  setEditingComment(null);
                }}
                className="h-8 px-3 text-xs"
              >
                حفظ
              </Button>
            </div>
          </div>
        ) : (
          <p className="mt-2 text-sm whitespace-pre-line">{comment.content}</p>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsReplying(!isReplying)}
          className="mt-2 h-8 px-3 text-xs"
        >
          <Reply className="w-3 h-3 ml-1" />
          رد
        </Button>

        {isReplying && (
          <div className="mt-2 flex flex-col gap-2">
            <Textarea
              placeholder="أضف ردًا..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="text-sm"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsReplying(false)}
                className="h-8 px-3 text-xs"
              >
                إلغاء
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  handleAddReply(Number(comment.id));
                  setIsReplying(false);
                }}
                className="h-8 px-3 text-xs"
              >
                إرسال
              </Button>
            </div>
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 pr-4">
            {comment.replies.map((reply) => (
              <div key={reply.id} className="mb-4 border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={reply.user?.avatar_url || reply.user?.avatar} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {reply.user?.first_name} {reply.user?.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(reply.created_at || ''), { 
                          addSuffix: true, 
                          locale: ar 
                        })}
                      </p>
                    </div>
                  </div>
                  
                  {(reply.user_id === user?.id || user?.id === comment.user_id) && (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingReply(Number(reply.id))}
                        className="h-6 px-2 text-xs"
                      >
                        تعديل
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteReply(Number(comment.id), Number(reply.id))}
                        className="h-6 px-2 text-xs text-red-500 hover:text-red-700"
                      >
                        حذف
                      </Button>
                    </div>
                  )}
                </div>

                {editingReply === Number(reply.id) ? (
                  <div className="mt-2 flex flex-col gap-2">
                    <Textarea
                      defaultValue={reply.content}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="text-sm"
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingReply(null)}
                        className="h-8 px-3 text-xs"
                      >
                        إلغاء
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          onEditReply(Number(comment.id), Number(reply.id), replyText);
                          setEditingReply(null);
                        }}
                        className="h-8 px-3 text-xs"
                      >
                        حفظ
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-2 text-sm whitespace-pre-line">{reply.content}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col">
      <div className="mb-4">
        <Textarea
          placeholder="أضف تعليقًا..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="text-sm"
        />
        <Button
          onClick={handleAddComment}
          disabled={isLoading}
          className="mt-2 w-fit ml-auto"
        >
          {isLoading ? (
            <>
              إرسال <Loader2 className="w-4 h-4 ml-2 animate-spin" />
            </>
          ) : (
            <>
              <MessageSquare className="w-4 h-4 ml-2" />
              إرسال
            </>
          )}
        </Button>
      </div>

      {queryClient
        .getQueryData<Comment[]>(['comments', listingId])
        ?.map((comment) => renderComment(comment))}
    </div>
  );
}
