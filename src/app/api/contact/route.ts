import { NextRequest, NextResponse } from "next/server";
import { sendContactAutoReply, sendContactNotification } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: "Email service not configured" }, { status: 503 });
    }

    const body = await request.json();
    const { name, email, subject, message, productName } = body;
    const locale: "en" | "es" = body.locale === "es" ? "es" : "en";

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const emailData = {
      name,
      email,
      subject,
      message,
      productName,
      locale,
    };

    const notificationSent = await sendContactNotification(emailData);

    if (!notificationSent) {
      console.error("Contact notification failed");
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 500 }
      );
    }

    await sendContactAutoReply(emailData);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
