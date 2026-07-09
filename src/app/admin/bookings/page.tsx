"use client";

import { useState, useEffect, useCallback } from "react";

interface BookingProduct {
  id: string;
  name: string;
  slug: string;
  brand: string;
}

interface BookingLocation {
  id: string;
  name: string;
  slug: string;
  address?: string;
  city?: string;
  pickup_instructions?: string | null;
  customer_instructions?: string | null;
  internal_notes?: string | null;
  lead_time_hours?: number | null;
  handoff_contact?: string | null;
  delivery_window?: string | null;
  collection_window?: string | null;
}

interface InventoryBlock {
  id: string;
  starts_at: string;
  ends_at: string;
  quantity: number;
  reason: string | null;
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
  rental_start_at?: string | null;
  rental_end_at?: string | null;
  timezone?: string | null;
  fulfillment_mode?: "customer_pickup" | "delivery_only" | "delivery_and_collection" | null;
  pickup_location?: BookingLocation | null;
  delivery_zone?: BookingLocation | null;
  collection_zone?: BookingLocation | null;
  collection_address?: string | null;
  collection_notes?: string | null;
  collection_fee_cents?: number | null;
  delivery_fee_cents?: number | null;
  subtotal_cents?: number | null;
  per_day_cents?: number | null;
  stripe_checkout_session_id?: string | null;
  stripe_payment_intent_id?: string | null;
  stripe_deposit_intent_id?: string | null;
  paid_at?: string | null;
  cancelled_at?: string | null;
  completed_at?: string | null;
  updated_at?: string | null;
  inventory_blocks?: InventoryBlock[];
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
    { label: "Cancel", next: "cancelled", color: "bg-red-600/20 hover:bg-red-600/40 text-red-400" },
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

const STATUSES = ["all", "pending", "confirmed", "paid", "delivering", "active", "returning", "completed", "cancelled", "refunded"];

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

  const formatDateTime = (d?: string | null) =>
    d
      ? new Date(d).toLocaleString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : null;

  const formatMoney = (cents?: number | null) => `€${((cents || 0) / 100).toFixed(2)}`;

  const formatFulfillmentMode = (mode?: string | null) => {
    if (mode === "customer_pickup") return "Customer pickup";
    if (mode === "delivery_only") return "Delivery only";
    if (mode === "delivery_and_collection") return "Delivery and collection";
    return "Legacy delivery";
  };

  const shortId = (value?: string | null) => {
    if (!value) return "Not set";
    if (value.length <= 18) return value;
    return `${value.slice(0, 10)}…${value.slice(-6)}`;
  };

