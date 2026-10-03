"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { readAnalyticsConsent, subscribeToAnalyticsConsent } from "@/components/CookieConsent";

const GA_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || process.env.NEXT_PUBLIC_GA_ID;

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const privatePage = pathname.startsWith("/agent") && !pathname.startsWith("/agent-network") || pathname.startsWith("/booking/messages/") || pathname.startsWith("/admin") || pathname.startsWith("/internal/");
  const consent = useSyncExternalStore(subscribeToAnalyticsConsent, readAnalyticsConsent, () => null);

  useEffect(() => {
    if (!GA_ID || privatePage || consent !== "granted" || typeof window.gtag !== "function") return;

    window.gtag("config", GA_ID, {
      page_path: `${pathname}${window.location.search}`,
    });
  }, [pathname, consent, privatePage]);

  if (!GA_ID || privatePage || consent !== "granted") return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
          window.dispatchEvent(new Event('rentandroll:analytics-ready'));
        `}
      </Script>
    </>
  );
}
