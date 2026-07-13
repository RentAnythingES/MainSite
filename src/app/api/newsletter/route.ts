import { NextRequest, NextResponse } from "next/server";
import { sendSignupWelcome } from "@/lib/email";
import { createAdminClient } from "@/lib/supabase-admin";

const CONSENT_VERSION = "2026-07-08";
const CONSENT_TEXT =
  "I agree to receive RentAnything.es emails with Valencia stay tips, product updates, kit launches, and occasional offers. I can unsubscribe at any time.";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const name = body.name ? String(body.name).trim() : null;
    const interest = body.interest ? String(body.interest).trim() : null;
    const source = body.source ? String(body.source).trim().slice(0, 80) : "website";
    const locale = body.locale === "es" ? "es" : "en";
    const consent = Boolean(body.consent);

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "A valid email address is required" }, { status: 400 });
    }

    if (!consent) {
      return NextResponse.json({ error: "Consent is required before subscribing" }, { status: 400 });
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
          consent_text: CONSENT_TEXT,
          consent_version: CONSENT_VERSION,
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
      return NextResponse.json({ error: "Could not save subscription" }, { status: 500 });
    }

    sendSignupWelcome({
      name: name || undefined,
      email,
      interest: interest || undefined,
      unsubscribeUrl: `${(process.env.NEXT_PUBLIC_SITE_URL || "https://www.rentanything.es").replace(/\/$/, "")}/newsletter/unsubscribe?token=${subscriber.unsubscribe_token}`,
    }).catch((err) => console.error("[newsletter] Welcome email error:", err));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[newsletter] API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
