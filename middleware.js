// middleware.js
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_API = [
  "/api/auth",          // next-auth endpoints
  "/api/confirmation",  // public confirm link
];

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // let Next.js assets, favicon, etc pass
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/public")
  ) {
    return NextResponse.next();
  }

  // Allow listed API routes pass through
  if (pathname.startsWith("/api")) {
    const isPublic = PUBLIC_API.some((p) => pathname.startsWith(p));
    if (isPublic) return NextResponse.next();

    // Otherwise, protect API
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    return NextResponse.next();
  }

  // Protect dashboard pages (adjust the list to your app)
  const mustBeAuthed =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/customers") ||
    pathname.startsWith("/restaurant") ||
    pathname.startsWith("/staff");

  if (!mustBeAuthed) return NextResponse.next();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Tell Next.js which paths should hit this middleware
export const config = {
  matcher: [
    /*
     * Run on ALL API routes except those starting with /api/auth or /api/confirmation
     * and on the protected page paths you care about.
     */
    "/api/:path*",
    "/dashboard/:path*",
    "/settings/:path*",
    "/customers/:path*",
    "/restaurant/:path*",
    "/staff/:path*",
  ],
};
