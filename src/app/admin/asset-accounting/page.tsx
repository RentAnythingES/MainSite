"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Asset = {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  stock_total: number;
  purchase_date: string | null;
  purchase_cost_cents: number;
  purchased_by: "Fadi" | "Johannes";
  useful_life_months: number;
  residual_value_cents: number;
  notes: string | null;
  current_daily_rate_cents: number;
  rental_revenue_since_purchase_cents: number | null;
  monthly_depreciation_cents: number;
  accumulated_depreciation_cents: number;
  net_book_value_cents: number;
};

const money = (value: number | null | undefined) => value === null || value === undefined ? "Set purchase date" : `€${(value / 100).toFixed(2)}`;
const inputClass = "rounded-lg border border-neutral-700 bg-neutral-950 px-2.5 py-2 text-sm text-white";

async function readResponse(response: Response) {
  const raw = await response.text();
  try { return raw ? JSON.parse(raw) as Record<string, unknown> : {}; }
  catch { return { error: `The server returned an unexpected response (HTTP ${response.status}).` }; }
}

export default function AssetAccountingPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    const response = await fetch("/api/admin/asset-accounting", { cache: "no-store" });
    const payload = await readResponse(response);
    if (!response.ok) throw new Error(String(payload.error || "Could not load the asset register."));
    setAssets((payload.assets || []) as Asset[]);
  }, []);

  useEffect(() => { void load().catch((reason) => setError(reason instanceof Error ? reason.message : "Could not load the asset register.")); }, [load]);

  const totals = useMemo(() => assets.reduce((total, asset) => ({
    cost: total.cost + asset.purchase_cost_cents,
    bookValue: total.bookValue + asset.net_book_value_cents,
    revenue: total.revenue + (asset.rental_revenue_since_purchase_cents || 0),
    missing: total.missing + (asset.purchase_date ? 0 : 1),
  }), { cost: 0, bookValue: 0, revenue: 0, missing: 0 }), [assets]);
  const visibleAssets = useMemo(() => assets.filter((asset) => `${asset.name} ${asset.slug}`.toLowerCase().includes(search.toLowerCase())), [assets, search]);

  function update(id: string, changes: Partial<Asset>) {
    setAssets((current) => current.map((asset) => asset.id === id ? { ...asset, ...changes } : asset));
  }

  async function save(asset: Asset) {
    setSavingId(asset.id); setError(""); setNotice("");
    try {
      const response = await fetch("/api/admin/asset-accounting", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: asset.id, purchaseDate: asset.purchase_date, purchaseCostCents: asset.purchase_cost_cents, purchasedBy: asset.purchased_by, usefulLifeMonths: asset.useful_life_months, residualValueCents: asset.residual_value_cents, notes: asset.notes }),
      });
      const payload = await readResponse(response);
      if (!response.ok) throw new Error(String(payload.error || "Could not save asset record."));
      await load(); setNotice(`${asset.name} asset record saved.`);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not save asset record."); }
    finally { setSavingId(null); }
  }

  return <div className="space-y-7"><div><h1 className="text-3xl font-bold text-white">Asset accounting</h1><p className="mt-2 max-w-3xl text-neutral-400">Product purchase costs, straight-line depreciation, and rental-only revenue accumulated from the recorded purchase date. Delivery and collection fees are excluded from product revenue.</p></div>{error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">{error}</div>}{notice && <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-300">{notice}</div>}<div className="grid gap-4 sm:grid-cols-4"><div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4"><p className="text-xs text-neutral-500">Purchase cost</p><p className="mt-1 text-xl font-bold text-white">{money(totals.cost)}</p></div><div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4"><p className="text-xs text-neutral-500">Net book value</p><p className="mt-1 text-xl font-bold text-white">{money(totals.bookValue)}</p></div><div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4"><p className="text-xs text-neutral-500">Gross rental revenue</p><p className="mt-1 text-xl font-bold text-white">{money(totals.revenue)}</p></div><div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4"><p className="text-xs text-amber-200">Needs purchase date</p><p className="mt-1 text-xl font-bold text-amber-100">{totals.missing}</p></div></div><section className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 px-5 py-4"><div><h2 className="font-semibold text-white">Product asset register</h2><p className="mt-1 text-xs text-neutral-500">Cost and date are intentionally blank until entered; no acquisition facts are guessed.</p></div><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" className={`${inputClass} w-56`} /></div><div className="overflow-x-auto"><table className="min-w-[1550px] w-full text-left text-sm"><thead className="bg-neutral-950/60 text-xs uppercase tracking-wide text-neutral-500"><tr><th className="px-4 py-3">Product</th><th className="px-4 py-3">Rental price</th><th className="px-4 py-3">Purchase date</th><th className="px-4 py-3">Cost</th><th className="px-4 py-3">Bought by</th><th className="px-4 py-3">Useful life</th><th className="px-4 py-3">Residual</th><th className="px-4 py-3">Monthly depreciation</th><th className="px-4 py-3">Accumulated</th><th className="px-4 py-3">Book value</th><th className="px-4 py-3">Rental revenue</th><th className="px-4 py-3">Notes</th><th className="px-4 py-3"></th></tr></thead><tbody className="divide-y divide-neutral-800">{visibleAssets.map((asset) => <tr key={asset.id} className="align-top text-neutral-300"><td className="px-4 py-4"><p className="font-medium text-white">{asset.name}</p><p className="mt-1 text-xs text-neutral-500">{asset.stock_total} owned · {asset.is_active ? "active" : "draft"}</p></td><td className="px-4 py-4">{money(asset.current_daily_rate_cents)}<p className="mt-1 text-xs text-neutral-500">from / day</p></td><td className="px-4 py-4"><input type="date" value={asset.purchase_date || ""} onChange={(event) => update(asset.id, { purchase_date: event.target.value || null })} className={inputClass} /></td><td className="px-4 py-4"><input type="number" min="0" step="0.01" value={(asset.purchase_cost_cents / 100).toFixed(2)} onChange={(event) => update(asset.id, { purchase_cost_cents: Math.round(Number(event.target.value || 0) * 100) })} className={`${inputClass} w-24`} /></td><td className="px-4 py-4"><select value={asset.purchased_by} onChange={(event) => update(asset.id, { purchased_by: event.target.value as Asset["purchased_by"] })} className={inputClass}><option>Fadi</option><option>Johannes</option></select></td><td className="px-4 py-4"><input type="number" min="1" max="240" value={asset.useful_life_months} onChange={(event) => update(asset.id, { useful_life_months: Number(event.target.value || 1) })} className={`${inputClass} w-20`} /><p className="mt-1 text-xs text-neutral-500">months</p></td><td className="px-4 py-4"><input type="number" min="0" step="0.01" value={(asset.residual_value_cents / 100).toFixed(2)} onChange={(event) => update(asset.id, { residual_value_cents: Math.round(Number(event.target.value || 0) * 100) })} className={`${inputClass} w-24`} /></td><td className="px-4 py-4">{money(asset.monthly_depreciation_cents)}</td><td className="px-4 py-4">{asset.purchase_date ? money(asset.accumulated_depreciation_cents) : "—"}</td><td className="px-4 py-4">{asset.purchase_date ? money(asset.net_book_value_cents) : "—"}</td><td className="px-4 py-4 font-semibold text-teal-300">{money(asset.rental_revenue_since_purchase_cents)}</td><td className="px-4 py-4"><input value={asset.notes || ""} onChange={(event) => update(asset.id, { notes: event.target.value || null })} placeholder="Optional note" className={`${inputClass} w-44`} /></td><td className="px-4 py-4"><button onClick={() => void save(asset)} disabled={savingId === asset.id} className="rounded-lg bg-teal-600 px-3 py-2 text-xs font-semibold text-white hover:bg-teal-500 disabled:opacity-50">{savingId === asset.id ? "Saving..." : "Save"}</button></td></tr>)}</tbody></table></div></section></div>;
}
