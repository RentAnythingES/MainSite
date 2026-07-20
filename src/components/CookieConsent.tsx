"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const isSpanish = pathname.startsWith("/es");
  const consent = useSyncExternalStore(subscribeToAnalyticsConsent, readAnalyticsConsent, () => null);
  const [editing, setEditing] = useState(false);

  const text = isSpanish
    ? {
        settings: "Configurar cookies",
        aria: "Preferencias de cookies de analítica",
        title: "Tus opciones de privacidad",
        body: "Utilizamos Google Analytics opcional para entender qué páginas y pasos de reserva son útiles. La web y el checkout funcionan sin analítica.",
        policy: "política de cookies",
        reject: "Rechazar analítica",
        allow: "Permitir analítica",
      }
    : {
        settings: "Cookie settings",
        aria: "Analytics cookie preferences",
        title: "Your privacy choices",
        body: "We use optional Google Analytics to understand which pages and booking steps are useful. The site and checkout work without analytics.",
        policy: "cookie policy",
        reject: "Reject analytics",
        allow: "Allow analytics",
      };

  function save(nextConsent: AnalyticsConsent) {
    window.localStorage.setItem(STORAGE_KEY, nextConsent);
    setEditing(false);
    publishConsent(nextConsent);
  }

  if (consent && !editing) {
    return <button type="button" onClick={() => setEditing(true)} className="fixed bottom-3 left-3 z-40 rounded-full border border-neutral-300 bg-white/95 px-3 py-1.5 text-xs font-medium text-neutral-600 shadow-sm hover:text-neutral-900">{text.settings}</button>;
  }

  return <div className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-2xl border border-neutral-200 bg-white p-5 shadow-2xl" role="dialog" aria-modal="true" aria-label={text.aria}>
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div><p className="font-semibold text-neutral-900">{text.title}</p><p className="mt-1 text-sm leading-relaxed text-neutral-600">{text.body} {isSpanish ? "Consulta nuestra" : "Read our"} <Link href={isSpanish ? "/es/cookies" : "/cookies"} className="font-medium text-teal-700 underline">{text.policy}</Link>.</p></div>
      <div className="flex shrink-0 gap-2"><button type="button" onClick={() => save("denied")} className="rounded-xl border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50">{text.reject}</button><button type="button" onClick={() => save("granted")} className="rounded-xl bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-600">{text.allow}</button></div>
    </div>
  </div>;
}
