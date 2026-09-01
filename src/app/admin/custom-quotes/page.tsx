"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { resolveCustomQuoteExpiry } from "@/lib/custom-booking-quotes";

type ProductOption = { id: string; name: string; brand: string; stock_total: number; stock_available: number };
type PickupOption = { id: string; name: string; address: string };
type QuoteLine = { description: string; amountCents: number };
type QuoteStatus = "open" | "checkout_created" | "paid" | "cancelled" | "expired";
type FulfillmentMode = "customer_pickup" | "delivery_only" | "delivery_and_collection";
type CustomQuote = {
  id: string;
  public_token: string;
  status: QuoteStatus;
  quantity: number;
  customer_name: string | null;
  customer_email: string | null;
  rental_start_at: string;
  rental_end_at: string;
  fulfillment_mode: FulfillmentMode;
  line_items: QuoteLine[];
  total_cents: number;
  customer_terms: string | null;
  internal_notes: string | null;
  expires_at: string;
  product: { id: string; name: string; brand: string };
};

function localDateTime(daysFromNow: number, hour: number) {
  const value = new Date();
  value.setDate(value.getDate() + daysFromNow);
  value.setHours(hour, 0, 0, 0);
  const offset = value.getTimezoneOffset() * 60_000;
  return new Date(value.getTime() - offset).toISOString().slice(0, 16);
}

function localDateTimeValue(value: Date) {
  const offset = value.getTimezoneOffset() * 60_000;
  return new Date(value.getTime() - offset).toISOString().slice(0, 16);
}

function shortNoticeSafeExpiry(rentalStartAt: string, requestedExpiresAt?: string) {
  const start = new Date(rentalStartAt);
  const requested = requestedExpiresAt ? new Date(requestedExpiresAt) : null;
  return localDateTimeValue(resolveCustomQuoteExpiry(start, requested));
}

const money = (cents: number) =>
  new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }).format(cents / 100);

const dateTime = (value: string) =>
  new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Madrid",
  }).format(new Date(value));

const inputClass = "mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white outline-none focus:border-teal-500";

