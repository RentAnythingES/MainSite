"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  slug: string;
  name: string;
}

interface PricingTier {
  min_days: number;
  per_day_cents: number;
}

const DEFAULT_TIERS: PricingTier[] = [
  { min_days: 1, per_day_cents: 1500 },
  { min_days: 3, per_day_cents: 1200 },
  { min_days: 7, per_day_cents: 800 },
  { min_days: 14, per_day_cents: 600 },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function AddProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [autoSlug, setAutoSlug] = useState(true);

  // Form state
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [subcategorySlug, setSubcategorySlug] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [stockTotal, setStockTotal] = useState(1);
  const [features, setFeatures] = useState<string[]>([""]);
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([{ key: "", value: "" }]);
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>(DEFAULT_TIERS);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((data) => setCategories(data.categories || []))
      .catch(() => setError("Failed to load categories"));
  }, []);

  // Auto-generate slug from name
  useEffect(() => {
    if (autoSlug && name) {
      setSlug(slugify(name));
    }
  }, [name, autoSlug]);

  const addFeature = () => setFeatures([...features, ""]);
  const removeFeature = (i: number) => setFeatures(features.filter((_, idx) => idx !== i));
  const updateFeature = (i: number, val: string) => {
    const updated = [...features];
    updated[i] = val;
    setFeatures(updated);
  };

  const addSpec = () => setSpecs([...specs, { key: "", value: "" }]);
  const removeSpec = (i: number) => setSpecs(specs.filter((_, idx) => idx !== i));
  const updateSpec = (i: number, field: "key" | "value", val: string) => {
    const updated = [...specs];
    updated[i] = { ...updated[i], [field]: val };
    setSpecs(updated);
  };

  const addTier = () => setPricingTiers([...pricingTiers, { min_days: 30, per_day_cents: 500 }]);
  const removeTier = (i: number) => setPricingTiers(pricingTiers.filter((_, idx) => idx !== i));
  const updateTier = (i: number, field: "min_days" | "per_day_cents", val: number) => {
    const updated = [...pricingTiers];
    updated[i] = { ...updated[i], [field]: val };
    setPricingTiers(updated);
  };

  const handleImageUpload = async (file: File) => {
    setError("");
    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("productSlug", slug || slugify(name) || "new-product");

      const res = await fetch("/api/admin/products/upload-image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to upload image");
      }

      setImageUrl(data.imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    // Build specs object
    const specsObj: Record<string, string> = {};
    specs.forEach((s) => {
      if (s.key.trim()) specsObj[s.key.trim()] = s.value.trim();
    });

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          name,
          brand,
          description,
          category_id: categoryId,
          subcategory,
          subcategory_slug: subcategorySlug || slugify(subcategory),
          image_url: imageUrl || null,
          stock_total: stockTotal,
          stock_available: stockTotal,
          features: features.filter((f) => f.trim()),
          specs: specsObj,
          pricing_tiers: pricingTiers,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create product");
      }

      router.push("/admin/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product");
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-3 py-2.5 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 placeholder:text-neutral-600";
  const labelClass = "block text-xs font-medium text-neutral-400 mb-1.5";

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()} className="text-neutral-500 hover:text-white text-sm">
          ← Back
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Add New Product</h1>
          <p className="text-neutral-500 text-sm mt-0.5">Fill in the product details below</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400 mb-4">
          {error}
          <button onClick={() => setError("")} className="ml-2 text-red-300 hover:text-white">✕</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        {/* Basic Info */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider mb-4">Basic Information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Product Name *</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                className={inputClass} placeholder="Compact Folding Stroller" />
            </div>
            <div>
              <label className={labelClass}>Brand *</label>
              <input type="text" required value={brand} onChange={(e) => setBrand(e.target.value)}
                className={inputClass} placeholder="Kinderkraft" />
            </div>
          </div>

          <div className="mt-4">
            <label className={labelClass}>
              Slug *
              <button type="button" onClick={() => setAutoSlug(!autoSlug)}
                className={`ml-2 text-xs ${autoSlug ? "text-teal-400" : "text-neutral-600"}`}>
                {autoSlug ? "(auto)" : "(manual)"}
              </button>
            </label>
            <input type="text" required value={slug}
              onChange={(e) => { setAutoSlug(false); setSlug(e.target.value); }}
              className={inputClass} placeholder="compact-stroller" />
          </div>

          <div className="mt-4">
            <label className={labelClass}>Description *</label>
            <textarea required rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
              className={`${inputClass} resize-none`}
              placeholder="Lightweight stroller perfect for navigating Valencia's old town..." />
          </div>
        </div>

        {/* Category */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider mb-4">Category</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Category *</label>
              <select required value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
                className={inputClass}>
                <option value="">Select category...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Subcategory *</label>
              <input type="text" required value={subcategory} onChange={(e) => setSubcategory(e.target.value)}
                className={inputClass} placeholder="Strollers" />
            </div>
            <div>
              <label className={labelClass}>Subcategory Slug</label>
              <input type="text" value={subcategorySlug} onChange={(e) => setSubcategorySlug(e.target.value)}
                className={inputClass} placeholder="strollers (auto)" />
            </div>
          </div>
        </div>

        {/* Image & Stock */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider mb-4">Image & Stock</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Image URL</label>
              <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
                className={inputClass} placeholder="/products/my-product.png" />
              <div className="mt-2 flex items-center gap-3">
                <label className="inline-flex cursor-pointer items-center rounded-lg bg-neutral-800 px-3 py-2 text-xs font-medium text-neutral-200 transition-colors hover:bg-neutral-700">
                  {uploadingImage ? "Uploading..." : "Upload image"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    disabled={uploadingImage}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void handleImageUpload(file);
                      e.currentTarget.value = "";
                    }}
                    className="sr-only"
                  />
                </label>
                <span className="text-xs text-neutral-500">JPG, PNG, WebP, GIF · max 5 MB</span>
              </div>
              {imageUrl && (
                <p className="mt-2 truncate text-xs text-neutral-500">Saved image: {imageUrl}</p>
              )}
            </div>
            <div>
              <label className={labelClass}>Stock Quantity *</label>
              <input type="number" required min={1} value={stockTotal}
                onChange={(e) => setStockTotal(parseInt(e.target.value) || 1)}
                className={inputClass} />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider">Features</h2>
            <button type="button" onClick={addFeature}
              className="text-xs px-2.5 py-1 rounded-lg bg-neutral-800 text-teal-400 hover:bg-neutral-700 transition-colors">
              + Add
            </button>
          </div>
          <div className="space-y-2">
            {features.map((feat, i) => (
              <div key={i} className="flex gap-2">
                <input type="text" value={feat} onChange={(e) => updateFeature(i, e.target.value)}
                  className={`${inputClass} flex-1`} placeholder="One-hand fold" />
                {features.length > 1 && (
                  <button type="button" onClick={() => removeFeature(i)}
                    className="px-2 text-neutral-600 hover:text-red-400 transition-colors">✕</button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Specs */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider">Specifications</h2>
            <button type="button" onClick={addSpec}
              className="text-xs px-2.5 py-1 rounded-lg bg-neutral-800 text-teal-400 hover:bg-neutral-700 transition-colors">
              + Add
            </button>
          </div>
          <div className="space-y-2">
            {specs.map((spec, i) => (
              <div key={i} className="flex gap-2">
                <input type="text" value={spec.key} onChange={(e) => updateSpec(i, "key", e.target.value)}
                  className={`${inputClass} w-1/3`} placeholder="Weight" />
                <input type="text" value={spec.value} onChange={(e) => updateSpec(i, "value", e.target.value)}
                  className={`${inputClass} flex-1`} placeholder="7.5 kg" />
                {specs.length > 1 && (
                  <button type="button" onClick={() => removeSpec(i)}
                    className="px-2 text-neutral-600 hover:text-red-400 transition-colors">✕</button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider">Pricing Tiers</h2>
            <button type="button" onClick={addTier}
              className="text-xs px-2.5 py-1 rounded-lg bg-neutral-800 text-teal-400 hover:bg-neutral-700 transition-colors">
              + Add Tier
            </button>
          </div>
          <div className="space-y-2">
            {pricingTiers.map((tier, i) => (
              <div key={i} className="flex gap-2 items-center">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500">≥</span>
                  <input type="number" min={1} value={tier.min_days}
                    onChange={(e) => updateTier(i, "min_days", parseInt(e.target.value) || 1)}
                    className={`${inputClass} pl-7 pr-14`} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500">days</span>
                </div>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500">€</span>
                  <input type="number" min={0} step={0.01}
                    value={(tier.per_day_cents / 100).toFixed(2)}
                    onChange={(e) => updateTier(i, "per_day_cents", Math.round(parseFloat(e.target.value) * 100) || 0)}
                    className={`${inputClass} pl-7 pr-14`} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500">/day</span>
                </div>
                {pricingTiers.length > 1 && (
                  <button type="button" onClick={() => removeTier(i)}
                    className="px-2 text-neutral-600 hover:text-red-400 transition-colors">✕</button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving}
            className="px-6 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold transition-colors disabled:opacity-50">
            {saving ? "Creating..." : "Create Product"}
          </button>
          <button type="button" onClick={() => router.back()}
            className="px-6 py-2.5 rounded-lg text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}
