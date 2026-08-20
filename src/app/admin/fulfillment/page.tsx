"use client";

import { useCallback, useEffect, useState } from "react";

interface PickupLocation {
  id: string;
  slug: string;
  name: string;
  address: string;
  city: string;
  pickup_instructions?: string | null;
  customer_instructions?: string | null;
  internal_notes?: string | null;
  lead_time_hours?: number | null;
  handoff_contact?: string | null;
  confirmation_template?: string | null;
  is_active: boolean;
  sort_order: number;
}

interface ServiceZone {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  customer_instructions?: string | null;
  internal_notes?: string | null;
  lead_time_hours?: number | null;
  same_day_cutoff?: string | null;
  automatic_express_enabled: boolean;
  express_min_lead_hours: number;
  delivery_operating_hours: Record<string, { open: string; close: string } | null>;
  delivery_window?: string | null;
  collection_window?: string | null;
  confirmation_template?: string | null;
  delivery_fee_cents: number;
  collection_fee_cents: number;
  roundtrip_fee_cents: number;
  express_surcharge_cents: number;
  minimum_order_cents: number;
  automatic_checkout_enabled: boolean;
  is_active: boolean;
  sort_order: number;
}

type EditTarget =
  | { type: "pickup"; id: string; data: Partial<PickupLocation> }
  | { type: "zone"; id: string; data: Partial<ServiceZone> }
  | null;

const centsToEuros = (value?: number | null) => ((value || 0) / 100).toFixed(2);
const eurosToCents = (value: string) => Math.round(Number(value || 0) * 100);
const inputClass = "w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500";
const OPERATING_DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;

function summarizeOperatingHours(schedule?: ServiceZone["delivery_operating_hours"]): string {
  if (!schedule) return "Not configured";
  const windows = OPERATING_DAYS.map((day) => schedule[day]);
  const first = windows[0];
  if (first && windows.every((window) => window?.open === first.open && window?.close === first.close)) {
    return `Daily ${first.open}-${first.close}`;
  }
  return OPERATING_DAYS
    .map((day) => schedule[day] ? `${day.slice(0, 3)} ${schedule[day]?.open}-${schedule[day]?.close}` : `${day.slice(0, 3)} closed`)
    .join(" · ");
}

