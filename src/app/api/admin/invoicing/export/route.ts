import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase-admin";

const headers = [
  "document_number",
  "issue_date",
  "format",
  "status",
  "currency",
  "customer_name",
  "customer_tax_id",
  "tax_base_cents",
  "tax_rate_percent",
  "tax_cents",
  "gross_total_cents",
  "rectifies_document_id",
  "booking_id",
];

function csvCell(value: unknown) {
  const text = String(value ?? "");
  const safe = /^[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${safe.replaceAll('"', '""')}"`;
}

export async function GET(request: NextRequest) {
  if (!await verifyAdmin(request)) return unauthorizedResponse();

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const supabase = createAdminClient() as any;
  let query = supabase
    .from("booking_documents")
    .select("document_number, issued_at, invoice_format, status, currency, customer_snapshot, customer_tax_id, tax_base_cents, tax_rate_bps, tax_cents, total_cents, rectifies_document_id, booking_id")
    .eq("status", "issued")
    .order("issued_at", { ascending: true });

  if (from) query = query.gte("issued_at", `${from}T00:00:00.000Z`);
  if (to) query = query.lte("issued_at", `${to}T23:59:59.999Z`);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: "Failed to export invoice data" }, { status: 500 });

  const rows = (data || []).map((document: any) => [
    document.document_number,
    document.issued_at,
    document.invoice_format || "full",
    document.status,
    String(document.currency || "EUR").toUpperCase(),
    document.customer_snapshot?.name,
    document.customer_tax_id || document.customer_snapshot?.tax_id,
    document.tax_base_cents,
    document.tax_rate_bps ? (document.tax_rate_bps / 100).toFixed(2) : "0.00",
    document.tax_cents,
    document.total_cents,
    document.rectifies_document_id,
    document.booking_id,
  ]);

  const csv = [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
  const filename = `rentanything-invoices${from ? `-${from}` : ""}${to ? `-to-${to}` : ""}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
