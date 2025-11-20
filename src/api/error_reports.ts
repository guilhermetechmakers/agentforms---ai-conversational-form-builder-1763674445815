import { supabase } from '@/lib/supabase';
import type { ErrorReports, ErrorReportsInsert } from '@/types/database/error_reports';

export const createErrorReport = async (report: ErrorReportsInsert): Promise<ErrorReports | null> => {
  const { data, error } = await supabase
    .from('error_reports')
    .insert(report)
    .select()
    .single();

  if (error) {
    console.error('Error creating error report:', error);
    throw error;
  }

  return data as ErrorReports;
};
