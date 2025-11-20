-- =====================================================
-- Migration: Create Error Reports Table
-- Created: 2025-11-20T15:00:00Z
-- Tables: error_reports
-- Purpose: Store user-submitted error reports for 500 server errors
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
-- TABLE: error_reports
-- Purpose: Store user-submitted details about server errors
-- =====================================================
CREATE TABLE IF NOT EXISTS error_reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Nullable for anonymous users
  session_id TEXT,
  
  error_details TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed', 'investigating')),
  
  metadata JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS error_reports_user_id_idx ON error_reports(user_id);
CREATE INDEX IF NOT EXISTS error_reports_created_at_idx ON error_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS error_reports_status_idx ON error_reports(status);

-- Auto-update trigger
DROP TRIGGER IF EXISTS update_error_reports_updated_at ON error_reports;
CREATE TRIGGER update_error_reports_updated_at
  BEFORE UPDATE ON error_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE error_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Allow anyone to insert reports (including anonymous users)
CREATE POLICY "error_reports_insert_all"
  ON error_reports FOR INSERT
  WITH CHECK (true);

-- Users can select their own reports
CREATE POLICY "error_reports_select_own"
  ON error_reports FOR SELECT
  USING (auth.uid() = user_id);

-- Documentation
COMMENT ON TABLE error_reports IS 'User-submitted reports for server errors';
COMMENT ON COLUMN error_reports.session_id IS 'Session ID captured during the error';
COMMENT ON COLUMN error_reports.status IS 'Status of the error report (open, closed, investigating)';

-- =====================================================
-- ROLLBACK INSTRUCTIONS
-- =====================================================
-- DROP TABLE IF EXISTS error_reports CASCADE;
