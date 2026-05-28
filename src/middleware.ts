import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Simple token check for admin routes
  // Full auth validation happens in API route handlers
  const token = request.cookies.get("authjs.session-token") || request.cookies.get("__Secure-authjs.session-token");
  
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isApiAdminRoute = request.nextUrl.pathname.startsWith("/api/admin");

  if ((isAdminRoute || isApiAdminRoute) && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
