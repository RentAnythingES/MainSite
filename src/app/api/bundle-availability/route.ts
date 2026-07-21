import { NextRequest, NextResponse } from "next/server";
import { rentalBundles } from "@/data/bundles";
import { checkBundleAvailability } from "@/lib/bundle-availability";
import { createServiceClient } from "@/lib/supabase";

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
  const bundle = rentalBundles.find((candidate) => candidate.slug === body?.bundleSlug);
  const startDate = typeof body?.startDate === "string" ? body.startDate : "";
  const endDate = typeof body?.endDate === "string" ? body.endDate : "";

  if (!bundle) return NextResponse.json({ error: "Kit not found" }, { status: 404 });
  if (!validDate(startDate) || !validDate(endDate) || endDate <= startDate) {
    return NextResponse.json({ error: "Choose a valid start and end date" }, { status: 400 });
  }

  const selectedItems = selectedNames(body?.selectedItems, new Set(bundle.includedItems.map((item) => item.name)));
  const selectedAddons = selectedNames(body?.selectedAddons, new Set(bundle.addons.map((item) => item.name)));
  if (selectedItems.length === 0 && selectedAddons.length === 0) {
    return NextResponse.json({ error: "Choose at least one kit item" }, { status: 400 });
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
    return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[bundle-availability] Check failed", error);
    return NextResponse.json({ error: "Could not check kit availability" }, { status: 500 });
  }
}
