import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Middleware runs on every request.
 * Responsibilities:
 *   1. Refresh Supabase session cookie if expired
 *   2. Redirect unauthenticated users away from /admin to /login
 *   3. Redirect non-admin authenticated users away from /admin to /
 *
 * Admin status is checked via the public.is_admin() DB function which
 * is called indirectly when we query the admins table.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const path = request.nextUrl.pathname;

  // Determine protection level
  const isAdmin = path.startsWith("/admin");
  const isDashboard = path.startsWith("/dashboard");
  const isProtected = isAdmin || isDashboard;

  // Public routes — no auth needed
  if (!isProtected) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Both /admin and /dashboard require sign-in
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  // /dashboard only needs auth — no admin check
  if (isDashboard) {
    return response;
  }

  // /admin also requires admin whitelist
  const { data: adminRow } = await supabase
    .from("admins")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!adminRow) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("error", "not_admin");
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    // Run on everything except static files, images, and Next.js internals
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
