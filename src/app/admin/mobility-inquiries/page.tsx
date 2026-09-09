"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  MOBILITY_INQUIRY_LANGUAGES,
  MOBILITY_INQUIRY_LOSS_REASONS,
  MOBILITY_INQUIRY_SOURCES,
  MOBILITY_INQUIRY_STATUSES,
  type MobilityInquiryLossReason,
  type MobilityInquiryStatus,
} from "@/lib/mobility-inquiries";

type Inquiry = {
  id: string;
  item_requested: string;
  start_date: string | null;
  end_date: string | null;
  location: string | null;
  language: string;
  source_channel: string;
  landing_page: string | null;
  source_detail: string | null;
  customer_name: string | null;
  customer_contact: string | null;
  status: MobilityInquiryStatus;
  outcome: string | null;
  loss_reason: MobilityInquiryLossReason | null;
  admin_notes: string | null;
  created_at: string;
};

type Draft = { status: MobilityInquiryStatus; outcome: string; lossReason: string; adminNotes: string };

const blankForm = {
  itemRequested: "",
  startDate: "",
  endDate: "",
  location: "",
  language: "en",
  sourceChannel: "whatsapp",
  landingPage: "",
  sourceDetail: "",
  customerName: "",
  customerContact: "",
};

const inputClass = "mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white";
const labelClass = "text-xs font-medium text-neutral-400";

function toDraft(inquiry: Inquiry): Draft {
  return {
    status: inquiry.status,
    outcome: inquiry.outcome || "",
    lossReason: inquiry.loss_reason || "",
    adminNotes: inquiry.admin_notes || "",
  };
}

