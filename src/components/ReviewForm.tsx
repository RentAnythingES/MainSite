"use client";

import { FormEvent, useEffect, useState } from "react";

type ReviewState = {
  productName: string;
  submitted: boolean;
  rating: number | null;
  consentToPublish: boolean;
};

export default function ReviewForm({ token }: { token: string }) {
  const [review, setReview] = useState<ReviewState | null>(null);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/reviews/${token}`, { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not load feedback form");
        setReview(data);
        setRating(data.rating || 0);
      })
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Could not load feedback form"))
      .finally(() => setLoading(false));
  }, [token]);

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
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save feedback");
      setReview((current) => current ? { ...current, submitted: true, rating } : current);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not save feedback");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="card p-8 text-center text-neutral-500">Loading your feedback form…</div>;
  }

  if (error && !review) {
    return <div className="card border-red-200 bg-red-50 p-8 text-center text-red-700">{error}</div>;
  }

  if (review?.submitted) {
    return (
      <div className="card p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-2xl text-brand">✓</div>
        <h2 className="mt-5 text-2xl font-bold">Thank you for your feedback</h2>
        <p className="mt-3 text-neutral-600">
          Your response has been saved. Feedback is only shown publicly after consent and a manual accuracy check.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card space-y-6 p-6 md:p-8">
      <div>
        <p className="text-sm text-neutral-500">Completed rental</p>
        <h2 className="mt-1 text-2xl font-bold">{review?.productName}</h2>
      </div>

      <fieldset>
        <legend className="font-semibold">How was your rental?</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className={`rounded-xl border px-4 py-2 text-lg transition-colors ${rating >= value ? "border-amber-400 bg-amber-50 text-amber-600" : "border-neutral-300 text-neutral-400 hover:border-amber-300"}`}
              aria-label={`${value} star${value === 1 ? "" : "s"}`}
            >
              ★
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="review-title" className="block text-sm font-medium text-neutral-700">Short title <span className="text-neutral-400">(optional)</span></label>
        <input id="review-title" name="title" maxLength={120} className="input mt-1.5 w-full" placeholder="What stood out?" />
      </div>

      <div>
        <label htmlFor="review-body" className="block text-sm font-medium text-neutral-700">Your feedback</label>
        <textarea id="review-body" name="reviewBody" required minLength={10} maxLength={2000} rows={6} className="input mt-1.5 w-full resize-y" placeholder="Tell us what worked well and what we could improve." />
      </div>

      <div>
        <label htmlFor="display-name" className="block text-sm font-medium text-neutral-700">Public display name <span className="text-neutral-400">(optional)</span></label>
        <input id="display-name" name="displayName" maxLength={80} className="input mt-1.5 w-full" placeholder="e.g. Maria S." />
      </div>

      <label className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm leading-relaxed text-neutral-700">
        <input type="checkbox" name="consentToPublish" className="mt-1 h-4 w-4 accent-teal-700" />
        <span>I allow RentAnything.es to publish this feedback and my chosen display name. Submitting feedback without checking this box keeps it internal.</span>
      </label>

      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <button type="submit" disabled={saving || rating === 0} className="btn btn-primary btn-lg w-full disabled:cursor-not-allowed disabled:opacity-50">
        {saving ? "Saving…" : "Submit feedback"}
      </button>
    </form>
  );
}
