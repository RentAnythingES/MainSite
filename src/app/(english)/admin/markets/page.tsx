"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import type { Market } from "@/lib/types";
import { MARKET_SETUP_LOCALES, validateMarketSetup } from "@/lib/market-validation";
import type { MarketSetup } from "@/lib/market-validation";

const EMPTY: MarketSetup = { name: "", slug: "", country_code: "", timezone: "", currency: "eur", default_locale: "en", supported_locales: ["en"] };
const inputClass = "w-full rounded-lg border border-neutral-600 bg-neutral-900 px-3 py-2 text-white disabled:text-neutral-400 focus:outline-2 focus:outline-teal-400";

function settings(market: Market): MarketSetup {
  return { name: market.name, slug: market.slug, country_code: market.country_code, timezone: market.timezone,
    currency: market.currency, default_locale: market.default_locale, supported_locales: market.supported_locales };
}

export default function MarketsPage() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [selected, setSelected] = useState<Market | null>(null);
  const [form, setForm] = useState<MarketSetup>(EMPTY);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);
  const [refresh, setRefresh] = useState(0);
  const dirty = open && JSON.stringify(form) !== JSON.stringify(selected ? settings(selected) : EMPTY);
  const locked = !!selected && (selected.is_default || selected.is_active || selected.is_public || selected.is_booking_enabled || selected.is_indexable);

  function load() { setLoading(true); setLoadError(""); setRefresh(value => value + 1); }
  useEffect(() => {
    let current = true;
    const abort = new AbortController();
    fetch(`/api/admin/markets?page=${page}`, { cache: "no-store", signal: AbortSignal.any([abort.signal, AbortSignal.timeout(15000)]) })
      .then(async response => {
        const data = await response.json();
        if (!response.ok) throw new Error(response.status === 401 ? "Sign in as a platform administrator to manage cities." : data.error);
        return data;
      }).then(data => { if (current) { setMarkets(data.markets); setHasMore(data.hasMore); setLoadError(""); } })
      .catch(err => { if (current) setLoadError(err instanceof Error ? err.message : "Could not load cities"); })
      .finally(() => { if (current) setLoading(false); });
    return () => { current = false; abort.abort(); };
  }, [page, refresh]);
  useEffect(() => { if (open) nameRef.current?.focus(); }, [open, selected]);
  useEffect(() => { if (error) errorRef.current?.focus(); }, [error]);
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    const navigate = (event: MouseEvent) => {
      if ((event.target as HTMLElement).closest("a[href]") && !window.confirm("Discard unsaved city changes?")) event.preventDefault();
    };
    window.addEventListener("beforeunload", warn); document.addEventListener("click", navigate, true);
    return () => { window.removeEventListener("beforeunload", warn); document.removeEventListener("click", navigate, true); };
  }, [dirty]);

  function edit(market: Market | null) {
    if (dirty && !window.confirm("Discard unsaved city changes?")) return;
    setSelected(market); setForm(market ? settings(market) : EMPTY); setOpen(true); setError(""); setNotice("");
  }
  async function save(event: FormEvent) {
    event.preventDefault(); setError(""); setNotice("");
    try { validateMarketSetup(form); } catch (err) { setError((err as Error).message); return; }
    setSaving(true);
    try {
      const response = await fetch(selected ? `/api/admin/markets/${selected.id}` : "/api/admin/markets", {
        method: selected ? "PATCH" : "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, ...(selected ? { expectedUpdatedAt: selected.updated_at } : {}) }),
        signal: AbortSignal.timeout(15000),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(response.status === 401 ? "Your session expired. Sign in again before saving." : data.error);
      setSelected(data.market); setForm(settings(data.market));
      setNotice(selected ? "City settings saved." : "Private city created. Public access and bookings remain disabled.");
      await load();
    } catch (err) { setError(err instanceof Error && err.name !== "TimeoutError" && err.name !== "TypeError" ? err.message : "Save outcome is unknown. Reload cities and check for your change before retrying."); }
    finally { setSaving(false); }
  }
  return <div className="max-w-5xl text-neutral-200">
    <h1 className="text-2xl font-bold text-white">Cities</h1>
    <p className="mt-2 text-neutral-400">Prepare a city privately. Publishing and enabling bookings require a separate launch review.</p>
    <button type="button" className="btn btn-primary my-4" disabled={saving} onClick={() => edit(null)}>Add city</button>
    {loadError && <div role="alert"><p>{loadError}</p><button className="underline" onClick={() => void load()}>Retry loading cities</button></div>}
    {loading ? <p role="status">Loading cities…</p> : !loadError && <>
      {markets.length === 0 ? <p>No cities on this page.</p> : <ul className="space-y-2">
        {markets.map(market => <li key={market.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-800 p-4">
          <div><strong>{market.name}</strong><p className="text-sm text-neutral-400">{market.slug} · {market.timezone} · {market.is_public ? "Public" : "Private"} · {market.is_booking_enabled ? "Bookings enabled" : "Bookings disabled"}{market.is_default ? " · Default city" : ""}</p></div>
          <button type="button" className="underline text-teal-300" disabled={saving} onClick={() => edit(market)} aria-label={`Edit ${market.name}`}>Edit</button>
        </li>)}
      </ul>}
      <div className="flex gap-4 my-4"><button disabled={page === 0 || saving} onClick={() => setPage(page - 1)} className="disabled:opacity-40">Previous</button><span>Page {page + 1}</span><button disabled={!hasMore || saving} onClick={() => setPage(page + 1)} className="disabled:opacity-40">Next</button></div>
    </>}
    {notice && <p role="status" className="my-4 text-teal-300">{notice}</p>}
    {open && <form onSubmit={save} className="mt-6 rounded-xl border border-neutral-800 p-4 sm:p-6">
      <h2 className="text-xl font-semibold mb-3">{selected ? `Edit ${selected.name}` : "New private city"}</h2>
      {locked && <p className="mb-4 text-neutral-400">Only the name can be changed for an operating or default city.</p>}
      <fieldset disabled={saving} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label>City name<input ref={nameRef} className={inputClass} value={form.name} required maxLength={100} onChange={e => setForm({ ...form, name: e.target.value })} /></label>
        <label>City slug<input className={inputClass} value={form.slug} disabled={!!selected} required maxLength={64} placeholder="hamburg" onChange={e => setForm({ ...form, slug: e.target.value })} /></label>
        <label>Country code<input className={inputClass} value={form.country_code} disabled={locked} required maxLength={2} placeholder="DE" onChange={e => setForm({ ...form, country_code: e.target.value.toUpperCase() })} /></label>
        <label>Timezone<input className={inputClass} value={form.timezone} disabled={locked} required placeholder="Europe/Berlin" onChange={e => setForm({ ...form, timezone: e.target.value })} /></label>
        <label>Currency<input className={inputClass} value="EUR" readOnly /></label>
        <label>Default language<select className={inputClass} value={form.default_locale} disabled={locked} onChange={e => setForm({ ...form, default_locale: e.target.value })}>{form.supported_locales.map(locale => <option key={locale} value={locale}>{locale === "en" ? "English" : "Spanish"}</option>)}</select></label>
        <fieldset className="sm:col-span-2" disabled={locked}><legend>Available languages</legend><div className="flex gap-4 mt-2">{MARKET_SETUP_LOCALES.map(locale => <label key={locale} className="flex gap-2 items-center"><input type="checkbox" checked={form.supported_locales.includes(locale)} disabled={locale === form.default_locale} onChange={e => setForm({ ...form, supported_locales: e.target.checked ? [...form.supported_locales, locale] : form.supported_locales.filter(item => item !== locale) })} />{locale === "en" ? "English" : "Spanish"}</label>)}</div><p className="text-sm text-neutral-400 mt-2">German becomes available after the shared language foundation is implemented.</p></fieldset>
      </fieldset>
      {error && <p ref={errorRef} tabIndex={-1} role="alert" className="mt-4 text-red-300">{error} <button type="button" className="underline" disabled={saving} onClick={() => void load()}>Reload cities</button></p>}
      <div className="flex flex-wrap gap-4 mt-5"><button className="btn btn-primary" disabled={saving}>{saving ? "Saving…" : "Save city"}</button><button type="button" disabled={saving} onClick={() => { if (!dirty || window.confirm("Discard unsaved city changes?")) setOpen(false); }}>Close</button>{dirty && <span className="self-center text-sm text-amber-300">Unsaved changes</span>}</div>
    </form>}
  </div>;
}
