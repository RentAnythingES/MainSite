"use client";

import { useEffect, useMemo, useState } from "react";

interface ServiceZone {
  id: string;
  name: string;
  delivery_fee_cents: number;
  collection_fee_cents: number;
  is_active: boolean;
}

interface Amendment {
  id: string;
  status: string;
  fulfillment_mode: "delivery_only" | "delivery_and_collection";
  delivery_address: string;
  collection_address: string | null;
  delivery_fee_cents: number;
  collection_fee_cents: number;
  is_custom_quote: boolean;
  expires_at: string;
  paid_at: string | null;
  customer_url: string;
}

interface Props {
  bookingId: string;
  bookingStatus: string;
  fulfillmentMode?: string | null;
  amendments: Amendment[];
  available: boolean;
  onChanged: () => Promise<void>;
}

const inputClass = "w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 focus:border-teal-500 focus:outline-none";

function money(cents: number) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "EUR" }).format(cents / 100);
}

export default function BookingFulfillmentAmendments({
  bookingId,
  bookingStatus,
  fulfillmentMode,
  amendments,
  available,
  onChanged,
}: Props) {
  const [open, setOpen] = useState(false);
  const [zones, setZones] = useState<ServiceZone[]>([]);
  const [loadingZones, setLoadingZones] = useState(false);
  const [saving, setSaving] = useState(false);
  const [emailingId, setEmailingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [mode, setMode] = useState<"delivery_only" | "delivery_and_collection">("delivery_and_collection");
  const [custom, setCustom] = useState(false);
  const [deliveryZoneId, setDeliveryZoneId] = useState("");
  const [collectionZoneId, setCollectionZoneId] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [collectionAddress, setCollectionAddress] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [collectionNotes, setCollectionNotes] = useState("");
  const [deliveryFee, setDeliveryFee] = useState("");
  const [collectionFee, setCollectionFee] = useState("");
  const [quoteNotes, setQuoteNotes] = useState("");
  const [expiresInDays, setExpiresInDays] = useState("7");

  const activeQuote = amendments.find((item) => ["quoted", "checkout_created"].includes(item.status));
  const canCreate = available && fulfillmentMode === "customer_pickup" && ["confirmed", "paid"].includes(bookingStatus) && !activeQuote;
  const activeZones = useMemo(() => zones.filter((zone) => zone.is_active), [zones]);
  const deliveryZone = activeZones.find((zone) => zone.id === deliveryZoneId);
  const collectionZone = activeZones.find((zone) => zone.id === collectionZoneId);
  const calculatedTotal = custom
    ? Math.round((Number(deliveryFee) + (mode === "delivery_and_collection" ? Number(collectionFee) : 0)) * 100) || 0
    : (deliveryZone?.delivery_fee_cents || 0) + (mode === "delivery_and_collection" ? collectionZone?.collection_fee_cents || 0 : 0);

  useEffect(() => {
    if (!open || zones.length > 0 || loadingZones) return;
    setLoadingZones(true);
    fetch("/api/admin/fulfillment")
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || "Could not load service zones");
        setZones(payload.serviceZones || []);
      })
      .catch((caught) => setError(caught instanceof Error ? caught.message : "Could not load service zones"))
      .finally(() => setLoadingZones(false));
  }, [loadingZones, open, zones.length]);

  async function createQuote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/fulfillment-amendments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fulfillmentMode: mode,
          isCustomQuote: custom,
          deliveryZoneId: custom ? null : deliveryZoneId,
          collectionZoneId: custom || mode === "delivery_only" ? null : collectionZoneId,
          deliveryAddress,
          collectionAddress: mode === "delivery_and_collection" ? collectionAddress : null,
          deliveryNotes,
          collectionNotes: mode === "delivery_and_collection" ? collectionNotes : null,
          deliveryFeeCents: custom ? Math.round(Number(deliveryFee) * 100) : undefined,
          collectionFeeCents: custom && mode === "delivery_and_collection" ? Math.round(Number(collectionFee) * 100) : 0,
          quoteNotes,
          expiresInDays: Number(expiresInDays),
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Could not create transport quote");
      setNotice("Transport quote created. Copy the private link and send it to the customer.");
      setOpen(false);
      await onChanged();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not create transport quote");
    } finally {
      setSaving(false);
    }
  }

  async function cancelQuote(amendmentId: string) {
    if (!window.confirm("Cancel this open transport quote and close its Stripe payment session?")) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/fulfillment-amendments/${amendmentId}`, { method: "DELETE" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Could not cancel transport quote");
      setNotice("Transport quote cancelled.");
      await onChanged();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not cancel transport quote");
    } finally {
      setSaving(false);
    }
  }

  async function copyLink(url: string) {
    await navigator.clipboard.writeText(url);
    setNotice("Private customer link copied.");
  }

  async function emailQuote(amendmentId: string) {
    setEmailingId(amendmentId);
    setError("");
    setNotice("");
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/fulfillment-amendments/${amendmentId}/email`, { method: "POST" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Could not email transport quote");
      setNotice("Transport quote emailed to the customer.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not email transport quote");
    } finally {
      setEmailingId(null);
    }
  }

  return (
    <section className="mb-4 border-t border-neutral-800 pt-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs text-neutral-500">Post-booking transport</p>
          <p className="mt-1 text-sm text-neutral-300">Quote delivery after a customer initially chose self-pickup.</p>
        </div>
        {canCreate && (
          <button type="button" onClick={() => setOpen((value) => !value)} className="rounded-lg bg-teal-600 px-3 py-2 text-xs font-semibold text-white hover:bg-teal-500">
            {open ? "Close quote form" : "Create transport quote"}
          </button>
        )}
      </div>

      {!available && <p className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-300">Apply the fulfillment-amendment migration to enable transport quotes.</p>}
      {notice && <p className="mt-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-300">{notice}</p>}
      {error && <p className="mt-3 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-300">{error}</p>}

      {amendments.length > 0 && (
        <div className="mt-4 space-y-2">
          {amendments.map((amendment) => (
            <div key={amendment.id} className="rounded-lg border border-neutral-800 bg-neutral-950 p-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">
                    {amendment.fulfillment_mode === "delivery_and_collection" ? "Delivery + collection" : "Delivery only"}
                    {amendment.is_custom_quote && <span className="ml-2 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-300">Custom</span>}
                  </p>
                  <p className="mt-1 text-xs text-neutral-400">{amendment.delivery_address}{amendment.collection_address ? ` → ${amendment.collection_address}` : ""}</p>
                  <p className="mt-1 text-xs text-neutral-500">{money(amendment.delivery_fee_cents + amendment.collection_fee_cents)} · {amendment.status} · expires {new Date(amendment.expires_at).toLocaleDateString("en-GB")}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => copyLink(amendment.customer_url)} className="rounded-lg border border-neutral-700 px-3 py-1.5 text-xs font-semibold text-neutral-200 hover:bg-neutral-800">Copy customer link</button>
                  {["quoted", "checkout_created"].includes(amendment.status) && (
                    <>
                      <button type="button" disabled={emailingId === amendment.id} onClick={() => emailQuote(amendment.id)} className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-500 disabled:opacity-50">{emailingId === amendment.id ? "Sending…" : "Email quote"}</button>
                      <button type="button" disabled={saving} onClick={() => cancelQuote(amendment.id)} className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/10 disabled:opacity-50">Cancel quote</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {open && (
        <form onSubmit={createQuote} className="mt-4 space-y-4 rounded-xl border border-neutral-800 bg-neutral-950 p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs text-neutral-400">Service
              <select value={mode} onChange={(event) => setMode(event.target.value as typeof mode)} className={`${inputClass} mt-1`}>
                <option value="delivery_only">Delivery only</option>
                <option value="delivery_and_collection">Delivery and collection</option>
              </select>
            </label>
            <label className="flex items-center gap-2 self-end rounded-lg border border-neutral-800 p-2.5 text-xs text-neutral-300">
              <input type="checkbox" checked={custom} onChange={(event) => setCustom(event.target.checked)} /> Custom distance / manual fee
            </label>
          </div>

          {!custom && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-xs text-neutral-400">Delivery zone
                <select required value={deliveryZoneId} onChange={(event) => setDeliveryZoneId(event.target.value)} className={`${inputClass} mt-1`} disabled={loadingZones}>
                  <option value="">Choose zone</option>
                  {activeZones.map((zone) => <option key={zone.id} value={zone.id}>{zone.name} · {money(zone.delivery_fee_cents)}</option>)}
                </select>
              </label>
              {mode === "delivery_and_collection" && (
                <label className="text-xs text-neutral-400">Collection zone
                  <select required value={collectionZoneId} onChange={(event) => setCollectionZoneId(event.target.value)} className={`${inputClass} mt-1`} disabled={loadingZones}>
                    <option value="">Choose zone</option>
                    {activeZones.map((zone) => <option key={zone.id} value={zone.id}>{zone.name} · {money(zone.collection_fee_cents)}</option>)}
                  </select>
                </label>
              )}
            </div>
          )}

          {custom && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-xs text-neutral-400">Delivery fee (€)
                <input required type="number" min="0" max="1000" step="0.01" value={deliveryFee} onChange={(event) => setDeliveryFee(event.target.value)} className={`${inputClass} mt-1`} />
              </label>
              {mode === "delivery_and_collection" && (
                <label className="text-xs text-neutral-400">Collection fee (€)
                  <input required type="number" min="0" max="1000" step="0.01" value={collectionFee} onChange={(event) => setCollectionFee(event.target.value)} className={`${inputClass} mt-1`} />
                </label>
              )}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs text-neutral-400">Delivery address
              <textarea required rows={3} maxLength={500} value={deliveryAddress} onChange={(event) => setDeliveryAddress(event.target.value)} className={`${inputClass} mt-1 resize-y`} />
            </label>
            {mode === "delivery_and_collection" && (
              <label className="text-xs text-neutral-400">Collection address
                <textarea required rows={3} maxLength={500} value={collectionAddress} onChange={(event) => setCollectionAddress(event.target.value)} className={`${inputClass} mt-1 resize-y`} />
              </label>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs text-neutral-400">Delivery notes
              <input maxLength={1000} value={deliveryNotes} onChange={(event) => setDeliveryNotes(event.target.value)} className={`${inputClass} mt-1`} />
            </label>
            {mode === "delivery_and_collection" && (
              <label className="text-xs text-neutral-400">Collection notes
                <input maxLength={1000} value={collectionNotes} onChange={(event) => setCollectionNotes(event.target.value)} className={`${inputClass} mt-1`} />
              </label>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
            <label className="text-xs text-neutral-400">Customer-visible quote note
              <input maxLength={1000} value={quoteNotes} onChange={(event) => setQuoteNotes(event.target.value)} className={`${inputClass} mt-1`} placeholder="Optional timing or distance note" />
            </label>
            <label className="text-xs text-neutral-400">Valid for days
              <input type="number" min="1" max="30" value={expiresInDays} onChange={(event) => setExpiresInDays(event.target.value)} className={`${inputClass} mt-1`} />
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-800 pt-4">
            <p className="text-sm font-semibold text-white">Customer pays: <span className="text-teal-300">{money(calculatedTotal)}</span></p>
            <button type="submit" disabled={saving || calculatedTotal <= 0} className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-50">{saving ? "Creating…" : "Create private quote"}</button>
          </div>
        </form>
      )}
    </section>
  );
}
