"use client";

import Link from "next/link";
import { quoteCopy, quoteMoney, quoteDate } from "@/i18n/private-quotes";
import type { Locale } from "@/i18n/config";
import { customerPrefix } from "@/i18n/customer-path";
import { FormEvent, useEffect, useState } from "react";
import GooglePlacesAddressInput from "@/components/GooglePlacesAddressInput";

type QuoteLine = { description: string; amountCents: number };
type QuoteView = {
  locale: Locale;
  public_token: string;
  status: "open" | "checkout_created" | "paid" | "cancelled" | "expired";
  display_name: string;
  quantity: number;
  customer_name: string | null;
  customer_email: string;
  customer_phone: string;
  rental_start_at: string;
  rental_end_at: string;
  timezone: string;
  fulfillment_mode: "customer_pickup" | "delivery_only" | "delivery_and_collection";
  delivery_address: string | null;
  collection_address: string | null;
  delivery_notes: string | null;
  collection_notes: string | null;
  currency: string;
  line_items: QuoteLine[];
  total_cents: number;
  customer_terms: string | null;
  expires_at: string;
  product: { id: string; name: string; slug: string; brand: string; image_url: string | null };
  pickup_location: {
    id: string;
    name: string;
    address: string;
    customer_instructions: string | null;
    pickup_instructions: string | null;
  } | null;
};

const fieldClass = "mt-1 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-neutral-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100";

