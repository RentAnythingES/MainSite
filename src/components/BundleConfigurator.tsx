"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import type { RentalBundle } from "@/data/bundles";
import { trackEvent } from "@/lib/analytics";

interface BundleConfiguratorProps {
  bundle: RentalBundle;
  locale?: "en" | "es";
}

type AvailabilityResult = {
  status: "available" | "unavailable" | "partial";
  knownRentalSubtotalCents: number;
  lines: Array<{
    name: string;
    status: "available" | "unavailable" | "manual_confirmation";
    maxAvailableQuantity: number | null;
    note: string | null;
  }>;
};

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

const copy = {
  en: {
    badge: "Build your request", title: "Configure this kit", intro: "This is the first version of bundle configurability. It does not reserve inventory yet; it creates a structured request so we can confirm the best available setup directly.",
    startDate: "Start date", endDate: "End date", area: "Accommodation area", areaPlaceholder: "e.g. Ruzafa, Patacona, Paterna, hotel name, Airbnb area",
    included: "Included items", addons: "Optional add-ons", notes: "Anything we should know?", notesPlaceholder: "Child ages, lift access, apartment constraints, delivery timing, special requests...",
    reply: "Where should we reply?", name: "Name", email: "Email", phone: "WhatsApp number", optional: "(optional)", consentBefore: "I agree that RentAnything.es may use these details to answer and manage my kit request. See our", privacy: "privacy policy",
    summary: "Request summary", dates: "Dates", unsure: "Not sure yet", selected: "Items selected", includedCount: "included", addonCount: "add-ons", next: "Next step", nextText: "We confirm stock, substitutions, delivery/collection, and pricing directly.",
    checking: "Checking inventory…", check: "Check known inventory", inventory: "Inventory check", available: "Known items available", unavailable: "Substitution needed", partial: "Partly confirmed", lineAvailable: "Available", lineUnavailable: "Unavailable", staffCheck: "Staff check",
    estimate: "Known-item rental estimate", estimateNote: "Staff confirm alternatives, delivery and final kit pricing.", directWhatsapp: "If it continues, message us directly on WhatsApp.", saved: "Request saved as", saving: "Saving request…", submit: "Save request & open WhatsApp", footer: "We save your choices first, then open WhatsApp. No payment is taken until availability and pricing are confirmed.",
    availabilityError: "Could not check availability", submitError: "Could not save your request",
  },
  es: {
    badge: "Prepara tu solicitud", title: "Configura este kit", intro: "Esta primera versión no reserva el inventario. Guarda una solicitud estructurada para que podamos confirmar directamente la mejor combinación disponible.",
    startDate: "Fecha de inicio", endDate: "Fecha de fin", area: "Zona del alojamiento", areaPlaceholder: "p. ej., Ruzafa, Patacona, Paterna, nombre del hotel o zona del apartamento",
    included: "Artículos incluidos", addons: "Extras opcionales", notes: "¿Hay algo que debamos saber?", notesPlaceholder: "Edades, acceso en ascensor, limitaciones del alojamiento, horario o solicitudes especiales...",
    reply: "¿Dónde debemos responder?", name: "Nombre", email: "Correo electrónico", phone: "Número de WhatsApp", optional: "(opcional)", consentBefore: "Acepto que RentAnything.es utilice estos datos para responder y gestionar mi solicitud. Consulta nuestra", privacy: "política de privacidad",
    summary: "Resumen de la solicitud", dates: "Fechas", unsure: "Por confirmar", selected: "Artículos seleccionados", includedCount: "incluidos", addonCount: "extras", next: "Siguiente paso", nextText: "Confirmamos directamente el stock, las sustituciones, la entrega o recogida y el precio.",
    checking: "Comprobando inventario…", check: "Comprobar inventario conocido", inventory: "Comprobación de inventario", available: "Artículos conocidos disponibles", unavailable: "Hace falta una sustitución", partial: "Confirmación parcial", lineAvailable: "Disponible", lineUnavailable: "No disponible", staffCheck: "Revisión manual",
    estimate: "Estimación de artículos conocidos", estimateNote: "Nuestro equipo confirma alternativas, entrega y precio final del kit.", directWhatsapp: "Si continúa, escríbenos directamente por WhatsApp.", saved: "Solicitud guardada como", saving: "Guardando solicitud…", submit: "Guardar y abrir WhatsApp", footer: "Primero guardamos tus elecciones y después abrimos WhatsApp. No se cobra nada hasta confirmar disponibilidad y precio.",
    availabilityError: "No se pudo comprobar la disponibilidad", submitError: "No se pudo guardar la solicitud",
  },
} as const;

