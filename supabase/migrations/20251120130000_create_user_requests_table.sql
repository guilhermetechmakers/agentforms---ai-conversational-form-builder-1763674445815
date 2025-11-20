-- =====================================================
-- Migration: Create user_requests table
-- Created: 2025-11-20
-- Tables: user_requests
-- Purpose: To track user inquiries related to legal requests (data deletion, information inquiries)
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
-- TABLE: user_requests
-- Purpose: Tracks user legal requests and inquiries
-- =====================================================
CREATE TABLE IF NOT EXISTS user_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Request details
  request_type TEXT NOT NULL CHECK (request_type IN ('data_deletion', 'information_inquiry')),
  request_content TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'rejected')),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT user_requests_content_not_empty CHECK (length(trim(request_content)) > 0)
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS user_requests_user_id_idx ON user_requests(user_id);
CREATE INDEX IF NOT EXISTS user_requests_created_at_idx ON user_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS user_requests_status_idx ON user_requests(status);

-- Auto-update trigger
DROP TRIGGER IF EXISTS update_user_requests_updated_at ON user_requests;
CREATE TRIGGER update_user_requests_updated_at
  BEFORE UPDATE ON user_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE user_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only see their own requests
CREATE POLICY "user_requests_select_own"
  ON user_requests FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own requests
CREATE POLICY "user_requests_insert_own"
  ON user_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own requests (optional, mainly for cancellation if logic allows, but usually requests are immutable by user once sent)
-- For now allowing update only if pending, but requirements didn't specify update. I'll stick to View/Create.

-- Documentation
COMMENT ON TABLE user_requests IS 'Tracks user legal requests (GDPR, inquiries)';
COMMENT ON COLUMN user_requests.id IS 'Primary key (UUID v4)';
COMMENT ON COLUMN user_requests.user_id IS 'The user making the request';
COMMENT ON COLUMN user_requests.request_type IS 'Type of request: data_deletion or information_inquiry';
COMMENT ON COLUMN user_requests.status IS 'Current status of the request';
