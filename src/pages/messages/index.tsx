import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  MoreVertical,
  Reply,
  Heart,
  Trash2,
  Edit,
  Send,
  Loader2,
  Smile,
  ImagePlus,
  Paperclip,
  Search,
  Plus,
  X,
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { ProtectedRoute } from '@/components/auth/protected-route';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

// Mock data - replace with API calls later
const mockUsers = [
  { id: 1, name: 'أحمد محمد', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: 2, name: 'ليلى خالد', avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: 3, name: 'سالم علي', avatar: 'https://i.pravatar.cc/150?img=3' },
];

const mockConversations = [
  {
    id: 101,
    participants: [1, 2],
    lastMessage: 'مرحباً! هل ما زلت مهتمًا بالإعلان؟',
    unread: true,
    adTitle: 'كاميرا احترافية للبيع',
    adImage: 'https://placehold.co/600x400',
    lastActive: new Date(),
  },
  {
    id: 102,
    participants: [1, 3],
    lastMessage: 'نعم، أنا جاد في الشراء. متى يمكنني رؤية المنتج؟',
    unread: false,
    adTitle: 'دراجة نارية بحالة ممتازة',
    adImage: 'https://placehold.co/600x400',
    lastActive: new Date(),
  },
];

const mockMessages = {
  101: [
    { id: 1, senderId: 2, text: 'مرحباً! هل ما زلت مهتمًا بالإعلان؟', timestamp: new Date() },
    { id: 2, senderId: 1, text: 'أهلاً بك! نعم، ما زلت مهتمًا.', timestamp: new Date() },
  ],
  102: [
    { id: 3, senderId: 3, text: 'نعم، أنا جاد في الشراء. متى يمكنني رؤية المنتج؟', timestamp: new Date() },
    { id: 4, senderId: 1, text: 'يمكنك رؤيته غدًا في الساعة 5 مساءً.', timestamp: new Date() },
  ],
};

