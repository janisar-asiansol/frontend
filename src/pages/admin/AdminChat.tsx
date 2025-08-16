import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Send, MoreVertical } from "lucide-react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { 
  formatToPakistaniTime, 
  formatToPakistaniDateTime,
  isToday,
  isYesterday
} from "@/lib/time";

type Message = {
  id: string;
  message: string;
  sender_id: string;
  sender_role: 'user' | 'admin';
  recipient_id: string;
  created_at: string;
  is_read: boolean;
  user_id?: string;
  admin_id?: string;
};

type ChatUser = {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  is_online: boolean;
  last_message?: string;
  last_message_at?: string;
};

export const AdminChat = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState({
    users: false,
    messages: false,
    sending: false
  });
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  if (!user || user.role !== 'admin') {
    return <div className="p-4 text-center">Unauthorized - Admin access required</div>;
  }

  useEffect(() => {
    if (!user?.access_token) return;

    const socket = io(import.meta.env.VITE_SOCKET_URL, {
      auth: {
        token: user.access_token
      },
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    const handleUserStatusChange = (data: { userId: string; isOnline: boolean }) => {
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === data.userId ? { ...u, is_online: data.isOnline } : u
        )
      );
    };

    const handleNewMessage = (message: Message) => {
      if (message.sender_role === 'user') {
        setUsers(prevUsers => 
          prevUsers.map(u => 
            u.id === message.user_id ? {
              ...u,
              last_message: message.message,
              last_message_at: message.created_at,
              is_online: true
            } : u
          )
        );
      }

      if (selectedUser && message.user_id === selectedUser.id) {
        setMessages(prev => [...prev, {
          ...message,
          message: message.message || '[No content]',
          created_at: message.created_at,
          is_read: message.sender_role === 'admin'
        }]);
        scrollToBottom();
      }
    };

    socket.on('connect', () => {
      socket.emit('join_admin_room');
      socket.emit('join_admin', user.user_id);
    });

    socket.on('user_status_change', handleUserStatusChange);
    socket.on('new_message', handleNewMessage);

    return () => {
      socket.off('user_status_change', handleUserStatusChange);
      socket.off('new_message', handleNewMessage);
      socket.disconnect();
    };
  }, [user?.access_token, user?.user_id, selectedUser]);

  useEffect(() => {
    if (!user?.access_token) return;

    const fetchUsers = async () => {
      setLoading(prev => ({ ...prev, users: true }));
      setError(null);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/chat/admin/users`, {
          headers: {
            'Authorization': `Bearer ${user.access_token}`,
            'Cache-Control': 'no-cache'
          }
        });

        if (!response.ok) throw new Error(`Failed to fetch users: ${response.status}`);

        const data = await response.json();
        setUsers(data.map((u: any) => ({
          id: u.user_id || u.id,
          email: u.email || '',
          name: u.name || u.email?.split('@')[0] || 'Unknown',
          avatar: u.avatar || '/placeholder-user.jpg',
          last_message: u.last_message || '',
          last_message_at: u.last_message_at || '',
          is_online: u.is_online || false
        })));
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setError(err instanceof Error ? err.message : 'Failed to load users');
      } finally {
        setLoading(prev => ({ ...prev, users: false }));
      }
    };

    fetchUsers();
    const interval = setInterval(fetchUsers, 30000);
    return () => clearInterval(interval);
  }, [user?.access_token]);

  useEffect(() => {
    if (!selectedUser || !user?.access_token) return;

    const fetchMessages = async () => {
      setLoading(prev => ({ ...prev, messages: true }));
      setError(null);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/chat/admin/conversations/${selectedUser.id}`, {
            headers: { 
              'Authorization': `Bearer ${user.access_token}`,
              'Cache-Control': 'no-cache'
            }
          }
        );

        if (!response.ok) throw new Error(`Failed to fetch messages: ${response.status}`);

        const data = await response.json();
        setMessages((data.messages || []).map((msg: any) => ({
          id: msg.id,
          message: msg.message || '[No content]',
          sender_id: msg.sender_id,
          sender_role: msg.sender_role || 'user',
          recipient_id: msg.recipient_id,
          created_at: msg.created_at,
          is_read: Boolean(msg.is_read),
          user_id: msg.user_id,
          admin_id: msg.admin_id
        })));
        scrollToBottom();
      } catch (err) {
        console.error('Failed to fetch messages:', err);
        setError(err instanceof Error ? err.message : 'Failed to load messages');
      } finally {
        setLoading(prev => ({ ...prev, messages: false }));
      }
    };

    fetchMessages();
  }, [selectedUser, user?.access_token]);

  const scrollToBottom = () => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socketRef.current || !user || !selectedUser) return;

    setLoading(prev => ({ ...prev, sending: true }));

    try {
      socketRef.current.emit('send_message', {
        message: newMessage.trim(),
        recipient_id: selectedUser.id,
        sender_role: 'admin',
        sender_id: user.user_id,
        user_id: selectedUser.id
      }, (response: any) => {
        if (response?.success) {
          setMessages(prev => [...prev, {
            id: response.message.id,
            message: response.message.message,
            sender_id: user.user_id,
            sender_role: 'admin',
            recipient_id: selectedUser.id,
            created_at: response.message.created_at,
            is_read: true,
            admin_id: user.user_id,
            user_id: selectedUser.id
          }]);
          setNewMessage("");
          scrollToBottom();

          setUsers(prevUsers => 
            prevUsers.map(u => 
              u.id === selectedUser.id ? {
                ...u,
                last_message: response.message.message,
                last_message_at: response.message.created_at
              } : u
            )
          );
        }
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setLoading(prev => ({ ...prev, sending: false }));
    }
  };

  const handleDeleteChat = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this chat history?')) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/chat/admin/conversations/${userId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${user?.access_token}` }
        }
      );

      if (!response.ok) throw new Error(`Failed to delete chat: ${response.status}`);

      if (selectedUser?.id === userId) {
        setMessages([]);
        setSelectedUser(null);
      }
      setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
      
      toast({
        title: "Success",
        description: "Chat history deleted successfully",
      });
    } catch (err) {
      console.error('Failed to delete chat:', err);
      toast({
        title: "Error",
        description: "Failed to delete chat history",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const MessageItem = ({ message }: { message: Message }) => {
    return (
      <div className={`flex ${message.sender_role === 'admin' ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-[70%] rounded-lg p-3 ${
          message.sender_role === 'admin' ? 'bg-primary text-primary-foreground' : 'bg-muted'
        }`}>
          <div className="text-sm whitespace-pre-wrap break-words">{message.message}</div>
          <div className={`text-xs mt-1 ${
            message.sender_role === 'admin' ? 'text-primary-foreground/70' : 'text-muted-foreground'
          }`}>
            {formatToPakistaniTime(message.created_at)}
            {message.sender_role === 'admin' && ' (You)'}
          </div>
        </div>
      </div>
    );
  };

  const UserListItem = ({ user }: { user: ChatUser }) => {
    const getLastMessageTime = () => {
      if (!user.last_message_at) return '';
      
      if (isToday(user.last_message_at)) {
        return formatToPakistaniTime(user.last_message_at);
      } else if (isYesterday(user.last_message_at)) {
        return 'Yesterday';
      } else {
        return formatToPakistaniDateTime(user.last_message_at);
      }
    };

    return (
      <div
        key={user.id}
        onClick={() => setSelectedUser(user)}
        className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
          selectedUser?.id === user.id ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/50"
        }`}
      >
        <div className="relative">
          <Avatar>
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          {user.is_online && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-baseline">
            <p className="font-medium truncate">{user.name}</p>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {getLastMessageTime()}
            </span>
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {user.last_message || 'No messages yet'}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Chat Dashboard</h1>
      </div>

      {error && (
        <div className="bg-destructive/10 p-4 rounded-lg border border-destructive">
          <p className="text-destructive">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Active Chats</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-320px)]">
              {loading.users ? (
                <div className="p-4 text-center">Loading users...</div>
              ) : filteredUsers.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  {searchQuery ? "No matching users" : "No users available"}
                </div>
              ) : (
                <div className="space-y-1 p-4">
                  {filteredUsers.map((user) => (
                    <UserListItem key={user.id} user={user} />
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          {selectedUser ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={selectedUser.avatar} />
                        <AvatarFallback>
                          {selectedUser.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {selectedUser.is_online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{selectedUser.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedUser.is_online ? (
                          <span className="text-green-500">Online</span>
                        ) : (
                          <span>Offline</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteChat(selectedUser.id)}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 flex flex-col h-[calc(100vh-360px)]">
                <ScrollArea className="flex-1 p-4">
                  {loading.messages ? (
                    <div className="text-center py-8">Loading messages...</div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No messages yet. Start the conversation!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <MessageItem 
                          key={`${message.id}-${message.created_at}`} 
                          message={message} 
                        />
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </ScrollArea>
                <div className="border-t p-4">
                  <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1"
                      disabled={loading.sending}
                    />
                    <Button
                      type="submit"
                      disabled={!newMessage.trim() || loading.sending}
                    >
                      {loading.sending ? (
                        <span className="animate-pulse">...</span>
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </form>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center">
                <h3 className="text-lg font-semibold">No conversation selected</h3>
                <p className="text-muted-foreground">
                  Select a user from the list to view messages
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};