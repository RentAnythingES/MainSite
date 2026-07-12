import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase-admin";

const SETTINGS_ID = true;
const SERIES_PATTERN = /^[A-Z0-9-]{1,16}$/;
const TAX_ID_PATTERN = /^[A-Z0-9]{8,16}$/i;

type InvoiceSettingsInput = {
  legal_name?: string;
  trading_name?: string | null;
  domestic_tax_id?: string;
  eu_vat_id?: string | null;
  address_line_1?: string;
  address_line_2?: string | null;
  postal_code?: string;
  city?: string;
  country_code?: string;
  currency?: string;
  default_tax_rate_bps?: number;
  prices_include_tax?: boolean;
  simplified_invoice_limit_cents?: number;
  full_invoice_series_prefix?: string;
  simplified_invoice_series_prefix?: string;
  rectifying_invoice_series_prefix?: string;
  payment_terms_text?: string;
  invoice_footer_text?: string | null;
  tax_policy_status?: "pending_adviser_confirmation" | "confirmed";
  verifactu_status?: "planned" | "in_progress" | "integrated";
};

function cleanText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function validateSettings(body: InvoiceSettingsInput) {
  const domesticTaxId = cleanText(body.domestic_tax_id, 16).toUpperCase();
  const euVatId = cleanText(body.eu_vat_id, 16).toUpperCase();
  const series = [
    cleanText(body.full_invoice_series_prefix, 16).toUpperCase(),
    cleanText(body.simplified_invoice_series_prefix, 16).toUpperCase(),
    cleanText(body.rectifying_invoice_series_prefix, 16).toUpperCase(),
  ];

  if (!cleanText(body.legal_name, 160) || !cleanText(body.address_line_1, 160) || !cleanText(body.postal_code, 16) || !cleanText(body.city, 100)) {
    throw new Error("Legal name and registered address are required");
  }
  if (!TAX_ID_PATTERN.test(domesticTaxId) || (euVatId && !TAX_ID_PATTERN.test(euVatId))) {
    throw new Error("Enter valid domestic and EU tax ID formats");
  }
  if (series.some((prefix) => !SERIES_PATTERN.test(prefix)) || new Set(series).size !== series.length) {
    throw new Error("Invoice series must be unique uppercase letters, numbers, or hyphens");
  }

  const taxRate = Number(body.default_tax_rate_bps);
  const simplifiedLimit = Number(body.simplified_invoice_limit_cents);
  if (!Number.isInteger(taxRate) || taxRate < 0 || taxRate > 10000 || !Number.isInteger(simplifiedLimit) || simplifiedLimit < 0) {
    throw new Error("Enter valid IVA rate and simplified invoice limit");
  }

  return {
    legal_name: cleanText(body.legal_name, 160),
    trading_name: cleanText(body.trading_name, 160) || null,
    domestic_tax_id: domesticTaxId,
    eu_vat_id: euVatId || null,
    address_line_1: cleanText(body.address_line_1, 160),
    address_line_2: cleanText(body.address_line_2, 160) || null,
    postal_code: cleanText(body.postal_code, 16),
    city: cleanText(body.city, 100),
    country_code: cleanText(body.country_code, 2).toUpperCase() || "ES",
    currency: cleanText(body.currency, 3).toUpperCase() || "EUR",
    default_tax_rate_bps: taxRate,
    prices_include_tax: Boolean(body.prices_include_tax),
    simplified_invoice_limit_cents: simplifiedLimit,
    full_invoice_series_prefix: series[0],
    simplified_invoice_series_prefix: series[1],
    rectifying_invoice_series_prefix: series[2],
    payment_terms_text: cleanText(body.payment_terms_text, 300),
    invoice_footer_text: cleanText(body.invoice_footer_text, 1000) || null,
    tax_policy_status: body.tax_policy_status === "confirmed" ? "confirmed" : "pending_adviser_confirmation",
    verifactu_status: ["planned", "in_progress", "integrated"].includes(body.verifactu_status || "") ? body.verifactu_status : "planned",
  };
}

export async function GET(request: NextRequest) {
  if (!await verifyAdmin(request)) return unauthorizedResponse();
  const supabase = createAdminClient() as unknown as { from: (table: string) => { select: (columns: string) => { eq: (column: string, value: boolean) => { maybeSingle: () => Promise<{ data: unknown; error: unknown }> } } } };
  const { data, error } = await supabase.from("invoice_settings").select("*").eq("id", SETTINGS_ID).maybeSingle();
  if (error) return NextResponse.json({ error: "Failed to load invoice settings" }, { status: 500 });
  return NextResponse.json({ settings: data });
}

export async function PUT(request: NextRequest) {
  if (!await verifyAdmin(request)) return unauthorizedResponse();
  try {
    const values = validateSettings(await request.json() as InvoiceSettingsInput);
    const supabase = createAdminClient() as unknown as { from: (table: string) => { upsert: (row: Record<string, unknown>) => { select: (columns: string) => { single: () => Promise<{ data: unknown; error: unknown }> } } } };
    const { data, error } = await supabase.from("invoice_settings").upsert({ id: SETTINGS_ID, ...values }).select("*").single();
    if (error) throw error;
    return NextResponse.json({ settings: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save invoice settings";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
