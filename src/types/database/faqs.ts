/**
 * Database types for faqs table
 * Generated: 2025-11-20T12:00:00Z
 */

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface FaqInsert {
  id?: string;
  question: string;
  answer: string;
  category: string;
}

export interface FaqUpdate {
  question?: string;
  answer?: string;
  category?: string;
}

export type FaqRow = Faq;
