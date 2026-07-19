"use client";

import { useState } from "react";
import Link from "next/link";

type Locale = "en" | "es";

const copy = {
  en: {
    organization: "Organisation",
    organizationPlaceholder: "Company, accommodation, brand, or publication",
    name: "Your name",
    email: "Work email",
    partnerType: "How would you like to work together?",
    choose: "Choose an option",
    types: [
      "Accommodation or property-management referral",
      "Travel, relocation, or concierge referral",
      "Product brand or distributor pilot",
      "Editorial or creator collaboration",
      "Other partnership",
    ],
    message: "What would a useful collaboration look like?",
    messagePlaceholder: "Tell us about your guests, audience, products, or proposed Valencia pilot.",
    submit: "Send partnership enquiry",
    sending: "Sending…",
    privacyLead: "By submitting, you agree to our",
    privacy: "Privacy Policy",
    successTitle: "Thank you — we’ll review the fit.",
    successBody: "We’ll reply by email with the most useful next step. We do not add partnership enquiries to marketing lists.",
    again: "Send another enquiry",
    error: "We could not send your enquiry. Please try again.",
  },
  es: {
    organization: "Organización",
    organizationPlaceholder: "Empresa, alojamiento, marca o publicación",
    name: "Tu nombre",
    email: "Correo profesional",
    partnerType: "¿Cómo te gustaría colaborar?",
    choose: "Elige una opción",
    types: [
      "Recomendación desde alojamiento o gestión de propiedades",
      "Recomendación de viajes, relocation o conserjería",
      "Piloto con marca o distribuidor",
      "Colaboración editorial o con creadores",
      "Otra colaboración",
    ],
    message: "¿Cómo sería una colaboración útil?",
    messagePlaceholder: "Cuéntanos sobre tus huéspedes, audiencia, productos o una propuesta de piloto en Valencia.",
    submit: "Enviar propuesta de colaboración",
    sending: "Enviando…",
    privacyLead: "Al enviar, aceptas nuestra",
    privacy: "Política de privacidad",
    successTitle: "Gracias — revisaremos la propuesta.",
    successBody: "Responderemos por correo con el siguiente paso más útil. No añadimos estas consultas a listas de marketing.",
    again: "Enviar otra propuesta",
    error: "No hemos podido enviar la propuesta. Inténtalo de nuevo.",
  },
} satisfies Record<Locale, Record<string, string | string[]>>;

export default function PartnerInquiryForm({ locale }: { locale: Locale }) {
  const text = copy[locale];
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const organization = String(formData.get("organization") || "").trim();
    const partnerType = String(formData.get("partnerType") || "").trim();
    const message = String(formData.get("message") || "").trim();

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          subject: `Partnership enquiry — ${partnerType}`,
          message: `Organisation: ${organization}\nPartnership type: ${partnerType}\nLocale: ${locale}\n\n${message}`,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null) as { error?: string } | null;
        throw new Error(payload?.error || text.error as string);
      }

      form.reset();
      setStatus("success");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : text.error as string);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-teal-200 bg-teal-50 p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand text-2xl text-white">✓</div>
        <h3 className="mb-2 text-xl font-bold">{text.successTitle}</h3>
        <p className="mx-auto mb-6 max-w-lg text-sm leading-6 text-neutral-600">{text.successBody}</p>
        <button type="button" onClick={() => setStatus("idle")} className="btn btn-outline">
          {text.again}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" id="partner-inquiry-form">
      <div>
        <label htmlFor="partner-organization" className="mb-1.5 block text-sm font-medium text-neutral-700">
          {text.organization}
        </label>
        <input
          id="partner-organization"
          name="organization"
          type="text"
          required
          maxLength={120}
          placeholder={text.organizationPlaceholder as string}
          className="w-full rounded-xl border border-border bg-neutral-50 px-4 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="partner-name" className="mb-1.5 block text-sm font-medium text-neutral-700">{text.name}</label>
          <input id="partner-name" name="name" type="text" required maxLength={100} className="w-full rounded-xl border border-border bg-neutral-50 px-4 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30" />
        </div>
        <div>
          <label htmlFor="partner-email" className="mb-1.5 block text-sm font-medium text-neutral-700">{text.email}</label>
          <input id="partner-email" name="email" type="email" required maxLength={254} className="w-full rounded-xl border border-border bg-neutral-50 px-4 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30" />
        </div>
      </div>

      <div>
        <label htmlFor="partner-type" className="mb-1.5 block text-sm font-medium text-neutral-700">{text.partnerType}</label>
        <select id="partner-type" name="partnerType" required defaultValue="" className="w-full rounded-xl border border-border bg-neutral-50 px-4 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30">
          <option value="" disabled>{text.choose}</option>
          {(text.types as string[]).map((type) => <option key={type} value={type}>{type}</option>)}
        </select>
      </div>

      <div>
        <label htmlFor="partner-message" className="mb-1.5 block text-sm font-medium text-neutral-700">{text.message}</label>
        <textarea id="partner-message" name="message" required minLength={20} maxLength={3000} rows={6} placeholder={text.messagePlaceholder as string} className="w-full resize-y rounded-xl border border-border bg-neutral-50 px-4 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30" />
      </div>

      {status === "error" && <p className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">{errorMessage}</p>}

      <button type="submit" disabled={status === "sending"} className="btn btn-primary btn-lg w-full disabled:opacity-60">
        {status === "sending" ? text.sending : text.submit}
      </button>
      <p className="text-center text-xs text-neutral-500">
        {text.privacyLead} <Link href="/privacy" className="underline hover:text-brand">{text.privacy}</Link>.
      </p>
    </form>
  );
}
