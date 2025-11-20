export interface Message {
  id: string;
  session_id: string;
  sender_type: 'agent' | 'visitor' | 'system';
  content: string | null;
  metadata: Record<string, any>;
  created_at: string;
}

export interface MessageInsert {
  id?: string;
  session_id: string;
  sender_type: 'agent' | 'visitor' | 'system';
  content?: string | null;
  metadata?: Record<string, any>;
}

export interface MessageUpdate {
  content?: string | null;
  metadata?: Record<string, any>;
}
