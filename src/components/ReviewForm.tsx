"use client";

import { reviewCopy } from "@/i18n/review";
import { isLocale, type Locale } from "@/i18n/config";
import { FormEvent, useEffect, useState } from "react";

type ReviewState = {
  productName: string;
  submitted: boolean;
  rating: number | null;
  consentToPublish: boolean;
};

export default function ReviewForm({ token, initialLocale = "en" }: { token: string; initialLocale?: Locale }) {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const t = reviewCopy[locale];
  const [review, setReview] = useState<ReviewState | null>(null);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/reviews/${token}`, { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(t.error);
        if (isLocale(data.locale)) setLocale(data.locale);
        setReview(data);
        setRating(data.rating || 0);
      })
      .catch(() => setError(t.error))
      .finally(() => setLoading(false));
  }, [token, t.error]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch(`/api/reviews/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          title: formData.get("title"),
          reviewBody: formData.get("reviewBody"),
          displayName: formData.get("displayName"),
          consentToPublish: formData.get("consentToPublish") === "on",
        }),
      });
      if (!response.ok) throw new Error(t.error);
      setReview((current) => current ? { ...current, submitted: true, rating } : current);
    } catch {
      setError(t.error);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="card p-8 text-center text-neutral-500">{t.loading}</div>;
  }

  if (error && !review) {
    return <div className="card border-red-200 bg-red-50 p-8 text-center text-red-700">{error}</div>;
  }

  if (review?.submitted) {
    return (
      <div className="card p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-2xl text-brand">✓</div>
        <h2 className="mt-5 text-2xl font-bold">{t.thanks}</h2>
        <p className="mt-3 text-neutral-600">
          {t.saved}
        </p>
      </div>
    );
  }

  return (
    <form lang={locale} onSubmit={submit} className="card space-y-6 p-6 md:p-8">
      <div>
        <p className="text-sm text-neutral-500">{t.completed}</p>
        <h2 className="mt-1 text-2xl font-bold">{review?.productName}</h2>
      </div>

      <fieldset>
        <legend className="font-semibold">{t.rating}</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className={`rounded-xl border px-4 py-2 text-lg transition-colors ${rating >= value ? "border-amber-400 bg-amber-50 text-amber-600" : "border-neutral-300 text-neutral-400 hover:border-amber-300"}`}
              aria-label={`${value} ${t.stars}`}
            >
              ★
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="review-title" className="block text-sm font-medium text-neutral-700">{t.title}<span className="text-neutral-400">{t.optional}</span></label>
        <input id="review-title" name="title" maxLength={120} className="input mt-1.5 w-full" placeholder={t.titleHint} />
      </div>

      <div>
        <label htmlFor="review-body" className="block text-sm font-medium text-neutral-700">{t.body}</label>
        <textarea id="review-body" name="reviewBody" required minLength={10} maxLength={2000} rows={6} className="input mt-1.5 w-full resize-y" placeholder={t.bodyHint} />
      </div>

      <div>
        <label htmlFor="display-name" className="block text-sm font-medium text-neutral-700">{t.name}<span className="text-neutral-400">{t.optional}</span></label>
        <input id="display-name" name="displayName" maxLength={80} className="input mt-1.5 w-full" placeholder={t.nameHint} />
      </div>

      <label className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm leading-relaxed text-neutral-700">
        <input type="checkbox" name="consentToPublish" className="mt-1 h-4 w-4 accent-teal-700" />
        <span>{t.consent}</span>
      </label>

      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <button type="submit" disabled={saving || rating === 0} className="btn btn-primary btn-lg w-full disabled:cursor-not-allowed disabled:opacity-50">
        {saving ? t.saving : t.submit}
      </button>
    </form>
  );
}
