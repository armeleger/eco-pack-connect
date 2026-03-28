// middleware.ts
// ============================================================
// Next.js Edge Middleware — Route Protection
//
// Rules:
//   /seller-dashboard/* → requires auth + role = supplier
//   /admin/*            → requires auth + role = admin
//   /checkout           → requires auth (any role)
//   All other routes    → public (buyers browse freely)
//
// Uses Supabase SSR session reading from cookies.
// ============================================================
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Routes that require authentication
const PROTECTED_SELLER = ["/seller-dashboard"];
const PROTECTED_ADMIN  = ["/admin"];
const PROTECTED_BUYER  = ["/checkout"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response     = NextResponse.next({ request });

  // Build a Supabase client that can read/write cookies in middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: ()                => request.cookies.getAll(),
        setAll: (cookiesToSet)    => {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session — MUST be called before getUser()
  const { data: { user } } = await supabase.auth.getUser();

  // ── Seller Dashboard — must be logged in as supplier ──
  const isSellerRoute = PROTECTED_SELLER.some((p) => pathname.startsWith(p));
  if (isSellerRoute) {
    if (!user) {
      // Not logged in → redirect to login with return URL
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname);
      url.searchParams.set("role", "supplier");
      return NextResponse.redirect(url);
    }
    // Check role from profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "supplier" && profile?.role !== "admin") {
      // Wrong role → send to marketplace with message
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname);
      url.searchParams.set("role", "supplier");
      url.searchParams.set("error", "supplier_only");
      return NextResponse.redirect(url);
    }
  }

  // ── Admin Panel — must be logged in as admin ──
  const isAdminRoute = PROTECTED_ADMIN.some((p) => pathname.startsWith(p));
  if (isAdminRoute) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname);
      url.searchParams.set("role", "admin");
      return NextResponse.redirect(url);
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname);
      url.searchParams.set("error", "admin_only");
      return NextResponse.redirect(url);
    }
  }

  // ── Checkout — any authenticated user ──
  const isCheckoutRoute = PROTECTED_BUYER.some((p) => pathname.startsWith(p));
  if (isCheckoutRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname + request.nextUrl.search);
    url.searchParams.set("role", "buyer");
    return NextResponse.redirect(url);
  }

  return response;
}

// Only run middleware on these paths (skip static files, API routes)
export const config = {
  matcher: [
    "/seller-dashboard/:path*",
    "/admin/:path*",
    "/checkout/:path*",
  ],
};