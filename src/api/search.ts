import { supabase } from '@/lib/supabase';

export interface SearchResult {
  id: string;
  title: string;
  description: string; // snippet or content
  type: 'document' | 'agent';
  url: string;
}

/**
 * Searches for documents in the help_documents table
 * @param query The search query
 * @returns A list of search results
 */
export async function searchDocuments(query: string): Promise<SearchResult[]> {
  if (!query) return [];

  try {
    const { data, error } = await supabase
      .from('help_documents')
      .select('id, title, content, category')
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
      .limit(5);

    if (error) {
      console.error('Error searching documents:', error);
      throw error;
    }

    return (data || []).map((doc) => ({
      id: doc.id,
      title: doc.title,
      description: doc.content.substring(0, 100) + '...',
      type: 'document',
      url: `/help#${doc.id}`, // Assuming help page has anchors or specific routes, adjusting to /help for now
    }));
  } catch (err) {
    console.error('Unexpected error searching documents:', err);
    return [];
  }
}

// Mock function for agents since table doesn't exist yet
export async function searchAgents(_query: string): Promise<SearchResult[]> {
  // In a real implementation, this would query the agents table
  return [];
}

export async function searchAll(query: string): Promise<SearchResult[]> {
  const [docs, agents] = await Promise.all([
    searchDocuments(query),
    searchAgents(query)
  ]);
  return [...docs, ...agents];
}