export default function BundleConfigurator({ bundle, locale = "en" }: BundleConfiguratorProps) {
  const text = copy[locale];
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
  const [availability, setAvailability] = useState<AvailabilityResult | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState("");
  const [selectedItems, setSelectedItems] = useState(() => new Set(bundle.includedItems.map((item) => item.name)));
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set());

  const selectedItemNames = useMemo(
    () => bundle.includedItems.filter((item) => selectedItems.has(item.name)).map((item) => item.requestName || item.name),
    [bundle.includedItems, selectedItems]
  );

  const selectedAddonNames = useMemo(
    () => bundle.addons.filter((addon) => selectedAddons.has(addon.name)).map((addon) => addon.requestName || addon.name),
    [bundle.addons, selectedAddons]
  );

  function displayAvailabilityName(name: string) {
    return bundle.includedItems.find((item) => (item.requestName || item.name) === name)?.name
      || bundle.addons.find((addon) => (addon.requestName || addon.name) === name)?.name
      || name;
  }

  function toggleItem(itemName: string) {
    setAvailability(null);
    setAvailabilityError("");
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
    setAvailability(null);
    setAvailabilityError("");
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

  async function handleAvailabilityCheck() {
    setCheckingAvailability(true);
    setAvailabilityError("");
    setAvailability(null);
    try {
      const response = await fetch("/api/bundle-availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bundleSlug: bundle.slug,
          startDate,
          endDate,
          selectedItems: selectedItemNames,
          selectedAddons: selectedAddonNames,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || text.availabilityError);
      setAvailability(data);
      trackEvent("bundle_availability_check", {
        event_category: "bundle",
        bundle_slug: bundle.slug,
        result: data.status,
      });
    } catch (error) {
      setAvailabilityError(error instanceof Error ? error.message : text.availabilityError);
    } finally {
      setCheckingAvailability(false);
    }
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
      if (!response.ok) throw new Error(data.error || text.submitError);

      setRequestRef(data.requestRef);
      trackEvent("bundle_request_saved", {
        event_category: "bundle",
        bundle_slug: bundle.slug,
      });
      window.location.assign(data.whatsappUrl);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : text.submitError);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="section bg-white" id="configure-kit">
      <form className="container-site" onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <span className="badge badge-brand mb-3">{text.badge}</span>
            <h2 className="text-3xl font-bold mb-3">{text.title}</h2>
            <p className="text-neutral-600 leading-relaxed max-w-2xl mb-8">
              {text.intro}
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <label className="block">
                <span className="block text-sm font-semibold text-neutral-700 mb-2">{text.startDate}</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(event) => { setStartDate(event.target.value); setAvailability(null); }}
                  min={todayIsoDate()}
                  required
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
              </label>
              <label className="block">
                <span className="block text-sm font-semibold text-neutral-700 mb-2">{text.endDate}</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(event) => { setEndDate(event.target.value); setAvailability(null); }}
                  min={startDate || todayIsoDate()}
                  required
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
              </label>
              <label className="md:col-span-2 block">
                <span className="block text-sm font-semibold text-neutral-700 mb-2">{text.area}</span>
                <input
                  type="text"
                  value={area}
                  onChange={(event) => setArea(event.target.value)}
                  placeholder={text.areaPlaceholder}
                  required
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
              </label>
            </div>

            <div className="mb-8">
              <h3 className="font-bold text-xl mb-4">{text.included}</h3>
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
              <h3 className="font-bold text-xl mb-4">{text.addons}</h3>
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
              <span className="block text-sm font-semibold text-neutral-700 mb-2">{text.notes}</span>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={4}
                placeholder={text.notesPlaceholder}
                className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
            </label>

            <div className="mt-8 border-t border-border pt-8">
              <h3 className="text-xl font-bold mb-4">{text.reply}</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="block text-sm font-semibold text-neutral-700 mb-2">{text.name}</span>
                  <input type="text" value={customerName} onChange={(event) => setCustomerName(event.target.value)} autoComplete="name" required maxLength={120} className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20" />
                </label>
                <label className="block">
                  <span className="block text-sm font-semibold text-neutral-700 mb-2">{text.email}</span>
                  <input type="email" value={customerEmail} onChange={(event) => setCustomerEmail(event.target.value)} autoComplete="email" required maxLength={254} className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20" />
                </label>
                <label className="block sm:col-span-2">
                  <span className="block text-sm font-semibold text-neutral-700 mb-2">{text.phone} <span className="font-normal text-neutral-400">{text.optional}</span></span>
                  <input type="tel" value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} autoComplete="tel" maxLength={50} className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20" />
                </label>
              </div>
              <label className="mt-5 flex items-start gap-3 text-sm text-neutral-600">
                <input type="checkbox" checked={consentAccepted} onChange={(event) => setConsentAccepted(event.target.checked)} required className="mt-1 h-4 w-4 accent-brand" />
                <span>
                  {text.consentBefore} <Link href={locale === "es" ? "/es/privacy" : "/privacy"} className="font-semibold text-brand hover:underline">{text.privacy}</Link>.
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
              <h3 className="text-xl font-bold mb-4">{text.summary}</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-semibold text-neutral-800">{text.dates}</p>
                  <p className="text-neutral-500">{startDate || text.unsure} → {endDate || text.unsure}</p>
                </div>
                <div>
                  <p className="font-semibold text-neutral-800">{text.selected}</p>
                  <p className="text-neutral-500">{selectedItemNames.length} {text.includedCount} · {selectedAddonNames.length} {text.addonCount}</p>
                </div>
                <div>
                  <p className="font-semibold text-neutral-800">{text.next}</p>
                  <p className="text-neutral-500">{text.nextText}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAvailabilityCheck}
                disabled={checkingAvailability || !startDate || !endDate}
                className="btn btn-outline w-full mt-6 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {checkingAvailability ? text.checking : text.check}
              </button>
              {availabilityError && <p role="alert" className="mt-3 text-sm text-red-600">{availabilityError}</p>}
              {availability && (
                <div className="mt-4 rounded-2xl border border-border bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-neutral-800">{text.inventory}</p>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${availability.status === "available" ? "bg-emerald-100 text-emerald-700" : availability.status === "unavailable" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                      {availability.status === "available" ? text.available : availability.status === "unavailable" ? text.unavailable : text.partial}
                    </span>
                  </div>
                  <ul className="mt-3 space-y-2 text-xs">
                    {availability.lines.map((line) => (
                      <li key={line.name} className="flex items-start justify-between gap-3 border-t border-neutral-100 pt-2 first:border-0 first:pt-0">
                        <span className="text-neutral-600">{displayAvailabilityName(line.name)}</span>
                        <span className={`shrink-0 font-semibold ${line.status === "available" ? "text-emerald-700" : line.status === "unavailable" ? "text-red-700" : "text-amber-700"}`}>
                          {line.status === "available" ? text.lineAvailable : line.status === "unavailable" ? text.lineUnavailable : text.staffCheck}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {availability.knownRentalSubtotalCents > 0 && (
                    <p className="mt-3 border-t border-neutral-100 pt-3 text-xs text-neutral-500">
                      {text.estimate}: <strong className="text-neutral-700">€{(availability.knownRentalSubtotalCents / 100).toFixed(2)}</strong>. {text.estimateNote}
                    </p>
                  )}
                </div>
              )}
              {submitError && (
                <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {submitError} {text.directWhatsapp}
                </p>
              )}
              {requestRef && (
                <p className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {text.saved} <strong>{requestRef}</strong>.
                </p>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary w-full mt-4"
                id={`bundle-configurator-whatsapp-${bundle.slug}`}
              >
                {submitting ? text.saving : text.submit}
              </button>
              <p className="mt-3 text-xs text-neutral-400 text-center">
                {text.footer}
              </p>
            </div>
          </aside>
        </div>
      </form>
    </section>
  );
}