export default function MobilityInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [form, setForm] = useState(blankForm);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch(`/api/admin/mobility-inquiries?status=${filter}`, { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not load mobility inquiries");
        if (!active) return;
        const loaded = data.inquiries || [];
        setInquiries(loaded);
        setDrafts(Object.fromEntries(loaded.map((item: Inquiry) => [item.id, toDraft(item)])));
      })
      .catch((loadError) => active && setError(loadError instanceof Error ? loadError.message : "Could not load mobility inquiries"))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [filter]);

  function updateForm(field: keyof typeof blankForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function addInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/mobility-inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save mobility inquiry");
      setInquiries((current) => [data.inquiry, ...current]);
      setDrafts((current) => ({ ...current, [data.inquiry.id]: toDraft(data.inquiry) }));
      setForm(blankForm);
      setNotice("Mobility inquiry recorded.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save mobility inquiry");
    } finally {
      setSaving(false);
    }
  }

  async function updateInquiry(id: string) {
    const draft = drafts[id];
    if (!draft) return;
    setSavingId(id);
    setError("");
    setNotice("");
    try {
      const response = await fetch(`/api/admin/mobility-inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not update mobility inquiry");
      setInquiries((current) => current.map((item) => item.id === id ? data.inquiry : item));
      setDrafts((current) => ({ ...current, [id]: toDraft(data.inquiry) }));
      setNotice("Inquiry outcome updated.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not update mobility inquiry");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-4xl font-bold text-white">Mobility inquiries</h1>
        <p className="mt-2 text-neutral-400">Record demand from every channel and learn which requests convert or are lost to capacity, fit, timing or price.</p>
      </div>

      {error && <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">{error}</div>}
      {notice && <div className="mb-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-emerald-300">{notice}</div>}

      <form onSubmit={addInquiry} className="mb-8 rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
        <h2 className="text-xl font-semibold text-white">Record an inquiry</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <label className="lg:col-span-2"><span className={labelClass}>Item requested *</span><input required value={form.itemRequested} onChange={(event) => updateForm("itemRequested", event.target.value)} className={inputClass} placeholder="Electric wheelchair, foldable scooter…" /></label>
          <label><span className={labelClass}>Start date</span><input type="date" value={form.startDate} onChange={(event) => updateForm("startDate", event.target.value)} className={inputClass} /></label>
          <label><span className={labelClass}>End date</span><input type="date" value={form.endDate} onChange={(event) => updateForm("endDate", event.target.value)} className={inputClass} /></label>
          <label><span className={labelClass}>Location</span><input value={form.location} onChange={(event) => updateForm("location", event.target.value)} className={inputClass} placeholder="Hotel, area or delivery city" /></label>
          <label><span className={labelClass}>Language</span><select value={form.language} onChange={(event) => updateForm("language", event.target.value)} className={inputClass}>{MOBILITY_INQUIRY_LANGUAGES.map((value) => <option key={value}>{value}</option>)}</select></label>
          <label><span className={labelClass}>Channel</span><select value={form.sourceChannel} onChange={(event) => updateForm("sourceChannel", event.target.value)} className={inputClass}>{MOBILITY_INQUIRY_SOURCES.map((value) => <option key={value}>{value}</option>)}</select></label>
          <label><span className={labelClass}>Landing page</span><input value={form.landingPage} onChange={(event) => updateForm("landingPage", event.target.value)} className={inputClass} placeholder="/rental/mobility/…" /></label>
          <label><span className={labelClass}>Customer name</span><input value={form.customerName} onChange={(event) => updateForm("customerName", event.target.value)} className={inputClass} /></label>
          <label><span className={labelClass}>Contact</span><input value={form.customerContact} onChange={(event) => updateForm("customerContact", event.target.value)} className={inputClass} placeholder="Email or WhatsApp" /></label>
          <label className="lg:col-span-2"><span className={labelClass}>Source detail</span><input value={form.sourceDetail} onChange={(event) => updateForm("sourceDetail", event.target.value)} className={inputClass} placeholder="Google query, partner, campaign or referrer" /></label>
        </div>
        <button disabled={saving} className="mt-5 rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-500 disabled:opacity-50">{saving ? "Saving…" : "Record inquiry"}</button>
      </form>

      <div className="mb-5 flex flex-wrap gap-2">
        {["all", ...MOBILITY_INQUIRY_STATUSES].map((value) => <button key={value} type="button" onClick={() => { setError(""); setFilter(value); }} className={`rounded-full px-4 py-2 text-sm font-medium capitalize ${filter === value ? "bg-teal-500/20 text-teal-300" : "bg-neutral-900 text-neutral-400"}`}>{value}</button>)}
      </div>

      {loading ? <p className="text-neutral-500">Loading inquiries…</p> : inquiries.length === 0 ? <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-10 text-center text-neutral-500">No mobility inquiries in this view.</div> : (
        <div className="space-y-4">
          {inquiries.map((inquiry) => {
            const draft = drafts[inquiry.id] || toDraft(inquiry);
            return <article key={inquiry.id} className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div><div className="flex flex-wrap items-center gap-2"><h2 className="text-xl font-semibold text-white">{inquiry.item_requested}</h2><span className="rounded-full bg-neutral-800 px-2.5 py-1 text-xs font-semibold capitalize text-teal-300">{inquiry.status}</span></div><p className="mt-2 text-sm text-neutral-400">{inquiry.start_date || "Dates unknown"}{inquiry.end_date ? ` → ${inquiry.end_date}` : ""}{inquiry.location ? ` · ${inquiry.location}` : ""}</p></div>
                <p className="text-xs text-neutral-500">{new Date(inquiry.created_at).toLocaleString("en-GB")}</p>
              </div>
              <div className="mt-4 grid gap-3 text-sm text-neutral-300 md:grid-cols-3"><p><span className="text-neutral-500">Source:</span> {inquiry.source_channel}{inquiry.source_detail ? ` · ${inquiry.source_detail}` : ""}</p><p><span className="text-neutral-500">Language:</span> {inquiry.language}</p><p><span className="text-neutral-500">Customer:</span> {[inquiry.customer_name, inquiry.customer_contact].filter(Boolean).join(" · ") || "Not recorded"}</p>{inquiry.landing_page && <p className="md:col-span-3 break-all"><span className="text-neutral-500">Landing:</span> {inquiry.landing_page}</p>}</div>
              <div className="mt-5 grid gap-4 border-t border-neutral-800 pt-5 lg:grid-cols-4 lg:items-end">
                <label><span className={labelClass}>Status</span><select value={draft.status} onChange={(event) => setDrafts((current) => ({ ...current, [inquiry.id]: { ...draft, status: event.target.value as MobilityInquiryStatus, lossReason: event.target.value === "lost" ? draft.lossReason : "" } }))} className={inputClass}>{MOBILITY_INQUIRY_STATUSES.map((value) => <option key={value}>{value}</option>)}</select></label>
                <label><span className={labelClass}>Outcome</span><input value={draft.outcome} onChange={(event) => setDrafts((current) => ({ ...current, [inquiry.id]: { ...draft, outcome: event.target.value } }))} className={inputClass} placeholder="Quote sent, booked alternative…" /></label>
                {draft.status === "lost" ? <label><span className={labelClass}>Loss reason *</span><select required value={draft.lossReason} onChange={(event) => setDrafts((current) => ({ ...current, [inquiry.id]: { ...draft, lossReason: event.target.value } }))} className={inputClass}><option value="">Choose reason</option>{MOBILITY_INQUIRY_LOSS_REASONS.map((value) => <option key={value} value={value}>{value.replaceAll("_", " ")}</option>)}</select></label> : <label><span className={labelClass}>Internal note</span><input value={draft.adminNotes} onChange={(event) => setDrafts((current) => ({ ...current, [inquiry.id]: { ...draft, adminNotes: event.target.value } }))} className={inputClass} /></label>}
                <button type="button" onClick={() => updateInquiry(inquiry.id)} disabled={savingId === inquiry.id} className="rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-500 disabled:opacity-50">{savingId === inquiry.id ? "Saving…" : "Save outcome"}</button>
              </div>
              {draft.status === "lost" && <label className="mt-4 block"><span className={labelClass}>Internal note</span><input value={draft.adminNotes} onChange={(event) => setDrafts((current) => ({ ...current, [inquiry.id]: { ...draft, adminNotes: event.target.value } }))} className={inputClass} /></label>}
            </article>;
          })}
        </div>
      )}
    </div>
  );
}
