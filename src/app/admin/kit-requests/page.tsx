"use client";

import { useEffect, useState } from "react";
import { BUNDLE_REQUEST_STATUSES, type BundleRequestStatus } from "@/lib/bundle-requests";

type BundleRequest = {
  id: string;
  request_ref: string;
  bundle_name: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  start_date: string;
  end_date: string;
  accommodation_area: string;
  selected_items: string[];
  selected_addons: string[];
  customer_notes: string | null;
  admin_notes: string | null;
  status: BundleRequestStatus;
  notification_email_sent: boolean;
  confirmation_email_sent: boolean;
  created_at: string;
};

const filters = ["all", ...BUNDLE_REQUEST_STATUSES] as const;

const statusStyles: Record<BundleRequestStatus, string> = {
  new: "bg-amber-500/15 text-amber-300",
  contacted: "bg-sky-500/15 text-sky-300",
  quoted: "bg-violet-500/15 text-violet-300",
  converted: "bg-emerald-500/15 text-emerald-300",
  closed: "bg-neutral-700 text-neutral-300",
};

export default function AdminKitRequestsPage() {
  const [requests, setRequests] = useState<BundleRequest[]>([]);
  const [filter, setFilter] = useState<(typeof filters)[number]>("new");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, { status: BundleRequestStatus; notes: string }>>({});

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    fetch(`/api/admin/bundle-requests?status=${filter}`, { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not load kit requests");
        if (!active) return;
        const loaded = data.requests || [];
        setRequests(loaded);
        setDrafts(Object.fromEntries(loaded.map((item: BundleRequest) => [item.id, { status: item.status, notes: item.admin_notes || "" }])));
      })
      .catch((loadError) => {
        if (active) setError(loadError instanceof Error ? loadError.message : "Could not load kit requests");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [filter]);

  async function saveRequest(id: string) {
    const draft = drafts[id];
    if (!draft) return;
    setSavingId(id);
    setError("");
    try {
      const response = await fetch(`/api/admin/bundle-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: draft.status, adminNotes: draft.notes }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not update kit request");
      setRequests((current) =>
        filter === "all" || filter === data.request.status
          ? current.map((item) => item.id === id ? data.request : item)
          : current.filter((item) => item.id !== id),
      );
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not update kit request");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-4xl font-bold text-white">Kit requests</h1>
        <p className="mt-2 text-neutral-400">Follow up on saved kit configurations, record quotes, and track conversions.</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((value) => (
          <button key={value} type="button" onClick={() => setFilter(value)} className={`rounded-full px-4 py-2 text-sm font-medium capitalize ${filter === value ? "bg-teal-500/20 text-teal-300" : "bg-neutral-900 text-neutral-400 hover:text-white"}`}>
            {value}
          </button>
        ))}
      </div>

      {error && <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">{error}</div>}
      {loading ? <p className="text-neutral-500">Loading kit requests…</p> : requests.length === 0 ? (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-10 text-center text-neutral-500">No {filter === "all" ? "" : `${filter} `}kit requests.</div>
      ) : (
        <div className="space-y-5">
          {requests.map((item) => {
            const draft = drafts[item.id] || { status: item.status, notes: item.admin_notes || "" };
            return (
              <article key={item.id} className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm font-semibold text-teal-300">{item.request_ref}</span>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[item.status]}`}>{item.status}</span>
                    </div>
                    <h2 className="mt-3 text-xl font-semibold text-white">{item.bundle_name}</h2>
                    <p className="mt-1 text-sm text-neutral-400">{item.start_date} → {item.end_date} · {item.accommodation_area}</p>
                  </div>
                  <p className="text-sm text-neutral-500">{new Date(item.created_at).toLocaleString("en-GB")}</p>
                </div>

                <div className="mt-5 grid gap-5 md:grid-cols-3">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Customer</h3>
                    <p className="mt-2 font-medium text-white">{item.customer_name}</p>
                    <a href={`mailto:${item.customer_email}`} className="block text-sm text-teal-300 hover:underline">{item.customer_email}</a>
                    {item.customer_phone && <a href={`tel:${item.customer_phone}`} className="block text-sm text-teal-300 hover:underline">{item.customer_phone}</a>}
                    <p className="mt-2 text-xs text-neutral-500">Admin email: {item.notification_email_sent ? "sent" : "not sent"} · Customer email: {item.confirmation_email_sent ? "sent" : "not sent"}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Included items</h3>
                    <ul className="mt-2 space-y-1 text-sm text-neutral-300">
                      {item.selected_items.length ? item.selected_items.map((name) => <li key={name}>• {name}</li>) : <li>Recommendation requested</li>}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Add-ons</h3>
                    <ul className="mt-2 space-y-1 text-sm text-neutral-300">
                      {item.selected_addons.length ? item.selected_addons.map((name) => <li key={name}>• {name}</li>) : <li>None selected</li>}
                    </ul>
                  </div>
                </div>

                {item.customer_notes && <div className="mt-5 rounded-xl bg-neutral-950 px-4 py-3 text-sm text-neutral-300"><span className="font-semibold text-neutral-100">Customer notes:</span> {item.customer_notes}</div>}

                <div className="mt-6 grid gap-4 border-t border-neutral-800 pt-5 md:grid-cols-[220px_1fr_auto] md:items-end">
                  <label className="block">
                    <span className="text-sm font-medium text-neutral-300">Status</span>
                    <select value={draft.status} onChange={(event) => setDrafts((current) => ({ ...current, [item.id]: { ...draft, status: event.target.value as BundleRequestStatus } }))} className="mt-2 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm text-white">
                      {BUNDLE_REQUEST_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-neutral-300">Internal note</span>
                    <input value={draft.notes} onChange={(event) => setDrafts((current) => ({ ...current, [item.id]: { ...draft, notes: event.target.value } }))} maxLength={2000} className="mt-2 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm text-white" placeholder="Quote details, substitutions, follow-up…" />
                  </label>
                  <button type="button" onClick={() => saveRequest(item.id)} disabled={savingId === item.id} className="rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-500 disabled:opacity-50">
                    {savingId === item.id ? "Saving…" : "Save"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
