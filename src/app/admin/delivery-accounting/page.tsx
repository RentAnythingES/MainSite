"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

type Settings = {
  warehouse_origin: string;
  mileage_cost_per_km_cents: number;
  default_driver_name: string;
};

type Trip = {
  id: string;
  event_type: "delivery" | "pickup";
  event_date: string;
  origin_address: string;
  destination_address: string;
  distance_meters: number | null;
  distance_status: "calculated" | "unavailable" | "manual";
  routing_error: string | null;
  mileage_cost_per_km_cents: number;
  trip_cost_cents: number | null;
  driver_name: string;
  completed_at: string | null;
  booking: { booking_ref: string; delivery_fee_cents: number; collection_fee_cents: number } | null;
  delivery_request: { claimed_by_label: string | null; status: string } | null;
};

const BURJASSOT = "Carrer Obispo Muñoz, 73, 46100 Burjassot, Valencia, Spain";
const PATERNA = "Carrer el Puig, 32, 46980 Paterna, Valencia, Spain";
const inputClass = "mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white";

async function responseJson(response: Response) {
  const raw = await response.text();
  try { return raw ? JSON.parse(raw) as Record<string, unknown> : {}; }
  catch { return { error: `The server returned an unexpected response (HTTP ${response.status}).` }; }
}

const euro = (cents: number | null | undefined) => `€${((cents || 0) / 100).toFixed(2)}`;

