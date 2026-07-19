"use client";

import { useState } from "react";
import Link from "next/link";

const copy = {
  en: {
    sentTitle: "Message sent",
    sentBody: "We received your message and will reply as soon as we can. Check your email for confirmation.",
    sendAnother: "Send another message",
    name: "Name",
    namePlaceholder: "Your name",
    email: "Email",
    subject: "Subject",
    selectTopic: "Select a topic...",
    topics: ["Booking enquiry", "Product question", "B2B / Partnership", "Support / Issue", "Other"],
    message: "Message",
    messagePlaceholder: "Tell us how we can help...",
    sending: "Sending...",
    submit: "Send message",
    consentPrefix: "By submitting, you agree to our",
    privacy: "Privacy Policy",
    error: "We could not send your message. Please try again or contact us by email or WhatsApp.",
  },
  es: {
    sentTitle: "Mensaje enviado",
    sentBody: "Hemos recibido tu mensaje y responderemos en cuanto podamos. Revisa tu correo para ver la confirmación.",
    sendAnother: "Enviar otro mensaje",
    name: "Nombre",
    namePlaceholder: "Tu nombre",
    email: "Correo electrónico",
    subject: "Asunto",
    selectTopic: "Selecciona un tema...",
    topics: ["Consulta sobre una reserva", "Pregunta sobre un producto", "Empresa o colaboración", "Soporte o incidencia", "Otro"],
    message: "Mensaje",
    messagePlaceholder: "Cuéntanos cómo podemos ayudarte...",
    sending: "Enviando...",
    submit: "Enviar mensaje",
    consentPrefix: "Al enviar el formulario, aceptas nuestra",
    privacy: "Política de privacidad",
    error: "No hemos podido enviar el mensaje. Inténtalo de nuevo o contáctanos por correo o WhatsApp.",
  },
} as const;

export default function ContactForm({ locale = "en" }: { locale?: "en" | "es" }) {
  const text = copy[locale];
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          subject: formData.get("subject"),
          message: formData.get("message"),
          locale,
        }),
      });

      if (!res.ok) {
        await res.json().catch(() => null);
        throw new Error(text.error);
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : text.error);
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-12">
        <span className="text-5xl block mb-4">✅</span>
        <h3 className="text-xl font-bold mb-2">{text.sentTitle}</h3>
        <p className="text-neutral-500 mb-6">
          {text.sentBody}
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="btn btn-outline"
        >
          {text.sendAnother}
        </button>
      </div>
    );
  }

  return (
    <form className="space-y-5" id="contact-form" onSubmit={handleSubmit}>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1.5">{text.name}</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-4 py-3 rounded-xl border border-border bg-neutral-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
            placeholder={text.namePlaceholder}
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1.5">{text.email}</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-4 py-3 rounded-xl border border-border bg-neutral-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
            placeholder="you@example.com"
          />
        </div>
      </div>
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 mb-1.5">{text.subject}</label>
        <select
          id="subject"
          name="subject"
          className="w-full px-4 py-3 rounded-xl border border-border bg-neutral-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
        >
          <option value="">{text.selectTopic}</option>
          {text.topics.map((topic) => <option key={topic} value={topic}>{topic}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1.5">{text.message}</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="w-full px-4 py-3 rounded-xl border border-border bg-neutral-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all resize-none"
          placeholder={text.messagePlaceholder}
        />
      </div>

      {status === "error" && (
        <div className="bg-red-50 text-red-700 text-sm rounded-lg p-3 border border-red-100">
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn btn-primary btn-lg w-full disabled:opacity-60"
        id="contact-submit"
      >
        {status === "sending" ? text.sending : text.submit}
      </button>
      <p className="text-xs text-neutral-400 text-center">
        {text.consentPrefix} <Link href="/privacy" className="underline hover:text-brand">{text.privacy}</Link>.
      </p>
    </form>
  );
}
