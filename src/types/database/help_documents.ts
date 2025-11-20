/**
 * Database types for help_documents table
 * Generated: 2025-11-20T12:00:00Z
 */

export interface HelpDocument {
  id: string;
  title: string;
  content: string;
  category: string;
  keywords: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface HelpDocumentInsert {
  id?: string;
  title: string;
  content: string;
  category: string;
  keywords?: string[] | null;
}

export interface HelpDocumentUpdate {
  title?: string;
  content?: string;
  category?: string;
  keywords?: string[] | null;
}

export type HelpDocumentRow = HelpDocument;
