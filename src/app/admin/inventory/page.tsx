"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Product = {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  stock_total: number;
  stock_available: number;
  physical_units: number;
  operational_units: number;
  physically_available_units: number;
  unavailable_units: number;
};

type Unit = {
  id: string;
  product_id: string;
  asset_code: string;
  status: string;
  condition: string;
  location?: string | null;
  notes?: string | null;
  last_inspected_at?: string | null;
  products: { name: string };
};

const statuses = ["available", "reserved", "rented", "maintenance", "damaged", "retired"];
const manualStatuses = ["available", "maintenance", "damaged", "retired"];
const conditions = ["new", "good", "fair", "poor"];

export default function InventoryPage() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyProductId, setBusyProductId] = useState<string | null>(null);
  const [productId, setProductId] = useState("");
  const [assetCode, setAssetCode] = useState("");
  const [location, setLocation] = useState("");
  const [unitFilter, setUnitFilter] = useState("all");
  const [productView, setProductView] = useState<"active" | "all" | "review">("active");
  const [search, setSearch] = useState("");
  const [draftStock, setDraftStock] = useState<Record<string, { total: string; online: string }>>({});

  const load = useCallback(async () => {
    const response = await fetch("/api/admin/inventory");
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Could not load inventory");
    setUnits(data.units || []);
    setProducts(data.products || []);
    setDraftStock(
      Object.fromEntries(
        (data.products || []).map((product: Product) => [
          product.id,
          { total: String(product.stock_total), online: String(product.stock_available) },
        ]),
      ),
    );
  }, []);

  useEffect(() => {
    let active = true;
    const timeoutId = window.setTimeout(() => {
      load()
        .then(() => {
          if (active) setError("");
        })
        .catch((loadError) => {
          if (active) {
            setError(loadError instanceof Error ? loadError.message : "Could not load inventory");
          }
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, 0);
    return () => {
      active = false;
      window.clearTimeout(timeoutId);
    };
  }, [load]);

  const needsReview = useCallback(
    (product: Product) =>
      product.physical_units !== product.stock_total ||
      (product.physical_units > 0 && product.stock_available > product.operational_units),
    [],
  );

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((product) => {
      if (productView === "active" && !product.is_active) return false;
      if (productView === "review" && !needsReview(product)) return false;
      return !query || `${product.name} ${product.slug}`.toLowerCase().includes(query);
    });
  }, [needsReview, productView, products, search]);

  const visibleUnits = useMemo(
    () => (unitFilter === "all" ? units : units.filter((unit) => unit.status === unitFilter)),
    [unitFilter, units],
  );

  const summary = useMemo(
    () => ({
      review: products.filter((product) => product.is_active && needsReview(product)).length,
      physical: units.filter((unit) => unit.status !== "retired").length,
      online: products
        .filter((product) => product.is_active)
        .reduce((total, product) => total + product.stock_available, 0),
    }),
    [needsReview, products, units],
  );

  async function saveCapacity(product: Product) {
    const draft = draftStock[product.id];
    const stockTotal = Number(draft?.total);
    const onlineCapacity = Number(draft?.online);
    setBusyProductId(product.id);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/inventory", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, stockTotal, onlineCapacity }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not update online inventory");
      await load();
      setNotice(`${product.name} inventory values updated.`);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not update online inventory");
    } finally {
      setBusyProductId(null);
    }
  }

  async function registerMissing(product: Product) {
    const missing = Math.max(product.stock_total - product.physical_units, 0);
    if (!missing) return;
    const confirmed = window.confirm(
      `Register ${missing} physical unit${missing === 1 ? "" : "s"} for ${product.name} from the declared owned stock? Asset codes will be generated and can be reviewed below.`,
    );
    if (!confirmed) return;
    setBusyProductId(product.id);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "register_missing", productId: product.id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not register physical units");
      await load();
      const created = data.reconciliation?.created_count || 0;
      setNotice(`${created} physical unit${created === 1 ? "" : "s"} registered for ${product.name}.`);
    } catch (registerError) {
      setError(registerError instanceof Error ? registerError.message : "Could not register physical units");
    } finally {
      setBusyProductId(null);
    }
  }

  async function createUnit() {
    setError("");
    setNotice("");
    const response = await fetch("/api/admin/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, assetCode, location }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Could not create unit");
      return;
    }
    await load();
    setAssetCode("");
    setNotice(`Physical unit ${data.unit.asset_code} registered.`);
  }

  async function updateUnit(unit: Unit, updates: Record<string, unknown>) {
    const response = await fetch(`/api/admin/inventory/${unit.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Could not update unit");
      return;
    }
    setUnits((current) => current.map((item) => (item.id === unit.id ? data.unit : item)));
    setError("");
    setNotice(`${unit.asset_code} updated.`);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white">Inventory reconciliation</h1>
      <p className="mt-2 max-w-3xl text-sm text-neutral-400">
        Review what exists physically and how much of it customers can book online. Set online capacity to zero to
        pause a product without changing the owned-stock record.
      </p>

      {error && <div className="mt-5 rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-300">{error}</div>}
      {notice && <div className="mt-5 rounded-lg border border-teal-700/40 bg-teal-950/40 p-3 text-sm text-teal-200">{notice}</div>}

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          ["Active products to review", summary.review],
          ["Physical units registered", summary.physical],
          ["Total active online capacity", summary.online],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
            <p className="text-xs text-neutral-500">{label}</p>
            <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
          </div>
        ))}
      </div>

      <section className="mt-6 rounded-xl border border-neutral-800 bg-neutral-900 p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-semibold text-white">Online and physical inventory by product</h2>
            <p className="mt-1 text-xs text-neutral-500">
              Owned stock is the real total. Online capacity is the concurrent quantity checkout can reserve.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(["active", "review", "all"] as const).map((view) => (
              <button
                key={view}
                onClick={() => setProductView(view)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                  productView === view ? "bg-teal-500/20 text-teal-300" : "bg-neutral-950 text-neutral-400"
                }`}
              >
                {view === "active" ? "Active" : view === "review" ? "Needs review" : "All products"}
              </button>
            ))}
          </div>
        </div>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search products"
          className="mt-4 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white"
        />

        <div className="mt-4 space-y-3">
          {visibleProducts.map((product) => {
            const draft = draftStock[product.id] || {
              total: String(product.stock_total),
              online: String(product.stock_available),
            };
            const missingPhysical = Math.max(product.stock_total - product.physical_units, 0);
            const extraPhysical = Math.max(product.physical_units - product.stock_total, 0);
            const capacityRisk =
              product.physical_units > 0 && product.stock_available > product.operational_units;
            const changed =
              Number(draft.total) !== product.stock_total ||
              Number(draft.online) !== product.stock_available;
            const busy = busyProductId === product.id;
            return (
              <div key={product.id} className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
                  <div className="min-w-64 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-white">{product.name}</p>
                      {!product.is_active && (
                        <span className="rounded-full bg-neutral-800 px-2 py-0.5 text-[11px] text-neutral-400">Draft</span>
                      )}
                      {needsReview(product) && (
                        <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] text-amber-300">Review</span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-neutral-500">{product.slug}</p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-400">
                      <span>Physical: {product.physical_units}</span>
                      <span>Operational: {product.operational_units}</span>
                      <span>Available now: {product.physically_available_units}</span>
                      {product.unavailable_units > 0 && <span className="text-amber-300">Unavailable: {product.unavailable_units}</span>}
                    </div>
                    {missingPhysical > 0 && (
                      <p className="mt-2 text-xs text-amber-300">
                        {missingPhysical} declared owned unit{missingPhysical === 1 ? "" : "s"} not yet registered physically.
                      </p>
                    )}
                    {extraPhysical > 0 && (
                      <p className="mt-2 text-xs text-red-300">
                        {extraPhysical} more physical unit{extraPhysical === 1 ? "" : "s"} than declared owned stock.
                      </p>
                    )}
                    {capacityRisk && (
                      <p className="mt-2 text-xs text-red-300">
                        Online capacity exceeds the number of operational physical units.
                      </p>
                    )}
                  </div>

                  <label className="text-xs text-neutral-500">
                    Owned stock
                    <input
                      type="number"
                      min="0"
                      value={draft.total}
                      onChange={(event) =>
                        setDraftStock((current) => ({
                          ...current,
                          [product.id]: { ...draft, total: event.target.value },
                        }))
                      }
                      className="mt-1 block w-28 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white"
                    />
                  </label>
                  <label className="text-xs text-neutral-500">
                    Online capacity
                    <input
                      type="number"
                      min="0"
                      value={draft.online}
                      onChange={(event) =>
                        setDraftStock((current) => ({
                          ...current,
                          [product.id]: { ...draft, online: event.target.value },
                        }))
                      }
                      className="mt-1 block w-32 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white"
                    />
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => saveCapacity(product)}
                      disabled={busy || !changed}
                      className="rounded-lg bg-teal-600 px-3 py-2 text-xs font-semibold text-white hover:bg-teal-500 disabled:opacity-40"
                    >
                      Save values
                    </button>
                    {missingPhysical > 0 && (
                      <button
                        onClick={() => registerMissing(product)}
                        disabled={busy}
                        className="rounded-lg border border-amber-600/50 px-3 py-2 text-xs font-medium text-amber-200 hover:bg-amber-500/10 disabled:opacity-40"
                      >
                        Register {missingPhysical} missing
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {!loading && visibleProducts.length === 0 && (
            <div className="rounded-xl border border-neutral-800 p-8 text-center text-sm text-neutral-500">
              No products match this view.
            </div>
          )}
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-neutral-800 bg-neutral-900 p-5">
        <h2 className="font-semibold text-white">Register one physical item</h2>
        <p className="mt-1 text-xs text-neutral-500">
          Use this when an item has its own existing asset label or needs a specific code.
        </p>
        <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_220px_220px_auto]">
          <select
            value={productId}
            onChange={(event) => setProductId(event.target.value)}
            className="rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white"
          >
            <option value="">Select product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}{product.is_active ? "" : " (draft)"}
              </option>
            ))}
          </select>
          <input
            value={assetCode}
            onChange={(event) => setAssetCode(event.target.value)}
            placeholder="Asset code, e.g. RA-AC-001"
            className="rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white"
          />
          <input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="Current location"
            className="rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white"
          />
          <button
            disabled={!productId || !assetCode.trim()}
            onClick={createUnit}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
          >
            Add unit
          </button>
        </div>
      </section>

      <div className="mt-6 flex flex-wrap gap-2">
        {["all", ...statuses].map((status) => (
          <button
            key={status}
            onClick={() => setUnitFilter(status)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${
              unitFilter === status ? "bg-teal-500/20 text-teal-300" : "bg-neutral-900 text-neutral-400"
            }`}
          >
            {status} {status === "all" ? units.length : units.filter((unit) => unit.status === status).length}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        {visibleUnits.map((unit) => (
          <div key={unit.id} className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="min-w-60">
                <p className="font-mono text-sm font-semibold text-teal-300">{unit.asset_code}</p>
                <p className="text-sm text-white">{unit.products.name}</p>
                <p className="text-xs text-neutral-500">
                  {unit.last_inspected_at
                    ? `Inspected ${new Date(unit.last_inspected_at).toLocaleDateString()}`
                    : "Inspection not recorded"}
                </p>
              </div>
              <select
                value={unit.status}
                disabled={["reserved", "rented"].includes(unit.status)}
                onChange={(event) => updateUnit(unit, { status: event.target.value })}
                className="rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white disabled:opacity-60"
                title={["reserved", "rented"].includes(unit.status) ? "Change this through its booking assignment" : undefined}
              >
                {Array.from(new Set([...manualStatuses, unit.status])).map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
              <select
                value={unit.condition}
                onChange={(event) => updateUnit(unit, { condition: event.target.value })}
                className="rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white"
              >
                {conditions.map((condition) => <option key={condition}>{condition}</option>)}
              </select>
              <input
                defaultValue={unit.location || ""}
                onBlur={(event) => updateUnit(unit, { location: event.target.value })}
                placeholder="Location"
                className="rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white"
              />
              <input
                defaultValue={unit.notes || ""}
                onBlur={(event) => updateUnit(unit, { notes: event.target.value })}
                placeholder="Notes"
                className="flex-1 rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white"
              />
              <button
                onClick={() => updateUnit(unit, { markInspected: true })}
                className="rounded-lg border border-neutral-700 px-3 py-2 text-xs text-neutral-300"
              >
                Mark inspected
              </button>
            </div>
          </div>
        ))}
        {!visibleUnits.length && (
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-10 text-center text-neutral-500">
            No physical inventory units in this view.
          </div>
        )}
      </div>
    </div>
  );
}
