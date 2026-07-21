import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { rentalBundles } from "@/data/bundles";
import {
  BUNDLE_REQUEST_CONSENT_TEXT,
  BUNDLE_REQUEST_CONSENT_VERSION,
  cleanBundleRequestText,
  isMissingBundleRequestsTable,
} from "@/lib/bundle-requests";
import { sendContactAutoReply, sendContactNotification } from "@/lib/email";
import { createServiceClient } from "@/lib/supabase";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function createRequestRef() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `KIT-${date}-${randomUUID().slice(0, 6).toUpperCase()}`;
}

function validDate(value: unknown): value is string {
  return typeof value === "string" && DATE_PATTERN.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

function selectedNames(value: unknown, allowed: Set<string>): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((item): item is string => typeof item === "string" && allowed.has(item)))];
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body || body.website) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const bundleSlug = cleanBundleRequestText(body.bundleSlug, 120);
  const bundle = rentalBundles.find((candidate) => candidate.slug === bundleSlug);
  if (!bundle) {
    return NextResponse.json({ error: "Kit not found" }, { status: 404 });
  }

  const customerName = cleanBundleRequestText(body.customerName, 120);
  const customerEmail = cleanBundleRequestText(body.customerEmail, 254)?.toLowerCase() || null;
  const customerPhone = cleanBundleRequestText(body.customerPhone, 50);
  const accommodationArea = cleanBundleRequestText(body.area, 240);
  const customerNotes = cleanBundleRequestText(body.notes, 2000);
  const startDate = body.startDate;
  const endDate = body.endDate;

  if (!customerName || !customerEmail || !EMAIL_PATTERN.test(customerEmail)) {
    return NextResponse.json({ error: "Add your name and a valid email address" }, { status: 400 });
  }
  if (!validDate(startDate) || !validDate(endDate) || endDate < startDate) {
    return NextResponse.json({ error: "Choose a valid start and end date" }, { status: 400 });
  }
  if (!accommodationArea) {
    return NextResponse.json({ error: "Add your accommodation area" }, { status: 400 });
  }
  if (body.consentAccepted !== true) {
    return NextResponse.json({ error: "Confirm that we may use these details to manage your request" }, { status: 400 });
  }

  const allowedItems = new Set(bundle.includedItems.map((item) => item.name));
  const allowedAddons = new Set(bundle.addons.map((item) => item.name));
  const selectedItems = selectedNames(body.selectedItems, allowedItems);
  const selectedAddons = selectedNames(body.selectedAddons, allowedAddons);
  const requestRef = createRequestRef();
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
  const sourcePath = cleanBundleRequestText(body.sourcePath, 500);

  const supabase = createServiceClient();
  const { error } = await supabase.from("bundle_requests").insert({
    request_ref: requestRef,
    bundle_slug: bundle.slug,
    bundle_name: bundle.name,
    customer_name: customerName,
    customer_email: customerEmail,
    customer_phone: customerPhone,
    start_date: startDate,
    end_date: endDate,
    accommodation_area: accommodationArea,
    selected_items: selectedItems,
    selected_addons: selectedAddons,
    customer_notes: customerNotes,
    locale: "en",
    consent_version: BUNDLE_REQUEST_CONSENT_VERSION,
    consent_text: BUNDLE_REQUEST_CONSENT_TEXT,
    source_path: sourcePath,
    ip_address: forwardedFor,
    user_agent: request.headers.get("user-agent")?.slice(0, 1000) || null,
  });

  if (isMissingBundleRequestsTable(error)) {
    return NextResponse.json({ error: "Kit requests are being configured. Please contact us on WhatsApp." }, { status: 503 });
  }
  if (error) {
    console.error("[bundle-requests] Insert failed", error);
    return NextResponse.json({ error: "Could not save your request" }, { status: 500 });
  }

  const message = [
    `Request: ${requestRef}`,
    `Kit: ${bundle.name}`,
    `Dates: ${startDate} to ${endDate}`,
    `Area: ${accommodationArea}`,
    `Phone: ${customerPhone || "Not provided"}`,
    "",
    "Included items:",
    ...(selectedItems.length ? selectedItems.map((item) => `- ${item}`) : ["- Please recommend the right setup"]),
    "",
    "Add-ons:",
    ...(selectedAddons.length ? selectedAddons.map((item) => `- ${item}`) : ["- None selected"]),
    customerNotes ? `\nNotes: ${customerNotes}` : "",
  ].join("\n");

  const emailData = {
    name: customerName,
    email: customerEmail,
    subject: `Kit request ${requestRef}`,
    productName: bundle.name,
    message,
    locale: "en" as const,
  };
  const [notificationSent, confirmationSent] = await Promise.all([
    sendContactNotification(emailData),
    sendContactAutoReply(emailData),
  ]);

  if (notificationSent || confirmationSent) {
    await supabase
      .from("bundle_requests")
      .update({
        notification_email_sent: notificationSent,
        confirmation_email_sent: confirmationSent,
        updated_at: new Date().toISOString(),
      })
      .eq("request_ref", requestRef);
  }

  return NextResponse.json({
    success: true,
    requestRef,
    whatsappUrl: `https://wa.me/34684708013?text=${encodeURIComponent(message)}`,
  });
}
