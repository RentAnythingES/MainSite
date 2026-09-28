"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { isLocale, localeRegistry, type Locale } from "@/i18n/config";
import { transactionCopy, transactionService } from "@/i18n/transaction";
import { trackBookingEvent } from "@/lib/analytics";
interface Details {
  bookingRef?: string;
  productName?: string;
  quantity?: number;
  startDate: string;
  endDate: string;
  timeZone: string;
  deliveryType: string;
  fulfillmentMode: string;
  fulfillmentBaseFeeCents: number;
  expressSurchargeCents: number;
  totalCents: number;
  calendarUrl?: string;
  mapsUrl?: string;
}
function Content() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const hint = params.get("locale");
  const [locale, setLocale] = useState<Locale>(isLocale(hint) ? hint : "en");
  const [state, setState] = useState(sessionId ? "loading" : "unknown");
  const [details, setDetails] = useState<Details | null>(null);
  const t = transactionCopy[locale];
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    if (!sessionId) {
      clearTimeout(timeout);
      return;
    }
    fetch(`/api/checkout/status?id=${encodeURIComponent(sessionId)}`, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("status");
        return response.json();
      })
      .then((data) => {
        if (!active) return;
        if (isLocale(data.locale)) setLocale(data.locale);
        setState(data.status || "unknown");
        setDetails(data.booking || data.draft || null);
        trackBookingEvent("checkout_success_status_loaded", {
          checkoutStatus: data.status,
          sessionId,
          bookingRef: data.booking?.bookingRef,
        });
      })
      .catch(() => {
        if (active) setState("unknown");
      })
      .finally(() => clearTimeout(timeout));
    return () => {
      active = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [sessionId]);
  const key =
    state === "booking_confirmed"
      ? "confirmed"
      : state === "fulfillment_pending" || state === "approval_pending"
        ? "paid"
        : state === "payment_pending"
          ? "pending"
          : state === "payment_incomplete"
            ? "incomplete"
            : state === "booking_cancelled"
              ? "cancelled"
              : state === "loading"
                ? "loading"
                : "unknown";
  const body =
    key === "confirmed"
      ? t.confirmedBody
      : key === "paid"
        ? state === "approval_pending"
          ? t.pendingNotice
          : t.paidBody
        : key === "pending"
          ? t.pendingBody
          : key === "incomplete"
            ? t.incompleteBody
            : key === "cancelled"
              ? t.cancelled
              : key === "loading"
                ? ""
                : t.unknownBody;
  const money = (cents: number) =>
    new Intl.NumberFormat(localeRegistry[locale].format, {
      style: "currency",
      currency: "EUR",
    }).format(cents / 100);
  return (
    <main lang={locale} className="min-h-screen px-4 py-20">
      <section className="card mx-auto max-w-lg p-6">
        <h1 className="text-3xl font-bold mb-4" role="status">
          {t[key]}
        </h1>
        <p className="text-neutral-600 mb-6">{body}</p>
        {details && (
          <dl className="space-y-3">
            {[
              [t.ref, details.bookingRef],
              [t.item, details.productName],
              [t.quantity, details.quantity],
              [
                t.dates,
                `${details.startDate} → ${details.endDate} (${details.timeZone})`,
              ],
              [
                t.service,
                transactionService(
                  locale,
                  details.fulfillmentMode,
                  details.deliveryType,
                ),
              ],
              [t.fee, money(details.fulfillmentBaseFeeCents)],
              [
                t.surcharge,
                details.expressSurchargeCents
                  ? money(details.expressSurchargeCents)
                  : null,
              ],
              [t.total, money(details.totalCents)],
            ]
              .filter(([, value]) => value !== undefined && value !== null)
              .map(([label, value]) => (
                <div key={String(label)} className="flex justify-between gap-4">
                  <dt>{label}</dt>
                  <dd className="text-right font-medium">{value}</dd>
                </div>
              ))}
          </dl>
        )}
        {key === "confirmed" && (
          <div className="flex flex-wrap gap-3 my-5">
            {details?.calendarUrl && (
              <a
                href={details.calendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-700 underline"
              >
                {t.calendar}
              </a>
            )}
            {details?.mapsUrl && (
              <a
                href={details.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-700 underline"
              >
                {t.maps}
              </a>
            )}
          </div>
        )}
        {["confirmed", "paid"].includes(key) && (
          <p className="my-5 text-sm text-neutral-600">{t.emailNotice}</p>
        )}
        <div className="flex flex-wrap gap-3 mt-6">
          <Link
            href={locale === "es" ? "/es" : "/"}
            className="btn btn-primary"
          >
            {t.home}
          </Link>
          <a href="https://wa.me/34684708013" className="btn">
            {t.contact}
          </a>
        </div>
      </section>
    </main>
  );
}
export default function Page() {
  return (
    <Suspense fallback={<main className="min-h-screen" aria-busy="true" />}>
      <Content />
    </Suspense>
  );
}