  const buildTimeline = (booking: Booking) => [
    { label: "Created", value: booking.created_at },
    { label: "Paid", value: booking.paid_at },
    { label: "Cancelled", value: booking.cancelled_at },
    { label: "Completed", value: booking.completed_at },
    { label: "Updated", value: booking.updated_at },
  ].filter((item) => Boolean(item.value));

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
                  <p className="text-xs text-neutral-500">{formatDateTime(booking.rental_start_at) || formatDate(booking.start_date)}</p>
                  <p className="text-xs text-neutral-500">&rarr; {formatDateTime(booking.rental_end_at) || formatDate(booking.end_date)}</p>
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
                      <p className="text-xs text-neutral-500 mb-1">Rental Window</p>
                      <p className="text-sm text-neutral-300">
                        {formatDateTime(booking.rental_start_at) || formatDate(booking.start_date)}
                      </p>
                      <p className="text-sm text-neutral-300">
                        → {formatDateTime(booking.rental_end_at) || formatDate(booking.end_date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">Fulfillment</p>
                      <p className="text-sm text-white">{formatFulfillmentMode(booking.fulfillment_mode)}</p>
                      {booking.fulfillment_mode === "customer_pickup" ? (
                        <>
                          <p className="text-sm text-neutral-300">{booking.pickup_location?.name || "Pickup location not set"}</p>
                          {booking.pickup_location?.address && (
                            <p className="text-xs text-neutral-400">{booking.pickup_location.address}</p>
                          )}
                          {(booking.pickup_location?.customer_instructions || booking.pickup_location?.pickup_instructions) && (
                            <p className="text-xs text-neutral-400 mt-1">
                              Customer: {booking.pickup_location.customer_instructions || booking.pickup_location.pickup_instructions}
                            </p>
                          )}
                          {booking.pickup_location?.internal_notes && (
                            <p className="text-xs text-amber-300 mt-1">
                              Internal: {booking.pickup_location.internal_notes}
                            </p>
                          )}
                        </>
                      ) : (
                        <>
                          <p className="text-xs text-neutral-400 mt-1">
                            Delivery zone: {booking.delivery_zone?.name || "Not set"}
                          </p>
                          {booking.delivery_zone?.delivery_window && (
                            <p className="text-xs text-neutral-400">
                              Delivery window: {booking.delivery_zone.delivery_window}
                            </p>
                          )}
                          {booking.fulfillment_mode === "delivery_and_collection" && (
                            <>
                              <p className="text-xs text-neutral-400">
                                Collection zone: {booking.collection_zone?.name || "Not set"}
                              </p>
                              {booking.collection_zone?.collection_window && (
                                <p className="text-xs text-neutral-400">
                                  Collection window: {booking.collection_zone.collection_window}
                                </p>
                              )}
                            </>
                          )}
                          {(booking.delivery_zone?.customer_instructions || booking.delivery_zone?.internal_notes) && (
                            <p className="text-xs text-neutral-400 mt-1">
                              Customer: {booking.delivery_zone.customer_instructions || "Not set"}
                            </p>
                          )}
                          {booking.delivery_zone?.internal_notes && (
                            <p className="text-xs text-amber-300 mt-1">
                              Internal: {booking.delivery_zone.internal_notes}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                    {booking.fulfillment_mode !== "customer_pickup" && (
                      <div>
                        <p className="text-xs text-neutral-500 mb-1">Delivery</p>
                        <p className="text-sm text-neutral-300">{booking.delivery_address}</p>
                        {booking.delivery_notes && (
                          <p className="text-xs text-neutral-400 mt-1">Note: {booking.delivery_notes}</p>
                        )}
                      </div>
                    )}
                    {booking.fulfillment_mode === "delivery_and_collection" && (
                      <div>
                        <p className="text-xs text-neutral-500 mb-1">Collection</p>
                        <p className="text-sm text-neutral-300">{booking.collection_address || booking.delivery_address}</p>
                        {booking.collection_notes && (
                          <p className="text-xs text-neutral-400 mt-1">Note: {booking.collection_notes}</p>
                        )}
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">Created</p>
                      <p className="text-sm text-neutral-300">{formatDate(booking.created_at)}</p>
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-4 mb-4 pt-4 border-t border-neutral-800">
                    <div>
                      <p className="text-xs text-neutral-500 mb-2">Payment</p>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between gap-3">
                          <span className="text-neutral-500">Subtotal</span>
                          <span className="text-neutral-300">{formatMoney(booking.subtotal_cents)}</span>
                        </div>
                        <div className="flex justify-between gap-3">
                          <span className="text-neutral-500">Delivery</span>
                          <span className="text-neutral-300">{formatMoney(booking.delivery_fee_cents)}</span>
                        </div>
                        <div className="flex justify-between gap-3 font-semibold">
                          <span className="text-neutral-400">Total</span>
                          <span className="text-white">{formatMoney(booking.total_cents)}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-neutral-500 mb-2">Stripe</p>
                      <div className="space-y-1 text-xs font-mono">
                        <p className="text-neutral-400">Checkout: <span className="text-neutral-300">{shortId(booking.stripe_checkout_session_id)}</span></p>
                        <p className="text-neutral-400">Payment: <span className="text-neutral-300">{shortId(booking.stripe_payment_intent_id)}</span></p>
                        <p className="text-neutral-400">Deposit: <span className="text-neutral-300">{shortId(booking.stripe_deposit_intent_id)}</span></p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-neutral-500 mb-2">Inventory</p>
                      {booking.inventory_blocks && booking.inventory_blocks.length > 0 ? (
                        <div className="space-y-1">
                          {booking.inventory_blocks.map((block) => (
                            <div key={block.id} className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2 py-1.5">
                              <p className="text-xs font-semibold text-emerald-300">
                                Held: {block.quantity} unit{block.quantity === 1 ? "" : "s"}
                              </p>
                              <p className="text-[11px] text-emerald-200/80">
                                {formatDateTime(block.starts_at)} → {formatDateTime(block.ends_at)}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-neutral-400">
                          {["cancelled", "refunded", "completed"].includes(booking.status)
                            ? "Released"
                            : "No active inventory block found"}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mb-4 pt-4 border-t border-neutral-800">
                    <p className="text-xs text-neutral-500 mb-2">Timeline</p>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-2">
                      {buildTimeline(booking).map((item) => (
                        <div key={item.label} className="rounded-lg bg-neutral-950 border border-neutral-800 p-2">
                          <p className="text-[11px] uppercase tracking-wide text-neutral-500">{item.label}</p>
                          <p className="text-xs text-neutral-300 mt-1">{formatDateTime(item.value)}</p>
                        </div>
                      ))}
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
