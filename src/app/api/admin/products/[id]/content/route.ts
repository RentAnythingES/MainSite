import { NextRequest, NextResponse } from "next/server";
import { unauthorizedResponse, verifyAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase-admin";

type LocalizationPayload = {
  locale: "en" | "es";
  short_description?: string;
  detail_description?: string;
  includes_text?: string;
  constraints_text?: string;
  delivery_setup_note?: string;
  care_note?: string;
  seo_title?: string;
  seo_description?: string;
};

type FaqPayload = { locale: "en" | "es"; question: string; answer: string; sort_order: number };
type PrimaryImagePayload = { alt_text?: string; source_url?: string; rights_status?: string };

function getErrorMessage(error: unknown) {
  return error && typeof error === "object" && "message" in error
    ? String((error as { message: unknown }).message)
    : "Unknown error";
}

function buildReadiness(product: Record<string, unknown>) {
  const localizations = (product.product_localizations as LocalizationPayload[]) || [];
  const faqs = (product.product_faqs as FaqPayload[]) || [];
  const images = (product.product_images as Array<PrimaryImagePayload & { image_url?: string }>) || [];
  const pricing = (product.pricing_tiers as Array<{ per_day_cents: number }>) || [];
  const english = localizations.find((item) => item.locale === "en");
  const primaryImage = images.find((item) => item.image_url === product.image_url) || images[0];
  const missing: string[] = [];

  if (!product.image_url) missing.push("A product image");
  if (!pricing.some((tier) => tier.per_day_cents > 0)) missing.push("Positive rental pricing");
  if (Number(product.stock_total || 0) < 1) missing.push("Confirmed stock");
  if (!english?.short_description?.trim()) missing.push("English short description");
  if (!english?.detail_description?.trim()) missing.push("English product detail copy");
  if (!english?.seo_title?.trim() || !english?.seo_description?.trim()) missing.push("English SEO title and description");
  if (faqs.filter((faq) => faq.locale === "en" && faq.question?.trim() && faq.answer?.trim()).length < 3) missing.push("Three English FAQs");
  if (!primaryImage?.alt_text?.trim()) missing.push("Primary image alt text");
  if (!primaryImage?.rights_status || primaryImage.rights_status === "unknown") missing.push("Confirm why RentAnything is allowed to use the primary image");

  return { ready: missing.length === 0, missing };
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();

  const { id } = await params;
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("products")
      .select("id, name, slug, brand, image_url, stock_total, content_status, pricing_tiers(min_days, per_day_cents), product_localizations(*), product_faqs(*), product_images(*)")
      .eq("id", id)
      .single();
    if (error || !data) throw error || new Error("Product not found");
    return NextResponse.json({ product: data, readiness: buildReadiness(data as Record<string, unknown>) });
  } catch (error) {
    console.error("[admin/products/content] GET error:", error);
    return NextResponse.json({ error: "Could not load product content. Confirm the product-content migration has been applied." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();

  const { id } = await params;
  try {
    const body = await request.json() as {
      content_status?: "draft" | "facts_verified" | "content_ready";
      localizations?: LocalizationPayload[];
      faqs?: FaqPayload[];
      primary_image?: PrimaryImagePayload;
    };
    const allowedImageStatuses = ["unknown", "owned", "licensed", "manufacturer_approved"];
    if (body.primary_image?.rights_status && !allowedImageStatuses.includes(body.primary_image.rights_status)) {
      return NextResponse.json({ error: "Choose a valid image permission status." }, { status: 400 });
    }
    const supabase = createAdminClient();
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id, image_url")
      .eq("id", id)
      .single();
    if (productError || !product) throw productError || new Error("Product not found");

    const localizations = (body.localizations || []).map((item) => ({
      product_id: id,
      locale: item.locale,
      short_description: item.short_description?.trim() || null,
      detail_description: item.detail_description?.trim() || null,
      includes_text: item.includes_text?.trim() || null,
      constraints_text: item.constraints_text?.trim() || null,
      delivery_setup_note: item.delivery_setup_note?.trim() || null,
      care_note: item.care_note?.trim() || null,
      seo_title: item.seo_title?.trim() || null,
      seo_description: item.seo_description?.trim() || null,
    }));
    if (localizations.length > 0) {
      const { error } = await supabase.from("product_localizations").upsert(localizations, { onConflict: "product_id,locale" });
      if (error) throw error;
    }

    const cleanedFaqs = (body.faqs || [])
      .filter((faq) => faq.question?.trim() || faq.answer?.trim())
      .map((faq, index) => ({
        product_id: id,
        locale: faq.locale,
        question: faq.question?.trim() || "",
        answer: faq.answer?.trim() || "",
        sort_order: index,
      }));
    const { error: deleteFaqError } = await supabase.from("product_faqs").delete().eq("product_id", id);
    if (deleteFaqError) throw deleteFaqError;
    if (cleanedFaqs.length > 0) {
      const { error } = await supabase.from("product_faqs").insert(cleanedFaqs);
      if (error) throw error;
    }

    if (product.image_url && body.primary_image) {
      const { error: deleteImageError } = await supabase.from("product_images").delete().eq("product_id", id).eq("is_primary", true);
      if (deleteImageError) throw deleteImageError;
      const { error } = await supabase.from("product_images").insert({
        product_id: id,
        image_url: product.image_url,
        alt_text: body.primary_image.alt_text?.trim() || null,
        source_url: body.primary_image.source_url?.trim() || null,
        rights_status: body.primary_image.rights_status || "unknown",
        is_primary: true,
      });
      if (error) throw error;
    }

    const { data: contentSnapshot, error: contentSnapshotError } = await supabase
      .from("products")
      .select("image_url, stock_total, pricing_tiers(per_day_cents), product_localizations(*), product_faqs(*), product_images(*)")
      .eq("id", id)
      .single();
    if (contentSnapshotError || !contentSnapshot) throw contentSnapshotError || new Error("Product not found");
    const readiness = buildReadiness(contentSnapshot as Record<string, unknown>);

    if (body.content_status === "content_ready" && !readiness.ready) {
      return NextResponse.json({ error: `Content is not ready: ${readiness.missing.join(", ")}`, readiness }, { status: 400 });
    }

    if (body.content_status) {
      const { error } = await supabase.from("products").update({ content_status: body.content_status }).eq("id", id);
      if (error) throw error;
    }

    return NextResponse.json({ product: { ...product, content_status: body.content_status }, readiness });
  } catch (error) {
    console.error("[admin/products/content] PUT error:", error);
    return NextResponse.json({ error: `Could not save product content: ${getErrorMessage(error)}` }, { status: 500 });
  }
}
