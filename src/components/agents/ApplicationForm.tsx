"use client";
import Link from "next/link";
import { useState } from "react";
import { api, Area, buttonClass, Field, formValues } from "./shared";

export default function ApplicationForm({ es = false }: { es?: boolean }) {
  const [message, setMessage] = useState(""), [busy, setBusy] = useState(false), [done, setDone] = useState(false);
  if (done) return <div role="status" className="rounded-xl bg-teal-50 p-8 text-teal-900">{es ? "Hemos recibido tu solicitud. Nuestro equipo revisará tu experiencia y zona de servicio y se pondrá en contacto contigo." : "We have received your application. Our team will review your experience and service area and contact you about the next steps."}</div>;
  return <form className="space-y-5 rounded-2xl border p-6 bg-white" onSubmit={async e => {
    const values = formValues(e); setBusy(true); setMessage("");
    try { await api("/api/agent/applications", { ...values, consent: values.consent === "on" }); setDone(true); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Please try again."); } finally { setBusy(false); }
  }}>
    <div className="grid gap-4 sm:grid-cols-2">
      <Field name="full_name" label={es ? "Nombre completo" : "Full name"} />
      <Field name="email" type="email" label={es ? "Correo electrónico" : "Email"} />
      <Field name="phone" type="tel" maxLength={50} label={es ? "Teléfono con prefijo internacional" : "Phone with country code"} />
      <Field name="business_name" required={false} label={es ? "Empresa (opcional)" : "Business name (optional)"} />
      <Field name="country_code" maxLength={2} label={es ? "Código de país (p. ej., ES)" : "Country code (e.g. ES)"} />
      <Field name="city" maxLength={100} label={es ? "Ciudad" : "City"} />
    </div>
    <Area name="area_of_operations" required label={es ? "Zonas y distancia máxima de entrega" : "Service areas and delivery radius"} />
    <Area name="experience" label={es ? "Experiencia con alquileres, atención al cliente y entregas" : "Experience with rentals, customer service and deliveries"} />
    <Area name="equipment" label={es ? "Equipos, vehículos y almacenamiento disponibles" : "Available equipment, vehicles and storage"} />
    <div hidden aria-hidden="true"><input name="website" tabIndex={-1} autoComplete="off" /></div>
    <label className="flex items-start gap-3 text-sm"><input name="consent" type="checkbox" required className="mt-1" /><span>{es ? "Autorizo a Rentandroll a revisar mi solicitud y contactarme. He leído la " : "I agree that Rentandroll may review my application and contact me. I have read the "}<Link className="underline" href={es ? "/es/privacy" : "/privacy"}>{es ? "política de privacidad" : "privacy policy"}</Link>.</span></label>
    {message && <p role="alert" className="text-red-700">{message}</p>}
    <button className={buttonClass} disabled={busy}>{busy ? (es ? "Enviando…" : "Sending…") : (es ? "Enviar solicitud" : "Submit application")}</button>
    <p className="text-sm text-neutral-500">{es ? "Enviar una solicitud no crea una cuenta ni garantiza su aprobación. Acordaremos contigo la cobertura y las condiciones antes de activar tu cuenta." : "Applying does not create an account or guarantee approval. We will agree on coverage and operating terms with you before activating an account."}</p>
  </form>;
}
