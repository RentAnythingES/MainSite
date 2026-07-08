"use client";

import { FormEvent, useState } from "react";
import { trackEvent } from "@/lib/analytics";

interface NewsletterSignupProps {
  source: string;
  locale?: "en" | "es";
  dark?: boolean;
}

export default function NewsletterSignup({ source, locale = "en", dark = false }: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          consent,
          source,
          locale,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not subscribe");
      }

      trackEvent("newsletter_signup_submit", {
        event_category: "newsletter",
        source,
        locale,
      });

      setStatus("success");
      setEmail("");
      setConsent(false);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Could not subscribe");
    }
  }

  const inputClass = dark
    ? "w-full px-4 py-3 rounded-xl text-sm bg-white/10 text-white placeholder:text-teal-200 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
    : "w-full px-4 py-3 rounded-xl text-sm bg-white text-neutral-900 placeholder:text-neutral-400 border border-border focus:outline-none focus:ring-2 focus:ring-brand/20";

  const consentClass = dark ? "text-teal-100" : "text-neutral-500";
  const messageClass = dark ? "text-teal-100" : "text-neutral-600";

  return (
    <form className="max-w-xl mx-auto" id={`newsletter-${source}`} onSubmit={handleSubmit}>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="your@email.com"
          required
          className={inputClass}
          aria-label="Email address"
        />
        <button type="submit" className="btn btn-accent whitespace-nowrap" disabled={status === "submitting"}>
          {status === "submitting" ? "Subscribing..." : "Subscribe"}
        </button>
      </div>

      <label className={`mt-4 flex items-start gap-2 text-left text-xs leading-relaxed ${consentClass}`}>
        <input
          type="checkbox"
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          required
          className="mt-0.5 h-4 w-4 accent-amber-500"
        />
        <span>
          I agree to receive RentAnything.es emails with Valencia stay tips, product updates, kit launches, and occasional offers. I can unsubscribe at any time.
        </span>
      </label>

      {status === "success" && (
        <p className={`mt-4 text-sm font-semibold ${messageClass}`}>
          You&apos;re subscribed — please check your inbox for the welcome email.
        </p>
      )}
      {status === "error" && (
        <p className="mt-4 text-sm font-semibold text-red-200">
          {error}
        </p>
      )}
    </form>
  );
}
