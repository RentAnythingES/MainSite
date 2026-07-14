"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type Locale = "en" | "es";
type Localization = {
  locale: Locale;
  short_description: string;
  detail_description: string;
  includes_text: string;
  constraints_text: string;
  delivery_setup_note: string;
  care_note: string;
  seo_title: string;
  seo_description: string;
};
type Faq = { locale: Locale; question: string; answer: string; sort_order: number };
type PrimaryImage = { alt_text: string; source_url: string; rights_status: string };

const blankLocalization = (locale: Locale): Localization => ({
  locale, short_description: "", detail_description: "", includes_text: "", constraints_text: "",
  delivery_setup_note: "", care_note: "", seo_title: "", seo_description: "",
});

export default function ProductContentPage() {
  const params = useParams<{ id: string }>();
  const [locale, setLocale] = useState<Locale>("en");
  const [product, setProduct] = useState<{ name: string; slug: string; image_url: string | null; content_status: string } | null>(null);
  const [localizations, setLocalizations] = useState<Localization[]>([blankLocalization("en"), blankLocalization("es")]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [primaryImage, setPrimaryImage] = useState<PrimaryImage>({ alt_text: "", source_url: "", rights_status: "unknown" });
  const [readiness, setReadiness] = useState<{ ready: boolean; missing: string[] }>({ ready: false, missing: [] });
  const [status, setStatus] = useState("draft");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadContent = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/products/${params.id}/content`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load product content");
      setProduct(data.product);
      setStatus(data.product.content_status || "draft");
      setReadiness(data.readiness);
      setLocalizations((["en", "es"] as Locale[]).map((item) => ({ ...blankLocalization(item), ...(data.product.product_localizations || []).find((value: Localization) => value.locale === item) })));
      setFaqs((data.product.product_faqs || []).map((faq: Faq) => ({ ...faq })));
      const image = (data.product.product_images || []).find((value: { is_primary: boolean }) => value.is_primary);
      setPrimaryImage({ alt_text: image?.alt_text || data.product.name, source_url: image?.source_url || "", rights_status: image?.rights_status || "unknown" });
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load product content");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => { void loadContent(); }, [loadContent]);

  const activeLocalization = localizations.find((item) => item.locale === locale) || blankLocalization(locale);
  const localeFaqs = faqs.filter((faq) => faq.locale === locale);
  const updateLocalization = (field: keyof Localization, value: string) => setLocalizations((items) => items.map((item) => item.locale === locale ? { ...item, [field]: value } : item));
  const updateFaq = (index: number, field: "question" | "answer", value: string) => {
    const target = localeFaqs[index];
    setFaqs((items) => items.map((item) => item === target ? { ...item, [field]: value } : item));
  };

  const save = async () => {
    setSaving(true); setError(""); setNotice("");
    try {
      const response = await fetch(`/api/admin/products/${params.id}/content`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content_status: status, localizations, faqs, primary_image: primaryImage }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save product content");
      setReadiness(data.readiness); setNotice("Product content saved.");
    } catch (saveError) { setError(saveError instanceof Error ? saveError.message : "Could not save product content"); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="text-neutral-500">Loading product content...</div>;
  if (!product) return <div className="text-red-300">{error || "Product not found"}</div>;

  const inputClass = "w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2.5 text-sm text-white focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30";
  const labelClass = "mb-1.5 block text-xs font-medium text-neutral-400";

  return <div className="max-w-5xl">
    <div className="mb-6 flex items-center gap-4">
      <Link href="/admin/products" className="text-sm text-neutral-500 hover:text-white">← Products</Link>
      <div><h1 className="text-2xl font-bold text-white">Product content</h1><p className="mt-1 text-sm text-neutral-500">{product.name} · {product.slug}</p></div>
    </div>
    {error && <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">{error}</div>}
    {notice && <div className="mb-4 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-300">{notice}</div>}
    <div className="mb-6 rounded-xl border border-neutral-800 bg-neutral-900 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="font-semibold text-white">Publication checklist</p><p className="mt-1 max-w-2xl text-sm text-neutral-400">Complete every item below, choose <strong className="text-neutral-200">Content ready</strong>, and save. You can then return to Products and activate the listing.</p></div><div><label className="mb-1 block text-xs font-medium text-neutral-400">Editorial status</label><select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white"><option value="draft">Draft — still being prepared</option><option value="facts_verified">Facts verified — details checked</option><option value="content_ready">Content ready — approved to publish</option></select></div></div>
      {!readiness.ready && <ul className="mt-4 grid gap-1 text-sm text-amber-300">{readiness.missing.map((item) => <li key={item}>• {item}</li>)}</ul>}
    </div>
    <div className="mb-5 flex gap-2"><button onClick={() => setLocale("en")} className={`rounded-lg px-3 py-2 text-sm ${locale === "en" ? "bg-teal-600 text-white" : "bg-neutral-800 text-neutral-400"}`}>English</button><button onClick={() => setLocale("es")} className={`rounded-lg px-3 py-2 text-sm ${locale === "es" ? "bg-teal-600 text-white" : "bg-neutral-800 text-neutral-400"}`}>Spanish</button></div>
    <div className="space-y-5">
      <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-6"><h2 className="mb-4 font-semibold text-white">{locale === "en" ? "English" : "Spanish"} page copy</h2><div className="space-y-4">
        <div><label className={labelClass}>Short description</label><textarea value={activeLocalization.short_description} onChange={(event) => updateLocalization("short_description", event.target.value)} rows={3} className={inputClass} /></div>
        <div><label className={labelClass}>Product detail copy</label><textarea value={activeLocalization.detail_description} onChange={(event) => updateLocalization("detail_description", event.target.value)} rows={6} className={inputClass} /></div>
        <div className="grid gap-4 md:grid-cols-2"><div><label className={labelClass}>What is included</label><textarea value={activeLocalization.includes_text} onChange={(event) => updateLocalization("includes_text", event.target.value)} rows={3} className={inputClass} /></div><div><label className={labelClass}>Constraints and fit</label><textarea value={activeLocalization.constraints_text} onChange={(event) => updateLocalization("constraints_text", event.target.value)} rows={3} className={inputClass} /></div></div>
        <div className="grid gap-4 md:grid-cols-2"><div><label className={labelClass}>Delivery and setup</label><textarea value={activeLocalization.delivery_setup_note} onChange={(event) => updateLocalization("delivery_setup_note", event.target.value)} rows={3} className={inputClass} /></div><div><label className={labelClass}>Care, hygiene, or safety</label><textarea value={activeLocalization.care_note} onChange={(event) => updateLocalization("care_note", event.target.value)} rows={3} className={inputClass} /></div></div>
      </div></section>
      <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-6"><h2 className="mb-4 font-semibold text-white">Search snippet</h2><div className="space-y-4"><div><label className={labelClass}>SEO title</label><input value={activeLocalization.seo_title} onChange={(event) => updateLocalization("seo_title", event.target.value)} className={inputClass} /><p className="mt-1 text-xs text-neutral-500">{activeLocalization.seo_title.length}/60 characters</p></div><div><label className={labelClass}>SEO description</label><textarea value={activeLocalization.seo_description} onChange={(event) => updateLocalization("seo_description", event.target.value)} rows={3} className={inputClass} /><p className="mt-1 text-xs text-neutral-500">{activeLocalization.seo_description.length}/155 characters</p></div></div></section>
      <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-6"><h2 className="font-semibold text-white">Primary image permission</h2><p className="mb-4 mt-1 text-sm text-neutral-400">This check prevents us from publishing an image we are not allowed to use. Choose the option that is factually true. If none applies, upload a photo we took ourselves before publishing.</p>{product.image_url ? <div className="grid gap-4 md:grid-cols-[180px_1fr]"><img src={product.image_url} alt="Current product" className="h-36 w-full rounded-lg bg-neutral-950 object-contain" /><div className="space-y-4"><div><label className={labelClass}>Accessible image description</label><input value={primaryImage.alt_text} onChange={(event) => setPrimaryImage({ ...primaryImage, alt_text: event.target.value })} className={inputClass} /></div><div className="grid gap-4 md:grid-cols-2"><div><label className={labelClass}>Why are we allowed to use this image?</label><select value={primaryImage.rights_status} onChange={(event) => setPrimaryImage({ ...primaryImage, rights_status: event.target.value })} className={inputClass}><option value="unknown">Not confirmed — blocks publication</option><option value="owned">We took or created this image</option><option value="licensed">We have permission or a licence</option><option value="manufacturer_approved">Manufacturer approved it for our catalogue</option></select><p className="mt-1 text-xs text-neutral-500">Do not guess. The selected reason is kept as an internal compliance record.</p></div><div><label className={labelClass}>Where did the image come from?</label><input value={primaryImage.source_url} onChange={(event) => setPrimaryImage({ ...primaryImage, source_url: event.target.value })} placeholder="Source page, supplier file, or internal note" className={inputClass} /></div></div></div></div> : <p className="text-sm text-amber-300">Upload an approved product image from the product editor first.</p>}</section>
      <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-6"><div className="mb-4 flex items-center justify-between"><h2 className="font-semibold text-white">{locale === "en" ? "English" : "Spanish"} FAQs</h2><button type="button" onClick={() => setFaqs([...faqs, { locale, question: "", answer: "", sort_order: localeFaqs.length }])} className="rounded-lg bg-neutral-800 px-3 py-2 text-xs font-medium text-teal-300 hover:bg-neutral-700">+ Add FAQ</button></div><div className="space-y-4">{localeFaqs.map((faq, index) => <div key={`${faq.locale}-${index}`} className="rounded-lg border border-neutral-800 p-4"><input placeholder="Question" value={faq.question} onChange={(event) => updateFaq(index, "question", event.target.value)} className={inputClass} /><textarea placeholder="Answer" value={faq.answer} onChange={(event) => updateFaq(index, "answer", event.target.value)} rows={3} className={`${inputClass} mt-3`} /></div>)}{localeFaqs.length === 0 && <p className="text-sm text-neutral-500">Add three genuine pre-rental questions before marking this product content ready.</p>}</div></section>
      <div className="flex justify-end"><button onClick={() => void save()} disabled={saving} className="rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-500 disabled:opacity-50">{saving ? "Saving..." : status === "content_ready" ? "Save and approve for publication" : "Save content"}</button></div>
    </div>
  </div>;
}
