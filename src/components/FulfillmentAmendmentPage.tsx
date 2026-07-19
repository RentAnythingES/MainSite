"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

interface AmendmentView {
  bookingRef: string;
  bookingStatus: string;
  customerFirstName: string | null;
  productName: string;
  rentalStartAt: string | null;
  rentalEndAt: string | null;
  status: "quoted" | "checkout_created" | "paid" | "cancelled" | "expired";
  fulfillmentMode: "delivery_only" | "delivery_and_collection";
  deliveryZoneName: string | null;
  collectionZoneName: string | null;
  deliveryAddress: string;
  collectionAddress: string | null;
  deliveryNotes: string | null;
  collectionNotes: string | null;
  deliveryFeeCents: number;
  collectionFeeCents: number;
  totalCents: number;
  currency: string;
  isCustomQuote: boolean;
  quoteNotes: string | null;
  expiresAt: string;
  paidAt: string | null;
}

function money(cents: number, currency: string) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: currency.toUpperCase() }).format(cents / 100);
}

function dateTime(value: string | null) {
  if (!value) return "To be confirmed";
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Madrid",
  }).format(new Date(value));
}

export default function FulfillmentAmendmentPage({ token, paymentReturning }: { token: string; paymentReturning: boolean }) {
  const [amendment, setAmendment] = useState<AmendmentView | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const response = await fetch(`/api/fulfillment-amendments/${token}`, { cache: "no-store" });
    const payload = await response.json().catch(() => null) as AmendmentView & { error?: string };
    if (!response.ok) throw new Error(payload?.error || "Could not load this transport quote");
    setAmendment(payload);
    return payload;
  }, [token]);

  useEffect(() => {
    let cancelled = false;
    load()
      .catch((caught) => !cancelled && setError(caught instanceof Error ? caught.message : "Could not load this transport quote"))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [load]);

  useEffect(() => {
    if (!paymentReturning || amendment?.status === "paid") return;
    const interval = window.setInterval(() => {
      load().catch(() => undefined);
    }, 2000);
    const timeout = window.setTimeout(() => window.clearInterval(interval), 30000);
    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [amendment?.status, load, paymentReturning]);

  async function proceedToPayment() {
    setPaying(true);
    setError("");
    try {
      const response = await fetch(`/api/fulfillment-amendments/${token}/checkout`, { method: "POST" });
      const payload = await response.json().catch(() => null) as { checkoutUrl?: string; paid?: boolean; error?: string } | null;
      if (!response.ok) throw new Error(payload?.error || "Could not open payment");
      if (payload?.paid) {
        await load();
        return;
      }
      if (!payload?.checkoutUrl) throw new Error("Stripe did not return a payment link");
      window.location.assign(payload.checkoutUrl);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not open payment");
      setPaying(false);
    }
  }

  if (loading) {
    return <main className="container-site flex min-h-[60vh] items-center justify-center py-16 text-neutral-500">Loading transport quote…</main>;
  }

  if (!amendment) {
    return (
      <main className="container-site flex min-h-[60vh] items-center justify-center py-16">
        <div className="card max-w-lg p-8 text-center">
          <h1 className="mb-3 text-2xl font-bold">Transport quote unavailable</h1>
          <p className="mb-6 text-neutral-600">{error || "This private link is invalid or no longer available."}</p>
          <Link href="/contact" className="btn btn-outline">Contact us</Link>
        </div>
      </main>
    );
  }

  const payable = ["quoted", "checkout_created"].includes(amendment.status);
  const paid = amendment.status === "paid";

  return (
    <main className="bg-neutral-50 py-12 sm:py-16">
      <div className="container-site max-w-3xl">
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-brand">Booking {amendment.bookingRef}</p>
          <h1 className="text-3xl font-bold sm:text-4xl">
            {paid ? "Transport service confirmed" : "Add transport to your booking"}
          </h1>
          <p className="mt-3 text-neutral-600">
            {paid
              ? "Your booking has been updated. We will confirm the exact operational timing separately."
              : `${amendment.customerFirstName ? `Hi ${amendment.customerFirstName}, this` : "This"} is the transport quote prepared for your existing rental.`}
          </p>
        </div>

        <section className="card overflow-hidden">
          <div className="border-b border-neutral-200 bg-white p-6 sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Rental</p>
                <p className="mt-1 font-semibold">{amendment.productName}</p>
                <p className="mt-1 text-sm text-neutral-500">{dateTime(amendment.rentalStartAt)} → {dateTime(amendment.rentalEndAt)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">New service</p>
                <p className="mt-1 font-semibold">{amendment.fulfillmentMode === "delivery_and_collection" ? "Delivery and collection" : "Delivery only"}</p>
                {amendment.isCustomQuote && <span className="mt-2 inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">Custom distance quote</span>}
              </div>
            </div>
          </div>

          <div className="space-y-6 bg-white p-6 sm:p-8">
            <div>
              <p className="text-sm font-semibold">Delivery</p>
              <p className="mt-1 text-neutral-700">{amendment.deliveryAddress}</p>
              {amendment.deliveryZoneName && <p className="mt-1 text-sm text-neutral-500">{amendment.deliveryZoneName}</p>}
              {amendment.deliveryNotes && <p className="mt-2 text-sm text-neutral-500">Note: {amendment.deliveryNotes}</p>}
            </div>

            {amendment.fulfillmentMode === "delivery_and_collection" && (
              <div className="border-t border-neutral-100 pt-6">
                <p className="text-sm font-semibold">Collection</p>
                <p className="mt-1 text-neutral-700">{amendment.collectionAddress}</p>
                {amendment.collectionZoneName && <p className="mt-1 text-sm text-neutral-500">{amendment.collectionZoneName}</p>}
                {amendment.collectionNotes && <p className="mt-2 text-sm text-neutral-500">Note: {amendment.collectionNotes}</p>}
              </div>
            )}

            {amendment.quoteNotes && <div className="rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-950">{amendment.quoteNotes}</div>}

            <div className="border-t border-neutral-200 pt-5">
              <div className="flex justify-between text-sm text-neutral-600"><span>Delivery</span><span>{money(amendment.deliveryFeeCents, amendment.currency)}</span></div>
              {amendment.collectionFeeCents > 0 && <div className="mt-2 flex justify-between text-sm text-neutral-600"><span>Collection</span><span>{money(amendment.collectionFeeCents, amendment.currency)}</span></div>}
              <div className="mt-4 flex justify-between border-t border-neutral-200 pt-4 text-lg font-bold"><span>Total to pay</span><span className="text-brand">{money(amendment.totalCents, amendment.currency)}</span></div>
            </div>
          </div>

          <div className="border-t border-neutral-200 bg-neutral-50 p-6 sm:p-8">
            {paid ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">Payment received and booking updated.</div>
            ) : payable ? (
              <>
                {paymentReturning && <p className="mb-4 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">Payment is being confirmed. This page will update automatically.</p>}
                {error && <p className="mb-4 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
                <button type="button" onClick={proceedToPayment} disabled={paying} className="btn btn-primary btn-lg w-full disabled:opacity-60">
                  {paying ? "Opening secure payment…" : `Pay ${money(amendment.totalCents, amendment.currency)} securely`}
                </button>
                <p className="mt-3 text-center text-xs text-neutral-500">Quote valid until {dateTime(amendment.expiresAt)}. Payment is handled by Stripe.</p>
              </>
            ) : (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                This quote is {amendment.status}. Contact us if you still need transport.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
