"use client";
import { customerHome } from "@/i18n/customer-path";


import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { newsletterCopy } from "@/i18n/outreach";

export default function NewsletterUnsubscribePage({ initialLocale }: { initialLocale?: Locale }) {
  return (
    <Suspense fallback={<div className="container-site py-20" aria-busy="true" />}>
      <NewsletterUnsubscribeForm initialLocale={initialLocale} />
    </Suspense>
  );
}

function NewsletterUnsubscribeForm({ initialLocale }: { initialLocale?: Locale }) {
  const params = useSearchParams();
  const token = params.get("token") || "";
  const hint = params.get("locale");
  const [storedLocale, setStoredLocale] = useState<Locale | null>(null);
  const locale = storedLocale ?? initialLocale ?? (isLocale(hint) ? hint : "en");
  const text = newsletterCopy[locale];
  const [status, setStatus] = useState<"ready" | "submitting" | "success" | "error">("ready");
  const [message, setMessage] = useState("");

  async function unsubscribe() {
    setStatus("submitting");
    try {
    const response = await fetch("/api/newsletter/unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const payload = await response.json();
    if (!response.ok) {
      setStatus("error");
      setMessage(text.unsubscribeError);
      return;
    }
    if (isLocale(payload.locale)) setStoredLocale(payload.locale);
    setStatus("success");
    } catch {
      setStatus("error");
      setMessage(text.unsubscribeError);
    }
  }

  if (status === "success") {
    return (
      <UnsubscribeCard locale={locale}>
        <p>{text.unsubscribed}</p>
        <Link href={customerHome(locale)} className="btn btn-primary mt-6 inline-flex">{text.home}</Link>
      </UnsubscribeCard>
    );
  }

  return (
    <UnsubscribeCard locale={locale}>
      <p>{text.unsubscribeBody}</p>
      {status === "error" && <p className="mt-4 text-sm font-semibold text-red-600">{message}</p>}
      <button type="button" disabled={!token || status === "submitting"} onClick={unsubscribe} className="mt-6 rounded-xl bg-teal-700 px-5 py-3 font-semibold text-white disabled:opacity-50">
        {status === "submitting" ? text.updating : text.unsubscribe}
      </button>
    </UnsubscribeCard>
  );
}

function UnsubscribeCard({ children, locale }: { children: React.ReactNode; locale: Locale }) {
  return (
    <div className="container-site py-20" lang={locale}>
      <div className="mx-auto max-w-xl rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-3xl font-bold">{newsletterCopy[locale].preferences}</h1>
        <div className="mt-4 text-neutral-600">{children}</div>
      </div>
    </div>
  );
}
