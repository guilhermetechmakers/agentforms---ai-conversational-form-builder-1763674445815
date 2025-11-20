/**
 * Database types for error_reports table
 * Generated: 2025-11-20T15:00:00Z
 */

export interface ErrorReports {
  id: string;
  user_id: string | null;
  session_id: string | null;
  error_details: string | null;
  status: 'open' | 'closed' | 'investigating';
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ErrorReportsInsert {
  id?: string;
  user_id?: string | null;
  session_id?: string | null;
  error_details?: string | null;
  status?: 'open' | 'closed' | 'investigating';
  metadata?: Record<string, any>;
}

export interface ErrorReportsUpdate {
  user_id?: string | null;
  session_id?: string | null;
  error_details?: string | null;
  status?: 'open' | 'closed' | 'investigating';
  metadata?: Record<string, any>;
}

// Supabase query result type
export type ErrorReportsRow = ErrorReports;
