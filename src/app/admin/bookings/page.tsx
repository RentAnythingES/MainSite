"use client";

import { useState, useEffect, useCallback } from "react";
import BookingUnitAssignments from "@/components/admin/BookingUnitAssignments";
import BookingFulfillmentAmendments from "@/components/admin/BookingFulfillmentAmendments";

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

interface PaymentEvent {
  id: string;
  event_type: string;
  status: string;
  provider: string;
  currency: string;
  amount_cents: number;
  stripe_payment_intent_id?: string | null;
  stripe_refund_id?: string | null;
  provider_event_id?: string | null;
  description?: string | null;
  occurred_at: string;
}

interface BookingDocument {
  id: string;
  document_type: string;
  status: string;
  document_number?: string | null;
  total_cents: number;
  currency: string;
  pdf_url?: string | null;
  issued_at: string;
}

interface BookingOpsTask {
  id?: string;
  booking_id: string;
  task_key: string;
  label: string;
  sort_order: number;
  is_done: boolean;
  completed_at?: string | null;
  note?: string | null;
}

interface FulfillmentAmendment {
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
  payment_events?: PaymentEvent[];
  documents?: BookingDocument[];
  ops_tasks?: BookingOpsTask[];
  fulfillment_amendments?: FulfillmentAmendment[];
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
    { label: "Mark Paid Manually", next: "paid", color: "bg-emerald-600 hover:bg-emerald-500" },
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
  const [notice, setNotice] = useState("");
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sendingDocumentId, setSendingDocumentId] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [updatingOpsTask, setUpdatingOpsTask] = useState<string | null>(null);
  const [bookingOpsTasksAvailable, setBookingOpsTasksAvailable] = useState(true);
  const [fulfillmentAmendmentsAvailable, setFulfillmentAmendmentsAvailable] = useState(true);

  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/bookings?status=${filter}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setBookings(data.bookings || []);
      setBookingOpsTasksAvailable(data.capabilities?.bookingOpsTasks !== false);
      setFulfillmentAmendmentsAvailable(data.capabilities?.fulfillmentAmendments !== false);
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
      setNotice("");
      setUpdatingStatus(`${bookingId}:${newStatus}`);
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Update failed");
      }
      setNotice(data.emailSent === false
        ? "Booking updated. Customer email was not sent — check Resend configuration."
        : "Booking updated and customer email sent."
      );
      await fetchBookings();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update booking");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const sendDocumentEmail = async (bookingId: string, documentId: string) => {
    try {
      setError("");
      setNotice("");
      setSendingDocumentId(documentId);
      const res = await fetch(`/api/admin/bookings/${bookingId}/documents/${documentId}/email`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to email document");
      }
      setNotice("Document email sent to the customer.");
      await fetchBookings();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to email document");
    } finally {
      setSendingDocumentId(null);
    }
  };

  const updateOpsTask = async (bookingId: string, taskKey: string, isDone: boolean) => {
    try {
      setError("");
      setNotice("");
      setUpdatingOpsTask(`${bookingId}:${taskKey}`);
      const res = await fetch(`/api/admin/bookings/${bookingId}/ops-tasks`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskKey, isDone }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update checklist");
      }
      await fetchBookings();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update checklist");
    } finally {
      setUpdatingOpsTask(null);
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

  const formatEventType = (type: string) =>
    type
      .split("_")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

  const formatDocumentType = (type: string) => {
    if (type === "refund_receipt") return "Refund receipt";
    if (type === "rental_agreement") return "Rental agreement";
    return "Invoice";
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

  const getTransitions = (booking: Booking) => {
    const actions = TRANSITIONS[booking.status] || [];
    return actions.map((action) => {
      if (action.next === "delivering") {
        return {
          ...action,
          label: booking.fulfillment_mode === "customer_pickup" ? "Ready for Pickup" : "Out for Delivery",
        };
      }
      if (action.next === "active") {
        return {
          ...action,
          label: booking.fulfillment_mode === "customer_pickup" ? "Picked Up" : "Delivered",
        };
      }
      if (action.next === "returning") {
        return {
          ...action,
          label: booking.fulfillment_mode === "customer_pickup" ? "Return Due" : "Schedule Collection",
        };
      }
      return action;
    });
  };

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

      {notice && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-sm text-emerald-300 mb-4">
          {notice}
          <button onClick={() => setNotice("")} className="ml-2 text-emerald-200 hover:text-white">×</button>
        </div>
      )}

      {!bookingOpsTasksAvailable && (
        <div className="mb-4 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-sm text-amber-200">
          Operations checklist is temporarily unavailable because its database migration has not been applied. Booking status, payments, documents, inventory and customer emails still work normally.
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

                  <BookingFulfillmentAmendments
                    bookingId={booking.id}
                    bookingStatus={booking.status}
                    fulfillmentMode={booking.fulfillment_mode}
                    amendments={booking.fulfillment_amendments || []}
                    available={fulfillmentAmendmentsAvailable}
                    onChanged={fetchBookings}
                  />

                  <BookingUnitAssignments bookingId={booking.id} />

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

                  <div className="mb-4 pt-4 border-t border-neutral-800">
                    <p className="text-xs text-neutral-500 mb-2">Ops Checklist</p>
                    {booking.ops_tasks && booking.ops_tasks.length > 0 ? (
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {[...booking.ops_tasks]
                          .sort((a, b) => a.sort_order - b.sort_order)
                          .map((task) => {
                            const taskUpdating = updatingOpsTask === `${booking.id}:${task.task_key}`;
                            return (
                              <label
                                key={task.task_key}
                                className={`flex items-start gap-3 rounded-lg border p-3 transition-colors ${
                                  task.is_done
                                    ? "border-emerald-500/20 bg-emerald-500/10"
                                    : "border-neutral-800 bg-neutral-950"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={task.is_done}
                                  disabled={taskUpdating || !bookingOpsTasksAvailable}
                                  onChange={(event) => updateOpsTask(booking.id, task.task_key, event.target.checked)}
                                  className="mt-0.5 h-4 w-4 rounded border-neutral-700 bg-neutral-900 text-teal-500 focus:ring-teal-500"
                                />
                                <span>
                                  <span className={`block text-sm font-medium ${task.is_done ? "text-emerald-300" : "text-neutral-200"}`}>
                                    {task.label}
                                  </span>
                                  <span className="block text-xs text-neutral-500">
                                    {taskUpdating
                                      ? "Saving..."
                                      : !bookingOpsTasksAvailable
                                        ? "Unavailable until database migration is applied"
                                        : task.completed_at
                                        ? `Done ${formatDateTime(task.completed_at)}`
                                        : "Pending"}
                                  </span>
                                </span>
                              </label>
                            );
                          })}
                      </div>
                    ) : (
                      <p className="text-xs text-neutral-400">
                        Checklist will appear after the latest migration is applied.
                      </p>
                    )}
                  </div>

                  <div className="mb-4 pt-4 border-t border-neutral-800">
                    <p className="text-xs text-neutral-500 mb-2">Finance Ledger</p>
                    {booking.payment_events && booking.payment_events.length > 0 ? (
                      <div className="space-y-2">
                        {booking.payment_events.map((event) => (
                          <div key={event.id} className="rounded-lg bg-neutral-950 border border-neutral-800 p-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div>
                                <p className="text-sm font-semibold text-white">
                                  {formatEventType(event.event_type)}
                                  <span className={`ml-2 text-[11px] px-2 py-0.5 rounded-full capitalize ${
                                    event.status === "succeeded"
                                      ? "bg-emerald-500/10 text-emerald-300"
                                      : event.status === "failed"
                                        ? "bg-red-500/10 text-red-300"
                                        : "bg-amber-500/10 text-amber-300"
                                  }`}>
                                    {event.status}
                                  </span>
                                </p>
                                <p className="text-xs text-neutral-500">
                                  {event.description || event.provider} · {formatDateTime(event.occurred_at)}
                                </p>
                              </div>
                              <p className={`text-sm font-semibold ${
                                event.event_type === "refund" ? "text-red-300" : "text-emerald-300"
                              }`}>
                                {event.event_type === "refund" ? "-" : "+"}{formatMoney(event.amount_cents)}
                              </p>
                            </div>
                            <div className="mt-2 grid sm:grid-cols-3 gap-2 text-[11px] font-mono text-neutral-500">
                              <p>Payment: <span className="text-neutral-300">{shortId(event.stripe_payment_intent_id)}</span></p>
                              <p>Refund: <span className="text-neutral-300">{shortId(event.stripe_refund_id)}</span></p>
                              <p>Provider: <span className="text-neutral-300">{shortId(event.provider_event_id)}</span></p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-neutral-400">
                        No payment ledger events yet. Apply the latest migration to start recording new payments and refunds.
                      </p>
                    )}
                  </div>

                  <div className="mb-4 pt-4 border-t border-neutral-800">
                    <p className="text-xs text-neutral-500 mb-2">Documents</p>
                    {booking.documents && booking.documents.length > 0 ? (
                      <div className="grid sm:grid-cols-2 gap-2">
                        {booking.documents.map((document) => (
                          <div key={document.id} className="rounded-lg bg-neutral-950 border border-neutral-800 p-3">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold text-white">
                                  {formatDocumentType(document.document_type)}
                                </p>
                                <p className="text-xs font-mono text-neutral-300">
                                  {document.document_number || "Number pending"}
                                </p>
                                <p className="text-xs text-neutral-500">
                                  Issued {formatDateTime(document.issued_at)}
                                </p>
                              </div>
                              <span className={`text-[11px] px-2 py-0.5 rounded-full capitalize ${
                                document.status === "issued"
                                  ? "bg-emerald-500/10 text-emerald-300"
                                  : document.status === "void"
                                    ? "bg-red-500/10 text-red-300"
                                    : "bg-amber-500/10 text-amber-300"
                              }`}>
                                {document.status}
                              </span>
                            </div>
                            <div className="mt-2 flex items-center justify-between gap-3 text-xs">
                              <span className="text-neutral-500">Amount</span>
                              <span className="text-neutral-300">{formatMoney(document.total_cents)}</span>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2">
                              <a
                                href={`/api/admin/bookings/${booking.id}/documents/${document.id}/pdf`}
                                className="inline-flex rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-500"
                              >
                                Download PDF
                              </a>
                              <button
                                type="button"
                                onClick={() => sendDocumentEmail(booking.id, document.id)}
                                disabled={sendingDocumentId === document.id}
                                className="inline-flex rounded-lg border border-neutral-700 px-3 py-1.5 text-xs font-semibold text-neutral-200 hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {sendingDocumentId === document.id ? "Sending..." : "Email PDF"}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-neutral-400">
                        No documents yet. New payments create invoices; new refunds create refund receipts.
                      </p>
                    )}
                  </div>

                  {/* Status transition buttons */}
                  {getTransitions(booking).length > 0 && (
                    <div className="flex gap-2 pt-3 border-t border-neutral-800">
                      {getTransitions(booking).map((action) => (
                        <button
                          key={action.next}
                          onClick={() => updateStatus(booking.id, action.next)}
                          disabled={updatingStatus === `${booking.id}:${action.next}`}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-colors ${action.color}`}
                        >
                          {updatingStatus === `${booking.id}:${action.next}` ? "Updating..." : action.label}
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
