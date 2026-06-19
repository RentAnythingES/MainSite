"use client";

import { useState, useEffect, useCallback } from "react";

interface BookingProduct {
  id: string;
  name: string;
  slug: string;
  brand: string;
}

interface Booking {
  id: string;
  booking_ref: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  product: BookingProduct;
  start_date: string;
  end_date: string;
  rental_days: number;
  total_cents: number;
  delivery_address: string;
  delivery_notes: string | null;
  status: string;
  created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-400",
  confirmed: "bg-blue-500/10 text-blue-400",
  paid: "bg-emerald-500/10 text-emerald-400",
  delivering: "bg-purple-500/10 text-purple-400",
  active: "bg-teal-500/10 text-teal-400",
  returning: "bg-orange-500/10 text-orange-400",
  completed: "bg-neutral-700 text-neutral-300",
  cancelled: "bg-red-500/10 text-red-400",
  refunded: "bg-red-500/10 text-red-300",
};

const TRANSITIONS: Record<string, { label: string; next: string; color: string }[]> = {
  pending: [
    { label: "Confirm", next: "confirmed", color: "bg-blue-600 hover:bg-blue-500" },
    { label: "Cancel", next: "cancelled", color: "bg-red-600/20 hover:bg-red-600/40 text-red-400" },
  ],
  confirmed: [
    { label: "Mark Paid", next: "paid", color: "bg-emerald-600 hover:bg-emerald-500" },
    { label: "Cancel", next: "cancelled", color: "bg-red-600/20 hover:bg-red-600/40 text-red-400" },
  ],
  paid: [
    { label: "Out for Delivery", next: "delivering", color: "bg-purple-600 hover:bg-purple-500" },
    { label: "Refund", next: "refunded", color: "bg-red-600/20 hover:bg-red-600/40 text-red-400" },
  ],
  delivering: [
    { label: "Mark Active", next: "active", color: "bg-teal-600 hover:bg-teal-500" },
  ],
  active: [
    { label: "Schedule Return", next: "returning", color: "bg-orange-600 hover:bg-orange-500" },
  ],
  returning: [
    { label: "Complete", next: "completed", color: "bg-emerald-600 hover:bg-emerald-500" },
  ],
};

const STATUSES = ["all", "pending", "confirmed", "paid", "delivering", "active", "returning", "completed", "cancelled"];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/bookings?status=${filter}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch {
      setError("Failed to load bookings. Check Supabase connection.");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const updateStatus = async (bookingId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Update failed");
      }
      await fetchBookings();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update booking");
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-neutral-500">Loading bookings...</div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Bookings</h1>
        <p className="text-neutral-500 text-sm mt-1">{bookings.length} bookings</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400 mb-4">
          {error}
          <button onClick={() => setError("")} className="ml-2 text-red-300 hover:text-white">✕</button>
        </div>
      )}

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-1 mb-6">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => { setFilter(s); setLoading(true); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
              filter === s
                ? "bg-teal-500/10 text-teal-400"
                : "text-neutral-500 hover:text-white hover:bg-neutral-800"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {bookings.length === 0 ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-12 text-center">
          <p className="text-neutral-500">No bookings {filter !== "all" ? `with status "${filter}"` : "yet"}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden"
            >
              {/* Booking row */}
              <button
                onClick={() => setExpandedId(expandedId === booking.id ? null : booking.id)}
                className="w-full p-4 flex items-center gap-4 text-left hover:bg-neutral-800/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-bold text-white">{booking.booking_ref}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_COLORS[booking.status] || ""}`}>
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-400 truncate">
                    {booking.customer_name} · {booking.product?.name || "Unknown"}
                  </p>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-white">€{(booking.total_cents / 100).toFixed(2)}</p>
                  <p className="text-xs text-neutral-500">{booking.rental_days} days</p>
                </div>
                <div className="text-right hidden md:block">
                  <p className="text-xs text-neutral-500">{formatDate(booking.start_date)}</p>
                  <p className="text-xs text-neutral-500">→ {formatDate(booking.end_date)}</p>
                </div>
                <span className="text-neutral-600 text-sm">{expandedId === booking.id ? "▲" : "▼"}</span>
              </button>

              {/* Expanded details */}
              {expandedId === booking.id && (
                <div className="border-t border-neutral-800 p-4 bg-neutral-900/50">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">Customer</p>
                      <p className="text-sm text-white">{booking.customer_name}</p>
                      <p className="text-xs text-neutral-400">{booking.customer_email}</p>
                      {booking.customer_phone && (
                        <p className="text-xs text-neutral-400">{booking.customer_phone}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">Delivery</p>
                      <p className="text-sm text-neutral-300">{booking.delivery_address}</p>
                      {booking.delivery_notes && (
                        <p className="text-xs text-neutral-400 mt-1">Note: {booking.delivery_notes}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">Created</p>
                      <p className="text-sm text-neutral-300">{formatDate(booking.created_at)}</p>
                    </div>
                  </div>

                  {/* Status transition buttons */}
                  {TRANSITIONS[booking.status] && (
                    <div className="flex gap-2 pt-3 border-t border-neutral-800">
                      {TRANSITIONS[booking.status].map((action) => (
                        <button
                          key={action.next}
                          onClick={() => updateStatus(booking.id, action.next)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-colors ${action.color}`}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
