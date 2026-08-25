/*
# Create registrations table for Hack Ascension 2026

1. New Tables
- `registrations`
  - `id` (uuid, primary key)
  - `registration_id` (text, unique, human-readable ID like HA2026-XXXX)
  - `full_name` (text, not null)
  - `email` (text, not null)
  - `phone` (text, not null)
  - `institution` (text, not null)
  - `department` (text, not null)
  - `year` (text, not null)
  - `student_id` (text, not null, register number)
  - `interests` (text[], array of selected interest areas)
  - `motivation` (text, optional free-text)
  - `created_at` (timestamptz, default now)
2. Security
- Enable RLS on `registrations`.
- Allow anon + authenticated INSERT (public registration form, no sign-in).
- No SELECT/UPDATE/DELETE for anon (registrations are private; only the backend can read them).
3. Notes
- This is a single-tenant public registration form (no sign-in screen).
- The anon-key frontend can INSERT new registrations but cannot read them back.
- registration_id is generated server-side via a trigger to ensure uniqueness.
*/

CREATE TABLE IF NOT EXISTS registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id text UNIQUE NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  institution text NOT NULL,
  department text NOT NULL,
  year text NOT NULL,
  student_id text NOT NULL,
  interests text[] DEFAULT '{}',
  motivation text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Allow public to submit registrations (INSERT only)
DROP POLICY IF EXISTS "anon_insert_registrations" ON registrations;
CREATE POLICY "anon_insert_registrations"
ON registrations FOR INSERT
TO anon, authenticated WITH CHECK (true);

-- No SELECT/UPDATE/DELETE policies: registrations are private.
-- Only the service role (backend) can read them.

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS registrations_email_idx ON registrations (email);
CREATE INDEX IF NOT EXISTS registrations_registration_id_idx ON registrations (registration_id);
