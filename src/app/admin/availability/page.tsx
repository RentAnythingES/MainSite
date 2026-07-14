"use client";

import { useState, useEffect, useCallback } from "react";

interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  emoji: string;
}

interface BlockedDate {
  id: string;
  blocked_date: string;
  reason: string | null;
  booking_id: string | null;
}

interface BookingInfo {
  booking_ref: string;
  customer_name: string;
  status: string;
}
interface ProductState { stock_total: number; stock_available: number }

function getMonthDays(year: number, month: number): Date[] {
  const days: Date[] = [];
  const d = new Date(year, month, 1);
  while (d.getMonth() === month) {
    days.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return days;
}

function formatMonth(year: number, month: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function todayDateString() {
  return new Date().toISOString().split("T")[0];
}

export default function AdminAvailabilityPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [bookings, setBookings] = useState<Record<string, BookingInfo>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [productState, setProductState] = useState<ProductState | null>(null);
  const [futureLegacyBookingDates, setFutureLegacyBookingDates] = useState(0);

  // Calendar state
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());

  // Selection state for blocking/unblocking
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  const [blockReason, setBlockReason] = useState<"manual" | "maintenance">("manual");
  const [rangeScope, setRangeScope] = useState<"selected" | "all">("selected");
  const [rangeStartDate, setRangeStartDate] = useState(todayDateString());
  const [rangeEndDate, setRangeEndDate] = useState(todayDateString());

  // Fetch products on mount
  useEffect(() => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((data) => {
        const prods = data.products || [];
        setProducts(prods);
        if (prods.length > 0) setSelectedProductId(prods[0].id);
      })
      .catch(() => setError("Failed to load products"))
      .finally(() => setLoading(false));
  }, []);

  // Fetch blocked dates when product or month changes
  const fetchAvailability = useCallback(async () => {
    if (!selectedProductId) return;
    try {
      const month = formatMonth(viewYear, viewMonth);
      const res = await fetch(
        `/api/admin/availability?product_id=${selectedProductId}&month=${month}`
      );
      const data = await res.json();
      setBlockedDates(data.blockedDates || []);
      setBookings(data.bookings || {});
      setProductState(data.productState || null);
      setFutureLegacyBookingDates(data.futureLegacyBookingDates || 0);
    } catch {
      setError("Failed to load availability");
    }
  }, [selectedProductId, viewYear, viewMonth]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void fetchAvailability();
      setSelectedDates(new Set());
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [fetchAvailability]);

  // Navigation
  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const goToToday = () => {
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
  };

  // Date click handler
  const toggleDate = (dateStr: string) => {
    const next = new Set(selectedDates);
    if (next.has(dateStr)) {
      next.delete(dateStr);
    } else {
      next.add(dateStr);
    }
    setSelectedDates(next);
  };

  // Block selected dates
  const blockDates = async () => {
    if (selectedDates.size === 0) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/admin/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProductId,
          dates: Array.from(selectedDates),
          reason: blockReason,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to block dates");
      setSuccess(`Blocked ${data.blocked || selectedDates.size} date(s)`);
      setSelectedDates(new Set());
      await fetchAvailability();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to block dates");
    } finally {
      setSaving(false);
    }
  };

  // Unblock selected dates (manual only)
  const unblockDates = async () => {
    if (selectedDates.size === 0) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/admin/availability", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProductId,
          dates: Array.from(selectedDates),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to unblock dates");
      setSuccess(`Unblocked ${data.dateCount || selectedDates.size} date(s)`);
      setSelectedDates(new Set());
      await fetchAvailability();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to unblock dates");
    } finally {
      setSaving(false);
    }
  };

  const applyRangeAction = async (action: "block" | "unblock") => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/admin/availability", {
        method: action === "block" ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: rangeScope === "all" ? "all" : selectedProductId,
          startDate: rangeStartDate,
          endDate: rangeEndDate,
          reason: blockReason,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Failed to ${action} date range`);

      const productLabel = data.productCount === 1 ? "product" : "products";
      const actionLabel = action === "block" ? "Blocked" : "Unblocked";
      setSuccess(`${actionLabel} ${data.dateCount} date(s) across ${data.productCount} ${productLabel}`);
      await fetchAvailability();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${action} date range`);
    } finally {
      setSaving(false);
    }
  };

  const restoreOnlineAvailability = async () => {
    if (!confirm("Restore this product for online booking? This clears its legacy booking blocks only after checking there are no active bookings or holds.")) return;
    setSaving(true); setError(""); setSuccess("");
    try { const response = await fetch("/api/admin/availability", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "restore_online_availability", productId: selectedProductId }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error || "Could not restore availability"); setSuccess(`Online availability restored. Removed ${data.deletedLegacyDates} legacy date blocks.`); await fetchAvailability(); }
    catch (err) { setError(err instanceof Error ? err.message : "Could not restore availability"); }
    finally { setSaving(false); }
  };

  // Build blocked dates lookup
  const blockedMap = new Map<string, BlockedDate>();
  blockedDates.forEach((bd) => blockedMap.set(bd.blocked_date, bd));

  // Calendar rendering
  const days = getMonthDays(viewYear, viewMonth);
  // Pad start to align with Monday
  const firstDayOfWeek = (days[0].getDay() + 6) % 7; // 0=Mon
  const padBefore = Array.from({ length: firstDayOfWeek }, () => null);

  const monthLabel = new Date(viewYear, viewMonth).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const today = formatDate(new Date());

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-neutral-500">Loading products...</div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Availability</h1>
        <p className="text-neutral-500 text-sm mt-1">
          View and manage product availability
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400 mb-4">
          {error}
          <button onClick={() => setError("")} className="ml-2 text-red-300 hover:text-white">✕</button>
        </div>
      )}
      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-sm text-emerald-400 mb-4">
          {success}
          <button onClick={() => setSuccess("")} className="ml-2 text-emerald-300 hover:text-white">✕</button>
        </div>
      )}

      {/* Product selector */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 mb-4">
        <label className="text-xs font-medium text-neutral-400 block mb-2">
          Select Product
        </label>
        <select
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30"
        >
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.emoji} {p.name} — {p.brand}
            </option>
          ))}
        </select>
        {productState && <div className="mt-4 flex flex-col gap-3 rounded-lg border border-neutral-800 bg-neutral-950 p-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-medium text-white">Online stock: {productState.stock_available}/{productState.stock_total}</p><p className="text-xs text-neutral-500">{futureLegacyBookingDates} future legacy booking blocks</p></div>{(productState.stock_available === 0 || futureLegacyBookingDates > 0) && <button type="button" disabled={saving} onClick={restoreOnlineAvailability} className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50">Restore online availability</button>}</div>}
      </div>

      {/* Range tools */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 mb-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="flex-1">
            <label className="text-xs font-medium text-neutral-400 block mb-2">
              Quick range target
            </label>
            <select
              value={rangeScope}
              onChange={(e) => setRangeScope(e.target.value as "selected" | "all")}
              className="w-full px-3 py-2.5 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30"
            >
              <option value="selected">Selected product only</option>
              <option value="all">All active products</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-neutral-400 block mb-2">
              Start date
            </label>
            <input
              type="date"
              value={rangeStartDate}
              onChange={(e) => setRangeStartDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-neutral-400 block mb-2">
              End date
            </label>
            <input
              type="date"
              value={rangeEndDate}
              onChange={(e) => setRangeEndDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => applyRangeAction("block")}
              disabled={saving}
              className="px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors disabled:opacity-50"
            >
              Block Range
            </button>
            <button
              onClick={() => applyRangeAction("unblock")}
              disabled={saving}
              className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors disabled:opacity-50"
            >
              Unblock Range
            </button>
          </div>
        </div>
        {rangeScope === "all" && (
          <p className="mt-3 text-xs text-amber-300">
            All active products means every live item. Booking-linked blocks are never removed by unblock.
          </p>
        )}
      </div>

      {/* Calendar */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 mb-4">
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="px-3 py-1.5 rounded-lg text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            ← Prev
          </button>
          <div className="text-center">
            <h2 className="text-lg font-semibold text-white">{monthLabel}</h2>
            <button
              onClick={goToToday}
              className="text-xs text-teal-400 hover:text-teal-300"
            >
              Today
            </button>
          </div>
          <button
            onClick={nextMonth}
            className="px-3 py-1.5 rounded-lg text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            Next →
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {WEEKDAYS.map((d) => (
            <div key={d} className="text-center text-xs font-medium text-neutral-500 py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {padBefore.map((_, i) => (
            <div key={`pad-${i}`} className="h-16" />
          ))}
          {days.map((day) => {
            const dateStr = formatDate(day);
            const blocked = blockedMap.get(dateStr);
            const isSelected = selectedDates.has(dateStr);
            const isToday = dateStr === today;
            const isPast = dateStr < today;

            // Determine cell state
            let cellClass = "bg-neutral-800/50 hover:bg-neutral-700 cursor-pointer"; // available
            let label = "";
            let labelClass = "text-neutral-600";

            if (blocked) {
              if (blocked.booking_id) {
                cellClass = "bg-red-500/15 border-red-500/30 cursor-pointer";
                const bk = bookings[blocked.booking_id];
                label = bk ? bk.booking_ref : "Booked";
                labelClass = "text-red-400";
              } else if (blocked.reason === "maintenance") {
                cellClass = "bg-amber-500/15 border-amber-500/30 cursor-pointer";
                label = "Maintenance";
                labelClass = "text-amber-400";
              } else {
                cellClass = "bg-purple-500/15 border-purple-500/30 cursor-pointer";
                label = "Blocked";
                labelClass = "text-purple-400";
              }
            }

            if (isPast) {
              cellClass = "bg-neutral-900/50 opacity-40 cursor-default";
            }

            if (isSelected) {
              cellClass += " ring-2 ring-teal-400";
            }

            return (
              <button
                key={dateStr}
                onClick={() => !isPast && toggleDate(dateStr)}
                disabled={isPast}
                className={`h-16 rounded-lg border border-neutral-700/50 p-1.5 text-left transition-all ${cellClass}`}
              >
                <span className={`text-sm font-medium ${isToday ? "text-teal-400" : "text-neutral-300"}`}>
                  {day.getDate()}
                </span>
                {label && (
                  <p className={`text-[10px] leading-tight mt-0.5 truncate ${labelClass}`}>
                    {label}
                  </p>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 pt-3 border-t border-neutral-800">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-neutral-800/50 border border-neutral-700/50" />
            <span className="text-xs text-neutral-500">Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-red-500/15 border border-red-500/30" />
            <span className="text-xs text-neutral-500">Booked</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-purple-500/15 border border-purple-500/30" />
            <span className="text-xs text-neutral-500">Manual block</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-500/15 border border-amber-500/30" />
            <span className="text-xs text-neutral-500">Maintenance</span>
          </div>
        </div>
      </div>

      {/* Actions panel */}
      {selectedDates.size > 0 && (
        <div className="bg-neutral-900 border border-teal-500/30 rounded-xl p-4 sticky bottom-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex-1">
              <p className="text-sm font-medium text-white">
                {selectedDates.size} date{selectedDates.size > 1 ? "s" : ""} selected
              </p>
              <p className="text-xs text-neutral-400 mt-0.5">
                {Array.from(selectedDates).sort().slice(0, 3).join(", ")}
                {selectedDates.size > 3 && ` +${selectedDates.size - 3} more`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value as "manual" | "maintenance")}
                className="px-2 py-1.5 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-xs"
              >
                <option value="manual">Manual block</option>
                <option value="maintenance">Maintenance</option>
              </select>

              <button
                onClick={blockDates}
                disabled={saving}
                className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors disabled:opacity-50"
              >
                {saving ? "..." : "Block"}
              </button>
              <button
                onClick={unblockDates}
                disabled={saving}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors disabled:opacity-50"
              >
                {saving ? "..." : "Unblock"}
              </button>
              <button
                onClick={() => setSelectedDates(new Set())}
                className="px-3 py-1.5 rounded-lg text-neutral-400 hover:text-white text-xs transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
