-- =====================================================================
-- FOCUSTRT — STAGE 1A SCHEMA
-- Created: 2026-04-19
-- Purpose: Admin upload of studies + placeholder for podcasts
-- Row-level security enforced throughout
-- =====================================================================

-- Admins table — whitelist of admin users
-- Email matches auth.users.email; only these users can access admin pages
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

COMMENT ON TABLE public.admins IS 'Whitelisted admin users with access to /admin routes';

-- Helper function — check if current user is admin
-- Used throughout RLS policies
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admins
    WHERE user_id = auth.uid()
  );
$$;

COMMENT ON FUNCTION public.is_admin IS 'Returns true if current auth user is whitelisted admin';

-- Studies table — raw research studies uploaded by admin
-- Source of truth for everything downstream (scripts, podcasts)
CREATE TABLE IF NOT EXISTS public.studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('text', 'pdf', 'url')),
  source_text TEXT,              -- raw pasted text (for source_type='text')
  source_file_path TEXT,         -- Supabase Storage path (for source_type='pdf')
  source_url TEXT,               -- external URL (for source_type='url')
  doi TEXT,                      -- digital object identifier if known
  citation TEXT,                 -- formatted citation for PDF footer
  notes TEXT,                    -- admin notes
  status TEXT NOT NULL DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'script_generated', 'script_approved', 'audio_generated', 'published', 'archived')),
  uploaded_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enforce one of (source_text, source_file_path, source_url) is non-null
ALTER TABLE public.studies
  ADD CONSTRAINT studies_source_not_empty
  CHECK (
    (source_type = 'text' AND source_text IS NOT NULL AND length(source_text) > 0) OR
    (source_type = 'pdf'  AND source_file_path IS NOT NULL) OR
    (source_type = 'url'  AND source_url IS NOT NULL)
  );

COMMENT ON TABLE public.studies IS 'Research studies uploaded by admin. Source for script generation downstream.';

-- Podcasts table — placeholder for Stage 1B onwards
-- One study CAN generate multiple podcasts (re-runs, different angles)
CREATE TABLE IF NOT EXISTS public.podcasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  study_id UUID NOT NULL REFERENCES public.studies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  script_draft TEXT,              -- AI-generated draft (filled in Stage 1B)
  script_approved TEXT,           -- Final approved script (filled in Stage 1C)
  audio_path TEXT,                -- Supabase Storage path to .wav/.mp3 (Stage 1D)
  audio_duration_seconds INTEGER, -- duration for player UI
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'script_ready', 'script_approved', 'audio_ready', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  approved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.podcasts IS 'Podcast episodes derived from studies. Populated starting Stage 1B.';

-- Auto-update updated_at on row changes
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER studies_updated_at
  BEFORE UPDATE ON public.studies
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER podcasts_updated_at
  BEFORE UPDATE ON public.podcasts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_studies_uploaded_by ON public.studies(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_studies_status ON public.studies(status);
CREATE INDEX IF NOT EXISTS idx_studies_created_at ON public.studies(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_podcasts_study_id ON public.podcasts(study_id);
CREATE INDEX IF NOT EXISTS idx_podcasts_status ON public.podcasts(status);

-- =====================================================================
-- ROW LEVEL SECURITY
-- =====================================================================

ALTER TABLE public.admins   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.studies  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.podcasts ENABLE ROW LEVEL SECURITY;

-- Admins table: only admins can read the admin list, no one can modify via API
-- (admin additions done via service role from seed script or dashboard)
CREATE POLICY "admins can view admin list"
  ON public.admins FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Studies: only admins can do anything in Stage 1A
-- Members will get read access to published-only in Stage 1E
CREATE POLICY "admins can select studies"
  ON public.studies FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "admins can insert studies"
  ON public.studies FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin() AND uploaded_by = auth.uid());

CREATE POLICY "admins can update studies"
  ON public.studies FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admins can delete studies"
  ON public.studies FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- Podcasts: admin-only in Stage 1A (member read policies added in 1E)
CREATE POLICY "admins can manage podcasts"
  ON public.podcasts FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =====================================================================
-- STORAGE BUCKET FOR UPLOADED PDFS
-- =====================================================================
-- Note: this runs AFTER Supabase has created storage.buckets table
-- If this fails, create the bucket manually in Supabase dashboard and skip
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'study-uploads',
  'study-uploads',
  false,  -- PRIVATE bucket — only accessible via signed URLs
  26214400,  -- 25MB limit per file
  ARRAY['application/pdf', 'text/plain']
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: only admins can upload to study-uploads
CREATE POLICY "admins can upload to study-uploads"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'study-uploads' AND public.is_admin());

CREATE POLICY "admins can read study-uploads"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'study-uploads' AND public.is_admin());

CREATE POLICY "admins can delete study-uploads"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'study-uploads' AND public.is_admin());
