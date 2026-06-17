import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const TO_EMAIL = process.env.CONTACT_EMAIL || "hello@rentanything.es";
const FROM_EMAIL = process.env.FROM_EMAIL || "RentAnything <noreply@rentanything.es>";

export async function POST(request: NextRequest) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: "Email service not configured" }, { status: 503 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const body = await request.json();
    const { name, email, subject, message, productName } = body;

    // Validate
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const emailSubject = productName
      ? `[RentAnything] Enquiry: ${productName}`
      : subject
        ? `[RentAnything] ${subject}`
        : `[RentAnything] New Contact Form Submission`;

    // Send notification email to admin
    const { error: sendError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email,
      subject: emailSubject,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #0d9488, #14b8a6); padding: 24px 32px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">New Contact Form Submission</h1>
          </div>
          <div style="background: #f9fafb; padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 100px;">Name</td>
                <td style="padding: 8px 0; font-weight: 600; font-size: 14px;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Email</td>
                <td style="padding: 8px 0; font-size: 14px;"><a href="mailto:${email}" style="color: #0d9488;">${email}</a></td>
              </tr>
              ${productName ? `
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Product</td>
                <td style="padding: 8px 0; font-weight: 600; font-size: 14px;">${productName}</td>
              </tr>
              ` : ""}
              ${subject ? `
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Subject</td>
                <td style="padding: 8px 0; font-size: 14px;">${subject}</td>
              </tr>
              ` : ""}
            </table>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
            <div style="font-size: 14px; line-height: 1.6; color: #374151; white-space: pre-wrap;">${message}</div>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
            <p style="font-size: 12px; color: #9ca3af; margin: 0;">
              Reply directly to this email to respond to ${name}.
            </p>
          </div>
        </div>
      `,
    });

    if (sendError) {
      console.error("Resend error:", sendError);
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 500 }
      );
    }

    // Send confirmation to customer
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "We received your message — RentAnything.es",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #0d9488, #14b8a6); padding: 24px 32px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">Thanks for reaching out!</h1>
          </div>
          <div style="background: #f9fafb; padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <p style="font-size: 15px; color: #374151; line-height: 1.6; margin-top: 0;">
              Hi ${name},
            </p>
            <p style="font-size: 15px; color: #374151; line-height: 1.6;">
              We've received your message and will get back to you within 24 hours.
              For urgent enquiries, you can also reach us on WhatsApp.
            </p>
            <a href="https://wa.me/34600000000" style="display: inline-block; background: #25d366; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; margin-top: 8px;">
              💬 WhatsApp Us
            </a>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
            <p style="font-size: 12px; color: #9ca3af; margin: 0;">
              RentAnything.es · Escalera Labs S.L. · Valencia, Spain
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
