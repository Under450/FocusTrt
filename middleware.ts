import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Middleware — route protection.
 *
 * PUBLIC (no auth): /, /about, /podcasts, /clinics, /login, /auth/*
 * MEMBER (signed-in): /dashboard, /inner-circle/*, /protocol, /labs,
 *   /messages, /appointments, /pharmacy, /progress, /treatments/*
 * ADMIN (signed-in + whitelist): /admin/*
 */

const MEMBER_PREFIXES = [
  "/dashboard",
  "/inner-circle",
  "/protocol",
  "/labs",
  "/messages",
  "/appointments",
  "/pharmacy",
  "/progress",
  "/treatments",
];

function isMemberRoute(path: string) {
  return MEMBER_PREFIXES.some((p) => path === p || path.startsWith(p + "/"));
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const path = request.nextUrl.pathname;

  const isAdmin = path.startsWith("/admin");
  const isMember = isMemberRoute(path);

  // Public routes — no auth needed
  if (!isAdmin && !isMember) {
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

  // All protected routes require sign-in
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  // Member routes — auth only, no admin check
  if (isMember) {
    return response;
  }

  // Admin routes — also require whitelist
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
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
