import { supabase } from '@/lib/supabase';
import type { Agent } from '@/types/database/agents';
import type { Visitor, VisitorInsert } from '@/types/database/visitors';
import type { Session, SessionInsert, SessionUpdate } from '@/types/database/sessions';
import type { Message, MessageInsert } from '@/types/database/messages';
import type { FieldValueInsert } from '@/types/database/field_values';

// Visitor Operations
export async function createVisitor(visitor: VisitorInsert): Promise<Visitor> {
  const { data, error } = await supabase
    .from('visitors')
    .insert(visitor)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Agent Operations
export async function getAgentBySlug(slug: string): Promise<Agent> {
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) throw error;
  return data;
}

export async function getAgentById(id: string): Promise<Agent> {
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// Session Operations
export async function createSession(session: SessionInsert): Promise<Session> {
  const { data, error } = await supabase
    .from('sessions')
    .insert(session)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateSession(id: string, updates: SessionUpdate): Promise<Session> {
  const { data, error } = await supabase
    .from('sessions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getSession(id: string): Promise<Session> {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// Message Operations
export async function getMessages(sessionId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

export async function sendMessage(message: MessageInsert): Promise<Message> {
  const { data, error } = await supabase
    .from('messages')
    .insert(message)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Field Values
export async function saveFieldValue(fieldValue: FieldValueInsert): Promise<void> {
  const { error } = await supabase
    .from('field_values')
    .insert(fieldValue);

  if (error) throw error;
}
