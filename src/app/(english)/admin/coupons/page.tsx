"use client";

import { useEffect, useState } from "react";
import { couponToday, defaultCouponExpiry, isCouponExpired, type Coupon } from "@/lib/coupon-rules";

type Option = { id: string; name: string };
const inputClass = "w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-white";

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [products, setProducts] = useState<Option[]>([]);
  const [categories, setCategories] = useState<Option[]>([]);
  const [code, setCode] = useState("");
  const [expiresOn, setExpiresOn] = useState(() => defaultCouponExpiry());
  const [expiryEdits, setExpiryEdits] = useState<Record<string, string>>({});
  const [discountType, setDiscountType] = useState("percentage");
  const [amount, setAmount] = useState("");
  const [scope, setScope] = useState("all");
  const [targetIds, setTargetIds] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/coupons").then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setCoupons(data.coupons); setProducts(data.products); setCategories(data.categories);
    }).catch((error) => setError(error.message || "Could not load coupons.")).finally(() => setLoading(false));
  }, []);

  async function save(method: "POST" | "PATCH", body: object) {
    setBusy(true); setError(""); setMessage("");
    try {
      const response = await fetch("/api/admin/coupons", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setCoupons((current) => method === "POST" ? [data.coupon, ...current] : current.map((coupon) => coupon.id === data.coupon.id ? data.coupon : coupon));
      setMessage(method === "POST" ? `Coupon ${data.coupon.code} created.` : `Coupon ${data.coupon.code} updated.`);
      setExpiryEdits((current) => { const next = { ...current }; delete next[data.coupon.id]; return next; });
      if (method === "POST") { setCode(""); setAmount(""); setTargetIds([]); setExpiresOn(defaultCouponExpiry()); }
    } catch (error) { setError((error as Error).message || "Could not save coupon."); }
    finally { setBusy(false); }
  }

  return <div className="p-6 lg:p-8 max-w-5xl text-white">
    <h1 className="text-2xl font-bold mb-2">Coupons</h1>
    <p className="text-neutral-400 mb-6">Discount rental charges for all products, selected products, or categories. Delivery and extra services keep their usual price. One code per booking, applied after quantity discounts.</p>
    {error && <p role="alert" className="mb-4 text-red-300">{error}</p>}
    {message && <p role="status" className="mb-4 text-teal-300">{message}</p>}
    <form onSubmit={(event) => { event.preventDefault(); void save("POST", { code, discountType, amount, scope, targetIds, expiresOn }); }} className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 space-y-4 mb-8">
      <h2 className="font-semibold text-lg">Create coupon</h2>
      <label className="block text-sm">Code (leave blank to generate)
        <input value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} maxLength={40} pattern="[A-Za-z0-9_-]{3,40}" className={inputClass} placeholder="WELCOME10" />
      </label>
      <label className="block text-sm">Expiry date
        <input type="date" required min={couponToday()} value={expiresOn} onChange={(event) => setExpiresOn(event.target.value)} className={inputClass} />
        <span className="block mt-1 text-xs text-neutral-400">Defaults to one year. Valid through this date, Valencia time.</span>
      </label>
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block text-sm">Discount type<select value={discountType} onChange={(event) => setDiscountType(event.target.value)} className={inputClass}><option value="percentage">Percentage (%)</option><option value="fixed">Fixed amount (€)</option></select></label>
        <label className="block text-sm">{discountType === "percentage" ? "Percentage" : "Amount in EUR"}<input required type="number" min="0.01" max={discountType === "percentage" ? 100 : 21474836.47} step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} className={inputClass} /></label>
      </div>
      <label className="block text-sm">Applies to<select value={scope} onChange={(event) => { setScope(event.target.value); setTargetIds([]); }} className={inputClass}><option value="all">All products</option><option value="products">Selected products</option><option value="categories">Selected categories</option></select></label>
      {scope !== "all" && <fieldset className="max-h-64 overflow-auto rounded-lg border border-neutral-700 p-3 space-y-2"><legend className="text-sm px-1">Select {scope}</legend>
        {(scope === "products" ? products : categories).map((option) => <label key={option.id} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={targetIds.includes(option.id)} onChange={(event) => setTargetIds((current) => event.target.checked ? [...current, option.id] : current.filter((id) => id !== option.id))} />{option.name}</label>)}
      </fieldset>}
      <button disabled={busy || loading || (scope !== "all" && !targetIds.length)} className="btn btn-primary disabled:opacity-50">{busy ? "Saving…" : "Create coupon"}</button>
    </form>
    <h2 className="text-lg font-semibold mb-3">Existing coupons</h2>
    {loading ? <p>Loading coupons…</p> : !coupons.length && <p className="text-neutral-400">No coupons yet.</p>}
    <div className="space-y-3">{coupons.map((coupon) => <div key={coupon.id} className="rounded-xl border border-neutral-800 p-4 flex flex-wrap justify-between gap-4">
      <div><p className="font-mono font-semibold">{coupon.code}</p><p className="text-sm text-neutral-300">{coupon.discount_type === "percentage" ? `${coupon.value / 100}%` : `€${(coupon.value / 100).toFixed(2)}`} off · {!coupon.is_active ? "Disabled" : isCouponExpired(coupon) ? "Expired" : "Active"}</p>
        <p className="text-xs text-neutral-400 mt-1">{coupon.scope === "all" ? "All products" : (coupon.scope === "products" ? coupon.product_ids.map((id) => products.find((item) => item.id === id)?.name || "Archived product") : coupon.category_ids.map((id) => categories.find((item) => item.id === id)?.name || "Removed category")).join(", ")}</p>
      </div>
      <form onSubmit={(event) => { event.preventDefault(); void save("PATCH", { id: coupon.id, expiresOn: expiryEdits[coupon.id] ?? coupon.expires_on }); }} className="flex flex-wrap items-end gap-2">
        <label className="text-sm">Expiry date for {coupon.code}
          <input type="date" required min={couponToday()} value={expiryEdits[coupon.id] ?? coupon.expires_on} disabled={busy}
            onChange={(event) => setExpiryEdits((current) => ({ ...current, [coupon.id]: event.target.value }))} className={inputClass} />
        </label>
        <button disabled={busy || !expiryEdits[coupon.id] || expiryEdits[coupon.id] === coupon.expires_on} className="px-3 py-2 text-sm text-teal-300 disabled:opacity-50">Save expiry</button>
      </form>
      <button type="button" disabled={busy} onClick={() => void save("PATCH", { id: coupon.id, isActive: !coupon.is_active })} className="text-sm text-teal-300 disabled:opacity-50">{coupon.is_active ? "Disable" : "Enable"}</button>
    </div>)}</div>
  </div>;
}
