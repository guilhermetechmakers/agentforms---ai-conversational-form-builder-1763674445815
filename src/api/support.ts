import { supabase } from '@/lib/supabase';
import type { SupportTicketInsert, SupportTicket } from '@/types/database/support_tickets';

export async function createSupportTicket(ticket: SupportTicketInsert): Promise<SupportTicket> {
  const { data, error } = await supabase
    .from('support_tickets')
    .insert(ticket)
    .select()
    .single();

  if (error) {
    throw new Error(`Error creating support ticket: ${error.message}`);
  }

  return data;
}
