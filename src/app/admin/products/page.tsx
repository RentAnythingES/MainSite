"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getProductReadinessIssues } from "@/lib/product-validation";

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
  category_id: string;
  is_active: boolean;
  stock_total: number;
  stock_available: number;
  subcategory: string;
  subcategory_slug: string;
  features: string[];
  specs: Record<string, string>;
  pricing_tiers: PricingTier[];
  category: Category;
  content_status?: "draft" | "facts_verified" | "content_ready";
  seo?: {
    indexableEn: boolean;
    indexableEs: boolean;
    blockersEn: string[];
    blockersEs: string[];
  };
}

interface EditableSpec {
  key: string;
  value: string;
}

function isValidStoredImageUrl(value: string | null | undefined) {
  const imageUrl = String(value || "").trim();
  return !imageUrl || (imageUrl.startsWith("/") && !imageUrl.startsWith("//")) || /^https?:\/\//i.test(imageUrl);
}

const CONTENT_REVIEW_STATUS = {
  draft: { label: "Content draft", className: "text-amber-300" },
  facts_verified: { label: "Facts verified", className: "text-sky-300" },
  content_ready: { label: "Content ready", className: "text-emerald-400" },
} as const;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [statusFilter, setStatusFilter] = useState<"active" | "archived" | "all">("active");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [statusChangeId, setStatusChangeId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Product & { pricing_tiers: PricingTier[] }>>({});
  const [editFeatures, setEditFeatures] = useState<string[]>([]);
  const [editSpecs, setEditSpecs] = useState<EditableSpec[]>([]);

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

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch {
      setError("Failed to load categories. Check Supabase connection.");
    }
  }, []);

  useEffect(() => {
    void Promise.all([fetchProducts(), fetchCategories()]);
  }, [fetchProducts, fetchCategories]);

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setEditForm({
      name: product.name,
      slug: product.slug,
      brand: product.brand,
      description: product.description,
      image_url: product.image_url,
      category_id: product.category_id,
      subcategory: product.subcategory,
      subcategory_slug: product.subcategory_slug,
      stock_total: product.stock_total,
      stock_available: product.stock_available,
      pricing_tiers: [...product.pricing_tiers].sort((a, b) => a.min_days - b.min_days),
    });
    setEditFeatures(product.features?.length ? product.features : [""]);
    setEditSpecs(
      Object.entries(product.specs || {}).length
        ? Object.entries(product.specs || {}).map(([key, value]) => ({ key, value: String(value) }))
        : [{ key: "", value: "" }]
    );
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
    setEditFeatures([]);
    setEditSpecs([]);
  };

  const saveEdit = async (id: string) => {
    setSaving(true);
    try {
      if (!isValidStoredImageUrl(editForm.image_url)) {
        throw new Error("Please upload product images through the Upload image button. Local file paths cannot work on the website.");
      }

      const specs: Record<string, string> = {};
      editSpecs.forEach((spec) => {
        if (spec.key.trim()) specs[spec.key.trim()] = spec.value.trim();
      });

      const payload = {
        ...editForm,
        features: editFeatures.filter((feature) => feature.trim()),
        specs,
      };

      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Save failed");
      }
      setEditingId(null);
      await fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (id: string, currentlyActive: boolean) => {
    try {
      setStatusChangeId(id);
      setError("");
      setNotice("");
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !currentlyActive }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Toggle failed");
      }
      await fetchProducts();
      setNotice(currentlyActive ? "Product archived and hidden from public pages." : "Product activated and visible on public pages.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to toggle product status");
    } finally {
      setStatusChangeId(null);
    }
  };

  const archiveProduct = async (id: string) => {
    try {
      setError("");
      setNotice("");
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Archive failed");
      }
      await fetchProducts();
      setNotice("Product archived and hidden from public pages.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to archive product");
    }
  };

  const updatePricingTier = (index: number, field: "min_days" | "per_day_cents", value: number) => {
    const tiers = [...(editForm.pricing_tiers || [])];
    tiers[index] = { ...tiers[index], [field]: value };
    setEditForm({ ...editForm, pricing_tiers: tiers });
  };

  const updateFeature = (index: number, value: string) => {
    const features = [...editFeatures];
    features[index] = value;
    setEditFeatures(features);
  };

  const updateSpec = (index: number, field: "key" | "value", value: string) => {
    const specs = [...editSpecs];
    specs[index] = { ...specs[index], [field]: value };
    setEditSpecs(specs);
  };

  const uploadProductImage = async (file: File) => {
    setError("");
    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("productSlug", editForm.slug || editForm.name || "product");

      const res = await fetch("/api/admin/products/upload-image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to upload image");
      }

      setEditForm({ ...editForm, image_url: data.imageUrl });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
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

  const visibleProducts = products.filter((product) => {
    if (statusFilter === "active") return product.is_active;
    if (statusFilter === "archived") return !product.is_active;
    return true;
  });
  const editImageUrl = isValidStoredImageUrl(editForm.image_url) ? editForm.image_url || "" : "";
  const hasInvalidEditImageUrl = Boolean(editForm.image_url && !isValidStoredImageUrl(editForm.image_url));

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
            {products.length} products · {products.filter((product) => product.is_active).length} active · {products.filter((product) => product.seo?.indexableEn).length} EN indexed · {products.filter((product) => product.seo?.indexableEs).length} ES indexed
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/products/import"
            className="px-4 py-2 rounded-lg border border-neutral-700 text-neutral-200 text-sm font-semibold transition-colors hover:bg-neutral-800">
            Import CSV
          </Link>
          <Link href="/admin/products/new"
            className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold transition-colors">
            + Add Product
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400 mb-4">
          {error}
          <button onClick={() => setError("")} className="ml-2 text-red-300 hover:text-white">✕</button>
        </div>
      )}

      {notice && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-sm text-emerald-300 mb-4">
          {notice}
          <button onClick={() => setNotice("")} className="ml-2 text-emerald-200 hover:text-white">×</button>
        </div>
      )}

      <div className="flex flex-wrap gap-1 mb-4">
        {(["active", "archived", "all"] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setStatusFilter(filter)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
              statusFilter === filter
                ? "bg-teal-500/10 text-teal-400"
                : "text-neutral-500 hover:text-white hover:bg-neutral-800"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-800">
                <th className="text-left p-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Product</th>
                <th className="text-left p-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Category</th>
                <th className="text-left p-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Price Range</th>
                <th className="text-left p-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Stock</th>
                <th className="text-left p-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Quality</th>
                <th className="text-left p-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Search</th>
                <th className="text-left p-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                <th className="text-right p-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {visibleProducts.map((product) => (
                <tr key={product.id} className="hover:bg-neutral-800/50 transition-colors">
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-white">{product.name}</p>
                      <p className="text-xs text-neutral-500">{product.brand} · {product.slug}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1.5">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${product.seo?.indexableEn ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-300"}`}
                        title={product.seo?.blockersEn.join(" · ") || "English product page is indexable"}
                      >
                        EN {product.seo?.indexableEn ? "indexed" : "blocked"}
                      </span>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${product.seo?.indexableEs ? "bg-emerald-500/10 text-emerald-400" : "bg-neutral-800 text-neutral-400"}`}
                        title={product.seo?.blockersEs.join(" · ") || "Spanish product page is indexable"}
                      >
                        ES {product.seo?.indexableEs ? "indexed" : "blocked"}
                      </span>
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
                    {(() => {
                      const issues = getProductReadinessIssues(product);
                      return issues.length === 0 ? (
                        <span className="text-xs font-medium text-emerald-400">Ready</span>
                      ) : (
                        <span className="text-xs font-medium text-amber-300" title={issues.join(" · ")}>Needs attention</span>
                      );
                    })()}
                    {(() => {
                      const contentStatus = CONTENT_REVIEW_STATUS[product.content_status || "draft"];
                      return <p className={`mt-1 text-xs font-medium ${contentStatus.className}`}>{contentStatus.label}</p>;
                    })()}
                  </td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${product.is_active ? "bg-emerald-500/10 text-emerald-400" : "bg-neutral-700 text-neutral-400"}`}>
                      {product.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => startEdit(product)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700 transition-colors"
                      >
                        Edit
                      </button>
                      <Link
                        href={`/admin/products/${product.id}/content`}
                        className="rounded-lg bg-neutral-800 px-3 py-1.5 text-xs text-neutral-300 transition-colors hover:bg-neutral-700 hover:text-white"
                      >
                        Content
                      </Link>
                      {product.is_active ? (
                        <button
                          onClick={() => archiveProduct(product.id)}
                          className="text-xs px-3 py-1.5 rounded-lg bg-red-600/20 text-red-300 hover:bg-red-600/40 transition-colors"
                        >
                          Archive
                        </button>
                      ) : product.content_status !== "content_ready" ? (
                        <Link
                          href={`/admin/products/${product.id}/content`}
                          className="rounded-lg bg-amber-500/15 px-3 py-1.5 text-xs font-medium text-amber-200 transition-colors hover:bg-amber-500/25"
                          title="Complete the publication checklist before activation"
                        >
                          Finish review
                        </Link>
                      ) : (
                        <button
                          onClick={() => toggleActive(product.id, false)}
                          disabled={statusChangeId === product.id}
                          className="text-xs px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/40 transition-colors disabled:cursor-wait disabled:opacity-50"
                        >
                          {statusChangeId === product.id ? "Activating..." : "Activate"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {visibleProducts.length === 0 && (
          <div className="p-8 text-center text-sm text-neutral-500">
            No {statusFilter === "all" ? "" : statusFilter} products found.
          </div>
        )}
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">Slug</label>
                  <input
                    type="text"
                    value={editForm.slug || ""}
                    onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">Category</label>
                  <select
                    value={editForm.category_id || ""}
                    onChange={(e) => setEditForm({ ...editForm, category_id: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                  >
                    <option value="">Select category...</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">Subcategory</label>
                  <input
                    type="text"
                    value={editForm.subcategory || ""}
                    onChange={(e) => setEditForm({ ...editForm, subcategory: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">Subcategory Slug</label>
                  <input
                    type="text"
                    value={editForm.subcategory_slug || ""}
                    onChange={(e) => setEditForm({ ...editForm, subcategory_slug: e.target.value })}
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

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Product Image</label>
                {hasInvalidEditImageUrl && (
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
                    This product has an invalid local file path saved as its image. Upload the image here to store it properly.
                  </div>
                )}
                {editImageUrl && (
                  <div className="mt-3 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950">
                    <img
                      src={editImageUrl}
                      alt="Product preview"
                      className="h-36 w-full object-contain"
                    />
                  </div>
                )}
                {!editImageUrl && !hasInvalidEditImageUrl && (
                  <div className="rounded-xl border border-dashed border-neutral-700 bg-neutral-950 p-6 text-center text-xs text-neutral-500">
                    Upload an image to store it in Supabase Storage.
                  </div>
                )}
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <label className="inline-flex cursor-pointer items-center rounded-lg bg-neutral-800 px-3 py-2 text-xs font-medium text-neutral-200 transition-colors hover:bg-neutral-700">
                    {uploadingImage ? "Uploading..." : "Upload image"}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      disabled={uploadingImage}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) void uploadProductImage(file);
                        e.currentTarget.value = "";
                      }}
                      className="sr-only"
                    />
                  </label>
                  {(editImageUrl || hasInvalidEditImageUrl) && (
                    <button
                      type="button"
                      onClick={() => setEditForm({ ...editForm, image_url: "" })}
                      className="rounded-lg border border-neutral-700 px-3 py-2 text-xs font-medium text-neutral-300 hover:bg-neutral-800"
                    >
                      Remove image
                    </button>
                  )}
                  <span className="text-xs text-neutral-500">JPG, PNG, WebP, GIF · max 5 MB</span>
                </div>
                {editImageUrl && (
                  <p className="mt-2 truncate text-xs text-neutral-500">
                    Stored image URL: {editImageUrl}
                  </p>
                )}
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

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-neutral-400">Features</label>
                  <button
                    type="button"
                    onClick={() => setEditFeatures([...editFeatures, ""])}
                    className="text-xs px-2 py-0.5 rounded bg-neutral-800 text-teal-400 hover:bg-neutral-700 transition-colors"
                  >
                    + Add
                  </button>
                </div>
                <div className="space-y-2">
                  {editFeatures.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                        placeholder="One-hand fold"
                      />
                      {editFeatures.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setEditFeatures(editFeatures.filter((_, featureIndex) => featureIndex !== index))}
                          className="px-2 text-neutral-600 hover:text-red-400 transition-colors"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-neutral-400">Specifications</label>
                  <button
                    type="button"
                    onClick={() => setEditSpecs([...editSpecs, { key: "", value: "" }])}
                    className="text-xs px-2 py-0.5 rounded bg-neutral-800 text-teal-400 hover:bg-neutral-700 transition-colors"
                  >
                    + Add
                  </button>
                </div>
                <div className="space-y-2">
                  {editSpecs.map((spec, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={spec.key}
                        onChange={(e) => updateSpec(index, "key", e.target.value)}
                        className="w-1/3 px-3 py-2.5 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                        placeholder="Weight"
                      />
                      <input
                        type="text"
                        value={spec.value}
                        onChange={(e) => updateSpec(index, "value", e.target.value)}
                        className="flex-1 px-3 py-2.5 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                        placeholder="7.5 kg"
                      />
                      {editSpecs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setEditSpecs(editSpecs.filter((_, specIndex) => specIndex !== index))}
                          className="px-2 text-neutral-600 hover:text-red-400 transition-colors"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
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
