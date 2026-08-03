"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import BookingUnitAssignments from "@/components/admin/BookingUnitAssignments";
import BookingFulfillmentAmendments from "@/components/admin/BookingFulfillmentAmendments";
import { buildGoogleCalendarUrl, buildGoogleMapsUrl } from "@/lib/calendar-links";
import { requestBrowserNotificationPermission, showBookingPushNotification } from "@/lib/push-notifications";

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

interface BookingStatusEvent {
  id: string;
  from_status: string | null;
  to_status: string;
  source: string;
  created_at: string;
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
  quantity: number;
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
  status_events?: BookingStatusEvent[];
  fulfillment_amendments?: FulfillmentAmendment[];
  custom_quote_id?: string | null;
  custom_line_items?: Array<{ description: string; amountCents: number }>;
  custom_terms?: string | null;
  custom_internal_notes?: string | null;
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

const STATUSES = ["active", "all", "pending", "confirmed", "paid", "delivering", "returning", "completed", "cancelled", "refunded"];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [filter, setFilter] = useState("active");
  const [calendarView, setCalendarView] = useState<"list" | "calendar">("calendar");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());
  const [calendarSearch, setCalendarSearch] = useState("");
  const [selectedCalendarBookingId, setSelectedCalendarBookingId] = useState<string | null>(null);
  const [calendarDetailExpanded, setCalendarDetailExpanded] = useState(true);
  const [sendingDocumentId, setSendingDocumentId] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [updatingOpsTask, setUpdatingOpsTask] = useState<string | null>(null);
  const [bookingOpsTasksAvailable, setBookingOpsTasksAvailable] = useState(true);
  const [fulfillmentAmendmentsAvailable, setFulfillmentAmendmentsAvailable] = useState(true);
  const notifiedBookingIdsRef = useRef<Set<string>>(new Set());
  const initialBookingLoadRef = useRef(false);

  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/bookings?status=${filter}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      const nextBookings = data.bookings || [];
      setBookings(nextBookings);
      setBookingOpsTasksAvailable(data.capabilities?.bookingOpsTasks !== false);
      setFulfillmentAmendmentsAvailable(data.capabilities?.fulfillmentAmendments !== false);

      if (!initialBookingLoadRef.current) {
        initialBookingLoadRef.current = true;
        notifiedBookingIdsRef.current = new Set(nextBookings.map((booking: Booking) => booking.id));
      } else {
        const newlySeen = nextBookings.filter((booking: Booking) => {
          const shouldNotify = ["pending", "confirmed", "paid"].includes(booking.status);
          return shouldNotify && !notifiedBookingIdsRef.current.has(booking.id);
        });

        newlySeen.forEach((booking: Booking) => {
          notifiedBookingIdsRef.current.add(booking.id);
          showBookingPushNotification({
            title: "New booking activity",
            body: `${booking.customer_name || "A customer"} booked ${booking.product?.name || "an item"}`,
            url: "/admin/bookings",
          });
        });
      }
    } catch {
      setError("Failed to load bookings. Check Supabase connection.");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    void requestBrowserNotificationPermission();
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchBookings();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [fetchBookings]);

  useEffect(() => {
    setCalendarDetailExpanded(true);
  }, [selectedCalendarBookingId]);

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
      setNotice(
        data.statusChanged
          ? `Checklist saved. Booking advanced from ${data.previousBookingStatus} to ${data.bookingStatus}${data.emailSent ? " and the customer was notified" : ""}.`
          : "Checklist saved.",
      );
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

  const getBookingCalendarUrl = (booking: Booking) => {
    const start = booking.rental_start_at || booking.start_date;
    const end = booking.rental_end_at || booking.end_date;
    if (!start || !end) return null;

    const title = `${booking.product?.name || "Rental booking"} · ${booking.booking_ref}`;
    const description = [
      `Customer: ${booking.customer_name}`,
      `Booking ref: ${booking.booking_ref}`,
      `Delivery window: ${formatDateTime(start) || formatDate(start)}`,
      `Pickup window: ${formatDateTime(end) || formatDate(end)}`,
      "Reminders: 1 day before, 1 hour before",
      booking.delivery_address ? `Delivery address: ${booking.delivery_address}` : null,
      booking.collection_address ? `Collection address: ${booking.collection_address}` : null,
    ].filter(Boolean).join("\n");

    return buildGoogleCalendarUrl({
      title,
      description,
      startDateTime: start,
      endDateTime: end,
      location: booking.delivery_address || booking.collection_address || booking.pickup_location?.address || "Valencia, Spain",
    });
  };

  const getBookingMapsUrl = (booking: Booking) => {
    const query = booking.delivery_address || booking.collection_address || booking.pickup_location?.address || booking.delivery_zone?.name || "Valencia Spain";
    return buildGoogleMapsUrl(query);
  };

  const getBookingMapEmbedUrl = (booking: Booking) => {
    const query = booking.delivery_address || booking.collection_address || booking.pickup_location?.address || booking.delivery_zone?.name || "Valencia Spain";
    return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
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

  interface CalendarDay {
    date: Date;
    inMonth: boolean;
  }

  const calendarWeeks: CalendarDay[][] = (() => {
    const monthStart = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
    const monthEnd = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0);
    const leadingOffset = (monthStart.getDay() + 6) % 7;
    const gridStart = new Date(monthStart);
    gridStart.setDate(gridStart.getDate() - leadingOffset);
    const totalCells = Math.ceil((leadingOffset + monthEnd.getDate()) / 7) * 7;
    const days: CalendarDay[] = [];
    for (let i = 0; i < totalCells; i += 1) {
      const date = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i);
      days.push({ date, inMonth: date.getMonth() === calendarMonth.getMonth() });
    }
    const weeks: CalendarDay[][] = [];
    for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
    return weeks;
  })();

  const filteredBookings = bookings.filter((booking) => {
    const haystack = `${booking.booking_ref} ${booking.customer_name} ${booking.product?.name || ""}`.toLowerCase();
    return haystack.includes(calendarSearch.toLowerCase());
  });

  const monthLabel = calendarMonth.toLocaleDateString("en-GB", { month: "long", year: "numeric" });

  const getBookingAccent = (booking: Booking) => {
    const palette = ["#22d3ee", "#818cf8", "#f472b6", "#fb923c", "#34d399", "#facc15"];
    let hash = 0;
    for (const char of booking.id) {
      hash = (hash * 31 + char.charCodeAt(0)) % palette.length;
    }
    return palette[hash];
  };

  const getWeekLanes = (week: CalendarDay[]) => {
    const weekStart = week[0].date;
    const weekEnd = week[6].date;
    const overlapping = filteredBookings
      .map((booking) => {
        const startKey = booking.rental_start_at ? booking.rental_start_at.slice(0, 10) : booking.start_date?.slice(0, 10);
        const endKey = booking.rental_end_at ? booking.rental_end_at.slice(0, 10) : booking.end_date?.slice(0, 10);
        if (!startKey || !endKey) return null;
        const bookingStart = new Date(`${startKey}T00:00:00`);
        const bookingEnd = new Date(`${endKey}T00:00:00`);
        if (bookingEnd < weekStart || bookingStart > weekEnd) return null;
        const segmentStart = bookingStart < weekStart ? weekStart : bookingStart;
        const segmentEnd = bookingEnd > weekEnd ? weekEnd : bookingEnd;
        const startCol = Math.round((segmentStart.getTime() - weekStart.getTime()) / 86400000);
        const endCol = Math.round((segmentEnd.getTime() - weekStart.getTime()) / 86400000);
        return {
          booking,
          startCol,
          endCol,
          continuesBefore: bookingStart < weekStart,
          continuesAfter: bookingEnd > weekEnd,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => a.startCol - b.startCol || a.endCol - b.endCol);

    const laneEnds: number[] = [];
    return overlapping.map((item) => {
      let lane = laneEnds.findIndex((endCol) => endCol < item.startCol);
      if (lane === -1) {
        lane = laneEnds.length;
        laneEnds.push(item.endCol);
      } else {
        laneEnds[lane] = item.endCol;
      }
      return { ...item, lane };
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

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4">
        <div>
          <p className="text-sm font-semibold text-white">Booking calendar</p>
          <p className="text-xs text-neutral-500">Past and future bookings, with quick drill-down details.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={calendarSearch}
            onChange={(event) => setCalendarSearch(event.target.value)}
            placeholder="Search customer or item"
            className="rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white placeholder:text-neutral-600"
          />
          <button onClick={() => setCalendarView(calendarView === "list" ? "calendar" : "list")} className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-200">
            {calendarView === "list" ? "Show calendar" : "Show list"}
          </button>
        </div>
      </div>

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

      {calendarView === "calendar" ? (
        <div className="mb-6 space-y-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-white">{monthLabel}</p>
              <p className="text-xs text-neutral-500">Each booking receives its own color and can be opened for full details.</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))} className="rounded-lg border border-neutral-700 px-3 py-2 text-sm text-neutral-300">←</button>
              <button onClick={() => setCalendarMonth(new Date())} className="rounded-lg border border-neutral-700 px-3 py-2 text-sm text-neutral-300">Today</button>
              <button onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))} className="rounded-lg border border-neutral-700 px-3 py-2 text-sm text-neutral-300">→</button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((label) => (
              <div key={label} className="px-2 py-1 text-center text-[11px] font-semibold uppercase tracking-wide text-neutral-500">{label}</div>
            ))}
          </div>
          <div className="space-y-1">
            {calendarWeeks.map((week, weekIndex) => {
              const lanes = getWeekLanes(week);
              const laneCount = Math.max(1, lanes.length);
              const todayKey = new Date().toISOString().slice(0, 10);
              return (
                <div key={weekIndex} className="relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950/70">
                  <div className="grid grid-cols-7">
                    {week.map(({ date, inMonth }) => {
                      const dayKey = date.toISOString().slice(0, 10);
                      const isToday = dayKey === todayKey;
                      return (
                        <div key={dayKey} className={`border-r border-neutral-800/60 px-2 pt-1.5 text-[11px] font-semibold last:border-r-0 ${isToday ? "text-sky-300" : inMonth ? "text-white" : "text-neutral-700"}`}>
                          {isToday ? <span className="rounded-full bg-sky-500/10 px-1.5 py-0.5">{date.getDate()}</span> : date.getDate()}
                        </div>
                      );
                    })}
                  </div>
                  <div className="relative px-0.5 pb-1.5" style={{ minHeight: `${laneCount * 24 + 6}px` }}>
                    {lanes.map(({ booking, startCol, endCol, continuesBefore, continuesAfter, lane }) => {
                      const accent = getBookingAccent(booking);
                      const leftPercent = (startCol / 7) * 100;
                      const widthPercent = ((endCol - startCol + 1) / 7) * 100;
                      const leftRadius = continuesBefore ? "0px" : "9999px";
                      const rightRadius = continuesAfter ? "0px" : "9999px";
                      const selected = selectedCalendarBookingId === booking.id;
                      return (
                        <button
                          key={`${booking.id}-${weekIndex}`}
                          type="button"
                          onClick={() => setSelectedCalendarBookingId(selected ? null : booking.id)}
                          title={`${booking.product?.name || "Unknown item"} · ${booking.customer_name}`}
                          className={`absolute flex items-center truncate px-2 text-[11px] font-medium text-white shadow-sm transition-all hover:brightness-110 ${selected ? "ring-2 ring-white/80" : ""}`}
                          style={{
                            left: `calc(${leftPercent}% + 2px)`,
                            width: `calc(${widthPercent}% - 4px)`,
                            top: `${6 + lane * 24}px`,
                            height: "20px",
                            backgroundColor: accent,
                            borderRadius: `${leftRadius} ${rightRadius} ${rightRadius} ${leftRadius}`,
                          }}
                        >
                          {booking.product?.name || "Unknown item"} · {booking.customer_name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {(() => {
            const selectedBooking = filteredBookings.find((booking) => booking.id === selectedCalendarBookingId);
            if (!selectedBooking) return null;
            const accent = getBookingAccent(selectedBooking);
            const showDeliverySection = selectedBooking.fulfillment_mode !== "customer_pickup";
            const showCollectionSection = selectedBooking.fulfillment_mode === "delivery_and_collection";
            return (
              <div className="rounded-xl border border-neutral-800 bg-neutral-950/70 text-sm text-neutral-300">
                <button
                  type="button"
                  onClick={() => setCalendarDetailExpanded((value) => !value)}
                  className="flex w-full flex-wrap items-center justify-between gap-2 p-3 text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: accent }} />
                    <div>
                      <p className="font-semibold text-white">{selectedBooking.product?.name || "Unknown item"} · {selectedBooking.customer_name}</p>
                      <p className="text-xs text-neutral-500">{selectedBooking.booking_ref} · {selectedBooking.customer_email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right text-xs text-neutral-400">
                      <div className="font-semibold text-white">{formatMoney(selectedBooking.total_cents)}</div>
                      <div>{selectedBooking.quantity} × item</div>
                    </div>
                    <span className="text-neutral-600 text-sm">{calendarDetailExpanded ? "▲" : "▼"}</span>
                  </div>
                </button>

                {calendarDetailExpanded && (
                  <div className="border-t border-neutral-800 p-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <p className="text-xs text-neutral-500 mb-1">Customer</p>
                        <p className="text-sm text-white">{selectedBooking.customer_name}</p>
                        <p className="text-xs text-neutral-400">{selectedBooking.customer_email}</p>
                        {selectedBooking.customer_phone && (
                          <p className="text-xs text-neutral-400">{selectedBooking.customer_phone}</p>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 mb-1">Rental window</p>
                        <p className="text-sm text-white mb-1">Quantity: {selectedBooking.quantity || 1}</p>
                        <p className="text-sm text-neutral-300">{formatDateTime(selectedBooking.rental_start_at) || formatDate(selectedBooking.start_date)}</p>
                        <p className="text-sm text-neutral-300">→ {formatDateTime(selectedBooking.rental_end_at) || formatDate(selectedBooking.end_date)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 mb-1">Status</p>
                        <p className="text-sm font-semibold text-sky-300 capitalize">{selectedBooking.status}</p>
                        <p className="text-sm text-neutral-400">{selectedBooking.paid_at ? `Paid ${formatDate(selectedBooking.paid_at)}` : "Not marked paid yet"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 mb-1">Fulfillment</p>
                        <p className="text-sm text-white">{formatFulfillmentMode(selectedBooking.fulfillment_mode)}</p>
                        {selectedBooking.fulfillment_mode === "customer_pickup" ? (
                          <>
                            <p className="text-sm text-neutral-300">{selectedBooking.pickup_location?.name || "Pickup location not set"}</p>
                            {selectedBooking.pickup_location?.address && (
                              <p className="text-xs text-neutral-400">{selectedBooking.pickup_location.address}</p>
                            )}
                            {(selectedBooking.pickup_location?.customer_instructions || selectedBooking.pickup_location?.pickup_instructions) && (
                              <p className="text-xs text-neutral-400 mt-1">
                                Customer: {selectedBooking.pickup_location.customer_instructions || selectedBooking.pickup_location.pickup_instructions}
                              </p>
                            )}
                          </>
                        ) : (
                          <>
                            <p className="text-xs text-neutral-400 mt-1">Delivery zone: {selectedBooking.delivery_zone?.name || "Not set"}</p>
                            {selectedBooking.delivery_zone?.delivery_window && (
                              <p className="text-xs text-neutral-400">Delivery window: {selectedBooking.delivery_zone.delivery_window}</p>
                            )}
                            {showCollectionSection && (
                              <>
                                <p className="text-xs text-neutral-400">Collection zone: {selectedBooking.collection_zone?.name || "Not set"}</p>
                                {selectedBooking.collection_zone?.collection_window && (
                                  <p className="text-xs text-neutral-400">Collection window: {selectedBooking.collection_zone.collection_window}</p>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {showDeliverySection && (
                      <div className="mt-3 border-t border-neutral-800 pt-3">
                        <p className="text-xs text-neutral-500 mb-1">Delivery address</p>
                        <p className="text-sm text-neutral-300">{selectedBooking.delivery_address}</p>
                        {selectedBooking.delivery_notes && (
                          <p className="text-xs text-neutral-400 mt-1">Note: {selectedBooking.delivery_notes}</p>
                        )}
                        <div className="mt-3 flex flex-wrap gap-2">
                          {getBookingCalendarUrl(selectedBooking) && (
                            <a href={getBookingCalendarUrl(selectedBooking)!} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-teal-500/20 bg-teal-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-teal-300">
                              📅 Add to Google Calendar
                            </a>
                          )}
                          <a href={getBookingMapsUrl(selectedBooking)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-950 px-2.5 py-1.5 text-[11px] font-semibold text-neutral-200">
                            🧭 Open in Google Maps
                          </a>
                        </div>
                        <div className="mt-3 overflow-hidden rounded-xl border border-neutral-800">
                          <iframe title={`Map for ${selectedBooking.booking_ref}`} src={getBookingMapEmbedUrl(selectedBooking)} className="h-40 w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                        </div>
                      </div>
                    )}

                    {showCollectionSection && (
                      <div className="mt-3 border-t border-neutral-800 pt-3">
                        <p className="text-xs text-neutral-500 mb-1">Collection address</p>
                        <p className="text-sm text-neutral-300">{selectedBooking.collection_address || selectedBooking.delivery_address}</p>
                        {selectedBooking.collection_notes && (
                          <p className="text-xs text-neutral-400 mt-1">Note: {selectedBooking.collection_notes}</p>
                        )}
                        <div className="mt-3 flex flex-wrap gap-2">
                          <a href={getBookingMapsUrl(selectedBooking)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-950 px-2.5 py-1.5 text-[11px] font-semibold text-neutral-200">
                            🧭 Open in Google Maps
                          </a>
                        </div>
                      </div>
                    )}

                    {selectedBooking.fulfillment_mode === "customer_pickup" && selectedBooking.pickup_location?.address && (
                      <div className="mt-3 border-t border-neutral-800 pt-3">
                        <p className="text-xs text-neutral-500 mb-1">Pickup address</p>
                        <p className="text-sm text-neutral-300">{selectedBooking.pickup_location.address}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <a href={getBookingMapsUrl(selectedBooking)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-950 px-2.5 py-1.5 text-[11px] font-semibold text-neutral-200">
                            🧭 Open in Google Maps
                          </a>
                        </div>
                        <div className="mt-3 overflow-hidden rounded-xl border border-neutral-800">
                          <iframe title={`Map for ${selectedBooking.booking_ref}`} src={getBookingMapEmbedUrl(selectedBooking)} className="h-40 w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                        </div>
                      </div>
                    )}

                    <div className="mt-3 border-t border-neutral-800 pt-3">
                      <p className="text-xs text-neutral-500 mb-2">Payment</p>
                      <div className="space-y-1 text-xs max-w-xs">
                        <div className="flex justify-between gap-3">
                          <span className="text-neutral-500">Subtotal</span>
                          <span className="text-neutral-300">{formatMoney(selectedBooking.subtotal_cents)}</span>
                        </div>
                        <div className="flex justify-between gap-3">
                          <span className="text-neutral-500">Delivery</span>
                          <span className="text-neutral-300">{formatMoney(selectedBooking.delivery_fee_cents)}</span>
                        </div>
                        <div className="flex justify-between gap-3 font-semibold">
                          <span className="text-neutral-400">Amount paid</span>
                          <span className="text-white">{formatMoney(selectedBooking.total_cents)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      ) : null}


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
                    {booking.customer_name} · {booking.quantity > 1 ? `${booking.quantity} × ` : ""}{booking.product?.name || "Unknown"}
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
                      <p className="text-sm text-white mb-1">Quantity: {booking.quantity || 1}</p>
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
                        <div className="mt-3 flex flex-wrap gap-2">
                          {getBookingCalendarUrl(booking) && (
                            <a
                              href={getBookingCalendarUrl(booking)!}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-lg border border-teal-500/20 bg-teal-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-teal-300"
                            >
                              📅 Add to Google Calendar
                            </a>
                          )}
                          <a
                            href={getBookingMapsUrl(booking)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-950 px-2.5 py-1.5 text-[11px] font-semibold text-neutral-200"
                          >
                            🧭 Open in Google Maps
                          </a>
                        </div>
                        <div className="mt-3 overflow-hidden rounded-xl border border-neutral-800">
                          <iframe
                            title={`Map for ${booking.booking_ref}`}
                            src={getBookingMapEmbedUrl(booking)}
                            className="h-40 w-full"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                          />
                        </div>
                      </div>
                    )}
                    {booking.fulfillment_mode === "delivery_and_collection" && (
                      <div>
                        <p className="text-xs text-neutral-500 mb-1">Collection</p>
                        <p className="text-sm text-neutral-300">{booking.collection_address || booking.delivery_address}</p>
                        {booking.collection_notes && (
                          <p className="text-xs text-neutral-400 mt-1">Note: {booking.collection_notes}</p>
                        )}
                        <div className="mt-3 flex flex-wrap gap-2">
                          {getBookingCalendarUrl(booking) && (
                            <a
                              href={getBookingCalendarUrl(booking)!}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-lg border border-teal-500/20 bg-teal-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-teal-300"
                            >
                              📅 Add to Google Calendar
                            </a>
                          )}
                          <a
                            href={getBookingMapsUrl(booking)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-950 px-2.5 py-1.5 text-[11px] font-semibold text-neutral-200"
                          >
                            🧭 Open in Google Maps
                          </a>
                        </div>
                        <div className="mt-3 overflow-hidden rounded-xl border border-neutral-800">
                          <iframe
                            title={`Map for ${booking.booking_ref}`}
                            src={getBookingMapEmbedUrl(booking)}
                            className="h-40 w-full"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                          />
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">Created</p>
                      <p className="text-sm text-neutral-300">{formatDate(booking.created_at)}</p>
                    </div>
                  </div>

                  {booking.custom_quote_id && (
                    <div className="mb-4 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-amber-200">Custom booking arrangement</p>
                        <span className="text-xs font-mono text-amber-300/70">{shortId(booking.custom_quote_id)}</span>
                      </div>
                      {(booking.custom_line_items || []).length > 0 && (
                        <ul className="mt-3 space-y-1.5 text-sm text-amber-50">
                          {(booking.custom_line_items || []).map((line, index) => (
                            <li key={index} className="flex justify-between gap-4">
                              <span>{line.description}</span>
                              <span className="whitespace-nowrap">{formatMoney(line.amountCents)}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {booking.custom_terms && (
                        <p className="mt-3 whitespace-pre-wrap border-t border-amber-500/20 pt-3 text-sm leading-6 text-amber-100">
                          Customer conditions: {booking.custom_terms}
                        </p>
                      )}
                      {booking.custom_internal_notes && (
                        <p className="mt-3 whitespace-pre-wrap rounded-lg bg-neutral-950/50 p-3 text-sm leading-6 text-amber-200">
                          Staff preparation: {booking.custom_internal_notes}
                        </p>
                      )}
                    </div>
                  )}

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

                  <BookingUnitAssignments bookingId={booking.id} onChanged={fetchBookings} />

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
                    {booking.status_events && booking.status_events.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {booking.status_events.map((event) => (
                          <span
                            key={event.id}
                            className="rounded-full border border-neutral-800 bg-neutral-950 px-2.5 py-1 text-[11px] text-neutral-400"
                            title={`${event.source} · ${formatDateTime(event.created_at)}`}
                          >
                            {event.from_status ? `${event.from_status} → ` : ""}
                            <span className="text-neutral-200">{event.to_status}</span>
                          </span>
                        ))}
                      </div>
                    )}
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
