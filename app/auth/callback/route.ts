import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

/**
 * Handles magic-link callback.
 * Supabase redirects user here after they click the email link.
 * We exchange the code for a session, then redirect based on role:
 *   - Admins → /admin
 *   - Everyone else → /dashboard
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // If caller specified an explicit destination, honour it
      if (next) {
        return NextResponse.redirect(`${origin}${next}`);
      }

      // Otherwise, route by role
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const service = createServiceClient();
        const { data: adminRow } = await service
          .from("admins")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

        const destination = adminRow ? "/admin" : "/dashboard";
        return NextResponse.redirect(`${origin}${destination}`);
      }

      // Fallback — user somehow null after exchange
      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  // Failed — send back to login with error flag
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
