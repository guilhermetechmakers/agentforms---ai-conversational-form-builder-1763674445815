export interface Agent {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  slug: string | null;
  status: 'draft' | 'published' | 'archived';
  schema: Record<string, any>;
  persona: Record<string, any>;
  visuals: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface AgentInsert {
  id?: string;
  user_id: string;
  name: string;
  description?: string | null;
  slug?: string | null;
  status?: 'draft' | 'published' | 'archived';
  schema?: Record<string, any>;
  persona?: Record<string, any>;
  visuals?: Record<string, any>;
}

export interface AgentUpdate {
  name?: string;
  description?: string | null;
  slug?: string | null;
  status?: 'draft' | 'published' | 'archived';
  schema?: Record<string, any>;
  persona?: Record<string, any>;
  visuals?: Record<string, any>;
}