export default function AdminFulfillmentPage() {
  const [pickupLocations, setPickupLocations] = useState<PickupLocation[]>([]);
  const [serviceZones, setServiceZones] = useState<ServiceZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<EditTarget>(null);

  const fetchFulfillment = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/fulfillment");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setPickupLocations(data.pickupLocations || []);
      setServiceZones(data.serviceZones || []);
    } catch {
      setError("Failed to load fulfillment settings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(fetchFulfillment, 0);
    return () => window.clearTimeout(timeoutId);
  }, [fetchFulfillment]);

  const startPickupEdit = (location: PickupLocation) => {
    setEditing({ type: "pickup", id: location.id, data: { ...location } });
  };

  const startZoneEdit = (zone: ServiceZone) => {
    setEditing({ type: "zone", id: zone.id, data: { ...zone } });
  };

  const setEditField = (field: string, value: unknown) => {
    if (!editing) return;
    setEditing({
      ...editing,
      data: {
        ...editing.data,
        [field]: value,
      },
    } as EditTarget);
  };

  const setOperatingDay = (
    day: typeof OPERATING_DAYS[number],
    value: { open: string; close: string } | null,
  ) => {
    if (!editing || editing.type !== "zone") return;
    const zone = editing.data as Partial<ServiceZone>;
    setEditField("delivery_operating_hours", {
      ...(zone.delivery_operating_hours || {}),
      [day]: value,
    });
  };

  const saveEdit = async () => {
    if (!editing) return;

    setSaving(true);
    try {
      const path =
        editing.type === "pickup"
          ? `/api/admin/fulfillment/pickup-locations/${editing.id}`
          : `/api/admin/fulfillment/service-zones/${editing.id}`;
      const res = await fetch(path, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing.data),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Save failed");
      }

      setEditing(null);
      await fetchFulfillment();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save fulfillment settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-neutral-500">Loading fulfillment settings...</div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Fulfillment</h1>
        <p className="text-neutral-500 text-sm mt-1">
          Configure pickup instructions, delivery zones, lead times, and internal ops notes.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400 mb-4">
          {error}
          <button onClick={() => setError("")} className="ml-2 text-red-300 hover:text-white">×</button>
        </div>
      )}

      <section className="mb-8">
        <h2 className="text-lg font-bold text-white mb-3">Pickup locations</h2>
        <div className="grid lg:grid-cols-2 gap-4">
          {pickupLocations.map((location) => {
            const isEditing = editing?.type === "pickup" && editing.id === location.id;
            const form = isEditing ? editing.data as Partial<PickupLocation> : location;

            return (
              <div key={location.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-bold text-white">{location.name}</h3>
                    <p className="text-xs text-neutral-500">{location.slug}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${location.is_active ? "bg-emerald-500/10 text-emerald-400" : "bg-neutral-800 text-neutral-400"}`}>
                    {location.is_active ? "Active" : "Inactive"}
                  </span>
                </div>

                {isEditing ? (
                  <div className="space-y-3">
                    <input className={inputClass} value={form.name || ""} onChange={(e) => setEditField("name", e.target.value)} placeholder="Name" />
                    <input className={inputClass} value={form.address || ""} onChange={(e) => setEditField("address", e.target.value)} placeholder="Address" />
                    <textarea className={`${inputClass} min-h-20`} value={form.customer_instructions || ""} onChange={(e) => setEditField("customer_instructions", e.target.value)} placeholder="Customer instructions" />
                    <textarea className={`${inputClass} min-h-20`} value={form.internal_notes || ""} onChange={(e) => setEditField("internal_notes", e.target.value)} placeholder="Internal ops notes" />
                    <input className={inputClass} value={form.handoff_contact || ""} onChange={(e) => setEditField("handoff_contact", e.target.value)} placeholder="Handoff contact" />
                    <div className="grid grid-cols-2 gap-3">
                      <label className="text-xs text-neutral-400">
                        Lead time hours
                        <input className={`${inputClass} mt-1`} type="number" value={form.lead_time_hours ?? 24} onChange={(e) => setEditField("lead_time_hours", Number(e.target.value))} />
                      </label>
                      <label className="flex items-center gap-2 text-sm text-neutral-300 mt-5">
                        <input type="checkbox" checked={Boolean(form.is_active)} onChange={(e) => setEditField("is_active", e.target.checked)} />
                        Active
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 text-sm">
                    <p className="text-neutral-300">{location.address}</p>
                    <p className="text-neutral-400">Customer: {location.customer_instructions || location.pickup_instructions || "Not set"}</p>
                    <p className="text-amber-300">Internal: {location.internal_notes || "Not set"}</p>
                    <p className="text-neutral-500 text-xs">Lead time: {location.lead_time_hours || 24}h · Contact: {location.handoff_contact || "Not set"}</p>
                  </div>
                )}

                <div className="flex gap-2 mt-4 pt-3 border-t border-neutral-800">
                  {isEditing ? (
                    <>
                      <button onClick={saveEdit} disabled={saving} className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white text-xs font-semibold">
                        {saving ? "Saving..." : "Save"}
                      </button>
                      <button onClick={() => setEditing(null)} className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold">
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button onClick={() => startPickupEdit(location)} className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold">
                      Edit
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-white mb-3">Service zones</h2>
        <div className="grid lg:grid-cols-2 gap-4">
          {serviceZones.map((zone) => {
            const isEditing = editing?.type === "zone" && editing.id === zone.id;
            const form = isEditing ? editing.data as Partial<ServiceZone> : zone;

            return (
              <div key={zone.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-bold text-white">{zone.name}</h3>
                    <p className="text-xs text-neutral-500">{zone.slug}</p>
                  </div>
                   <span className={`text-xs px-2 py-1 rounded-full ${zone.is_active && zone.automatic_checkout_enabled ? "bg-emerald-500/10 text-emerald-400" : "bg-neutral-800 text-neutral-400"}`}>
                     {!zone.is_active ? "Inactive" : zone.automatic_checkout_enabled ? "Online checkout" : "Manual quote"}
                  </span>
                </div>

                {isEditing ? (
                  <div className="space-y-3">
                    <input className={inputClass} value={form.name || ""} onChange={(e) => setEditField("name", e.target.value)} placeholder="Name" />
                    <textarea className={`${inputClass} min-h-20`} value={form.description || ""} onChange={(e) => setEditField("description", e.target.value)} placeholder="Description" />
                    <textarea className={`${inputClass} min-h-20`} value={form.customer_instructions || ""} onChange={(e) => setEditField("customer_instructions", e.target.value)} placeholder="Customer instructions" />
                    <textarea className={`${inputClass} min-h-20`} value={form.internal_notes || ""} onChange={(e) => setEditField("internal_notes", e.target.value)} placeholder="Internal ops notes" />
                    <div className="grid sm:grid-cols-2 gap-3">
                      <input className={inputClass} value={form.delivery_window || ""} onChange={(e) => setEditField("delivery_window", e.target.value)} placeholder="Delivery window" />
                      <input className={inputClass} value={form.collection_window || ""} onChange={(e) => setEditField("collection_window", e.target.value)} placeholder="Collection window" />
                    </div>
                     <div className="grid sm:grid-cols-2 gap-3">
                      <label className="text-xs text-neutral-400">Delivery fee €
                        <input className={`${inputClass} mt-1`} value={centsToEuros(form.delivery_fee_cents)} onChange={(e) => setEditField("delivery_fee_cents", eurosToCents(e.target.value))} />
                      </label>
                      <label className="text-xs text-neutral-400">Collection fee €
                        <input className={`${inputClass} mt-1`} value={centsToEuros(form.collection_fee_cents)} onChange={(e) => setEditField("collection_fee_cents", eurosToCents(e.target.value))} />
                      </label>
                      <label className="text-xs text-neutral-400">Roundtrip €
                        <input className={`${inputClass} mt-1`} value={centsToEuros(form.roundtrip_fee_cents)} onChange={(e) => setEditField("roundtrip_fee_cents", eurosToCents(e.target.value))} />
                      </label>
                     </div>
                     <div className="grid sm:grid-cols-3 gap-3">
                       <label className="text-xs text-neutral-400">Express surcharge €
                         <input className={`${inputClass} mt-1`} value={centsToEuros(form.express_surcharge_cents)} onChange={(e) => setEditField("express_surcharge_cents", eurosToCents(e.target.value))} />
                       </label>
                       <label className="text-xs text-neutral-400">Minimum rental €
                         <input className={`${inputClass} mt-1`} value={centsToEuros(form.minimum_order_cents)} onChange={(e) => setEditField("minimum_order_cents", eurosToCents(e.target.value))} />
                       </label>
                     </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <label className="text-xs text-neutral-400">
                        Later-date Standard lead time
                        <input className={`${inputClass} mt-1`} type="number" min="0" max="72" step="1" value={form.lead_time_hours ?? 12} onChange={(e) => setEditField("lead_time_hours", Number(e.target.value))} />
                      </label>
                      <label className="text-xs text-neutral-400">
                        Same-day Express minimum lead time
                        <input className={`${inputClass} mt-1`} type="number" min="0" max="72" step="1" value={form.express_min_lead_hours ?? 6} onChange={(e) => setEditField("express_min_lead_hours", Number(e.target.value))} />
                      </label>
                    </div>
                    <div className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-3">
                      <p className="mb-2 text-xs font-semibold text-neutral-300">Automatic delivery start hours · Europe/Madrid</p>
                      <div className="space-y-2">
                        {OPERATING_DAYS.map((day) => {
                          const window = form.delivery_operating_hours?.[day];
                          const isOpen = Boolean(window);
                          const effectiveWindow = window || { open: "09:00", close: "20:00" };
                          return (
                            <div key={day} className="grid grid-cols-[88px_1fr_1fr] items-center gap-2">
                              <label className="flex items-center gap-2 text-xs capitalize text-neutral-300">
                                <input
                                  type="checkbox"
                                  checked={isOpen}
                                  onChange={(event) => setOperatingDay(day, event.target.checked ? effectiveWindow : null)}
                                />
                                {day.slice(0, 3)}
                              </label>
                              <input
                                className={inputClass}
                                type="time"
                                value={effectiveWindow.open}
                                disabled={!isOpen}
                                aria-label={`${day} opening time`}
                                onChange={(event) => setOperatingDay(day, { ...effectiveWindow, open: event.target.value })}
                              />
                              <input
                                className={inputClass}
                                type="time"
                                value={effectiveWindow.close}
                                disabled={!isOpen}
                                aria-label={`${day} closing time`}
                                onChange={(event) => setOperatingDay(day, { ...effectiveWindow, close: event.target.value })}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                       <label className="flex items-center gap-2 text-sm text-neutral-300 mt-5">
                        <input type="checkbox" checked={Boolean(form.is_active)} onChange={(e) => setEditField("is_active", e.target.checked)} />
                         Active
                       </label>
                       <label className="flex items-center gap-2 text-sm text-neutral-300 mt-5">
                         <input type="checkbox" checked={Boolean(form.automatic_checkout_enabled)} onChange={(e) => setEditField("automatic_checkout_enabled", e.target.checked)} />
                         Allow online checkout
                       </label>
                       <label className="flex items-center gap-2 text-sm text-amber-300 sm:col-span-2">
                         <input type="checkbox" checked={Boolean(form.automatic_express_enabled)} onChange={(e) => setEditField("automatic_express_enabled", e.target.checked)} />
                         Automatic same-day Express enabled (kill switch)
                       </label>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 text-sm">
                    <p className="text-neutral-400">{zone.description || "No description"}</p>
                    <p className="text-neutral-400">Customer: {zone.customer_instructions || "Not set"}</p>
                    <p className="text-amber-300">Internal: {zone.internal_notes || "Not set"}</p>
                    <p className="text-neutral-500 text-xs">
                       Delivery {centsToEuros(zone.delivery_fee_cents)} · Collection {centsToEuros(zone.collection_fee_cents)} · Roundtrip {centsToEuros(zone.roundtrip_fee_cents)}
                    </p>
                     <p className="text-neutral-500 text-xs">
                       {summarizeOperatingHours(zone.delivery_operating_hours)} · Later-date Standard {zone.lead_time_hours ?? 12}h
                     </p>
                     <p className="text-neutral-500 text-xs">
                       Same-day Express {zone.express_min_lead_hours ?? 6}h+ · +€{centsToEuros(zone.express_surcharge_cents)} · {zone.automatic_express_enabled ? "Automatic Express ON" : "Automatic Express OFF"}
                     </p>
                  </div>
                )}

                <div className="flex gap-2 mt-4 pt-3 border-t border-neutral-800">
                  {isEditing ? (
                    <>
                      <button onClick={saveEdit} disabled={saving} className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white text-xs font-semibold">
                        {saving ? "Saving..." : "Save"}
                      </button>
                      <button onClick={() => setEditing(null)} className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold">
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button onClick={() => startZoneEdit(zone)} className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold">
                      Edit
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
