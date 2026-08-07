import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  EXPECTED_PRODUCTION_SITE_URL,
  LEGACY_SITE_URL,
} from "@/config/site";

const canonicalHost = new URL(EXPECTED_PRODUCTION_SITE_URL).hostname;
const legacyHost = new URL(LEGACY_SITE_URL).hostname;
const redirectHosts = new Set([
  legacyHost,
  `www.${legacyHost}`,
  `www.${canonicalHost}`,
]);

const collapsedLegacyPaths: Record<string, string> = {
  "/product/portable-ac":
    "/product/mobile-airconditioner-delonghi-pinguino-compact-classic",
  "/es/product/portable-ac":
    "/es/product/mobile-airconditioner-delonghi-pinguino-compact-classic",
  "/product/mobility-scooter-lightweight":
    "/product/mobility-scooter-lightweight-foldable",
  "/es/product/mobility-scooter-lightweight":
    "/es/product/mobility-scooter-lightweight-foldable",
};

export function proxy(request: NextRequest) {
  if (redirectHosts.has(request.nextUrl.hostname)) {
    const path =
      collapsedLegacyPaths[request.nextUrl.pathname] ||
      request.nextUrl.pathname;
    const destination = new URL(path, EXPECTED_PRODUCTION_SITE_URL);
    destination.search = request.nextUrl.search;
    return NextResponse.redirect(destination, 308);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);
  const locale = request.nextUrl.pathname === "/es" || request.nextUrl.pathname.startsWith("/es/")
    ? "es"
    : "en";

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  response.headers.set("Content-Language", locale);
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