export default function DeliveryAccountingPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const [busyTripId, setBusyTripId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/delivery-accounting", { cache: "no-store" });
      const payload = await responseJson(response);
      if (!response.ok) throw new Error(String(payload.error || "Could not load delivery accounting."));
      setSettings(payload.settings as Settings);
      setTrips((payload.trips || []) as Trip[]);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not load delivery accounting."); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const totals = useMemo(() => trips.reduce((summary, trip) => {
    summary.distance += (trip.distance_meters || 0) / 1000;
    summary.cost += trip.trip_cost_cents || 0;
    summary.revenue += trip.event_type === "delivery" ? trip.booking?.delivery_fee_cents || 0 : trip.booking?.collection_fee_cents || 0;
    return summary;
  }, { distance: 0, cost: 0, revenue: 0 }), [trips]);

  async function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!settings) return;
    setSaving(true); setError(""); setNotice("");
    try {
      const response = await fetch("/api/admin/delivery-accounting", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ warehouseOrigin: settings.warehouse_origin, mileageCostPerKmCents: settings.mileage_cost_per_km_cents, defaultDriverName: settings.default_driver_name }),
      });
      const payload = await responseJson(response);
      if (!response.ok) throw new Error(String(payload.error || "Could not save settings."));
      setSettings(payload.settings as Settings); setNotice("Warehouse and mileage settings saved for future trips.");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not save settings."); }
    finally { setSaving(false); }
  }

  async function syncTrips() {
    setSaving(true); setError(""); setNotice("");
    try {
      const response = await fetch("/api/admin/delivery-accounting", { method: "POST" });
      const payload = await responseJson(response);
      if (!response.ok) throw new Error(String(payload.error || "Could not synchronise trips."));
      setNotice(`${Number(payload.created || 0)} missing trip record(s) added.`); await load();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not synchronise trips."); }
    finally { setSaving(false); }
  }

  async function saveTrip(trip: Trip, completed: boolean) {
    setBusyTripId(trip.id); setError(""); setNotice("");
    try {
      const response = await fetch("/api/admin/delivery-accounting", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tripId: trip.id, driverName: trip.driver_name, completed }),
      });
      const payload = await responseJson(response);
      if (!response.ok) throw new Error(String(payload.error || "Could not update trip."));
      const updated = payload.trip as Trip;
      setTrips((current) => current.map((item) => item.id === trip.id ? { ...item, ...updated } : item));
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not update trip."); }
    finally { setBusyTripId(null); }
  }

  if (!settings) return <p className="text-neutral-400">{error || "Loading delivery accounting..."}</p>;

  return <div className="space-y-7">
    <div className="flex flex-wrap items-start justify-between gap-4"><div><h1 className="text-3xl font-bold text-white">Delivery accounting</h1><p className="mt-2 max-w-3xl text-neutral-400">One-way driving distance and internal mileage cost for each delivery or collection trip. Customer delivery fees remain separate from this operational ledger.</p></div><button onClick={() => void syncTrips()} disabled={saving} className="rounded-xl border border-teal-500/50 px-4 py-2.5 text-sm font-semibold text-teal-300 hover:bg-teal-500/10 disabled:opacity-50">{saving ? "Working..." : "Sync missing trips"}</button></div>
    {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">{error}</div>}{notice && <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-emerald-300">{notice}</div>}
    <div className="grid gap-4 sm:grid-cols-3"><section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5"><p className="text-sm text-neutral-400">Recorded distance</p><p className="mt-1 text-2xl font-bold text-white">{totals.distance.toFixed(1)} km</p></section><section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5"><p className="text-sm text-neutral-400">Mileage cost</p><p className="mt-1 text-2xl font-bold text-white">{euro(totals.cost)}</p></section><section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5"><p className="text-sm text-neutral-400">Fulfilment fees billed</p><p className="mt-1 text-2xl font-bold text-white">{euro(totals.revenue)}</p><p className="mt-1 text-xs text-neutral-500">Before other operating costs</p></section></div>
    <form onSubmit={saveSettings} className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6"><div className="flex flex-wrap items-end justify-between gap-4"><div><h2 className="text-xl font-semibold text-white">Trip settings</h2><p className="mt-1 text-sm text-neutral-400">The selected origin and rate are snapshotted on each new trip, so historical accounting remains auditable.</p></div><button disabled={saving} className="rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-500 disabled:opacity-50">Save settings</button></div><div className="mt-5 grid gap-4 md:grid-cols-3"><label className="text-sm text-neutral-300">Warehouse origin<select className={inputClass} value={settings.warehouse_origin} onChange={(event) => setSettings({ ...settings, warehouse_origin: event.target.value })}><option value={BURJASSOT}>Burjassot — Carrer Obispo Muñoz 73</option><option value={PATERNA}>Paterna — Carrer el Puig 32</option></select></label><label className="text-sm text-neutral-300">Mileage cost per km (€)<input className={inputClass} type="number" min="0" max="100" step="0.01" value={(settings.mileage_cost_per_km_cents / 100).toFixed(2)} onChange={(event) => setSettings({ ...settings, mileage_cost_per_km_cents: Math.round(Number(event.target.value || 0) * 100) })} /></label><label className="text-sm text-neutral-300">Default driver<input className={inputClass} value={settings.default_driver_name} onChange={(event) => setSettings({ ...settings, default_driver_name: event.target.value })} /></label></div></form>
    <section className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900"><div className="border-b border-neutral-800 px-6 py-4"><h2 className="font-semibold text-white">Trip ledger</h2></div>{trips.length === 0 ? <p className="p-8 text-center text-neutral-500">No delivery or collection trips have been recorded yet.</p> : <div className="overflow-x-auto"><table className="w-full min-w-[1050px] text-left text-sm"><thead className="bg-neutral-950/60 text-xs uppercase tracking-wide text-neutral-500"><tr><th className="px-5 py-3">Date / booking</th><th className="px-5 py-3">Trip</th><th className="px-5 py-3">Route</th><th className="px-5 py-3">Distance</th><th className="px-5 py-3">Mileage cost</th><th className="px-5 py-3">Driver</th><th className="px-5 py-3">Completion</th></tr></thead><tbody className="divide-y divide-neutral-800">{trips.map((trip) => <tr key={trip.id} className="align-top text-neutral-300"><td className="px-5 py-4"><div>{new Date(`${trip.event_date}T12:00:00`).toLocaleDateString("en-GB")}</div><div className="mt-1 text-xs text-neutral-500">{trip.booking?.booking_ref || "Booking removed"}</div></td><td className="px-5 py-4 capitalize">{trip.event_type}</td><td className="max-w-xs px-5 py-4 text-xs"><p className="truncate text-neutral-400" title={trip.origin_address}>From: {trip.origin_address}</p><p className="mt-1 truncate" title={trip.destination_address}>To: {trip.destination_address}</p></td><td className="px-5 py-4">{trip.distance_meters === null ? <span className="text-amber-300" title={trip.routing_error || "Distance unavailable"}>Unavailable</span> : `${(trip.distance_meters / 1000).toFixed(1)} km`}</td><td className="px-5 py-4"><div>{euro(trip.trip_cost_cents)}</div><div className="mt-1 text-xs text-neutral-500">€{(trip.mileage_cost_per_km_cents / 100).toFixed(2)}/km</div></td><td className="px-5 py-4"><input className="w-36 rounded-lg border border-neutral-700 bg-neutral-950 px-2 py-1.5 text-sm text-white" value={trip.driver_name} onChange={(event) => setTrips((current) => current.map((item) => item.id === trip.id ? { ...item, driver_name: event.target.value } : item))} /></td><td className="px-5 py-4"><button disabled={busyTripId === trip.id} onClick={() => void saveTrip(trip, !trip.completed_at)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold disabled:opacity-50 ${trip.completed_at ? "bg-emerald-500/15 text-emerald-300" : "border border-neutral-700 text-neutral-300 hover:bg-neutral-800"}`}>{busyTripId === trip.id ? "Saving..." : trip.completed_at ? "Completed" : "Mark completed"}</button></td></tr>)}</tbody></table></div>}</section>
  </div>;
}
