/**
 * Database types for sample_prompts table
 * Generated: 2025-11-20T12:00:00Z
 */

export interface SamplePrompt {
  id: string;
  title: string;
  description: string | null;
  category: string;
  example: string;
  created_at: string;
  updated_at: string;
}

export interface SamplePromptInsert {
  id?: string;
  title: string;
  description?: string | null;
  category: string;
  example: string;
}

export interface SamplePromptUpdate {
  title?: string;
  description?: string | null;
  category?: string;
  example?: string;
}

export type SamplePromptRow = SamplePrompt;
