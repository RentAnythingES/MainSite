"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function NewsletterUnsubscribePage() {
  return (
    <Suspense fallback={<UnsubscribeCard>Loading email preferences…</UnsubscribeCard>}>
      <NewsletterUnsubscribeForm />
    </Suspense>
  );
}

function NewsletterUnsubscribeForm() {
  const token = useSearchParams().get("token") || "";
  const [status, setStatus] = useState<"ready" | "submitting" | "success" | "error">("ready");
  const [message, setMessage] = useState("");

  async function unsubscribe() {
    setStatus("submitting");
    const response = await fetch("/api/newsletter/unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const payload = await response.json();
    if (!response.ok) {
      setStatus("error");
      setMessage(payload.error || "Could not unsubscribe");
      return;
    }
    setStatus("success");
  }

  if (status === "success") {
    return (
      <UnsubscribeCard>
        <p>You have been unsubscribed from marketing emails.</p>
        <Link href="/" className="btn btn-primary mt-6 inline-flex">Return home</Link>
      </UnsubscribeCard>
    );
  }

  return (
    <UnsubscribeCard>
      <p>Stop receiving Valencia tips, inventory updates and occasional offers. Booking and service emails for active rentals are unaffected.</p>
      {status === "error" && <p className="mt-4 text-sm font-semibold text-red-600">{message}</p>}
      <button type="button" disabled={!token || status === "submitting"} onClick={unsubscribe} className="mt-6 rounded-xl bg-teal-700 px-5 py-3 font-semibold text-white disabled:opacity-50">
        {status === "submitting" ? "Updating…" : "Unsubscribe"}
      </button>
    </UnsubscribeCard>
  );
}

function UnsubscribeCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-site py-20">
      <div className="mx-auto max-w-xl rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-3xl font-bold">Email preferences</h1>
        <div className="mt-4 text-neutral-600">{children}</div>
      </div>
    </div>
  );
}
