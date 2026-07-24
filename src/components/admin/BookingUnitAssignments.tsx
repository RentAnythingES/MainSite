"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

type InventoryUnit = {
  id: string;
  asset_code: string;
  status: string;
  condition: string;
  location: string | null;
};

type Assignment = {
  id: string;
  status: "assigned" | "handed_over" | "returned" | "released";
  assigned_at: string;
  inventory_units: InventoryUnit | null;
};

export default function BookingUnitAssignments({
  bookingId,
  onChanged,
}: {
  bookingId: string;
  onChanged?: () => void | Promise<void>;
}) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [units, setUnits] = useState<InventoryUnit[]>([]);
  const [selectedUnitId, setSelectedUnitId] = useState("");
  const [requiredQuantity, setRequiredQuantity] = useState(1);
  const [productName, setProductName] = useState("this product");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    const response = await fetch(`/api/admin/bookings/${bookingId}/inventory-units`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to load physical inventory");
    setAssignments(data.assignments || []);
    setUnits(data.units || []);
    setRequiredQuantity(data.requiredQuantity || 1);
    setProductName(data.productName || "this product");
  }, [bookingId]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void load().catch((loadError) =>
        setError(loadError instanceof Error ? loadError.message : "Failed to load physical inventory"),
      );
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [load]);

  const availableUnits = useMemo(() => units.filter((unit) => unit.status === "available"), [units]);
  const activeAssignments = useMemo(
    () => assignments.filter((assignment) => ["assigned", "handed_over"].includes(assignment.status)),
    [assignments],
  );

  const assign = async () => {
    if (!selectedUnitId) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/inventory-units`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unitId: selectedUnitId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to assign unit");
      setSelectedUnitId("");
      await load();
      setNotice("Physical unit assigned.");
    } catch (assignError) {
      setError(assignError instanceof Error ? assignError.message : "Failed to assign unit");
    } finally {
      setBusy(false);
    }
  };

  const transition = async (assignmentId: string, action: "hand_over" | "return" | "release") => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/inventory-units`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignmentId, action }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to update unit");
      await load();
      await onChanged?.();
      setNotice(
        data.statusChanged
          ? `Unit updated. Booking advanced from ${data.previousBookingStatus} to ${data.bookingStatus}${data.emailSent ? " and the customer was notified" : ""}.`
          : "Physical unit updated.",
      );
    } catch (transitionError) {
      setError(transitionError instanceof Error ? transitionError.message : "Failed to update unit");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mb-4 border-t border-neutral-800 pt-4">
      <div className="mb-3 flex flex-wrap items-end gap-2">
        <div className="min-w-56 flex-1">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-neutral-500">
              Physical Inventory · {activeAssignments.length}/{requiredQuantity} assigned
            </p>
            <Link href="/admin/inventory" className="text-xs font-medium text-teal-400 hover:text-teal-300">
              Review inventory
            </Link>
          </div>
          <select value={selectedUnitId} onChange={(event) => setSelectedUnitId(event.target.value)} disabled={busy || availableUnits.length === 0 || activeAssignments.length >= requiredQuantity} className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-200">
            <option value="">
              {activeAssignments.length >= requiredQuantity
                ? "Required units already assigned"
                : availableUnits.length
                  ? "Select an available unit"
                  : units.length
                    ? "No registered units are currently available"
                    : "No physical units registered for this product"}
            </option>
            {availableUnits.map((unit) => (
              <option key={unit.id} value={unit.id}>{unit.asset_code} · {unit.condition}{unit.location ? ` · ${unit.location}` : ""}</option>
            ))}
          </select>
        </div>
        <button type="button" onClick={assign} disabled={busy || !selectedUnitId} className="rounded-lg bg-teal-600 px-3 py-2 text-sm font-medium text-white hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-50">Assign unit</button>
      </div>

      {error && <p className="mb-3 rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-xs text-red-300">{error}</p>}
      {notice && <p className="mb-3 rounded-lg border border-teal-500/20 bg-teal-500/10 p-2 text-xs text-teal-200">{notice}</p>}
      {units.length === 0 && (
        <p className="mb-3 text-xs text-amber-300">
          {productName} has no registered physical units. Add or reconcile them on the Inventory page before assignment.
        </p>
      )}

      {assignments.length > 0 ? (
        <div className="space-y-2">
          {assignments.map((assignment) => {
            const unit = assignment.inventory_units;
            return (
              <div key={assignment.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-neutral-800 bg-neutral-950 p-3">
                <div>
                  <p className="text-sm font-medium text-white">{unit?.asset_code || "Unknown unit"}</p>
                  <p className="text-xs text-neutral-500">{unit?.condition || "Unknown condition"}{unit?.location ? ` · ${unit.location}` : ""} · <span className="capitalize">{assignment.status.replace("_", " ")}</span></p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {assignment.status === "assigned" && (
                    <>
                      <button type="button" disabled={busy} onClick={() => transition(assignment.id, "hand_over")} className="rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-purple-500 disabled:opacity-50">Hand over</button>
                      <button type="button" disabled={busy} onClick={() => transition(assignment.id, "release")} className="rounded-lg border border-neutral-700 px-3 py-1.5 text-xs text-neutral-300 hover:bg-neutral-800 disabled:opacity-50">Release</button>
                    </>
                  )}
                  {assignment.status === "handed_over" && (
                    <button type="button" disabled={busy} onClick={() => transition(assignment.id, "return")} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-500 disabled:opacity-50">Mark returned</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-xs text-neutral-400">No physical unit assigned yet.</p>
      )}
    </div>
  );
}
