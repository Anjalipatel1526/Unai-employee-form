-- ================================================================
--  UNAI Tech — Employee Onboarding Portal
--  Supabase Database Schema
--  Run this in: Supabase Dashboard → SQL Editor → New Query
-- ================================================================

-- ── Enable UUID extension ──────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================================
--  TABLE: onboarding_submissions
-- ================================================================
CREATE TABLE IF NOT EXISTS public.onboarding_submissions (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_code         TEXT UNIQUE NOT NULL,
  submitted_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status                TEXT NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending', 'verified', 'rejected', 'onboarded')),

  -- ── Personal ──────────────────────────────────────────────────
  full_name             TEXT NOT NULL,
  preferred_name        TEXT,
  gender                TEXT,
  date_of_birth         DATE,
  marital_status        TEXT,
  nationality           TEXT,
  blood_group           TEXT,
  personal_email        TEXT NOT NULL,
  mobile                TEXT NOT NULL,
  alternate_number      TEXT,
  profile_photo_url     TEXT,

  -- ── Address ───────────────────────────────────────────────────
  current_address       TEXT NOT NULL,
  current_city          TEXT NOT NULL,
  current_state         TEXT NOT NULL,
  current_country       TEXT NOT NULL,
  current_pincode       TEXT NOT NULL,
  permanent_address     TEXT NOT NULL,
  permanent_city        TEXT NOT NULL,
  permanent_state       TEXT NOT NULL,
  permanent_country     TEXT NOT NULL,
  permanent_pincode     TEXT NOT NULL,

  -- ── Employment ────────────────────────────────────────────────
  employee_type         TEXT NOT NULL CHECK (employee_type IN ('employee', 'intern')),
  department            TEXT NOT NULL,
  designation           TEXT NOT NULL,
  employee_id_provided  TEXT,
  reporting_manager     TEXT,
  date_of_joining       DATE NOT NULL,
  work_location         TEXT,
  employment_type       TEXT NOT NULL,

  -- ── Education ─────────────────────────────────────────────────
  highest_qualification TEXT NOT NULL,
  university            TEXT NOT NULL,
  year_of_passing       TEXT NOT NULL,
  percentage            TEXT NOT NULL,
  additional_education  JSONB DEFAULT '[]'::JSONB,

  -- ── Professional ──────────────────────────────────────────────
  years_of_experience   TEXT,
  previous_company      TEXT,
  previous_designation  TEXT,
  linkedin              TEXT,
  portfolio             TEXT,
  skills                TEXT[] DEFAULT '{}',

  -- ── Identity ──────────────────────────────────────────────────
  aadhaar_number        TEXT,
  pan_number            TEXT,
  passport_number       TEXT,
  driving_license       TEXT,
  aadhaar_file_url      TEXT,
  pan_file_url          TEXT,
  resume_url            TEXT,

  -- ── Emergency ─────────────────────────────────────────────────
  emergency_name        TEXT NOT NULL,
  emergency_relationship TEXT NOT NULL,
  emergency_mobile      TEXT NOT NULL,
  emergency_alternate   TEXT,
  emergency_address     TEXT,

  -- ── Banking ───────────────────────────────────────────────────
  account_holder_name   TEXT,
  bank_name             TEXT,
  branch_name           TEXT,
  account_number        TEXT,  -- stored as plain text; encrypt at app layer if needed
  ifsc_code             TEXT,
  upi_id                TEXT,

  -- ── Assets & Declaration ──────────────────────────────────────
  assets_requested      TEXT[] DEFAULT '{}',
  declaration_accepted  BOOLEAN NOT NULL DEFAULT FALSE,
  has_signature         BOOLEAN NOT NULL DEFAULT FALSE,

  -- ── Audit ─────────────────────────────────────────────────────
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_by           TEXT,
  review_notes          TEXT
);

-- ── Auto-update updated_at ────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON public.onboarding_submissions;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.onboarding_submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Indexes ───────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_submissions_email
  ON public.onboarding_submissions (personal_email);

CREATE INDEX IF NOT EXISTS idx_submissions_status
  ON public.onboarding_submissions (status);

CREATE INDEX IF NOT EXISTS idx_submissions_department
  ON public.onboarding_submissions (department);

CREATE INDEX IF NOT EXISTS idx_submissions_joining
  ON public.onboarding_submissions (date_of_joining);

-- ================================================================
--  ROW LEVEL SECURITY (RLS)
-- ================================================================
ALTER TABLE public.onboarding_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anonymous INSERT (form submissions from anyone)
CREATE POLICY "allow_anon_insert"
  ON public.onboarding_submissions
  FOR INSERT
  WITH CHECK (true);

-- Allow public SELECT (to fetch registrations in the admin console)
CREATE POLICY "allow_public_read"
  ON public.onboarding_submissions
  FOR SELECT
  USING (true);

-- Allow public UPDATE (to change status/review notes in the admin console)
CREATE POLICY "allow_public_update"
  ON public.onboarding_submissions
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- ================================================================
--  STORAGE BUCKET: onboarding-documents
--  Run in: Supabase Dashboard → Storage → New Bucket
--  OR run this SQL (requires storage extension):
-- ================================================================
-- INSERT INTO storage.buckets (id, name, public, file_size_limit)
-- VALUES ('onboarding-documents', 'onboarding-documents', false, 5242880)  -- 5 MB limit
-- ON CONFLICT (id) DO NOTHING;

-- Storage policy — allow anon upload
-- CREATE POLICY "allow_anon_upload"
--   ON storage.objects FOR INSERT TO anon
--   WITH CHECK (bucket_id = 'onboarding-documents');

-- ================================================================
--  SAMPLE QUERY: View all pending submissions
-- ================================================================
-- SELECT employee_code, full_name, department, date_of_joining, status, submitted_at
-- FROM public.onboarding_submissions
-- WHERE status = 'pending'
-- ORDER BY submitted_at DESC;
