-- ====================================================================
-- HACK ASCENSION 2026 / ACM STUDENT CHAPTER SUPABASE SCHEMA MIGRATION
-- Run this script in your Supabase Project -> SQL Editor -> Run
-- ====================================================================

-- 1. Create hackathon_submissions table
CREATE TABLE IF NOT EXISTS public.hackathon_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_name text NOT NULL,
  leader_name text NOT NULL,
  leader_roll_no text NOT NULL,
  class_name text NOT NULL,
  section text NOT NULL,
  github_url text NOT NULL,
  drive_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS for submissions
ALTER TABLE public.hackathon_submissions ENABLE ROW LEVEL SECURITY;

-- Allow public anonymous & authenticated users to INSERT submissions
DROP POLICY IF EXISTS "anon_insert_submissions" ON public.hackathon_submissions;
CREATE POLICY "anon_insert_submissions"
ON public.hackathon_submissions FOR INSERT
TO anon, authenticated WITH CHECK (true);

-- Allow public & authenticated users to SELECT submissions
DROP POLICY IF EXISTS "public_select_submissions" ON public.hackathon_submissions;
CREATE POLICY "public_select_submissions"
ON public.hackathon_submissions FOR SELECT
TO anon, authenticated USING (true);

-- Allow admins to UPDATE submissions
DROP POLICY IF EXISTS "admin_update_submissions" ON public.hackathon_submissions;
CREATE POLICY "admin_update_submissions"
ON public.hackathon_submissions FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

-- Allow admins to DELETE submissions
DROP POLICY IF EXISTS "admin_delete_submissions" ON public.hackathon_submissions;
CREATE POLICY "admin_delete_submissions"
ON public.hackathon_submissions FOR DELETE
TO anon, authenticated USING (true);


-- 2. Create hackathon_registrations table
CREATE TABLE IF NOT EXISTS public.hackathon_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_name text NOT NULL,
  leader_name text NOT NULL,
  leader_email text NOT NULL,
  leader_phone text NOT NULL,
  leader_roll_no text NOT NULL,
  leader_class_department text NOT NULL,
  team_members jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS for registrations
ALTER TABLE public.hackathon_registrations ENABLE ROW LEVEL SECURITY;

-- Allow public anonymous & authenticated users to INSERT registrations
DROP POLICY IF EXISTS "anon_insert_registrations" ON public.hackathon_registrations;
CREATE POLICY "anon_insert_registrations"
ON public.hackathon_registrations FOR INSERT
TO anon, authenticated WITH CHECK (true);

-- Allow public & authenticated users to SELECT registrations
DROP POLICY IF EXISTS "public_select_registrations" ON public.hackathon_registrations;
CREATE POLICY "public_select_registrations"
ON public.hackathon_registrations FOR SELECT
TO anon, authenticated USING (true);

-- Allow admins to UPDATE registrations
DROP POLICY IF EXISTS "admin_update_registrations" ON public.hackathon_registrations;
CREATE POLICY "admin_update_registrations"
ON public.hackathon_registrations FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

-- Allow admins to DELETE registrations
DROP POLICY IF EXISTS "admin_delete_registrations" ON public.hackathon_registrations;
CREATE POLICY "admin_delete_registrations"
ON public.hackathon_registrations FOR DELETE
TO anon, authenticated USING (true);


-- 3. Create system_settings table
CREATE TABLE IF NOT EXISTS public.system_settings (
  id text PRIMARY KEY DEFAULT 'default',
  submissions_open boolean DEFAULT true,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS for system_settings
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read of system settings
DROP POLICY IF EXISTS "public_read_system_settings" ON public.system_settings;
CREATE POLICY "public_read_system_settings"
ON public.system_settings FOR SELECT
TO anon, authenticated USING (true);

-- Allow authenticated users / admins to insert and update system settings
DROP POLICY IF EXISTS "public_write_system_settings" ON public.system_settings;
CREATE POLICY "public_write_system_settings"
ON public.system_settings FOR ALL
TO anon, authenticated USING (true) WITH CHECK (true);

-- Insert default row if not exists
INSERT INTO public.system_settings (id, submissions_open)
VALUES ('default', true)
ON CONFLICT (id) DO NOTHING;
