"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";

interface BookingInfo {
  bookingRef: string;
  productName: string;
  startDate: string;
  endDate: string;
  totalCents: number;
  customerEmail: string;
}

function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [booking, setBooking] = useState<BookingInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    // Fetch session details to show confirmation
    fetch(`/api/checkout/session?id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
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
        {/* Success icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-teal-100 flex items-center justify-center">
          <svg className="w-10 h-10 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Booking Confirmed!
        </h1>

        <p className="text-neutral-600 mb-8">
          Thank you for your booking. We&apos;ll be in touch to arrange delivery.
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

        {!loading && !booking && !sessionId && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
            <p className="text-amber-800">
              No booking session found. If you just completed a payment, please check your email for confirmation.
            </p>
          </div>
        )}

        <div className="space-y-3">
          <p className="text-sm text-neutral-500">
            A confirmation email has been sent to {booking?.customerEmail || "your email address"}.
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
