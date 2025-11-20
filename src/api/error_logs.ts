import { supabase } from '@/lib/supabase';
import type { ErrorLogInsert } from '@/types/database/error_logs';

/**
 * Logs an error to the database
 * @param errorData The error data to log
 */
export async function logError(errorData: ErrorLogInsert) {
  try {
    const { error } = await supabase
      .from('error_logs')
      .insert(errorData);

    if (error) {
      console.error('Error logging to database:', error);
    }
  } catch (err) {
    console.error('Unexpected error logging to database:', err);
  }
}