export default function MessagesPage() {
  const { toast } = useToast()
  const { user, isAuthenticated } = useAuth();
  const [conversations, setConversations] = useState(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(mockUsers);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [isUserSearchOpen, setIsUserSearchOpen] = useState(false);
  const [isAttachmentOpen, setIsAttachmentOpen] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (selectedConversation) {
      setMessages(mockMessages[selectedConversation] || []);
    } else {
      setMessages([]);
    }
  }, [selectedConversation]);

  const handleConversationClick = (id: number) => {
    setSelectedConversation(id);
  };

  const handleSendMessage = () => {
    if (selectedConversation && newMessage.trim() !== '') {
      const newMessageObj = {
        id: messages.length + 1,
        senderId: user?.id,
        text: newMessage,
        timestamp: new Date(),
      };
      setMessages([...messages, newMessageObj]);
      setNewMessage('');
    }
  };

  const handleComposeClick = () => {
    setIsComposeOpen(true);
  };

  const handleCloseCompose = () => {
    setIsComposeOpen(false);
    setSearchQuery('');
    setFilteredUsers(mockUsers);
    setSelectedUsers([]);
  };

  const handleSearchUser = (search: string) => {
    setSearchQuery(search);
    const filtered = mockUsers.filter((u) =>
      u.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleSelectUser = (userId: number) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleStartConversation = () => {
    if (selectedUsers.length > 0) {
      const newConversationId = conversations.length > 0 ? Math.max(...conversations.map(c => c.id)) + 1 : 1;
      const newConversation = {
        id: newConversationId,
        participants: [user?.id, ...selectedUsers],
        lastMessage: 'محادثة جديدة',
        unread: true,
        adTitle: 'إعلان جديد',
        adImage: 'https://placehold.co/600x400',
        lastActive: new Date(),
      };
      setConversations([...conversations, newConversation]);
      setSelectedConversation(newConversationId);
      setIsComposeOpen(false);
      setSearchQuery('');
      setFilteredUsers(mockUsers);
      setSelectedUsers([]);
      toast({
        title: "تم إنشاء المحادثة بنجاح",
      });
    }
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment(file);
      setIsAttachmentOpen(false);
      toast({
        title: "تم إرفاق الملف بنجاح",
      });
    }
  };

  const handleDeleteConversation = () => {
    if (selectedConversation) {
      setConversations(conversations.filter(c => c.id !== selectedConversation));
      setSelectedConversation(null);
      setIsDeleteDialogOpen(false);
      toast({
        title: "تم حذف المحادثة بنجاح",
      });
    }
  };

  const formatDate = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true, locale: ar });
  };

  // Ensure user is not null before accessing its properties
  if (!user) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <Card>
            <CardContent>
              الرجاء تسجيل الدخول لرؤية الرسائل.
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  const messageId = messages.length > 0 ? messages[0].id.toString() : ''; // Convert number to string if needed
  const conversationId = conversations.length > 0 ? conversations[0].id.toString() : ''; // Convert number to string if needed
  const userId = mockUsers.length > 0 ? mockUsers[0].id.toString() : ''; // Convert number to string if needed

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-6 min-h-screen">
        <Card className="flex flex-col md:flex-row h-[calc(100vh-150px)]">
          {/* Conversations List */}
          <div className="md:w-1/4 border-b md:border-b-0 md:border-l border-border flex flex-col">
            <CardHeader className="space-y-0.5">
              <CardTitle>الرسائل</CardTitle>
              <CardDescription>إدارة الرسائل والتواصل</CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              <ScrollArea className="h-full">
                <div className="p-4">
                  {conversations.map((conversation) => (
                    <Button
                      key={conversation.id}
                      variant="ghost"
                      className={`w-full justify-start rounded-md ${
                        selectedConversation === conversation.id ? 'bg-muted' : ''
                      }`}
                      onClick={() => handleConversationClick(conversation.id)}
                    >
                      <div className="flex items-center space-x-4 w-full">
                        <Avatar>
                          <AvatarImage src={conversation.adImage} alt={conversation.adTitle} />
                          <AvatarFallback>صورة</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col text-right w-full overflow-hidden">
                          <span className="text-sm font-medium truncate">{conversation.adTitle}</span>
                          <p className="text-muted-foreground text-xs truncate">
                            {conversation.lastMessage}
                          </p>
                        </div>
                        {conversation.unread && (
                          <Badge variant="secondary" className="ml-auto">
                            جديد
                          </Badge>
                        )}
                      </div>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
            <div className="p-4">
              <Button variant="outline" className="w-full" onClick={handleComposeClick}>
                <Plus className="ml-2 h-4 w-4" />
                إنشاء رسالة
              </Button>
            </div>
          </div>

          {/* Message Area */}
          <div className="md:w-3/4 flex flex-col">
            {selectedConversation ? (
              <>
                <CardHeader className="space-y-0.5">
                  <CardTitle>
                    {conversations.find((c) => c.id === selectedConversation)?.adTitle}
                  </CardTitle>
                  <CardDescription>
                    {conversations
                      .find((c) => c.id === selectedConversation)
                      ?.participants.map((participantId) => {
                        const user = mockUsers.find((u) => u.id === participantId);
                        return user ? user.name : 'غير معروف';
                      })
                      .join(', ')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 p-4">
                  <ScrollArea className="h-full">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex flex-col items-${
                            message.senderId === user.id ? 'start' : 'end'
                          } space-y-2`}
                        >
                          <div
                            className={`rounded-lg p-3 text-sm w-fit max-w-[80%] ${
                              message.senderId === user.id
                                ? 'bg-brand text-white'
                                : 'bg-muted'
                            }`}
                          >
                            {message.text}
                            <div className="text-xs text-muted-foreground mt-1">
                              {formatDate(message.timestamp)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
                <div className="p-4 border-t border-border">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Sheet open={isAttachmentOpen} onOpenChange={setIsAttachmentOpen}>
                      <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Paperclip className="h-5 w-5" />
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="bottom">
                        <SheetHeader>
                          <SheetTitle>إرفاق ملف</SheetTitle>
                          <SheetDescription>
                            اختر ملفًا من جهازك لإرساله في الرسالة.
                          </SheetDescription>
                        </SheetHeader>
                        <div className="grid gap-4 py-4">
                          <div className="flex items-center space-x-2">
                            <Label htmlFor="attachment" className="text-right">
                              الملف:
                            </Label>
                            <Input
                              type="file"
                              id="attachment"
                              className="hidden"
                              onChange={handleAttachmentChange}
                            />
                            <Button variant="outline" size="sm" asChild>
                              <label htmlFor="attachment" className="cursor-pointer">
                                اختيار ملف
                              </label>
                            </Button>
                            {attachment && (
                              <span className="text-muted-foreground text-sm">
                                {attachment.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </SheetContent>
                    </Sheet>
                    <Input
                      type="text"
                      placeholder="اكتب رسالتك..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} disabled={newMessage.trim() === ''}>
                      إرسال
                      <Send className="mr-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center">
                  <h3 className="text-lg font-medium">اختر محادثة لعرضها</h3>
                  <p className="text-muted-foreground">أو ابدأ محادثة جديدة</p>
                </div>
              </CardContent>
            )}
          </div>
        </Card>
      </div>

      {/* Compose Message Sheet */}
      <Sheet open={isComposeOpen} onOpenChange={setIsComposeOpen}>
        <SheetContent side="right" className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>رسالة جديدة</SheetTitle>
            <SheetDescription>
              اختر مستخدمين لبدء محادثة جديدة.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="ابحث عن مستخدم..."
                value={searchQuery}
                onChange={(e) => handleSearchUser(e.target.value)}
              />
              <Search className="absolute top-1/2 left-3 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {filteredUsers.map((user) => (
                  <Button
                    key={user.id}
                    variant="outline"
                    className={`w-full justify-start ${
                      selectedUsers.includes(user.id) ? 'bg-brand/10' : ''
                    }`}
                    onClick={() => handleSelectUser(user.id)}
                  >
                    <div className="flex items-center space-x-2 space-x-reverse w-full">
                      <Avatar>
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name}</AvatarFallback>
                      </Avatar>
                      <span>{user.name}</span>
                      {selectedUsers.includes(user.id) && (
                        <X className="mr-auto h-4 w-4" />
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
          <Button onClick={handleStartConversation} disabled={selectedUsers.length === 0}>
            بدء المحادثة
          </Button>
          <Button type="reset" variant="secondary" onClick={handleCloseCompose}>
            إلغاء
          </Button>
        </SheetContent>
      </Sheet>

      {/* Delete Conversation Alert Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف هذه المحادثة بشكل نهائي ولا يمكنك استعادتها.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              إلغاء
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConversation}>
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ProtectedRoute>
  );
}
