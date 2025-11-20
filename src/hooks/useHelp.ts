import { useQuery } from '@tanstack/react-query';
import { getHelpDocuments, getFaqs, getSamplePrompts } from '@/api/help';

export function useHelpDocuments(query?: string) {
  return useQuery({
    queryKey: ['helpDocuments', query],
    queryFn: () => getHelpDocuments(query),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useFaqs(query?: string) {
  return useQuery({
    queryKey: ['faqs', query],
    queryFn: () => getFaqs(query),
    staleTime: 1000 * 60 * 5,
  });
}

export function useSamplePrompts(category?: string) {
  return useQuery({
    queryKey: ['samplePrompts', category],
    queryFn: () => getSamplePrompts(category),
    staleTime: 1000 * 60 * 5,
  });
}
