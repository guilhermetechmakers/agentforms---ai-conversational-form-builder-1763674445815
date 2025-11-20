/**
 * Database types for support_tickets table
 * Generated: 2025-11-20T12:00:00Z
 */

export interface SupportTicket {
  id: string;
  user_id: string | null;
  session_id: string | null;
  issue_description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface SupportTicketInsert {
  id?: string;
  user_id?: string | null;
  session_id?: string | null;
  issue_description: string;
  status?: 'open' | 'in_progress' | 'resolved' | 'closed';
}

export interface SupportTicketUpdate {
  user_id?: string | null;
  session_id?: string | null;
  issue_description?: string;
  status?: 'open' | 'in_progress' | 'resolved' | 'closed';
}

export type SupportTicketRow = SupportTicket;