export default function CustomBookingQuotePage({ token, initialLocale = "en" }: { token: string; initialLocale?: Locale }) {
  const [quote, setQuote] = useState<QuoteView | null>(null);
  const locale = quote?.locale ?? initialLocale;
  const text = quoteCopy[locale];
  const money = (cents: number, currency: string) => quoteMoney(cents, currency, locale);
  const dateTime = (value: string | null) => quoteDate(value, locale, quote?.timezone);
  const contactHref = customerPrefix(locale) + "/contact";
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [collectionAddress, setCollectionAddress] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/custom-quotes/${encodeURIComponent(token)}`, { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not load this quote");
        if (cancelled) return;
        const loaded = data.quote as QuoteView;
        setQuote(loaded);
        setCustomerName(loaded.customer_name || "");
        setCustomerEmail(loaded.customer_email || "");
        setCustomerPhone(loaded.customer_phone || "");
        setDeliveryAddress(loaded.delivery_address || "");
        setCollectionAddress(loaded.collection_address || "");
      })
      .catch(() => !cancelled && setError(quoteCopy[initialLocale].load))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [token, initialLocale]);

  const proceed = async (event: FormEvent) => {
    event.preventDefault();
    setPaying(true);
    setError("");
    try {
      const acceptResponse = await fetch(`/api/custom-quotes/${encodeURIComponent(token)}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          deliveryAddress,
          collectionAddress,
        }),
      });
      const accepted = await acceptResponse.json();
      if (!acceptResponse.ok || !accepted.draftId) {
        throw new Error(accepted.error || "Could not reserve the quoted rental");
      }

      const checkoutResponse = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draftId: accepted.draftId, locale }),
      });
      const checkout = await checkoutResponse.json();
      if (!checkoutResponse.ok || !checkout.checkoutUrl) {
        throw new Error(checkout.error || "Could not open secure payment");
      }
      window.location.assign(checkout.checkoutUrl);
    } catch {
      setError(text.payment);
      setPaying(false);
    }
  };

  if (loading) {
    return <main className="container-site flex min-h-[65vh] items-center justify-center py-16 text-neutral-500">{text.loading}</main>;
  }

  if (!quote) {
    return (
      <main className="container-site flex min-h-[65vh] items-center justify-center py-16">
        <div className="card max-w-lg p-8 text-center">
          <h1 className="mb-3 text-2xl font-bold">{text.unavailable}</h1>
          <p className="mb-6 text-neutral-600">{error || text.invalid}</p>
          <Link href={contactHref} className="btn btn-outline">{text.contact}</Link>
        </div>
      </main>
    );
  }

  const payable = quote.status === "open" || quote.status === "checkout_created";
  const fulfillmentLabel =
    quote.fulfillment_mode === "customer_pickup"
      ? text.pickup
      : quote.fulfillment_mode === "delivery_and_collection"
        ? text.both
        : text.delivery;

  return (
    <main className="bg-neutral-50 py-12 sm:py-16">
      <div className="container-site max-w-3xl">
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-brand">{text.badge}</p>
          <h1 className="text-3xl font-bold sm:text-4xl">
            {quote.status === "paid" ? text.confirmed : text.title}
          </h1>
          <p className="mt-3 text-neutral-600">
            {text.intro}
          </p>
        </div>

        <section className="card overflow-hidden bg-white">
          <div className="border-b border-neutral-200 p-6 sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">{text.rental}</p>
                <p className="mt-1 font-semibold">
                  {quote.quantity > 1 ? `${quote.quantity} × ` : ""}
                  {quote.display_name}
                </p>
                <p className="mt-1 text-sm text-neutral-500">{dateTime(quote.rental_start_at)} → {dateTime(quote.rental_end_at)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">{text.arrangement}</p>
                <p className="mt-1 font-semibold">{fulfillmentLabel}</p>
                {quote.fulfillment_mode === "customer_pickup" && quote.pickup_location && (
                  <p className="mt-1 text-sm text-neutral-500">{quote.pickup_location.name}</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6 p-6 sm:p-8">
            <div>
              <h2 className="font-semibold">{text.price}</h2>
              <ul className="mt-3 space-y-2">
                {quote.line_items.map((line, index) => (
                  <li key={index} className="flex justify-between gap-5 text-sm text-neutral-700">
                    <span>{line.description}</span>
                    <span className="whitespace-nowrap">{money(line.amountCents, quote.currency)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex justify-between border-t border-neutral-200 pt-4 text-lg font-bold">
                <span>{text.total}</span>
                <span className="text-brand">{money(quote.total_cents, quote.currency)}</span>
              </div>
            </div>

            {quote.customer_terms && (
              <div className="rounded-xl bg-amber-50 p-4">
                <h2 className="text-sm font-semibold text-amber-950">{text.conditions}</h2>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-amber-950">{quote.customer_terms}</p>
              </div>
            )}

            {quote.fulfillment_mode !== "customer_pickup" && quote.delivery_address && (
              <div>
                <h2 className="text-sm font-semibold">{text.delivery}</h2>
                <p className="mt-1 text-sm text-neutral-700">{quote.delivery_address}</p>
                {quote.delivery_notes && <p className="mt-1 text-sm text-neutral-500">{quote.delivery_notes}</p>}
              </div>
            )}
            {quote.fulfillment_mode === "delivery_and_collection" && quote.collection_address && (
              <div>
                <h2 className="text-sm font-semibold">{text.collection}</h2>
                <p className="mt-1 text-sm text-neutral-700">{quote.collection_address}</p>
                {quote.collection_notes && <p className="mt-1 text-sm text-neutral-500">{quote.collection_notes}</p>}
              </div>
            )}
          </div>

          <div className="border-t border-neutral-200 bg-neutral-50 p-6 sm:p-8">
            {quote.status === "paid" ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                {text.received}
              </div>
            ) : payable ? (
              <form onSubmit={proceed} className="space-y-4">
                <h2 className="text-lg font-semibold">{text.details}</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-medium text-neutral-700">
                    {text.name}
                    <input className={fieldClass} value={customerName} onChange={(event) => setCustomerName(event.target.value)} maxLength={120} autoComplete="name" required />
                  </label>
                  <label className="text-sm font-medium text-neutral-700">
                    {text.email}
                    <input className={fieldClass} type="email" value={customerEmail} onChange={(event) => setCustomerEmail(event.target.value)} maxLength={254} autoComplete="email" required />
                  </label>
                  <label className="text-sm font-medium text-neutral-700 sm:col-span-2">
                    {text.phone}
                    <input className={fieldClass} value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} maxLength={40} autoComplete="tel" />
                  </label>
                  {quote.fulfillment_mode !== "customer_pickup" && (
                    <label className="text-sm font-medium text-neutral-700 sm:col-span-2">
                    {text.deliveryAddress}
                      <GooglePlacesAddressInput
                        value={deliveryAddress}
                        onChange={setDeliveryAddress}
                        placeholder={text.addressPlaceholder}
                        locale={locale}
                        className={fieldClass}
                        required
                      />
                    </label>
                  )}
                  {quote.fulfillment_mode === "delivery_and_collection" && (
                    <label className="text-sm font-medium text-neutral-700 sm:col-span-2">
                    {text.collectionAddress}
                      <GooglePlacesAddressInput
                        value={collectionAddress}
                        onChange={setCollectionAddress}
                        placeholder={text.collectionPlaceholder}
                        locale={locale}
                        className={fieldClass}
                      />
                    </label>
                  )}
                </div>
                {error && <p className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
                <button type="submit" disabled={paying} className="btn btn-primary btn-lg w-full disabled:opacity-60">
                  {paying ? text.reserving : `${text.continue} · ${money(quote.total_cents, quote.currency)}`}
                </button>
                <p className="text-center text-xs text-neutral-500">
                  {text.expiry} {dateTime(quote.expires_at)}.
                </p>
              </form>
            ) : (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                {quote.status === "expired" ? text.expired : text.cancelled} {text.closed}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
