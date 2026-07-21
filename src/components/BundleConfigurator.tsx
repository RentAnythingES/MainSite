"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import type { RentalBundle } from "@/data/bundles";
import { trackEvent } from "@/lib/analytics";

interface BundleConfiguratorProps {
  bundle: RentalBundle;
}

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export default function BundleConfigurator({ bundle }: BundleConfiguratorProps) {
  const [startDate, setStartDate] = useState(todayIsoDate());
  const [endDate, setEndDate] = useState("");
  const [area, setArea] = useState("");
  const [notes, setNotes] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [website, setWebsite] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [requestRef, setRequestRef] = useState("");
  const [selectedItems, setSelectedItems] = useState(() => new Set(bundle.includedItems.map((item) => item.name)));
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set());

  const selectedItemNames = useMemo(
    () => bundle.includedItems.filter((item) => selectedItems.has(item.name)).map((item) => item.name),
    [bundle.includedItems, selectedItems]
  );

  const selectedAddonNames = useMemo(
    () => bundle.addons.filter((addon) => selectedAddons.has(addon.name)).map((addon) => addon.name),
    [bundle.addons, selectedAddons]
  );

  function toggleItem(itemName: string) {
    setSelectedItems((current) => {
      const next = new Set(current);
      if (next.has(itemName)) {
        next.delete(itemName);
      } else {
        next.add(itemName);
      }
      return next;
    });
  }

  function toggleAddon(addonName: string) {
    setSelectedAddons((current) => {
      const next = new Set(current);
      if (next.has(addonName)) {
        next.delete(addonName);
      } else {
        next.add(addonName);
      }
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError("");

    trackEvent("bundle_request_submit", {
      event_category: "bundle",
      bundle_slug: bundle.slug,
      selected_items: selectedItemNames.length,
      selected_addons: selectedAddonNames.length,
    });

    try {
      const response = await fetch("/api/bundle-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bundleSlug: bundle.slug,
          customerName,
          customerEmail,
          customerPhone,
          startDate,
          endDate,
          area,
          selectedItems: selectedItemNames,
          selectedAddons: selectedAddonNames,
          notes,
          consentAccepted,
          website,
          sourcePath: window.location.pathname,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save your request");

      setRequestRef(data.requestRef);
      trackEvent("bundle_request_saved", {
        event_category: "bundle",
        bundle_slug: bundle.slug,
      });
      window.location.assign(data.whatsappUrl);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Could not save your request");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="section bg-white" id="configure-kit">
      <form className="container-site" onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <span className="badge badge-brand mb-3">Build your request</span>
            <h2 className="text-3xl font-bold mb-3">Configure this kit</h2>
            <p className="text-neutral-600 leading-relaxed max-w-2xl mb-8">
              This is the first version of bundle configurability. It does not reserve inventory yet; it creates a structured request so we can confirm the best available setup directly.
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <label className="block">
                <span className="block text-sm font-semibold text-neutral-700 mb-2">Start date</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                  min={todayIsoDate()}
                  required
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
              </label>
              <label className="block">
                <span className="block text-sm font-semibold text-neutral-700 mb-2">End date</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                  min={startDate || todayIsoDate()}
                  required
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
              </label>
              <label className="md:col-span-2 block">
                <span className="block text-sm font-semibold text-neutral-700 mb-2">Accommodation area</span>
                <input
                  type="text"
                  value={area}
                  onChange={(event) => setArea(event.target.value)}
                  placeholder="e.g. Ruzafa, Patacona, Paterna, hotel name, Airbnb area"
                  required
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
              </label>
            </div>

            <div className="mb-8">
              <h3 className="font-bold text-xl mb-4">Included items</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {bundle.includedItems.map((item) => (
                  <label
                    key={item.name}
                    className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                      selectedItems.has(item.name)
                        ? "border-brand bg-brand/5"
                        : "border-border bg-white hover:border-brand/40"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(item.name)}
                        onChange={() => toggleItem(item.name)}
                        className="mt-1 h-4 w-4 accent-brand"
                      />
                      <div>
                        <p className="font-semibold text-neutral-800">{item.name}</p>
                        {item.note && <p className="mt-1 text-sm text-neutral-500">{item.note}</p>}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-bold text-xl mb-4">Optional add-ons</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {bundle.addons.map((addon) => (
                  <label
                    key={addon.name}
                    className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                      selectedAddons.has(addon.name)
                        ? "border-amber-400 bg-amber-50"
                        : "border-border bg-white hover:border-amber-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedAddons.has(addon.name)}
                        onChange={() => toggleAddon(addon.name)}
                        className="mt-1 h-4 w-4 accent-amber-500"
                      />
                      <div>
                        <p className="font-semibold text-neutral-800">{addon.name}</p>
                        <p className="mt-1 text-sm text-neutral-500">{addon.note}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <label className="block">
              <span className="block text-sm font-semibold text-neutral-700 mb-2">Anything we should know?</span>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={4}
                placeholder="Child ages, lift access, apartment constraints, delivery timing, special requests..."
                className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
            </label>

            <div className="mt-8 border-t border-border pt-8">
              <h3 className="text-xl font-bold mb-4">Where should we reply?</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="block text-sm font-semibold text-neutral-700 mb-2">Name</span>
                  <input type="text" value={customerName} onChange={(event) => setCustomerName(event.target.value)} autoComplete="name" required maxLength={120} className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20" />
                </label>
                <label className="block">
                  <span className="block text-sm font-semibold text-neutral-700 mb-2">Email</span>
                  <input type="email" value={customerEmail} onChange={(event) => setCustomerEmail(event.target.value)} autoComplete="email" required maxLength={254} className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20" />
                </label>
                <label className="block sm:col-span-2">
                  <span className="block text-sm font-semibold text-neutral-700 mb-2">WhatsApp number <span className="font-normal text-neutral-400">(optional)</span></span>
                  <input type="tel" value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} autoComplete="tel" maxLength={50} className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20" />
                </label>
              </div>
              <label className="mt-5 flex items-start gap-3 text-sm text-neutral-600">
                <input type="checkbox" checked={consentAccepted} onChange={(event) => setConsentAccepted(event.target.checked)} required className="mt-1 h-4 w-4 accent-brand" />
                <span>
                  I agree that RentAnything.es may use these details to answer and manage my kit request. See our <Link href="/privacy" className="font-semibold text-brand hover:underline">privacy policy</Link>.
                </span>
              </label>
              <label className="absolute -left-[10000px]" aria-hidden="true">
                Website
                <input type="text" value={website} onChange={(event) => setWebsite(event.target.value)} tabIndex={-1} autoComplete="off" />
              </label>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 h-fit">
            <div className="card p-6 bg-neutral-50">
              <h3 className="text-xl font-bold mb-4">Request summary</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-semibold text-neutral-800">Dates</p>
                  <p className="text-neutral-500">{startDate || "Not sure yet"} → {endDate || "Not sure yet"}</p>
                </div>
                <div>
                  <p className="font-semibold text-neutral-800">Items selected</p>
                  <p className="text-neutral-500">{selectedItemNames.length} included · {selectedAddonNames.length} add-ons</p>
                </div>
                <div>
                  <p className="font-semibold text-neutral-800">Next step</p>
                  <p className="text-neutral-500">We confirm stock, substitutions, delivery/collection, and pricing directly.</p>
                </div>
              </div>
              {submitError && (
                <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {submitError} If it continues, message us directly on WhatsApp.
                </p>
              )}
              {requestRef && (
                <p className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  Request saved as <strong>{requestRef}</strong>.
                </p>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary w-full mt-6"
                id={`bundle-configurator-whatsapp-${bundle.slug}`}
              >
                {submitting ? "Saving request…" : "Save request & open WhatsApp"}
              </button>
              <p className="mt-3 text-xs text-neutral-400 text-center">
                We save your choices first, then open WhatsApp. No payment is taken until availability and pricing are confirmed.
              </p>
            </div>
          </aside>
        </div>
      </form>
    </section>
  );
}
