// Path: src/pages/messages/components.tsx
import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChatMessage, ChatParticipant } from '@/types';
import { ChevronLeft, Send, User, MessageCircle, FileText } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

// 1. Header Inspired by modern apps
export const FocusChatHeader = ({ participant }: { participant?: ChatParticipant }) => (
    <motion.header 
      initial={{ y: -60, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="flex items-center p-3 sm:p-4 gap-4 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm sticky top-0 z-10 border-b border-neutral-200/50 dark:border-neutral-800/50"
    >
        <Link to="/dashboard/messages" className="p-2 rounded-full hover:bg-neutral-200/50 dark:hover:bg-neutral-800 transition-colors">
            <ChevronLeft className="h-6 w-6 text-muted-foreground" />
        </Link>
        {participant ? (
            <>
                <div className="relative">
                    <Avatar className="w-11 h-11 border-2 border-white dark:border-neutral-900 shadow-sm">
                        <AvatarImage src={participant.image} alt={participant.full_name} />
                        <AvatarFallback><User /></AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 border-2 border-white dark:border-neutral-900" />
                </div>
                <h2 className="font-bold text-lg text-neutral-800 dark:text-neutral-100">{participant.full_name}</h2>
            </>
        ) : (
            <div className="flex items-center gap-4 animate-pulse">
                <div className="w-11 h-11 rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
                <div className="w-32 h-5 rounded-md bg-neutral-200 dark:bg-neutral-700"></div>
            </div>
        )}
    </motion.header>
);


// 2. An immersive Message Bubble
export const FocusMessageBubble = memo(({ message }: { message: ChatMessage }) => {
    const isMe = message.sent_by_me;
    const variants = {
        hidden: { opacity: 0, y: 15 },
        visible: (custom: boolean) => ({ 
            opacity: 1, 
            y: 0, 
            transition: { delay: custom ? 0.05 : 0 }
        }),
    };
    return (
        <motion.div 
            custom={isMe}
            variants={variants}
            initial="hidden"
            animate="visible"
            className={`flex w-full my-1 ${isMe ? 'justify-end' : 'justify-start'}`}
        >
            <div className={`flex items-end gap-2 max-w-[80%] sm:max-w-[70%]`}>
                {/* For received messages, show avatar */}
                {!isMe && (
                   <Avatar className="w-8 h-8 self-end mb-1">
                      {/* Use a placeholder image or participant's image if available */}
                      {/* <AvatarImage src={participant?.image} /> */}
                      <AvatarFallback className="text-xs">U</AvatarFallback>
                   </Avatar>
                )}
                <div
                    className={
                        `px-4 py-2.5 rounded-3xl text-sm leading-relaxed transition-transform duration-300
                        ${isMe 
                           ? 'bg-gradient-to-br from-[#7C3AED] to-[#A855F7] text-white rounded-br-lg' 
                           : 'bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-100 shadow-sm rounded-bl-lg'
                        }`
                    }
                >
                    {message.message.text}
                </div>
            </div>
        </motion.div>
    );
});


// 3. Message Input with animations
export const FocusMessageInput = ({ value, onChange, onSubmit, isSending }: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    isSending: boolean;
}) => (
    <motion.div 
      initial={{ y: 60, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      transition={{ type: "spring", stiffness: 100, damping: 18 }}
      className="p-3 sm:p-4 bg-transparent"
    >
        <form onSubmit={onSubmit} className="flex items-center gap-3 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md rounded-full shadow-lg p-2 border border-neutral-200/70 dark:border-neutral-700/70">
            <Textarea 
                placeholder="اكتب رسالتك..." 
                value={value} 
                onChange={onChange} 
                rows={1}
                className="flex-1 resize-none bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { onSubmit(e); } }}
            />
            <motion.button 
                whileTap={{ scale: 0.9 }}
                type="submit" 
                disabled={isSending || !value.trim()}
                className="flex items-center justify-center h-11 w-11 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#A855F7] text-white disabled:opacity-50 disabled:saturate-50 transition-all duration-300 hover:scale-105"
            >
                {isSending ? <div className="h-5 w-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div> : <Send className="w-5 h-5"/>}
            </motion.button>
        </form>
    </motion.div>
);