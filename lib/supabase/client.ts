import { createBrowserClient } from "@supabase/ssr";

/**
 * Client-side Supabase client.
 * Use in React components that run in the browser.
 * Respects RLS via user's session cookie.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
