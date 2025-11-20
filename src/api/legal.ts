import { supabase } from '@/lib/supabase';
import type { UserRequestInsert, UserRequest } from '@/types/database/user_requests';

export async function createUserRequest(request: UserRequestInsert): Promise<UserRequest> {
  const { data, error } = await supabase
    .from('user_requests')
    .insert(request)
    .select()
    .single();

  if (error) {
    throw new Error(`Error creating user request: ${error.message}`);
  }

  return data;
}

export async function getUserRequests(userId: string): Promise<UserRequest[]> {
  const { data, error } = await supabase
    .from('user_requests')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Error fetching user requests: ${error.message}`);
  }

  return data || [];
}
