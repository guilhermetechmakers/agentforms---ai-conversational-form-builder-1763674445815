-- =====================================================
-- Migration: Create Error Logs Table
-- Created: 2025-11-20T14:00:00Z
-- Tables: error_logs
-- Purpose: Log 404 errors and other client-side errors for analytics
-- =====================================================

-- Enable UUID extension (idempotent)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE: error_logs
-- Purpose: Store details about 404 and other errors
-- =====================================================
CREATE TABLE IF NOT EXISTS error_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Nullable for anonymous users
  
  error_page TEXT NOT NULL,
  referrer_url TEXT,
  error_type TEXT DEFAULT '404',
  metadata JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS error_logs_user_id_idx ON error_logs(user_id);
CREATE INDEX IF NOT EXISTS error_logs_created_at_idx ON error_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS error_logs_error_type_idx ON error_logs(error_type);

-- Enable Row Level Security
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Allow anyone to insert logs (including anonymous users)
CREATE POLICY "error_logs_insert_all"
  ON error_logs FOR INSERT
  WITH CHECK (true);

-- Users can only see their own logs (or admins, but we'll stick to own for now)
CREATE POLICY "error_logs_select_own"
  ON error_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Documentation
COMMENT ON TABLE error_logs IS 'Logs for client-side errors like 404s';
COMMENT ON COLUMN error_logs.error_page IS 'The URL path where the error occurred';
COMMENT ON COLUMN error_logs.referrer_url IS 'The referrer URL if available';

-- =====================================================
-- ROLLBACK INSTRUCTIONS
-- =====================================================
-- DROP TABLE IF EXISTS error_logs CASCADE;
