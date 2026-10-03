"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { api, Area, buttonClass, formValues, Message } from "./shared";
import type { Locale } from "@/i18n/config";
import { customerPrefix } from "@/i18n/customer-path";
const copy = {
  en: { title: "Your Rentandroll conversation", intro: "Coordinate delivery and collection with your local agent. Keep this private link to yourself.", refresh: "Refresh messages", you: "You", agent: "Your local agent", reply: "Your reply", send: "Send reply", help: "For booking changes or urgent help,", contact: "contact Rentandroll", error: "Could not load or send your message. Please try again.", date: "en-GB" },
  es: { title: "Tu conversación con Rentandroll", intro: "Coordina la entrega y la recogida con tu agente local. No compartas este enlace privado.", refresh: "Actualizar mensajes", you: "Tú", agent: "Tu agente local", reply: "Tu respuesta", send: "Enviar respuesta", help: "Para cambios en la reserva o ayuda urgente,", contact: "contacta con Rentandroll", error: "No se ha podido cargar o enviar el mensaje. Inténtalo de nuevo.", date: "es-ES" },
  de: { title: "Dein Gespräch mit Rentandroll", intro: "Stimme Lieferung und Rückholung mit deinem Ansprechpartner vor Ort ab. Behalte diesen privaten Link für dich.", refresh: "Nachrichten aktualisieren", you: "Du", agent: "Dein Ansprechpartner vor Ort", reply: "Deine Antwort", send: "Antwort senden", help: "Für Änderungen an deiner Buchung oder dringende Hilfe", contact: "kontaktiere Rentandroll", error: "Deine Nachricht konnte nicht geladen oder gesendet werden. Bitte versuche es erneut.", date: "de-DE" },
};
export default function CustomerConversation({ token, locale = "en" }: { token: string; locale?: Locale }) {
  const text = copy[locale];
  const errorText = useCallback((error: Error) => locale === "en" ? error.message : text.error, [locale, text.error]);
  const [messages, setMessages] = useState<Message[]>([]), [error, setError] = useState(""), [busy, setBusy] = useState(false), [loaded, setLoaded] = useState(false), [messageId, setMessageId] = useState<string | null>(null);
  const path = `/api/agent/messages/${encodeURIComponent(token)}`;
  async function load() { const data = await api(path); setMessages(data.messages); setLoaded(true); }
  useEffect(() => { api(path).then(data => { setMessages(data.messages); setLoaded(true); }).catch(e => setError(errorText(e))); }, [path, errorText]);
  return <div className="container-site max-w-2xl py-12 space-y-5"><h1 className="text-3xl font-bold">{text.title}</h1><p>{text.intro}</p>{error && <p role="alert" className="text-red-700">{error}</p>}{loaded && <><button className="underline text-teal-700" disabled={busy} onClick={() => void load().catch(e => setError(errorText(e)))}>{text.refresh}</button>{messages.map(m => <div key={m.id} className={`rounded-xl p-4 ${m.direction === "customer" ? "bg-neutral-100" : "bg-teal-50"}`}><p className="text-sm font-semibold">{m.direction === "customer" ? text.you : text.agent} · {new Date(m.created_at).toLocaleString(text.date)}</p><p className="mt-2 whitespace-pre-wrap">{m.body}</p></div>)}<form className="space-y-4" onSubmit={async e => { const form = e.currentTarget, values = formValues(e), id = messageId || crypto.randomUUID(); setMessageId(id); setBusy(true); setError(""); try { await api(path, { ...values, messageId: id }); form.reset(); setMessageId(null); await load(); } catch (e) { setError(errorText(e as Error)); } finally { setBusy(false); } }}><Area name="body" label={text.reply} required /><button disabled={busy} className={buttonClass}>{text.send}</button></form></>}<p className="text-sm">{text.help} <Link className="underline text-teal-700" href={`${customerPrefix(locale)}/contact`}>{text.contact}</Link>.</p></div>;
}
