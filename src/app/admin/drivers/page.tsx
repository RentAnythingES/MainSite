"use client";

import { FormEvent, useEffect, useState } from "react";

type Driver = {
  id: string;
  full_name: string;
  phone: string | null;
  telegram_user_id: number;
  telegram_username: string | null;
  is_active: boolean;
  group_membership_status: "invited" | "active" | "removed";
  invited_at: string | null;
  joined_at: string | null;
};

const inputClass = "mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white";
const blankForm = { fullName: "", phone: "", telegramUserId: "", telegramUsername: "" };

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [form, setForm] = useState(blankForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function loadDrivers() {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/drivers", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load drivers");
      setDrivers(data.drivers || []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load drivers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadDrivers(); }, []);

  async function addDriver(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true); setError(""); setNotice("");
    try {
      const response = await fetch("/api/admin/drivers", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not add driver");
      setDrivers((current) => [...current, data.driver]);
      setForm(blankForm);
      setNotice("Driver added. Create a one-time group invite below.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not add driver");
    } finally { setSaving(false); }
  }

  async function inviteDriver(driver: Driver) {
    setBusyId(driver.id); setError(""); setNotice("");
    try {
      const response = await fetch(`/api/admin/drivers/${driver.id}/group`, { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not create invite");
      setDrivers((current) => current.map((item) => item.id === driver.id ? data.driver : item));
      await navigator.clipboard.writeText(data.inviteLink);
      setNotice(`One-time invite for ${driver.full_name} copied. Send it to the driver privately.`);
    } catch (inviteError) {
      setError(inviteError instanceof Error ? inviteError.message : "Could not create invite");
    } finally { setBusyId(null); }
  }

  async function removeDriver(driver: Driver) {
    if (!window.confirm(`Remove ${driver.full_name} from Rent'n Roll Deliveries and disable claims?`)) return;
    setBusyId(driver.id); setError(""); setNotice("");
    try {
      const response = await fetch(`/api/admin/drivers/${driver.id}/group`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not remove driver");
      setDrivers((current) => current.map((item) => item.id === driver.id ? data.driver : item));
      setNotice(`${driver.full_name} was removed from the group and can no longer claim work.`);
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : "Could not remove driver");
    } finally { setBusyId(null); }
  }

  return <div>
    <div className="mb-7">
      <h1 className="text-4xl font-bold text-white">Delivery drivers</h1>
      <p className="mt-2 max-w-3xl text-neutral-400">Manage the verified drivers allowed to claim work in Rent&apos;n Roll Deliveries. The group receives only timing and postcode; the successful driver receives customer details privately.</p>
    </div>
    {error && <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">{error}</div>}
    {notice && <div className="mb-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-emerald-300">{notice}</div>}
    <form onSubmit={addDriver} className="mb-8 rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
      <h2 className="text-xl font-semibold text-white">Add a driver</h2>
      <p className="mt-1 text-sm text-neutral-500">Ask each driver to send <code>/chatid</code> to the Rent&apos;n Roll bot, then enter that private Telegram user ID here.</p>
      <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <label className="text-xs font-medium text-neutral-400">Driver name *<input required value={form.fullName} onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))} className={inputClass} /></label>
        <label className="text-xs font-medium text-neutral-400">Telegram user ID *<input required inputMode="numeric" value={form.telegramUserId} onChange={(event) => setForm((current) => ({ ...current, telegramUserId: event.target.value }))} className={inputClass} placeholder="e.g. 3956998068" /></label>
        <label className="text-xs font-medium text-neutral-400">Phone (internal)<input value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} className={inputClass} /></label>
        <label className="text-xs font-medium text-neutral-400">Telegram username (optional)<input value={form.telegramUsername} onChange={(event) => setForm((current) => ({ ...current, telegramUsername: event.target.value.replace(/^@/, "") }))} className={inputClass} placeholder="drivername" /></label>
      </div>
      <button disabled={saving} className="mt-5 rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-500 disabled:opacity-50">{saving ? "Adding…" : "Add driver"}</button>
    </form>
    {loading ? <p className="text-neutral-500">Loading drivers…</p> : drivers.length === 0 ? <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-10 text-center text-neutral-500">No drivers registered yet.</div> : <div className="space-y-4">
      {drivers.map((driver) => <article key={driver.id} className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div><h2 className="text-xl font-semibold text-white">{driver.full_name}</h2><p className="mt-1 text-sm text-neutral-400">Telegram ID: {driver.telegram_user_id}{driver.telegram_username ? ` · @${driver.telegram_username}` : ""}{driver.phone ? ` · ${driver.phone}` : ""}</p></div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${driver.is_active && driver.group_membership_status === "active" ? "bg-emerald-500/15 text-emerald-300" : "bg-amber-500/15 text-amber-200"}`}>{driver.is_active ? driver.group_membership_status : "disabled"}</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          {driver.is_active && <button type="button" onClick={() => void inviteDriver(driver)} disabled={busyId === driver.id} className="rounded-xl border border-teal-500/50 px-4 py-2 text-sm font-semibold text-teal-300 hover:bg-teal-500/10 disabled:opacity-50">{busyId === driver.id ? "Working…" : "Create group invite"}</button>}
          {driver.is_active && <button type="button" onClick={() => void removeDriver(driver)} disabled={busyId === driver.id} className="rounded-xl border border-red-500/40 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/10 disabled:opacity-50">Remove from group</button>}
        </div>
      </article>)}
    </div>}
  </div>;
}