export default function AdminCustomQuotesPage() {
  const [quotes, setQuotes] = useState<CustomQuote[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [pickupLocations, setPickupLocations] = useState<PickupOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [rentalStartAt, setRentalStartAt] = useState(localDateTime(2, 10));
  const [rentalEndAt, setRentalEndAt] = useState(localDateTime(7, 10));
  const [expiresAt, setExpiresAt] = useState(() =>
    shortNoticeSafeExpiry(localDateTime(2, 10), localDateTime(1, 18)),
  );
  const [fulfillmentMode, setFulfillmentMode] = useState<FulfillmentMode>("delivery_only");
  const [pickupLocationId, setPickupLocationId] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [collectionAddress, setCollectionAddress] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [collectionNotes, setCollectionNotes] = useState("");
  const [customerTerms, setCustomerTerms] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const [lineItems, setLineItems] = useState<QuoteLine[]>([
    { description: "Custom rental arrangement", amountCents: 0 },
  ]);

  const totalCents = useMemo(
    () => lineItems.reduce((total, line) => total + (Number.isFinite(line.amountCents) ? line.amountCents : 0), 0),
    [lineItems],
  );

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/custom-quotes", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not load custom quotes");
        if (cancelled) return;
        setQuotes(data.quotes || []);
        setProducts(data.products || []);
        setPickupLocations(data.pickupLocations || []);
        setProductId((current) => current || data.products?.[0]?.id || "");
        setPickupLocationId((current) => current || data.pickupLocations?.[0]?.id || "");
      })
      .catch((caught) => {
        if (!cancelled) setError(caught instanceof Error ? caught.message : "Could not load custom quotes");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const updateLine = (index: number, changes: Partial<QuoteLine>) => {
    setLineItems((current) =>
      current.map((line, lineIndex) => lineIndex === index ? { ...line, ...changes } : line),
    );
  };

  const updateRentalStart = (value: string) => {
    setRentalStartAt(value);
    try {
      setExpiresAt(shortNoticeSafeExpiry(value, expiresAt));
      setError("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Choose a valid future rental start");
    }
  };

  const createQuote = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");
    let resolvedExpiresAt: string;
    try {
      resolvedExpiresAt = shortNoticeSafeExpiry(rentalStartAt, expiresAt);
      setExpiresAt(resolvedExpiresAt);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Choose a valid future rental start");
      return;
    }
    setSaving(true);
    const response = await fetch("/api/admin/custom-quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId,
        quantity,
        customerName,
        customerEmail,
        customerPhone,
        rentalStartAt: new Date(rentalStartAt).toISOString(),
        rentalEndAt: new Date(rentalEndAt).toISOString(),
        expiresAt: new Date(resolvedExpiresAt).toISOString(),
        fulfillmentMode,
        pickupLocationId,
        deliveryAddress,
        collectionAddress,
        deliveryNotes,
        collectionNotes,
        customerTerms,
        internalNotes,
        lineItems,
      }),
    });
    const data = await response.json();
    setSaving(false);
    if (!response.ok) {
      setError(data.error || "Could not create custom quote");
      return;
    }
    setMessage("Custom quote created. Its private link is ready to copy.");
    setQuotes((current) => [data.quote, ...current]);
  };

  const quoteUrl = (token: string) =>
    `${typeof window === "undefined" ? "" : window.location.origin}/booking/quote/${token}`;

  const copyLink = async (token: string) => {
    await navigator.clipboard.writeText(quoteUrl(token));
    setMessage("Private quote link copied.");
  };

  const cancelQuote = async (quote: CustomQuote) => {
    if (!window.confirm("Cancel this custom quote? Its link will stop accepting payment.")) return;
    const response = await fetch(`/api/admin/custom-quotes/${quote.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "cancel" }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Could not cancel custom quote");
      return;
    }
    setQuotes((current) =>
      current.map((item) => item.id === quote.id ? { ...item, status: "cancelled" } : item),
    );
    setMessage("Custom quote cancelled.");
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Custom booking quotes</h1>
        <p className="mt-2 max-w-3xl text-neutral-400">
          Prepare a private fixed-price link. Free-form lines live only on this quote; only the selected catalogue product reserves inventory.
        </p>
      </div>

      {message && <div className="mb-5 rounded-xl border border-teal-500/30 bg-teal-500/10 px-4 py-3 text-sm text-teal-200">{message}</div>}
      {error && <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}

      <form onSubmit={createQuote} className="mb-10 rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
        <h2 className="text-xl font-semibold text-white">Create a quote</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="text-sm text-neutral-300">
            Primary inventory product
            <select className={inputClass} value={productId} onChange={(event) => setProductId(event.target.value)} required>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.brand.trim() ? `${product.brand.trim()} ` : ""}{product.name} ({Math.min(product.stock_total, product.stock_available)} online)
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-neutral-300">
            Quantity
            <input className={inputClass} type="number" min={1} max={50} value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} required />
          </label>
          <label className="text-sm text-neutral-300">
            Rental starts
            <input className={inputClass} type="datetime-local" value={rentalStartAt} onChange={(event) => updateRentalStart(event.target.value)} required />
          </label>
          <label className="text-sm text-neutral-300">
            Rental ends
            <input className={inputClass} type="datetime-local" value={rentalEndAt} onChange={(event) => setRentalEndAt(event.target.value)} required />
          </label>
          <label className="text-sm text-neutral-300">
            Quote expires
            <input className={inputClass} type="datetime-local" value={expiresAt} onChange={(event) => setExpiresAt(event.target.value)} required />
            <span className="mt-1 block text-xs leading-5 text-neutral-500">
              Automatically kept before the rental start. Short-notice approval does not use the public lead-time rule.
            </span>
          </label>
          <label className="text-sm text-neutral-300">
            Fulfillment
            <select className={inputClass} value={fulfillmentMode} onChange={(event) => setFulfillmentMode(event.target.value as FulfillmentMode)}>
              <option value="delivery_only">Delivery only</option>
              <option value="delivery_and_collection">Delivery and collection</option>
              <option value="customer_pickup">Customer pickup</option>
            </select>
          </label>
        </div>

        {fulfillmentMode === "customer_pickup" ? (
          <label className="mt-4 block text-sm text-neutral-300">
            Pickup location
            <select className={inputClass} value={pickupLocationId} onChange={(event) => setPickupLocationId(event.target.value)} required>
              {pickupLocations.map((location) => <option key={location.id} value={location.id}>{location.name} — {location.address}</option>)}
            </select>
          </label>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="text-sm text-neutral-300">
              Delivery address or area (customer can complete it)
              <input className={inputClass} value={deliveryAddress} onChange={(event) => setDeliveryAddress(event.target.value)} maxLength={500} />
            </label>
            {fulfillmentMode === "delivery_and_collection" && (
              <label className="text-sm text-neutral-300">
                Collection address (customer can complete it)
                <input className={inputClass} value={collectionAddress} onChange={(event) => setCollectionAddress(event.target.value)} maxLength={500} />
              </label>
            )}
            <label className="text-sm text-neutral-300">
              Delivery notes
              <input className={inputClass} value={deliveryNotes} onChange={(event) => setDeliveryNotes(event.target.value)} maxLength={1000} />
            </label>
            {fulfillmentMode === "delivery_and_collection" && (
              <label className="text-sm text-neutral-300">
                Collection notes
                <input className={inputClass} value={collectionNotes} onChange={(event) => setCollectionNotes(event.target.value)} maxLength={1000} />
              </label>
            )}
          </div>
        )}

        <div className="mt-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-white">Customer-visible price lines</h3>
              <p className="text-xs text-neutral-500">One-off descriptions, not catalogue items.</p>
            </div>
            <button
              type="button"
              className="rounded-lg border border-neutral-700 px-3 py-2 text-sm text-neutral-300 hover:border-teal-500 hover:text-white disabled:opacity-50"
              onClick={() => setLineItems((current) => [...current, { description: "", amountCents: 0 }])}
              disabled={lineItems.length >= 12}
            >
              + Add line
            </button>
          </div>
          <div className="mt-3 space-y-3">
            {lineItems.map((line, index) => (
              <div key={index} className="grid gap-3 rounded-xl border border-neutral-800 bg-neutral-950/60 p-3 md:grid-cols-[1fr_160px_auto]">
                <label className="text-xs text-neutral-500">
                  Description
                  <input
                    className={inputClass}
                    placeholder="e.g. 5-metre exhaust tube and setup"
                    value={line.description}
                    onChange={(event) => updateLine(index, { description: event.target.value })}
                    maxLength={160}
                    required
                  />
                </label>
                <label className="text-xs text-neutral-500">
                  Amount (€)
                  <input
                    className={inputClass}
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={line.amountCents ? (line.amountCents / 100).toFixed(2) : ""}
                    onChange={(event) => updateLine(index, { amountCents: Math.round(Number(event.target.value) * 100) })}
                    required
                  />
                </label>
                <button
                  type="button"
                  className="self-end rounded-lg px-3 py-2 text-sm text-red-300 hover:bg-red-500/10 disabled:opacity-40"
                  onClick={() => setLineItems((current) => current.filter((_, lineIndex) => lineIndex !== index))}
                  disabled={lineItems.length === 1}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <p className="mt-3 text-right text-lg font-semibold text-white">Quoted total: {money(totalCents)}</p>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="text-sm text-neutral-300">
            Customer conditions
            <textarea className={`${inputClass} min-h-28`} value={customerTerms} onChange={(event) => setCustomerTerms(event.target.value)} maxLength={3000} placeholder="Included setup, access requirements, or anything else agreed." />
          </label>
          <label className="text-sm text-neutral-300">
            Internal preparation notes
            <textarea className={`${inputClass} min-h-28`} value={internalNotes} onChange={(event) => setInternalNotes(event.target.value)} maxLength={3000} placeholder="Staff-only preparation details." />
          </label>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <label className="text-sm text-neutral-300">Customer name (optional)<input className={inputClass} value={customerName} onChange={(event) => setCustomerName(event.target.value)} maxLength={120} /></label>
          <label className="text-sm text-neutral-300">Customer email (optional)<input className={inputClass} type="email" value={customerEmail} onChange={(event) => setCustomerEmail(event.target.value)} maxLength={254} /></label>
          <label className="text-sm text-neutral-300">Customer phone (optional)<input className={inputClass} value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} maxLength={40} /></label>
        </div>

        <button className="mt-6 rounded-xl bg-teal-600 px-5 py-3 font-semibold text-white hover:bg-teal-500 disabled:opacity-60" disabled={saving || loading || totalCents <= 0}>
          {saving ? "Creating quote…" : `Create ${money(totalCents)} quote`}
        </button>
      </form>

      <section>
        <h2 className="text-xl font-semibold text-white">Recent quotes</h2>
        {loading ? (
          <p className="mt-4 text-neutral-500">Loading custom quotes…</p>
        ) : quotes.length === 0 ? (
          <p className="mt-4 rounded-xl border border-neutral-800 bg-neutral-900 p-5 text-neutral-500">No custom quotes yet.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {quotes.map((quote) => (
              <article key={quote.id} className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-white">
                        {quote.quantity > 1 ? `${quote.quantity} × ` : ""}
                        {quote.product.brand.trim() ? `${quote.product.brand.trim()} ` : ""}
                        {quote.product.name}
                      </h3>
                      <span className="rounded-full bg-neutral-800 px-2.5 py-1 text-xs font-medium uppercase text-neutral-300">{quote.status.replace("_", " ")}</span>
                    </div>
                    <p className="mt-1 text-sm text-neutral-400">{dateTime(quote.rental_start_at)} → {dateTime(quote.rental_end_at)}</p>
                    <p className="mt-1 text-sm text-neutral-500">{quote.customer_name || "Customer not specified"}{quote.customer_email ? ` · ${quote.customer_email}` : ""}</p>
                  </div>
                  <p className="text-xl font-bold text-white">{money(quote.total_cents)}</p>
                </div>
                <ul className="mt-4 space-y-1 text-sm text-neutral-300">
                  {quote.line_items.map((line, index) => <li key={index} className="flex justify-between gap-4"><span>{line.description}</span><span>{money(line.amountCents)}</span></li>)}
                </ul>
                {quote.customer_terms && <p className="mt-4 whitespace-pre-wrap rounded-xl bg-neutral-950 p-3 text-sm text-neutral-300">{quote.customer_terms}</p>}
                {quote.internal_notes && <p className="mt-3 text-xs text-amber-300">Internal: {quote.internal_notes}</p>}
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  {["open", "checkout_created"].includes(quote.status) && (
                    <>
                      <button type="button" className="rounded-lg bg-teal-600 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-500" onClick={() => copyLink(quote.public_token)}>Copy private link</button>
                      <a className="rounded-lg border border-neutral-700 px-3 py-2 text-sm text-neutral-300 hover:text-white" href={`/booking/quote/${quote.public_token}`} target="_blank" rel="noreferrer">Preview</a>
                      <button type="button" className="rounded-lg px-3 py-2 text-sm text-red-300 hover:bg-red-500/10" onClick={() => cancelQuote(quote)}>Cancel quote</button>
                    </>
                  )}
                  <span className="text-xs text-neutral-500">Valid until {dateTime(quote.expires_at)}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
