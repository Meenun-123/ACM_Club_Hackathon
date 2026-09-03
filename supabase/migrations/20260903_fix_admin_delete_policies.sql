-- ====================================================================
-- FIX ADMIN DELETE & UPDATE PERMISSIONS FOR SUPABASE
-- Run this script in your Supabase Dashboard -> SQL Editor -> Run
-- ====================================================================

-- 1. Ensure Table Grants exist for anon, authenticated, and service_role
GRANT ALL ON TABLE public.hackathon_registrations TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.hackathon_submissions TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.system_settings TO anon, authenticated, service_role;

-- 2. Clean & Enable Full RLS Policies for hackathon_registrations
ALTER TABLE public.hackathon_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow_all_registrations" ON public.hackathon_registrations;
DROP POLICY IF EXISTS "anon_insert_registrations" ON public.hackathon_registrations;
DROP POLICY IF EXISTS "public_select_registrations" ON public.hackathon_registrations;
DROP POLICY IF EXISTS "admin_update_registrations" ON public.hackathon_registrations;
DROP POLICY IF EXISTS "admin_delete_registrations" ON public.hackathon_registrations;

CREATE POLICY "allow_all_registrations"
ON public.hackathon_registrations
FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);


-- 3. Clean & Enable Full RLS Policies for hackathon_submissions
ALTER TABLE public.hackathon_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow_all_submissions" ON public.hackathon_submissions;
DROP POLICY IF EXISTS "anon_insert_submissions" ON public.hackathon_submissions;
DROP POLICY IF EXISTS "public_select_submissions" ON public.hackathon_submissions;
DROP POLICY IF EXISTS "admin_update_submissions" ON public.hackathon_submissions;
DROP POLICY IF EXISTS "admin_delete_submissions" ON public.hackathon_submissions;

CREATE POLICY "allow_all_submissions"
ON public.hackathon_submissions
FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);


-- 4. Clean & Enable Full RLS Policies for system_settings
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow_all_system_settings" ON public.system_settings;
DROP POLICY IF EXISTS "public_read_system_settings" ON public.system_settings;
DROP POLICY IF EXISTS "public_write_system_settings" ON public.system_settings;

CREATE POLICY "allow_all_system_settings"
ON public.system_settings
FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Insert default row if not exists
INSERT INTO public.system_settings (id, submissions_open)
VALUES ('default', true)
ON CONFLICT (id) DO NOTHING;
