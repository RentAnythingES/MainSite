import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { getProductReadinessIssues, isValidProductSlug } from "@/lib/product-validation";
import { invalidatePublicProductCache } from "@/lib/product-cache";
import { seoCategorySlugs } from "@/data/seo-clusters";

type PricingTierPayload = { min_days: number; per_day_cents: number };
type QuantityDiscountPayload = { min_quantity: number; discount_bps: number };
const publicCategorySlugs = new Set<string>(seoCategorySlugs);

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

function validateQuantityDiscounts(tiers: QuantityDiscountPayload[]) {
  const quantities = new Set<number>();
  for (const tier of tiers) {
    if (!Number.isInteger(tier.min_quantity) || tier.min_quantity < 2) {
      return "Quantity discount minimum must be at least 2 units";
    }
    if (!Number.isInteger(tier.discount_bps) || tier.discount_bps < 1 || tier.discount_bps >= 10000) {
      return "Quantity discount must be greater than 0% and less than 100%";
    }
    if (quantities.has(tier.min_quantity)) {
      return `Duplicate quantity discount for ${tier.min_quantity} units`;
    }
    quantities.add(tier.min_quantity);
  }
  return null;
}

function validateImageUrl(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return null;
  const imageUrl = value.trim();
  if (imageUrl.startsWith("/") || /^https?:\/\//i.test(imageUrl)) return null;
  return "Image must be uploaded through admin or use a public https URL";
}

function isContentMigrationMissing(error: unknown) {
  const code = (error as { code?: string } | null)?.code;
  return code === "42703" || code === "PGRST204" || code === "PGRST205" || code === "42P01";
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
  let didMutate = false;

  try {
    const body = await request.json();
    const supabase = createAdminClient();

    if (body.pricing_tiers) {
      const validationError = validatePricingTiers(body.pricing_tiers);
      if (validationError) {
        return NextResponse.json({ error: validationError }, { status: 400 });
      }
    }

    if (body.quantity_discounts) {
      const validationError = validateQuantityDiscounts(body.quantity_discounts);
      if (validationError) {
        return NextResponse.json({ error: validationError }, { status: 400 });
      }
    }

    const imageValidationError = validateImageUrl(body.image_url);
    if (imageValidationError) {
      return NextResponse.json({ error: imageValidationError }, { status: 400 });
    }

    if (body.slug !== undefined && (typeof body.slug !== "string" || !isValidProductSlug(body.slug.trim()))) {
      return NextResponse.json(
        { error: "Product slug must use lowercase letters, numbers, and hyphens only" },
        { status: 400 }
      );
    }

    if (body.subcategory_slug !== undefined && (typeof body.subcategory_slug !== "string" || !isValidProductSlug(body.subcategory_slug.trim()))) {
      return NextResponse.json(
        { error: "Subcategory slug must use lowercase letters, numbers, and hyphens only" },
        { status: 400 }
      );
    }

    const { data: existingProduct, error: existingProductError } = await supabase
      .from("products")
      .select("slug, name, brand, description, image_url, category_id, subcategory, subcategory_slug, stock_total, stock_available, pricing_tiers (min_days, per_day_cents)")
      .eq("id", id)
      .single();

    if (existingProductError || !existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (body.is_active === true) {
      const targetCategoryId = String(body.category_id || existingProduct.category_id || "");
      const { data: targetCategory, error: targetCategoryError } = await supabase
        .from("categories")
        .select("slug")
        .eq("id", targetCategoryId)
        .single();

      if (targetCategoryError || !targetCategory?.slug || !publicCategorySlugs.has(targetCategory.slug)) {
        return NextResponse.json(
          { error: "This product cannot be activated until its category has a public customer-facing hub." },
          { status: 400 },
        );
      }

      const issues = getProductReadinessIssues({
        ...existingProduct,
        ...body,
        pricing_tiers: body.pricing_tiers || existingProduct.pricing_tiers,
      });
      if (issues.length > 0) {
        return NextResponse.json({ error: `This product cannot be activated: ${issues[0]}` }, { status: 400 });
      }

      const { data: editorialStatus, error: editorialStatusError } = await supabase
        .from("products")
        .select("content_status")
        .eq("id", id)
        .single();

      if (editorialStatusError) {
        if (isContentMigrationMissing(editorialStatusError)) {
          return NextResponse.json(
            { error: "Apply the product-content migration before activating new products." },
            { status: 400 }
          );
        }
        throw editorialStatusError;
      }

      if ((editorialStatus as { content_status?: string } | null)?.content_status !== "content_ready") {
        return NextResponse.json(
          { error: "Complete the Content review and mark this product content ready before activation." },
          { status: 400 }
        );
      }
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
    didMutate = true;

    // Update pricing tiers if provided
    if (body.pricing_tiers) {
      // Delete existing tiers and re-insert
      const { error: deletePricingError } = await supabase
        .from("pricing_tiers")
        .delete()
        .eq("product_id", id);

      if (deletePricingError) {
        invalidatePublicProductCache();
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
          invalidatePublicProductCache();
          console.error("[admin/products] Pricing update error:", pricingError);
          return NextResponse.json(
            { error: `Product pricing update failed: ${getErrorMessage(pricingError)}` },
            { status: 400 }
          );
        }
      }
    }


    if (body.quantity_discounts) {
      const { error: deleteDiscountError } = await supabase
        .from("product_quantity_discounts")
        .delete()
        .eq("product_id", id);

      if (deleteDiscountError) {
        return NextResponse.json({ error: `Quantity discount update failed: ${getErrorMessage(deleteDiscountError)}` }, { status: 400 });
      }

      if (body.quantity_discounts.length > 0) {
        const { error: discountError } = await supabase
          .from("product_quantity_discounts")
          .insert(body.quantity_discounts.map((tier: QuantityDiscountPayload) => ({
            product_id: id,
            min_quantity: tier.min_quantity,
            discount_bps: tier.discount_bps,
          })));

        if (discountError) {
          return NextResponse.json({ error: `Quantity discount update failed: ${getErrorMessage(discountError)}` }, { status: 400 });
        }
      }
    }

    invalidatePublicProductCache([existingProduct.slug, String(data.slug || existingProduct.slug)]);
    return NextResponse.json({ product: data });
  } catch (err) {
    if (didMutate) invalidatePublicProductCache();
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

    const { data: product, error } = await supabase
      .from("products")
      .update({ is_active: false })
      .eq("id", id)
      .select("slug")
      .single();

    if (error) throw error;

    invalidatePublicProductCache(product?.slug ? [product.slug] : []);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[admin/products] DELETE error:", err);
    return NextResponse.json(
      { error: `Failed to deactivate product: ${getErrorMessage(err)}` },
      { status: 500 }
    );
  }
}
