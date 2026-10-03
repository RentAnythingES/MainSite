"use client";
import { type Locale } from "@/i18n/config";

import Link from "next/link";
import { useState } from "react";
import { api, Area, buttonClass, Field, formValues } from "./shared";

export default function ApplicationForm({ es: spanish = false, locale = spanish ? "es" : "en" }: { es?: boolean; locale?: Locale }) {
  const es = locale === "es";
  const [message, setMessage] = useState(""), [busy, setBusy] = useState(false), [done, setDone] = useState(false);
  if (done) return <div role="status" className="rounded-xl bg-teal-50 p-8 text-teal-900">{locale === "de" ? "Wir haben deine Bewerbung erhalten. Unser Team prüft deine Erfahrung und dein Servicegebiet und meldet sich wegen der nächsten Schritte bei dir." : (es ? "Hemos recibido tu solicitud. Nuestro equipo revisará tu experiencia y zona de servicio y se pondrá en contacto contigo." : "We have received your application. Our team will review your experience and service area and contact you about the next steps.")}</div>;
  return <form className="space-y-5 rounded-2xl border p-6 bg-white" onSubmit={async e => {
    const values = formValues(e); setBusy(true); setMessage("");
    try { await api("/api/agent/applications", { ...values, consent: values.consent === "on" }); setDone(true); }
    catch (error) { setMessage(locale === "de" ? "Deine Bewerbung konnte nicht gesendet werden. Bitte versuche es erneut." : error instanceof Error ? error.message : "Please try again."); } finally { setBusy(false); }
  }}>
    <div className="grid gap-4 sm:grid-cols-2">
      <Field name="full_name" label={locale === "de" ? "Vollständiger Name" : (es ? "Nombre completo" : "Full name")} />
      <Field name="email" type="email" label={locale === "de" ? "E-Mail-Adresse" : (es ? "Correo electrónico" : "Email")} />
      <Field name="phone" type="tel" maxLength={50} label={locale === "de" ? "Telefonnummer mit Ländervorwahl" : (es ? "Teléfono con prefijo internacional" : "Phone with country code")} />
      <Field name="business_name" required={false} label={locale === "de" ? "Unternehmensname (optional)" : (es ? "Empresa (opcional)" : "Business name (optional)")} />
      <Field name="country_code" maxLength={2} label={locale === "de" ? "Länderkürzel (z. B. ES)" : (es ? "Código de país (p. ej., ES)" : "Country code (e.g. ES)")} />
      <Field name="city" maxLength={100} label={locale === "de" ? "Stadt" : (es ? "Ciudad" : "City")} />
    </div>
    <Area name="area_of_operations" required label={locale === "de" ? "Servicegebiete und Lieferradius" : (es ? "Zonas y distancia máxima de entrega" : "Service areas and delivery radius")} />
    <Area name="experience" label={locale === "de" ? "Erfahrung mit Vermietung, Kundenbetreuung und Lieferungen" : (es ? "Experiencia con alquileres, atención al cliente y entregas" : "Experience with rentals, customer service and deliveries")} />
    <Area name="equipment" label={locale === "de" ? "Verfügbare Ausstattung, Fahrzeuge und Lagerflächen" : (es ? "Equipos, vehículos y almacenamiento disponibles" : "Available equipment, vehicles and storage")} />
    <div hidden aria-hidden="true"><input name="website" tabIndex={-1} autoComplete="off" /></div>
    <label className="flex items-start gap-3 text-sm"><input name="consent" type="checkbox" required className="mt-1" /><span>{locale === "de" ? "Ich bin damit einverstanden, dass Rentandroll meine Bewerbung prüft und mich kontaktiert. Ich habe die " : (es ? "Autorizo a Rentandroll a revisar mi solicitud y contactarme. He leído la " : "I agree that Rentandroll may review my application and contact me. I have read the ")}<Link className="underline" href={locale === "de" ? "/de/privacy" : (es ? "/es/privacy" : "/privacy")}>{locale === "de" ? "Datenschutzerklärung gelesen" : (es ? "política de privacidad" : "privacy policy")}</Link>.</span></label>
    {message && <p role="alert" className="text-red-700">{message}</p>}
    <button className={buttonClass} disabled={busy}>{busy ? (locale === "de" ? "Wird gesendet …" : (es ? "Enviando…" : "Sending…")) : (locale === "de" ? "Bewerbung senden" : (es ? "Enviar solicitud" : "Submit application"))}</button>
    <p className="text-sm text-neutral-500">{locale === "de" ? "Mit der Bewerbung wird kein Konto erstellt und eine Zusage ist nicht garantiert. Wir vereinbaren das Servicegebiet und die Bedingungen mit dir, bevor wir ein Konto aktivieren." : (es ? "Enviar una solicitud no crea una cuenta ni garantiza su aprobación. Acordaremos contigo la cobertura y las condiciones antes de activar tu cuenta." : "Applying does not create an account or guarantee approval. We will agree on coverage and operating terms with you before activating an account.")}</p>
  </form>;
}
