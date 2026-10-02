import { customerTokenPath } from "@/i18n/customer-path";
import { NextRequest, NextResponse } from "next/server";
import { sendSignupWelcome } from "@/lib/email";
import { outreachLocale } from "@/lib/outreach-locale";
import { newsletterCopy, newsletterConsentVersion } from "@/i18n/outreach";
import { privateGermanPreviewEnabled } from "@/lib/localization-preview";
import type { Locale } from "@/i18n/config";
import { createAdminClient } from "@/lib/supabase-admin";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  let locale: Locale = "en";
  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const name = body.name ? String(body.name).trim() : null;
    const interest = body.interest ? String(body.interest).trim() : null;
    const source = body.source ? String(body.source).trim().slice(0, 80) : "website";
    try { locale = outreachLocale(body.locale); }
    catch { return NextResponse.json({ error: "Language is not available" }, { status: 400 }); }
    const text = newsletterCopy[locale];
    const consent = body.consent === true;

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: text.invalidEmail }, { status: 400 });
    }

    if (!consent) {
      return NextResponse.json({ error: text.missingConsent }, { status: 400 });
    }

    const supabase = createAdminClient();
    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      null;
    const userAgent = request.headers.get("user-agent");

    const { data: subscriber, error } = await supabase
      .from("newsletter_subscribers")
      .upsert(
        {
          email,
          name,
          interest,
          locale,
          source,
          consent_text: text.consent,
          consent_version: newsletterConsentVersion,
          consented_at: new Date().toISOString(),
          ip_address: ipAddress,
          user_agent: userAgent,
          is_active: true,
          unsubscribed_at: null,
        },
        { onConflict: "email" }
      )
      .select("unsubscribe_token")
      .single();

    if (error) {
      console.error("[newsletter] Subscribe error:", error);
      return NextResponse.json({ error: text.error }, { status: 500 });
    }

    if (!privateGermanPreviewEnabled()) await sendSignupWelcome({
      locale,
      name: name || undefined,
      email,
      interest: interest || undefined,
      unsubscribeUrl: `${(process.env.NEXT_PUBLIC_SITE_URL || "https://rentandroll.com").replace(/\/$/, "")}${customerTokenPath(locale, "/newsletter/unsubscribe")}?token=${subscriber.unsubscribe_token}&locale=${locale}`,
    }).catch((err) => console.error("[newsletter] Welcome email error:", err));

    return NextResponse.json({ success: true, preview: privateGermanPreviewEnabled() });
  } catch (err) {
    console.error("[newsletter] API error:", err);
    return NextResponse.json({ error: newsletterCopy[locale].error }, { status: 500 });
  }
}
