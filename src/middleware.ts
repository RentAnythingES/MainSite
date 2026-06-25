import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware to inject the current pathname into request headers.
 * Used by the admin layout to detect the login page and skip auth redirects.
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set("x-pathname", request.nextUrl.pathname);
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
