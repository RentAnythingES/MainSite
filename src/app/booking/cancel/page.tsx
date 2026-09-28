"use client";
import { transactionCopy } from "@/i18n/transaction";
import { isLocale } from "@/i18n/config";


import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { clearActiveCheckout } from "@/lib/active-checkout";

function safeProductPath(slug: string | null, locale: string | null) {
  const safeSlug = slug && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ? slug : null;
  if (locale === "de") return "/internal/localization/de";
  if (!safeSlug) return locale === "es" ? "/es" : "/";
  return `${locale === "es" ? "/es" : ""}/product/${safeSlug}`;
}

function BookingCancelContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hint = searchParams.get("locale");
  const locale = isLocale(hint) ? hint : "en";
  const t = transactionCopy[locale];
  const draftId = searchParams.get("draft_id");
  const quoteToken = searchParams.get("quote_token");
  const safeQuoteToken = quoteToken && /^[0-9a-f-]{36}$/i.test(quoteToken) ? quoteToken : null;
  const returnPath = safeQuoteToken
    ? `/booking/quote/${safeQuoteToken}`
    : safeProductPath(searchParams.get("slug"), searchParams.get("locale"));
  const [error, setError] = useState(
    draftId ? "" : t.releaseErrorBody,
  );

  useEffect(() => {
    if (!draftId) {
      return;
    }

    let active = true;
    fetch(`/api/booking-drafts/${encodeURIComponent(draftId)}/cancel`, {
      method: "POST",
      cache: "no-store",
    })
      .then(async (response) => {
        const data = await response.json();
        if (!active) return;
        clearActiveCheckout(draftId);
        if (response.ok) {
          router.replace(`${returnPath}?checkout=cancelled`);
          return;
        }
        if (data.status === "paid" && data.sessionId) {
          router.replace(`/booking/success?session_id=${encodeURIComponent(data.sessionId)}`);
          return;
        }
        setError(t.releaseErrorBody);
      })
      .catch(() => {
        if (active) setError(t.releaseErrorBody);
      });

    return () => {
      active = false;
    };
  }, [draftId, returnPath, router, t.releaseErrorBody]);

  return (
    <main lang={locale} className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="card max-w-md w-full p-8 text-center">
        <h1 className="text-2xl font-bold mb-3">
          {error ? t.releaseError : t.release}
        </h1>
        <p className="text-neutral-600 mb-6">
          {error || t.releaseBody}
        </p>
        {error && (
          <Link className="btn btn-primary" href={returnPath}>
            {t.returnProduct}
          </Link>
        )}
      </div>
    </main>
  );
}

export default function BookingCancelPage() {
  return (
    <Suspense fallback={<main className="min-h-screen" />}>
      <BookingCancelContent />
    </Suspense>
  );
}
