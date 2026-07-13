"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";

export type AnalyticsConsent = "granted" | "denied";

const STORAGE_KEY = "rentanything_analytics_consent";

function publishConsent(consent: AnalyticsConsent) {
  window.dispatchEvent(new CustomEvent("rentanything:analytics-consent", { detail: consent }));
}

export function readAnalyticsConsent(): AnalyticsConsent | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(STORAGE_KEY);
  return value === "granted" || value === "denied" ? value : null;
}

export function subscribeToAnalyticsConsent(callback: () => void) {
  window.addEventListener("rentanything:analytics-consent", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("rentanything:analytics-consent", callback);
    window.removeEventListener("storage", callback);
  };
}

export default function CookieConsent() {
  const consent = useSyncExternalStore(subscribeToAnalyticsConsent, readAnalyticsConsent, () => null);
  const [editing, setEditing] = useState(false);

  function save(nextConsent: AnalyticsConsent) {
    window.localStorage.setItem(STORAGE_KEY, nextConsent);
    setEditing(false);
    publishConsent(nextConsent);
  }

  if (consent && !editing) {
    return <button type="button" onClick={() => setEditing(true)} className="fixed bottom-3 left-3 z-40 rounded-full border border-neutral-300 bg-white/95 px-3 py-1.5 text-xs font-medium text-neutral-600 shadow-sm hover:text-neutral-900">Cookie settings</button>;
  }

  return <div className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-2xl border border-neutral-200 bg-white p-5 shadow-2xl" role="dialog" aria-modal="true" aria-label="Analytics cookie preferences">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div><p className="font-semibold text-neutral-900">Your privacy choices</p><p className="mt-1 text-sm leading-relaxed text-neutral-600">We use optional Google Analytics cookies to understand which pages and booking steps are useful. The site and checkout work without them. Read our <Link href="/cookies" className="font-medium text-teal-700 underline">cookie policy</Link>.</p></div>
      <div className="flex shrink-0 gap-2"><button type="button" onClick={() => save("denied")} className="rounded-xl border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50">Reject analytics</button><button type="button" onClick={() => save("granted")} className="rounded-xl bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-600">Allow analytics</button></div>
    </div>
  </div>;
}
