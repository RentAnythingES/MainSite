import { NextRequest, NextResponse } from "next/server";
import { rentalBundles } from "@/data/bundles";
import { checkBundleAvailability } from "@/lib/bundle-availability";
import { createServiceClient } from "@/lib/supabase";
import { outreachLocale } from "@/lib/outreach-locale";
import { bundleRequestCopy, bundleAvailabilityNotes } from "@/i18n/bundle-request";
import type { Locale } from "@/i18n/config";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function validDate(value: string) {
  return DATE_PATTERN.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

function selectedNames(value: unknown, allowed: Set<string>): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((item): item is string => typeof item === "string" && allowed.has(item)))].slice(0, 40);
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  let locale: Locale;
  try { locale = outreachLocale(body?.locale); }
  catch { return NextResponse.json({ error: "Language is not available" }, { status: 400 }); }
  const text = bundleRequestCopy[locale];
  const bundle = rentalBundles.find((candidate) => candidate.slug === body?.bundleSlug);
  const startDate = typeof body?.startDate === "string" ? body.startDate : "";
  const endDate = typeof body?.endDate === "string" ? body.endDate : "";

  if (!bundle) return NextResponse.json({ error: text.missing }, { status: 404 });
  if (!validDate(startDate) || !validDate(endDate) || endDate <= startDate) {
    return NextResponse.json({ error: text.dates }, { status: 400 });
  }

  const selectedItems = selectedNames(body?.selectedItems, new Set(bundle.includedItems.map((item) => item.name)));
  const selectedAddons = selectedNames(body?.selectedAddons, new Set(bundle.addons.map((item) => item.name)));
  if (selectedItems.length === 0 && selectedAddons.length === 0) {
    return NextResponse.json({ error: text.selection }, { status: 400 });
  }

  try {
    const result = await checkBundleAvailability(
      createServiceClient(),
      bundle,
      selectedItems,
      selectedAddons,
      startDate,
      endDate,
    );
    const notes = bundleAvailabilityNotes[locale];
    return NextResponse.json({ ...result, lines: result.lines.map(line => ({
      ...line,
      note: line.status === "available" ? null : line.status === "unavailable" ? notes.unavailable : line.productSlug ? notes.manual : notes.alternatives,
    })) }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[bundle-availability] Check failed", error);
    return NextResponse.json({ error: text.availability }, { status: 500 });
  }
}
