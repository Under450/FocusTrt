import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Handles magic-link callback.
 * Supabase redirects user here after they click the email link.
 * We exchange the code for a session, then redirect to the `next` URL.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/admin";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Failed — send back to login with error flag
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
