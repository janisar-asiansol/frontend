export interface Message {
  id: string;
  message: string;
  created_at: string;
  is_read: boolean;
  sender_role: 'user' | 'admin';
  sender_id: string;
  recipient_id: string;
  admin_id?: string;
}

export interface ChatUser {
  id: string;
  email: string;
  name: string;
  avatar: string;
  unread_count: number;
  last_message?: string;
  is_online: boolean;
  last_activity?: string;
}

export interface SocketMessagePayload {
  message: string;
  recipient_id: string;
  sender_role: 'user' | 'admin';
  sender_id: string;
  admin_id?: string;
}

export interface ChatApiResponse {
  success: boolean;
  error?: string;
  message?: Message;
  messages?: Message[];
  users?: ChatUser[];
}