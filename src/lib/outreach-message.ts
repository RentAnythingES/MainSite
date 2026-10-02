import { isLocale, type Locale } from "@/i18n/config";
import { contactMessageCopy, newsletterCopy } from "@/i18n/outreach";
import { SITE_IDENTITY } from "@/config/site";

const escape = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
function language(value?: Locale): Locale {
  if (value === undefined) return "en";
  if (!isLocale(value)) throw new Error("Unsupported message language");
  return value;
}
function frame(locale: Locale, title: string, body: string) {
  const country = { en: "Spain", es: "España", de: "Spanien" }[locale];
  return `<div lang="${locale}" style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#1f2937"><h1 style="color:#0e7c73">${escape(title)}</h1>${body}<hr><p style="font-size:12px">${escape(SITE_IDENTITY.brandName)} · ${escape(SITE_IDENTITY.legalName)} · Valencia, ${country}</p></div>`;
}
const whatsapp = (label: string) => `<p><a href="https://wa.me/34684708013">${escape(label)}</a></p>`;

export function renderContactMessage(data: { locale?: Locale; name: string; productName?: string }) {
  const locale = language(data.locale);
  const t = contactMessageCopy[locale];
  return { subject: t.subject, html: frame(locale, t.title,
    `<p>${t.hello} ${escape(data.name)},</p><p>${escape(t.body)}</p>${data.productName ? `<p><strong>${t.about}:</strong> ${escape(data.productName)}</p>` : ""}${whatsapp(t.whatsapp)}`) };
}

export function renderSignupMessage(data: { locale?: Locale; name?: string; interest?: string; unsubscribeUrl: string }) {
  const locale = language(data.locale);
  const t = newsletterCopy[locale];
  return { subject: t.welcome, html: frame(locale, t.welcome,
    `<p>${t.hello}${data.name?.trim() ? ` ${escape(data.name.trim())}` : ""},</p><p>${escape(t.intro)}</p>${data.interest ? `<p><strong>${t.interest}:</strong> ${escape(data.interest)}</p>` : ""}<p>${escape(t.help)}</p>${whatsapp(t.whatsapp)}<p>${escape(t.reason)} <a href="${escape(data.unsubscribeUrl)}">${t.unsubscribe}</a>.</p>`) };
}
