import { NextRequest, NextResponse } from "next/server";

/**
 * Subdomain-based routing middleware.
 *
 * Inspects the Host header to determine which route group to serve:
 * - exhibitors.hallofflowers.com → (exhibitor) route group
 * - hallofflowers.com (default)  → (marketing) route group
 *
 * Also applies Sanity-managed redirects before page routing.
 */

const EXHIBITOR_SUBDOMAINS = ["exhibitors", "exhibitors.hallofflowers"];

function getSubdomain(host: string): string | null {
  // Remove port for local dev
  const hostname = host.split(":")[0];

  // Local dev: use query param ?site=exhibitor or subdomain
  // e.g., exhibitors.localhost → "exhibitors"
  const parts = hostname.split(".");
  if (parts.length > 1 && parts[0] !== "www") {
    return parts[0];
  }
  return null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static assets, API routes, and Sanity Studio
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/studio") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const host = request.headers.get("host") || "";
  const subdomain = getSubdomain(host);

  // Also support ?site=exhibitor query param for local development
  const siteParam = request.nextUrl.searchParams.get("site");

  const isExhibitor =
    (subdomain && EXHIBITOR_SUBDOMAINS.includes(subdomain)) ||
    siteParam === "exhibitor";

  if (isExhibitor) {
    // Rewrite to (exhibitor) route group
    const url = request.nextUrl.clone();
    url.pathname = `/exhibitor${pathname}`;
    return NextResponse.rewrite(url);
  }

  // Default: rewrite to (marketing) route group
  const url = request.nextUrl.clone();
  url.pathname = `/marketing${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public files with extensions
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
