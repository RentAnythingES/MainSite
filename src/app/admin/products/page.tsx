"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface PricingTier {
  id: string;
  min_days: number;
  per_day_cents: number;
}

interface Category {
  id: string;
  slug: string;
  name: string;
}

interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  description: string;
  image_url: string | null;
  is_active: boolean;
  stock_total: number;
  stock_available: number;
  subcategory: string;
  pricing_tiers: PricingTier[];
  category: Category;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Product & { pricing_tiers: PricingTier[] }>>({});

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/products");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setProducts(data.products || []);
    } catch {
      setError("Failed to load products. Check Supabase connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setEditForm({
      name: product.name,
      brand: product.brand,
      description: product.description,
      stock_total: product.stock_total,
      stock_available: product.stock_available,
      pricing_tiers: [...product.pricing_tiers].sort((a, b) => a.min_days - b.min_days),
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async (id: string) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error("Save failed");
      setEditingId(null);
      await fetchProducts();
    } catch {
      setError("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (id: string, currentlyActive: boolean) => {
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !currentlyActive }),
      });
      if (!res.ok) throw new Error("Toggle failed");
      await fetchProducts();
    } catch {
      setError("Failed to toggle product status");
    }
  };

  const updatePricingTier = (index: number, field: "min_days" | "per_day_cents", value: number) => {
    const tiers = [...(editForm.pricing_tiers || [])];
    tiers[index] = { ...tiers[index], [field]: value };
    setEditForm({ ...editForm, pricing_tiers: tiers });
  };

  const formatPrice = (cents: number) => `€${(cents / 100).toFixed(2)}`;

  const getPriceRange = (tiers: PricingTier[]) => {
    if (!tiers || tiers.length === 0) return "—";
    const sorted = [...tiers].sort((a, b) => a.per_day_cents - b.per_day_cents);
    const low = sorted[0].per_day_cents;
    const high = sorted[sorted.length - 1].per_day_cents;
    if (low === high) return `${formatPrice(low)}/day`;
    return `${formatPrice(low)} – ${formatPrice(high)}/day`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-neutral-500">Loading products...</div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-neutral-500 text-sm mt-1">
            {products.length} products · {products.filter((p) => p.is_active).length} active
          </p>
        </div>
        <Link href="/admin/products/new"
          className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold transition-colors">
          + Add Product
        </Link>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400 mb-4">
          {error}
          <button onClick={() => setError("")} className="ml-2 text-red-300 hover:text-white">✕</button>
        </div>
      )}

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-800">
                <th className="text-left p-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Product</th>
                <th className="text-left p-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Category</th>
                <th className="text-left p-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Price Range</th>
                <th className="text-left p-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Stock</th>
                <th className="text-left p-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                <th className="text-right p-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-neutral-800/50 transition-colors">
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-white">{product.name}</p>
                      <p className="text-xs text-neutral-500">{product.brand} · {product.slug}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-xs px-2 py-1 rounded-full bg-neutral-800 text-neutral-300">
                      {product.category?.name || "—"}
                    </span>
                  </td>
                  <td className="p-4 text-neutral-300">
                    {getPriceRange(product.pricing_tiers)}
                  </td>
                  <td className="p-4">
                    <span className="text-neutral-300">
                      {product.stock_available}/{product.stock_total}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleActive(product.id, product.is_active)}
                      className={`text-xs px-2 py-1 rounded-full font-medium transition-colors ${
                        product.is_active
                          ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                          : "bg-neutral-700 text-neutral-400 hover:bg-neutral-600"
                      }`}
                    >
                      {product.is_active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => startEdit(product)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700 transition-colors"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Edit Product</h2>
              <button onClick={cancelEdit} className="text-neutral-500 hover:text-white text-xl">✕</button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">Name</label>
                  <input
                    type="text"
                    value={editForm.name || ""}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">Brand</label>
                  <input
                    type="text"
                    value={editForm.brand || ""}
                    onChange={(e) => setEditForm({ ...editForm, brand: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Description</label>
                <textarea
                  value={editForm.description || ""}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">Total Stock</label>
                  <input
                    type="number"
                    min={0}
                    value={editForm.stock_total || 0}
                    onChange={(e) => setEditForm({ ...editForm, stock_total: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2.5 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">Available Stock</label>
                  <input
                    type="number"
                    min={0}
                    value={editForm.stock_available || 0}
                    onChange={(e) => setEditForm({ ...editForm, stock_available: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2.5 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Pricing Tiers */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-neutral-400">Pricing Tiers</label>
                  <button type="button"
                    onClick={() => setEditForm({ ...editForm, pricing_tiers: [...(editForm.pricing_tiers || []), { id: '', min_days: 30, per_day_cents: 500 }] })}
                    className="text-xs px-2 py-0.5 rounded bg-neutral-800 text-teal-400 hover:bg-neutral-700 transition-colors">
                    + Add Tier
                  </button>
                </div>
                <div className="space-y-2">
                  {(editForm.pricing_tiers || []).map((tier, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500">≥</span>
                        <input
                          type="number"
                          min={1}
                          value={tier.min_days}
                          onChange={(e) => updatePricingTier(i, "min_days", parseInt(e.target.value) || 1)}
                          className="w-full pl-7 pr-12 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500">days</span>
                      </div>
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500">€</span>
                        <input
                          type="number"
                          min={0}
                          step={0.01}
                          value={(tier.per_day_cents / 100).toFixed(2)}
                          onChange={(e) => updatePricingTier(i, "per_day_cents", Math.round(parseFloat(e.target.value) * 100) || 0)}
                          className="w-full pl-7 pr-12 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500">/day</span>
                      </div>
                      {(editForm.pricing_tiers || []).length > 1 && (
                        <button type="button"
                          onClick={() => setEditForm({ ...editForm, pricing_tiers: (editForm.pricing_tiers || []).filter((_, idx) => idx !== i) })}
                          className="px-2 text-neutral-600 hover:text-red-400 transition-colors">✕</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-neutral-800 flex items-center justify-end gap-3">
              <button
                onClick={cancelEdit}
                className="px-4 py-2 rounded-lg text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => saveEdit(editingId)}
                disabled={saving}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-teal-600 hover:bg-teal-500 text-white transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
