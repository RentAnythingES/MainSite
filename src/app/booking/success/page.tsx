"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { trackBookingEvent } from "@/lib/analytics";

interface BookingInfo {
  bookingRef: string;
  productName: string;
  quantity: number;
  startDate: string;
  endDate: string;
  totalCents: number;
  customerEmail: string;
}

type CheckoutStatus =
  | "booking_confirmed"
  | "payment_pending"
  | "fulfillment_pending"
  | "payment_incomplete";

function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [booking, setBooking] = useState<BookingInfo | null>(null);
  const [checkoutStatus, setCheckoutStatus] = useState<CheckoutStatus | null>(null);
  const [customerEmail, setCustomerEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    fetch(`/api/checkout/status?id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        setCheckoutStatus(data.status || null);
        setCustomerEmail(data.session?.customerEmail || data.booking?.customerEmail || "");
        if (data.status) {
          trackBookingEvent("checkout_success_status_loaded", {
            checkoutStatus: data.status,
            sessionId,
            bookingRef: data.booking?.bookingRef,
          });
        }
        if (data.booking) {
          setBooking(data.booking);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [sessionId]);

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-lg w-full text-center">
        <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
          checkoutStatus === "fulfillment_pending" ? "bg-amber-100" : "bg-teal-100"
        }`}>
          {checkoutStatus === "fulfillment_pending" ? (
            <svg className="w-10 h-10 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-10 h-10 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>

        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          {checkoutStatus === "fulfillment_pending" ? "Payment Received" : "Booking Confirmed!"}
        </h1>

        <p className="text-neutral-600 mb-8">
          {checkoutStatus === "fulfillment_pending"
            ? "Your payment went through. We are finishing your booking confirmation now."
            : "Thank you for your booking. We'll be in touch to arrange the next step."}
        </p>

        {loading && (
          <div className="animate-pulse bg-neutral-100 rounded-2xl p-6 mb-8">
            <div className="h-4 bg-neutral-200 rounded w-3/4 mx-auto mb-3"></div>
            <div className="h-4 bg-neutral-200 rounded w-1/2 mx-auto"></div>
          </div>
        )}

        {booking && (
          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 mb-8 text-left">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-neutral-500">Booking ref</span>
                <span className="font-mono font-semibold text-teal-700">{booking.bookingRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Item</span>
                <span className="font-medium">{booking.productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Quantity</span>
                <span className="font-medium">{booking.quantity || 1}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Dates</span>
                <span className="font-medium">{booking.startDate} → {booking.endDate}</span>
              </div>
              <hr className="border-neutral-200" />
              <div className="flex justify-between">
                <span className="text-neutral-500">Total paid</span>
                <span className="font-bold text-lg">€{(booking.totalCents / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {!loading && checkoutStatus === "fulfillment_pending" && !booking && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8 text-left">
            <p className="font-semibold text-amber-900 mb-2">Confirmation is still processing</p>
            <p className="text-sm text-amber-800">
              Stripe has received the payment, but our booking confirmation webhook has not finished yet.
              Please do not pay again. If your confirmation email does not arrive shortly, contact us and include your checkout session ID.
            </p>
            {sessionId && (
              <p className="text-xs text-amber-700 mt-3 font-mono break-all">{sessionId}</p>
            )}
          </div>
        )}

        {!loading && !booking && !sessionId && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
            <p className="text-amber-800">
              No booking session found. If you just completed a payment, please check your email for confirmation.
            </p>
          </div>
        )}

        <div className="space-y-3">
          <p className="text-sm text-neutral-500">
            {checkoutStatus === "fulfillment_pending"
              ? `A confirmation email will be sent to ${customerEmail || "your email address"} as soon as the booking is created.`
              : `A confirmation email has been sent to ${booking?.customerEmail || customerEmail || "your email address"}.`}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors"
            >
              Back to Home
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-neutral-300 text-neutral-700 font-medium hover:bg-neutral-50 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-neutral-400">Loading...</div>
        </main>
      }
    >
      <BookingSuccessContent />
    </Suspense>
  );
}
