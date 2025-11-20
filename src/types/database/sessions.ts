export interface Session {
  id: string;
  agent_id: string;
  visitor_id: string | null;
  status: 'active' | 'completed' | 'abandoned';
  metadata: Record<string, any>;
  start_time: string;
  end_time: string | null;
  created_at: string;
  updated_at: string;
}

export interface SessionInsert {
  id?: string;
  agent_id: string;
  visitor_id?: string | null;
  status?: 'active' | 'completed' | 'abandoned';
  metadata?: Record<string, any>;
  start_time?: string;
  end_time?: string | null;
}

export interface SessionUpdate {
  visitor_id?: string | null;
  status?: 'active' | 'completed' | 'abandoned';
  metadata?: Record<string, any>;
  end_time?: string | null;
}
