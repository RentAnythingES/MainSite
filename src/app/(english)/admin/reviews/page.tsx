"use client";

import { useEffect, useState } from "react";

type Review = {
  id: string;
  status: "invited" | "submitted" | "approved" | "rejected";
  rating: number | null;
  title: string | null;
  review_body: string | null;
  display_name: string | null;
  consent_to_publish: boolean;
  submitted_at: string | null;
  moderation_notes: string | null;
  booking: {
    booking_ref: string;
    customer_name: string;
    customer_email: string;
    completed_at: string | null;
    product: { name: string; slug: string } | null;
  };
};

const filters = ["all", "submitted", "approved", "rejected", "invited"] as const;

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<(typeof filters)[number]>("submitted");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    let active = true;
    fetch(`/api/admin/reviews?status=${filter}`, { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not load reviews");
        if (!active) return;
        setReviews(data.reviews || []);
        setNotes(Object.fromEntries((data.reviews || []).map((review: Review) => [review.id, review.moderation_notes || ""])));
      })
      .catch((loadError) => {
        if (active) setError(loadError instanceof Error ? loadError.message : "Could not load reviews");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [filter]);

  async function moderate(id: string, status: "approved" | "rejected") {
    setSavingId(id);
    setError("");
    try {
      const response = await fetch(`/api/admin/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, moderationNotes: notes[id] || "" }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not update review");
      setReviews((current) =>
        filter === "all" || filter === status
          ? current.map((review) => review.id === id ? { ...review, ...data.review } : review)
          : current.filter((review) => review.id !== id),
      );
    } catch (moderationError) {
      setError(moderationError instanceof Error ? moderationError.message : "Could not update review");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-4xl font-bold text-white">Reviews</h1>
        <p className="mt-2 text-neutral-400">Moderate verified feedback from completed bookings. Customer wording cannot be edited.</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((value) => (
          <button key={value} type="button" onClick={() => { setLoading(true); setError(""); setFilter(value); }} className={`rounded-full px-4 py-2 text-sm font-medium capitalize ${filter === value ? "bg-teal-500/20 text-teal-300" : "bg-neutral-900 text-neutral-400 hover:text-white"}`}>
            {value}
          </button>
        ))}
      </div>

      {error && <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">{error}</div>}
      {loading ? <p className="text-neutral-500">Loading reviews…</p> : reviews.length === 0 ? (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-10 text-center text-neutral-500">No {filter === "all" ? "" : `${filter} `}reviews.</div>
      ) : (
        <div className="space-y-5">
          {reviews.map((review) => (
            <article key={review.id} className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-lg text-amber-400">{"★".repeat(review.rating || 0)}<span className="text-neutral-700">{"★".repeat(5 - (review.rating || 0))}</span></span>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${review.status === "approved" ? "bg-emerald-500/15 text-emerald-300" : review.status === "rejected" ? "bg-red-500/15 text-red-300" : "bg-amber-500/15 text-amber-300"}`}>{review.status}</span>
                    <span className={`rounded-full px-2.5 py-1 text-xs ${review.consent_to_publish ? "bg-teal-500/15 text-teal-300" : "bg-neutral-800 text-neutral-400"}`}>{review.consent_to_publish ? "Publication allowed" : "Internal only"}</span>
                  </div>
                  <h2 className="mt-3 text-xl font-semibold text-white">{review.title || review.booking.product?.name || "Rental feedback"}</h2>
                  <p className="mt-1 text-sm text-neutral-500">{review.booking.booking_ref} · {review.booking.customer_name} · {review.booking.customer_email}</p>
                </div>
                <p className="text-sm text-neutral-500">{review.submitted_at ? new Date(review.submitted_at).toLocaleString("en-GB") : "Not submitted"}</p>
              </div>

              {review.review_body && <blockquote className="mt-5 border-l-2 border-teal-500 pl-4 leading-relaxed text-neutral-200">{review.review_body}</blockquote>}
              {review.display_name && <p className="mt-3 text-sm text-neutral-400">Display name: {review.display_name}</p>}

              {review.status !== "invited" && (
                <div className="mt-6 border-t border-neutral-800 pt-5">
                  <label htmlFor={`notes-${review.id}`} className="text-sm font-medium text-neutral-300">Internal moderation note</label>
                  <textarea id={`notes-${review.id}`} value={notes[review.id] || ""} onChange={(event) => setNotes((current) => ({ ...current, [review.id]: event.target.value }))} maxLength={1000} rows={2} className="mt-2 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm text-white" />
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" disabled={savingId === review.id || !review.consent_to_publish} onClick={() => moderate(review.id, "approved")} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">Approve for display</button>
                    <button type="button" disabled={savingId === review.id} onClick={() => moderate(review.id, "rejected")} className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40">Reject</button>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
