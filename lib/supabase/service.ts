import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Service role client — BYPASSES ROW LEVEL SECURITY.
 *
 * DANGER: Only use in server-side code (Server Actions, API routes).
 * Never import this in any 'use client' file — would leak the service key.
 *
 * Use cases:
 *   - Admin-only writes that need to bypass RLS
 *   - Operations where you've already verified the user is admin via is_admin()
 *     but want to skip row-level policy overhead
 *
 * In Stage 1A we don't actually NEED this — RLS policies cover all admin ops.
 * Included so it's available for Stage 1B+ (e.g. server-side AI calls that
 * write back to the DB regardless of which user triggered them).
 */
export function createServiceClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }

  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
