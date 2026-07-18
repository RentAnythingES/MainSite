"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { readAnalyticsConsent, subscribeToAnalyticsConsent } from "@/components/CookieConsent";

const GA_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || process.env.NEXT_PUBLIC_GA_ID;

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const consent = useSyncExternalStore(subscribeToAnalyticsConsent, readAnalyticsConsent, () => null);

  useEffect(() => {
    if (!GA_ID || consent !== "granted" || typeof window.gtag !== "function") return;

    window.gtag("config", GA_ID, {
      page_path: `${pathname}${window.location.search}`,
    });
  }, [pathname, consent]);

  if (!GA_ID || consent !== "granted") return null;

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
          window.dispatchEvent(new Event('rentanything:analytics-ready'));
        `}
      </Script>
    </>
  );
}
