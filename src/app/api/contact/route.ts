import { NextRequest, NextResponse } from "next/server";
import { sendContactAutoReply, sendContactNotification } from "@/lib/email";
import { outreachLocale } from "@/lib/outreach-locale";
import { privateGermanPreviewEnabled } from "@/lib/localization-preview";
import { contactMessageCopy } from "@/i18n/outreach";
import type { Locale } from "@/i18n/config";

export async function POST(request: NextRequest) {
  let locale: Locale = "en";
  try {
    const body = await request.json();
    try { locale = outreachLocale(body.locale); }
    catch { return NextResponse.json({ error: "Language is not available" }, { status: 400 }); }
    const t = contactMessageCopy[locale];
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    if (!name || !email || !message) {
      return NextResponse.json({ error: t.required }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: t.invalidEmail }, { status: 400 });
    }
    const emailData = {
      name, email, message, locale,
      subject: typeof body.subject === "string" ? body.subject : undefined,
      productName: typeof body.productName === "string" ? body.productName : undefined,
    };
    // The guarded local preview exercises validation without sending messages.
    if (privateGermanPreviewEnabled()) return NextResponse.json({ success: true, preview: true });
    if (!process.env.RESEND_API_KEY) return NextResponse.json({ error: t.error }, { status: 503 });
    if (!await sendContactNotification(emailData)) {
      return NextResponse.json({ error: t.error }, { status: 500 });
    }
    await sendContactAutoReply(emailData);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ error: contactMessageCopy[locale].error }, { status: 500 });
  }
}
