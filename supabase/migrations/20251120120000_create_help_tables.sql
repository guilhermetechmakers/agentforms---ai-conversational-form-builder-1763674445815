-- =====================================================
-- Migration: Create Help and Support Tables
-- Created: 2025-11-20T12:00:00Z
-- Tables: help_documents, faqs, sample_prompts, support_tickets
-- Purpose: Setup schema for About & Help page content and support system
-- =====================================================

-- Enable UUID extension (idempotent)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Helper function for updated_at (idempotent)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TABLE: help_documents
-- Purpose: Store documentation guides and articles
-- =====================================================
CREATE TABLE IF NOT EXISTS help_documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  keywords TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Auto-update trigger for help_documents
DROP TRIGGER IF EXISTS update_help_documents_updated_at ON help_documents;
CREATE TRIGGER update_help_documents_updated_at
  BEFORE UPDATE ON help_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE help_documents ENABLE ROW LEVEL SECURITY;

-- Policies
-- Everyone can read docs
CREATE POLICY "help_documents_select_all"
  ON help_documents FOR SELECT
  USING (true);

-- Only authenticated users can manage (simplified for now, ideally admin only)
CREATE POLICY "help_documents_insert_auth"
  ON help_documents FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "help_documents_update_auth"
  ON help_documents FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "help_documents_delete_auth"
  ON help_documents FOR DELETE
  USING (auth.role() = 'authenticated');


-- =====================================================
-- TABLE: faqs
-- Purpose: Store Frequently Asked Questions
-- =====================================================
CREATE TABLE IF NOT EXISTS faqs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Auto-update trigger for faqs
DROP TRIGGER IF EXISTS update_faqs_updated_at ON faqs;
CREATE TRIGGER update_faqs_updated_at
  BEFORE UPDATE ON faqs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "faqs_select_all"
  ON faqs FOR SELECT
  USING (true);

CREATE POLICY "faqs_insert_auth"
  ON faqs FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "faqs_update_auth"
  ON faqs FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "faqs_delete_auth"
  ON faqs FOR DELETE
  USING (auth.role() = 'authenticated');


-- =====================================================
-- TABLE: sample_prompts
-- Purpose: Store example prompts for the library
-- =====================================================
CREATE TABLE IF NOT EXISTS sample_prompts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  example TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Auto-update trigger for sample_prompts
DROP TRIGGER IF EXISTS update_sample_prompts_updated_at ON sample_prompts;
CREATE TRIGGER update_sample_prompts_updated_at
  BEFORE UPDATE ON sample_prompts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE sample_prompts ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "sample_prompts_select_all"
  ON sample_prompts FOR SELECT
  USING (true);

CREATE POLICY "sample_prompts_insert_auth"
  ON sample_prompts FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "sample_prompts_update_auth"
  ON sample_prompts FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "sample_prompts_delete_auth"
  ON sample_prompts FOR DELETE
  USING (auth.role() = 'authenticated');


-- =====================================================
-- TABLE: support_tickets
-- Purpose: Store user support requests
-- =====================================================
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id UUID, -- Optional link to a session
  issue_description TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Auto-update trigger for support_tickets
DROP TRIGGER IF EXISTS update_support_tickets_updated_at ON support_tickets;
CREATE TRIGGER update_support_tickets_updated_at
  BEFORE UPDATE ON support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- Policies
-- Users can insert their own tickets
CREATE POLICY "support_tickets_insert_own"
  ON support_tickets FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL); -- Allow anonymous if needed, but usually auth

-- Users can view their own tickets
CREATE POLICY "support_tickets_select_own"
  ON support_tickets FOR SELECT
  USING (auth.uid() = user_id);

-- Admin policies would go here (omitted for brevity, assuming admin has bypass or specific role)
