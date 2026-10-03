import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase-admin";
import { invalidatePublicProductCache } from "@/lib/product-cache";
import { isLocale, localeRegistry } from "@/i18n/config";
import { isLocaleTag, isMarketId } from "@/lib/route-context";
import {
  translationReadiness,
  validateTranslationContent,
  type TranslationEntry,
} from "@/lib/translation-workflow";

type Context = { params: Promise<{ id: string }> };
const response = (data: unknown, status = 200) =>
  NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } });

export async function GET(request: NextRequest, { params }: Context) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();
  const { id } = await params;
  const locale = request.nextUrl.searchParams.get("locale") || "de";
  if (!isMarketId(id) || !isLocaleTag(locale) || locale === "en")
    return response({ error: "Choose a product and target language" }, 400);
  const db = createAdminClient();
  const [productResult, languagesResult, eventsResult] = await Promise.all([
    db
      .from("products")
      .select(
        "id,slug,name,brand,description,features,specs,image_url,content_status,translation_source_revision,product_localizations(*),product_faqs(*),product_images(*)",
      )
      .eq("id", id)
      .maybeSingle(),
    db.from("locales").select("code,name,is_public").order("code"),
    db
      .from("translation_events")
      .select("action,revision,source_revision,actor_id,created_at")
      .eq("product_id", id)
      .eq("locale", locale)
      .order("id", { ascending: false })
      .limit(20),
  ]);
  if (productResult.error || languagesResult.error || eventsResult.error)
    return response(
      {
        error:
          "Translation workflow is unavailable. Apply the translation workflow migration first.",
      },
      503,
    );
  if (!productResult.data) return response({ error: "Product not found" }, 404);
  if (!languagesResult.data.some((row) => row.code === locale))
    return response({ error: "Unknown language" }, 400);
  const product = productResult.data;
  const entry = (product.product_localizations || []).find(
    (row: { locale: string }) => row.locale === locale,
  ) as TranslationEntry | undefined;
  return response({
    product,
    entry: entry || null,
    languages: languagesResult.data.filter((row) => row.code !== "en"),
    readiness: translationReadiness(
      entry || null,
      product.translation_source_revision,
    ),
    events: eventsResult.data,
    canPublish:
      isLocale(locale) &&
      localeRegistry[locale].public &&
      languagesResult.data.some((row) => row.code === locale && row.is_public),
  });
}

export async function PUT(request: NextRequest, { params }: Context) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();
  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (
    !isMarketId(id) ||
    !body ||
    !isLocaleTag(body.locale) ||
    body.locale === "en" ||
    !["save", "review", "publish", "unpublish"].includes(body.action) ||
    !Number.isSafeInteger(body.expectedRevision) ||
    body.expectedRevision < 0 ||
    !Number.isSafeInteger(body.expectedSourceRevision) ||
    body.expectedSourceRevision < 1
  )
    return response({ error: "Invalid translation request" }, 400);
  if (
    body.action === "review" &&
    (body.languageReviewed !== true || body.factsReviewed !== true)
  )
    return response(
      { error: "Confirm language and product-fact review before approving" },
      400,
    );
  const targetLocale: string = body.locale;
  if (
    body.action === "publish" &&
    (!isLocale(targetLocale) || !localeRegistry[targetLocale].public)
  )
    return response(
      { error: "This language is private in the application" },
      409,
    );
  let content = null;
  if (body.action === "save") {
    try {
      content = validateTranslationContent(body.content);
    } catch (error) {
      return response(
        { error: error instanceof Error ? error.message : "Invalid content" },
        400,
      );
    }
  }
  const db = createAdminClient();
  const { data, error } = await db.rpc("manage_product_translation", {
    p_product_id: id,
    p_locale: body.locale,
    p_action: body.action,
    p_expected_revision: body.expectedRevision,
    p_expected_source_revision: body.expectedSourceRevision,
    p_content: content,
    p_actor_id: user.id,
  });
  if (error)
    return response(
      {
        error: ["40001", "22023", "P0002"].includes(error.code)
          ? error.message
          : "Could not save translation",
      },
      error.code === "40001"
        ? 409
        : error.code === "P0002"
          ? 404
          : error.code === "22023"
            ? 400
            : 500,
    );
  invalidatePublicProductCache();
  return response({ entry: data });
}
