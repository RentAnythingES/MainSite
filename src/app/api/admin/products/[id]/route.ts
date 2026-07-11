import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";

type PricingTierPayload = { min_days: number; per_day_cents: number };

function isValidSlug(value: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

function getErrorMessage(err: unknown) {
  if (err && typeof err === "object" && "message" in err) {
    return String((err as { message: unknown }).message);
  }
  return "Unknown error";
}

function validatePricingTiers(tiers: PricingTierPayload[]) {
  if (tiers.length === 0) return "At least one pricing tier is required";

  const tierDays = new Set<number>();
  for (const tier of tiers) {
    if (!Number.isInteger(tier.min_days) || tier.min_days < 1) {
      return "Pricing tier minimum days must be at least 1";
    }
    if (!Number.isInteger(tier.per_day_cents) || tier.per_day_cents < 0) {
      return "Pricing tier price must be zero or higher";
    }
    if (tierDays.has(tier.min_days)) {
      return `Duplicate pricing tier for ${tier.min_days} days`;
    }
    tierDays.add(tier.min_days);
  }

  return null;
}

function validateImageUrl(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return null;
  const imageUrl = value.trim();
  if (imageUrl.startsWith("/") || /^https?:\/\//i.test(imageUrl)) return null;
  return "Image must be uploaded through admin or use a public https URL";
}

/**
 * PUT /api/admin/products/[id] — Update a product
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();

  const { id } = await params;

  try {
    const body = await request.json();
    const supabase = createAdminClient();

    if (body.pricing_tiers) {
      const validationError = validatePricingTiers(body.pricing_tiers);
      if (validationError) {
        return NextResponse.json({ error: validationError }, { status: 400 });
      }
    }

    const imageValidationError = validateImageUrl(body.image_url);
    if (imageValidationError) {
      return NextResponse.json({ error: imageValidationError }, { status: 400 });
    }

    if (body.slug !== undefined && (typeof body.slug !== "string" || !isValidSlug(body.slug.trim()))) {
      return NextResponse.json(
        { error: "Product slug must use lowercase letters, numbers, and hyphens only" },
        { status: 400 }
      );
    }

    if (body.subcategory_slug !== undefined && (typeof body.subcategory_slug !== "string" || !isValidSlug(body.subcategory_slug.trim()))) {
      return NextResponse.json(
        { error: "Subcategory slug must use lowercase letters, numbers, and hyphens only" },
        { status: 400 }
      );
    }

    // Build update object with only provided fields
    const updates: Record<string, unknown> = {};
    const allowedFields = [
      "name", "brand", "description", "emoji", "image_url",
      "category_id", "subcategory", "subcategory_slug", "city",
      "stock_total", "stock_available", "is_active", "slug",
      "features", "specs", "meta_title", "meta_description",
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    const { data, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // Update pricing tiers if provided
    if (body.pricing_tiers) {
      // Delete existing tiers and re-insert
      const { error: deletePricingError } = await supabase
        .from("pricing_tiers")
        .delete()
        .eq("product_id", id);

      if (deletePricingError) {
        console.error("[admin/products] Pricing delete error:", deletePricingError);
        return NextResponse.json(
          { error: `Product pricing update failed: ${getErrorMessage(deletePricingError)}` },
          { status: 400 }
        );
      }

      if (body.pricing_tiers.length > 0) {
        const { error: pricingError } = await supabase
          .from("pricing_tiers")
          .insert(
            body.pricing_tiers.map((t: PricingTierPayload) => ({
              product_id: id,
              min_days: t.min_days,
              per_day_cents: t.per_day_cents,
            }))
          );

        if (pricingError) {
          console.error("[admin/products] Pricing update error:", pricingError);
          return NextResponse.json(
            { error: `Product pricing update failed: ${getErrorMessage(pricingError)}` },
            { status: 400 }
          );
        }
      }
    }

    return NextResponse.json({ product: data });
  } catch (err) {
    console.error("[admin/products] PUT error:", err);
    return NextResponse.json(
      { error: `Failed to update product: ${getErrorMessage(err)}` },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/products/[id] — Soft-delete (set is_active = false)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();

  const { id } = await params;

  try {
    const supabase = createAdminClient();

    const { error } = await supabase
      .from("products")
      .update({ is_active: false })
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[admin/products] DELETE error:", err);
    return NextResponse.json(
      { error: `Failed to deactivate product: ${getErrorMessage(err)}` },
      { status: 500 }
    );
  }
}
