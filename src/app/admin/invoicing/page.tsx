"use client";

import { FormEvent, useEffect, useState } from "react";

type Settings = Record<string, string | number | boolean | null>;
const inputClass = "mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white focus:border-teal-500 focus:outline-none";

export default function AdminInvoicingPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/invoicing").then(async (response) => {
      const payload = await response.json();
      if (!response.ok || !payload.settings) throw new Error(payload.error || "Run the invoice compliance migration first.");
      setSettings(payload.settings);
    }).catch((reason) => setError(reason instanceof Error ? reason.message : "Failed to load invoice settings."));
  }, []);

  const update = (key: string, value: Settings[string]) => setSettings((current) => current ? { ...current, [key]: value } : current);
  const field = (label: string, key: string, type = "text") => <label className="text-sm text-neutral-300">{label}<input className={inputClass} type={type} value={String(settings?.[key] ?? "")} onChange={(event) => update(key, type === "number" ? Number(event.target.value) : event.target.value)} /></label>;

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!settings) return;
    setSaving(true); setError(""); setNotice("");
    try {
      const response = await fetch("/api/admin/invoicing", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Failed to save invoice settings.");
      setSettings(payload.settings); setNotice("Invoice settings saved.");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Failed to save invoice settings."); }
    finally { setSaving(false); }
  };

  if (!settings) return <p className="text-neutral-400">{error || "Loading invoice settings..."}</p>;
  const taxRate = Number(settings.default_tax_rate_bps || 0) / 100;
  const limit = Number(settings.simplified_invoice_limit_cents || 0) / 100;

  return <form onSubmit={save} className="max-w-4xl space-y-6">
    <div><h1 className="text-2xl font-bold text-white">Invoicing</h1><p className="mt-1 text-sm text-neutral-400">Legal issuer, IVA policy, invoice series, and compliance readiness.</p></div>
    {settings.tax_policy_status === "pending_adviser_confirmation" && <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">21% IVA-inclusive pricing is provisional. Confirm the tax treatment with your gestor before issuing customer invoices.</div>}
    {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">{error}</div>}{notice && <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">{notice}</div>}
    <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-5"><h2 className="font-bold text-white">Issuer identity</h2><div className="mt-4 grid gap-4 sm:grid-cols-2">{field("Legal name", "legal_name")}{field("Trading name", "trading_name")}{field("Domestic NIF/CIF", "domestic_tax_id")}{field("EU VAT ID", "eu_vat_id")}{field("Registered address", "address_line_1")}{field("Postcode", "postal_code")}{field("City", "city")}</div></section>
    <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-5"><h2 className="font-bold text-white">IVA and series</h2><div className="mt-4 grid gap-4 sm:grid-cols-3">{field("Default IVA %", "default_tax_rate_bps", "number")}{field("Simplified limit cents", "simplified_invoice_limit_cents", "number")}{field("Full series", "full_invoice_series_prefix")}{field("Simplified series", "simplified_invoice_series_prefix")}{field("Rectifying series", "rectifying_invoice_series_prefix")}</div><p className="mt-3 text-xs text-neutral-500">Current values: {taxRate}% IVA and €{limit.toFixed(2)} simplified-invoice limit. Enter IVA in basis points (21% = 2100) and limit in cents (€400 = 40000).</p></section>
    <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-5"><h2 className="font-bold text-white">Compliance</h2><div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="text-sm text-neutral-300">Tax policy<select className={inputClass} value={String(settings.tax_policy_status)} onChange={(event) => update("tax_policy_status", event.target.value)}><option value="pending_adviser_confirmation">Pending adviser confirmation</option><option value="confirmed">Confirmed by adviser</option></select></label><label className="text-sm text-neutral-300">VERI*FACTU readiness<select className={inputClass} value={String(settings.verifactu_status)} onChange={(event) => update("verifactu_status", event.target.value)}><option value="planned">Planned</option><option value="in_progress">In progress</option><option value="integrated">Integrated</option></select></label></div></section>
    <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-5"><h2 className="font-bold text-white">Accounting export</h2><p className="mt-1 text-sm text-neutral-400">Download one CSV row per issued invoice or rectifying invoice for your gestor.</p><a href="/api/admin/invoicing/export" className="mt-3 inline-flex rounded-lg border border-neutral-700 px-3 py-2 text-sm font-semibold text-neutral-200 hover:bg-neutral-800">Download issued documents CSV</a></section>
    <button disabled={saving} className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-500 disabled:opacity-50">{saving ? "Saving..." : "Save invoice settings"}</button>
  </form>;
}
