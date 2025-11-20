-- =====================================================
-- Migration: Create Chat Tables
-- Created: 2025-11-20 16:00:00
-- Tables: visitors, agents, sessions, messages, field_values
-- Purpose: Setup schema for public agent chat
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Helper function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TABLE: visitors
-- Purpose: Track public visitors
-- =====================================================
CREATE TABLE IF NOT EXISTS visitors (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  consent_given BOOLEAN DEFAULT FALSE,
  ip_address TEXT,
  browser_info JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "visitors_insert_anon"
  ON visitors FOR INSERT
  WITH CHECK (true);

CREATE POLICY "visitors_select_anon"
  ON visitors FOR SELECT
  USING (true);

-- =====================================================
-- TABLE: agents
-- Purpose: Configuration for the chatbot
-- =====================================================
CREATE TABLE IF NOT EXISTS agents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  schema JSONB DEFAULT '{}'::jsonb,
  persona JSONB DEFAULT '{}'::jsonb,
  visuals JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS agents_user_id_idx ON agents(user_id);
CREATE INDEX IF NOT EXISTS agents_slug_idx ON agents(slug);

DROP TRIGGER IF EXISTS update_agents_updated_at ON agents;
CREATE TRIGGER update_agents_updated_at
  BEFORE UPDATE ON agents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "agents_select_public"
  ON agents FOR SELECT
  USING (status = 'published' OR auth.uid() = user_id);

CREATE POLICY "agents_all_owner"
  ON agents FOR ALL
  USING (auth.uid() = user_id);

-- =====================================================
-- TABLE: sessions
-- Purpose: Links visitors to agents
-- =====================================================
CREATE TABLE IF NOT EXISTS sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE NOT NULL,
  visitor_id UUID REFERENCES visitors(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
  metadata JSONB DEFAULT '{}'::jsonb,
  start_time TIMESTAMPTZ DEFAULT NOW(),
  end_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS sessions_agent_id_idx ON sessions(agent_id);
CREATE INDEX IF NOT EXISTS sessions_visitor_id_idx ON sessions(visitor_id);

DROP TRIGGER IF EXISTS update_sessions_updated_at ON sessions;
CREATE TRIGGER update_sessions_updated_at
  BEFORE UPDATE ON sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sessions_insert_anon"
  ON sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "sessions_select_anon"
  ON sessions FOR SELECT
  USING (true); -- In production, restrict to visitor ownership via token/cookie

CREATE POLICY "sessions_update_anon"
  ON sessions FOR UPDATE
  USING (true);

-- =====================================================
-- TABLE: messages
-- Purpose: Chat history
-- =====================================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE NOT NULL,
  sender_type TEXT CHECK (sender_type IN ('agent', 'visitor', 'system')),
  content TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS messages_session_id_idx ON messages(session_id);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "messages_insert_anon"
  ON messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "messages_select_anon"
  ON messages FOR SELECT
  USING (true);

-- =====================================================
-- TABLE: field_values
-- Purpose: Collected structured data
-- =====================================================
CREATE TABLE IF NOT EXISTS field_values (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE NOT NULL,
  field_key TEXT NOT NULL,
  value JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS field_values_session_id_idx ON field_values(session_id);

ALTER TABLE field_values ENABLE ROW LEVEL SECURITY;

CREATE POLICY "field_values_insert_anon"
  ON field_values FOR INSERT
  WITH CHECK (true);

CREATE POLICY "field_values_select_anon"
  ON field_values FOR SELECT
  USING (true);
