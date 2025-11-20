/**
 * Database types for user_requests table
 * Generated: 2025-11-20T13:00:00Z
 */

export interface UserRequest {
  id: string;
  user_id: string;
  request_type: 'data_deletion' | 'information_inquiry';
  request_content: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface UserRequestInsert {
  id?: string;
  user_id: string;
  request_type: 'data_deletion' | 'information_inquiry';
  request_content: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'rejected';
}

export interface UserRequestUpdate {
  request_type?: 'data_deletion' | 'information_inquiry';
  request_content?: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'rejected';
}

export type UserRequestRow = UserRequest;
