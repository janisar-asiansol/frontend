import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send } from "lucide-react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/context/AuthContext";
import { formatToPakistaniTime } from "@/lib/time";

interface Message {
  id: string;
  message: string;
  created_at: string;
  is_read: boolean;
  sender_role: 'user' | 'admin';
  user_id?: string;
  admin_id?: string;
}

export const Chat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [connectionStatus, setConnectionStatus] = useState<'connecting'|'connected'|'disconnected'>('connecting');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user?.access_token) return;

    const socket = io(import.meta.env.VITE_SOCKET_URL, {
      auth: {
        token: user.access_token
      },
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setConnectionStatus('connected');
      socket.emit('join_user_room', { user_id: user.user_id });
    });

    socket.on('disconnect', () => {
      setConnectionStatus('disconnected');
    });

    socket.on('connect_error', (err) => {
      console.error('Connection error:', err);
      setConnectionStatus('disconnected');
    });

    socket.on('new_message', (message: Message) => {
      if (message.sender_role === 'admin' || message.user_id === user.user_id) {
        const normalizedMessage = {
          ...message,
          message: message.message || '[No content]',
          created_at: message.created_at,
          is_read: message.is_read || false,
          sender_role: message.sender_role,
          user_id: message.user_id
        };

        setMessages(prev => [...prev, normalizedMessage]);
        scrollToBottom();
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user?.access_token, user?.user_id]);

  useEffect(() => {
    if (!user?.access_token) return;

    const fetchMessages = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/chat/messages`, {
          headers: {
            'Authorization': `Bearer ${user.access_token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        const messagesArray = Array.isArray(data) 
          ? data 
          : Array.isArray(data?.messages) 
            ? data.messages 
            : [];

        const normalizedMessages = messagesArray.map((msg: any) => ({
          id: msg.id,
          message: msg.message || '[No content]',
          created_at: msg.created_at,
          is_read: Boolean(msg.is_read),
          sender_role: msg.sender_role || 'user',
          user_id: msg.user_id
        }));

        setMessages(normalizedMessages);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
        setError(error instanceof Error ? error.message : 'Failed to load messages');
      } finally {
        setIsLoading(false);
        scrollToBottom();
      }
    };

    fetchMessages();
  }, [user?.access_token]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socketRef.current || !user?.user_id) return;

    socketRef.current.emit('send_message', { 
      message: newMessage,
      user_id: user.user_id
    }, (response: any) => {
      if (response?.success) {
        const normalizedMessage: Message = {
          id: response.message.id,
          message: response.message.message || '[No content]',
          created_at: response.message.created_at,
          is_read: true,
          sender_role: 'user',
          user_id: user.user_id
        };
        setMessages(prev => [...prev, normalizedMessage]);
        setNewMessage("");
        scrollToBottom();
      }
    });
  };

  if (!user) {
    return <div className="p-4 text-center">Please login to access chat</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Support Chat</h1>
          <p className="text-muted-foreground">
            {connectionStatus === 'connected' 
              ? 'Admin is online' 
              : connectionStatus === 'connecting' 
                ? 'Connecting...' 
                : 'Disconnected'}
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            connectionStatus === 'connected' ? 'bg-green-500' : 'bg-yellow-500'
          }`}></div>
          {connectionStatus.toUpperCase()}
        </Badge>
      </div>

      <Card className="h-[600px] flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/admin-avatar.jpg" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">Support Team</CardTitle>
              <p className="text-sm text-muted-foreground">
                {connectionStatus === 'connected' ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden p-0">
          <div className="h-full flex flex-col">
            {isLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <p>Loading messages...</p>
              </div>
            ) : error ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-red-500">{error}</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender_role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div className={`max-w-[70%] ${
                        message.sender_role === "user" 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted"
                      } rounded-lg p-3`}>
                        <p className="text-sm">{message.message}</p>
                        <div className={`text-xs mt-1 ${
                          message.sender_role === "user" 
                            ? "text-primary-foreground/70" 
                            : "text-muted-foreground"
                        }`}>
                          {formatToPakistaniTime(message.created_at)}
                          {message.sender_role === 'user' && ' (You)'}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <div className="border-t p-4">
                  <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1"
                      disabled={connectionStatus !== 'connected'}
                    />
                    <Button 
                      type="submit" 
                      disabled={!newMessage.trim() || connectionStatus !== 'connected'}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};