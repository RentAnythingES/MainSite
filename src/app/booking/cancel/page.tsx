"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { clearActiveCheckout } from "@/lib/active-checkout";

function safeProductPath(slug: string | null, locale: string | null) {
  const safeSlug = slug && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ? slug : null;
  if (!safeSlug) return locale === "es" ? "/es" : "/";
  return `${locale === "es" ? "/es" : ""}/product/${safeSlug}`;
}

function BookingCancelContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const draftId = searchParams.get("draft_id");
  const returnPath = safeProductPath(searchParams.get("slug"), searchParams.get("locale"));
  const [error, setError] = useState(
    draftId ? "" : "This booking attempt could not be identified.",
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
        setError(data.error || "We could not cancel this booking attempt.");
      })
      .catch(() => {
        if (active) setError("We could not cancel this booking attempt.");
      });

    return () => {
      active = false;
    };
  }, [draftId, returnPath, router]);

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="card max-w-md w-full p-8 text-center">
        <h1 className="text-2xl font-bold mb-3">
          {error ? "We couldn’t release your checkout" : "Releasing your dates…"}
        </h1>
        <p className="text-neutral-600 mb-6">
          {error || "You’ll be returned to the product as soon as its availability is restored."}
        </p>
        {error && (
          <Link className="btn btn-primary" href={returnPath}>
            Return to the product
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
