-- =====================================================================
-- ADMIN SEEDING SCRIPT
-- =====================================================================
-- Run this ONCE via Supabase dashboard SQL editor AFTER you have:
--   1. Created your admin auth user (sign up via the app with magic link)
--   2. Confirmed that user's email exists in auth.users table
-- 
-- Replace 'your-admin-email@example.com' with YOUR actual admin email.
-- =====================================================================

INSERT INTO public.admins (user_id, email, full_name)
SELECT
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1))
FROM auth.users
WHERE email = 'your-admin-email@example.com'  -- <-- CHANGE THIS
ON CONFLICT (email) DO NOTHING;

-- Verify it worked
SELECT a.email, a.full_name, a.created_at
FROM public.admins a
ORDER BY a.created_at DESC;
