/**
 * Database types for error_logs table
 * Generated: 2025-11-20T14:00:00Z
 */

export interface ErrorLog {
  id: string;
  user_id: string | null;
  error_page: string;
  referrer_url: string | null;
  error_type: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface ErrorLogInsert {
  id?: string;
  user_id?: string | null;
  error_page: string;
  referrer_url?: string | null;
  error_type?: string;
  metadata?: Record<string, any>;
  created_at?: string;
}

export interface ErrorLogUpdate {
  user_id?: string | null;
  error_page?: string;
  referrer_url?: string | null;
  error_type?: string;
  metadata?: Record<string, any>;
  created_at?: string;
}

// Supabase query result type
export type ErrorLogRow = ErrorLog;
