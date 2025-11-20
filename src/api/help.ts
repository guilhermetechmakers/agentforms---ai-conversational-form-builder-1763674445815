import { supabase } from '@/lib/supabase';
import type { HelpDocument } from '@/types/database/help_documents';
import type { Faq } from '@/types/database/faqs';
import type { SamplePrompt } from '@/types/database/sample_prompts';

export async function getHelpDocuments(query?: string): Promise<HelpDocument[]> {
  let request = supabase
    .from('help_documents')
    .select('*')
    .order('title');

  if (query) {
    // Use ilike for simple search on title and content
    request = supabase
        .from('help_documents')
        .select('*')
        .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
        .order('title');
  }

  const { data, error } = await request;

  if (error) {
    throw new Error(`Error fetching help documents: ${error.message}`);
  }

  return data || [];
}

export async function getFaqs(query?: string): Promise<Faq[]> {
  let request = supabase
    .from('faqs')
    .select('*')
    .order('category', { ascending: true })
    .order('question', { ascending: true });

  if (query) {
    request = request.or(`question.ilike.%${query}%,answer.ilike.%${query}%`);
  }

  const { data, error } = await request;

  if (error) {
    throw new Error(`Error fetching FAQs: ${error.message}`);
  }

  return data || [];
}

export async function getSamplePrompts(category?: string): Promise<SamplePrompt[]> {
  let request = supabase
    .from('sample_prompts')
    .select('*')
    .order('category')
    .order('title');

  if (category && category !== 'All') {
    request = request.eq('category', category);
  }

  const { data, error } = await request;

  if (error) {
    throw new Error(`Error fetching sample prompts: ${error.message}`);
  }

  return data || [];
}
