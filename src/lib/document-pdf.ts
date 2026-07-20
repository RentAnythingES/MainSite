import type { BookingDocument } from "@/lib/booking-documents";

interface BookingForPdf {
  booking_ref?: string | null;
  customer_name?: string | null;
  customer_email?: string | null;
  customer_phone?: string | null;
  rental_start_at?: string | null;
  rental_end_at?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  rental_days?: number | null;
  quantity?: number | null;
  fulfillment_mode?: string | null;
  delivery_address?: string | null;
  product?: { name?: string | null; brand?: string | null } | null;
}

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;

const toAscii = (value: unknown) =>
  String(value ?? "")
    .normalize("NFKD")
    .replace(/[^\x20-\x7E]/g, "")
    .trim();

const escapePdfText = (value: unknown) => toAscii(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

const formatMoney = (cents?: number | null, currency = "eur") =>
  `${currency.toUpperCase()} ${(((cents || 0) / 100)).toFixed(2)}`;

const formatDate = (value?: string | null) => {
  if (!value) return "Not set";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return toAscii(value);
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDocumentType = (type: string) => {
  if (type === "refund_receipt") return "Rectifying invoice";
  if (type === "rental_agreement") return "Rental agreement";
  return "Invoice";
};

const labelFulfillment = (mode?: string | null) => {
  if (mode === "customer_pickup") return "Customer pickup";
  if (mode === "delivery_only") return "Delivery only";
  if (mode === "delivery_and_collection") return "Delivery and collection";
  return "Not set";
};

function pdfText(text: unknown, x: number, y: number, size = 10, font = "F1") {
  return `BT /${font} ${size} Tf ${x} ${y} Td (${escapePdfText(text)}) Tj ET\n`;
}

function pdfLine(x1: number, y1: number, x2: number, y2: number, gray = 0.85) {
  return `${gray} G ${x1} ${y1} m ${x2} ${y2} l S\n`;
}

function pdfRect(x: number, y: number, width: number, height: number, r: number, g: number, b: number) {
  return `${r} ${g} ${b} rg ${x} ${y} ${width} ${height} re f\n`;
}

function drawKeyValue(label: string, value: unknown, x: number, y: number, width = 230) {
  return [
    pdfText(label, x, y, 8, "F2"),
    pdfText(value || "Not set", x + 95, y, 9, "F1"),
    pdfLine(x, y - 8, x + width, y - 8, 0.9),
  ].join("");
}

export function buildBookingDocumentPdf(document: BookingDocument, booking: BookingForPdf): Uint8Array {
  const documentTitle = formatDocumentType(document.document_type);
  const bookingSnapshot = document.booking_snapshot || {};
  const customerSnapshot = document.customer_snapshot || {};
  const companySnapshot = document.company_snapshot || {};
  const productName =
    toAscii(booking.product?.name) ||
    toAscii(bookingSnapshot.product_name) ||
    "Rental equipment";
  const customerName = toAscii(customerSnapshot.name) || toAscii(booking.customer_name) || "Customer";
  const customerEmail = toAscii(customerSnapshot.email) || toAscii(booking.customer_email) || "Not set";
  const startAt = toAscii(bookingSnapshot.rental_start_at) || booking.rental_start_at || booking.start_date;
  const endAt = toAscii(bookingSnapshot.rental_end_at) || booking.rental_end_at || booking.end_date;
  const fulfillmentMode = toAscii(bookingSnapshot.fulfillment_mode) || booking.fulfillment_mode;
  const quantity = Number(bookingSnapshot.quantity || booking.quantity || 1);
  const isRefund = document.document_type === "refund_receipt";
  const taxBaseCents = document.tax_base_cents ?? Math.max(0, document.total_cents - document.tax_cents);
  const taxRate = document.tax_rate_bps ? `${(document.tax_rate_bps / 100).toFixed(2)}% IVA` : "IVA";

  let content = "";
  content += pdfRect(0, PAGE_HEIGHT - 92, PAGE_WIDTH, 92, 0.055, 0.486, 0.451);
  content += pdfText("RentAnything.es", 48, 738, 22, "F2");
  content += pdfText("Travel light. Feel at home.", 48, 718, 10, "F1");
  content += pdfText(documentTitle, 420, 738, 22, "F2");
  content += pdfText(document.document_number || "Number pending", 420, 718, 10, "F1");

  content += pdfText("Document details", 48, 660, 13, "F2");
  content += drawKeyValue("Issued", formatDate(document.issued_at), 48, 638);
  content += drawKeyValue("Booking ref", booking.booking_ref || bookingSnapshot.booking_ref, 48, 616);
  content += drawKeyValue("Status", document.status, 48, 594);
  if (isRefund && bookingSnapshot.rectifies_document_number) {
    content += drawKeyValue("Rectifies", bookingSnapshot.rectifies_document_number, 48, 572);
  }

  content += pdfText("From", 330, 660, 13, "F2");
  content += pdfText(companySnapshot.brand || "RentAnything.es", 330, 638, 10, "F2");
  content += pdfText(companySnapshot.name || "Escalera Labs S.L.", 330, 622, 9, "F1");
  content += pdfText(companySnapshot.domestic_tax_id || "Tax ID pending", 330, 606, 9, "F1");
  content += pdfText(`${companySnapshot.address_line_1 || "Valencia"}, ${companySnapshot.postal_code || ""} ${companySnapshot.city || "Spain"}`, 330, 590, 8, "F1");

  content += pdfText("Customer", 48, 548, 13, "F2");
  content += drawKeyValue("Name", customerName, 48, 526);
  content += drawKeyValue("Email", customerEmail, 48, 504);
  content += drawKeyValue("Phone", customerSnapshot.phone || booking.customer_phone || "Not set", 48, 482);

  content += pdfText("Rental", 330, 548, 13, "F2");
  content += drawKeyValue("Item", productName, 330, 526);
  content += drawKeyValue("Quantity", quantity, 330, 504);
  content += drawKeyValue("Start", formatDate(startAt), 330, 482);
  content += drawKeyValue("End", formatDate(endAt), 330, 460);
  content += drawKeyValue("Fulfillment", labelFulfillment(fulfillmentMode), 330, 438);

  content += pdfText("Charges", 48, 408, 13, "F2");
  content += pdfLine(48, 394, 564, 394, 0.6);
  content += pdfText("Description", 58, 374, 9, "F2");
  content += pdfText("Amount", 484, 374, 9, "F2");
  content += pdfLine(48, 362, 564, 362, 0.82);

  let y = 340;
  if (isRefund) {
    content += pdfText("Refund / rectification", 58, y, 9, "F1");
    content += pdfText(formatMoney(document.total_cents, document.currency), 484, y, 9, "F1");
  } else {
    content += pdfText(`Rental - ${productName} x ${quantity}`, 58, y, 9, "F1");
    content += pdfText(formatMoney(taxBaseCents, document.currency), 484, y, 9, "F1");
    y -= 22;
    content += pdfText(taxRate, 58, y, 9, "F1");
    content += pdfText(formatMoney(document.tax_cents, document.currency), 484, y, 9, "F1");
  }

  content += pdfLine(390, 248, 564, 248, 0.5);
  content += pdfText(isRefund ? "Rectifying total" : "Invoice total", 390, 226, 12, "F2");
  content += pdfText(formatMoney(document.total_cents, document.currency), 484, 226, 12, "F2");

  content += pdfText("Payment reference", 48, 176, 12, "F2");
  const paymentSnapshot = document.payment_snapshot || {};
  content += drawKeyValue("Provider", paymentSnapshot.provider || "stripe", 48, 154, 500);
  content += drawKeyValue("Payment ID", paymentSnapshot.stripe_payment_intent_id || "Not set", 48, 132, 500);
  content += drawKeyValue("Refund ID", paymentSnapshot.stripe_refund_id || "Not applicable", 48, 110, 500);

  content += pdfLine(48, 72, 564, 72, 0.85);
  content += pdfText(companySnapshot.footer || "Issued from RentAnything.es booking and payment records.", 48, 52, 8, "F1");
  content += pdfText("Questions? Contact RentAnything.es support.", 48, 38, 8, "F1");

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
    `<< /Length ${content.length} >>\nstream\n${content}endstream`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (let index = 0; index < objects.length; index += 1) {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${objects[index]}\nendobj\n`;
  }

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let index = 1; index < offsets.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new TextEncoder().encode(pdf);
}
