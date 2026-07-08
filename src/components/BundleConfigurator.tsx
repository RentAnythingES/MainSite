"use client";

import { useMemo, useState } from "react";
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

  const whatsappMessage = [
    `Hi! I would like to check the ${bundle.shortName} in Valencia.`,
    "",
    `Dates: ${startDate || "not sure yet"} to ${endDate || "not sure yet"}`,
    `Area/accommodation: ${area || "not sure yet"}`,
    "",
    "Included items I want:",
    ...(selectedItemNames.length > 0 ? selectedItemNames.map((item) => `- ${item}`) : ["- Please recommend the right setup"]),
    "",
    "Add-ons I am interested in:",
    ...(selectedAddonNames.length > 0 ? selectedAddonNames.map((addon) => `- ${addon}`) : ["- None yet"]),
    notes.trim() ? `\nNotes: ${notes.trim()}` : "",
  ].join("\n");

  const whatsappUrl = `https://wa.me/34684708013?text=${encodeURIComponent(whatsappMessage)}`;

  function handleWhatsAppClick() {
    trackEvent("bundle_configurator_whatsapp_click", {
      event_category: "bundle",
      bundle_slug: bundle.slug,
      selected_items: selectedItemNames.length,
      selected_addons: selectedAddonNames.length,
      has_dates: Boolean(startDate && endDate),
      has_area: Boolean(area.trim()),
    });
  }

  return (
    <section className="section bg-white" id="configure-kit">
      <div className="container-site">
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
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
              </label>
              <label className="block">
                <span className="block text-sm font-semibold text-neutral-700 mb-2">End date</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
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
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsAppClick}
                className="btn btn-primary w-full mt-6"
                id={`bundle-configurator-whatsapp-${bundle.slug}`}
              >
                Send request on WhatsApp
              </a>
              <p className="mt-3 text-xs text-neutral-400 text-center">
                No online payment for kits until availability is confirmed.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
