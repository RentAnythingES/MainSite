import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { createServiceClient } from "@/lib/supabase";
import { MarketValidationError, validateMarketSetup } from "./market-validation";
import { isMarketId } from "./route-context";

export async function saveAdminMarket(request: NextRequest, marketId?: string) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();
  // Cookie-authenticated writes must originate from this application's browser origin.
  const requestOrigin = new URL(request.url);
  // Next's local server can normalize the URL hostname to localhost. The browser
  // Host header retains the actual origin (and cannot be set by cross-site JS).
  requestOrigin.host = request.headers.get("host") ?? requestOrigin.host;
  if (request.headers.get("origin") !== requestOrigin.origin) {
    return NextResponse.json({ error: "Reload this page before saving" }, { status: 403 });
  }
  if (marketId !== undefined && !isMarketId(marketId)) {
    return NextResponse.json({ error: "Invalid city ID" }, { status: 400 });
  }
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new MarketValidationError("Enter city details");
    const { expectedUpdatedAt, ...config } = body as Record<string, unknown>;
    if (marketId && (typeof expectedUpdatedAt !== "string" || !Number.isFinite(Date.parse(expectedUpdatedAt)))) {
      throw new MarketValidationError("Reload the city before saving");
    }
    if (!marketId && expectedUpdatedAt !== undefined) throw new MarketValidationError("Unexpected city revision");
    const validated = validateMarketSetup(config);
    const { data, error } = await createServiceClient().rpc("save_private_market", {
      p_actor_id: user.id, p_config: validated, p_market_id: marketId ?? null,
      p_expected_updated_at: expectedUpdatedAt ?? null,
    });
    if (error) {
      if (error.code === "23505") return NextResponse.json({ error: "That city slug already exists" }, { status: 409 });
      if (error.code === "40001") return NextResponse.json({ error: "This city changed. Reload it before saving your changes." }, { status: 409 });
      if (error.code === "P0002") return NextResponse.json({ error: "City not found" }, { status: 404 });
      if (error.code === "42501") return unauthorizedResponse();
      if (error.code === "22023") return NextResponse.json({ error: "Invalid city settings. Operating cities allow name changes only; city slugs cannot change." }, { status: 400 });
      console.error("[admin-markets] Save failed", { marketId: marketId ?? null, actorId: user.id, code: error.code });
      return NextResponse.json({ error: "City setup is unavailable. Check the database migration before retrying." }, { status: 503 });
    }
    return NextResponse.json({ market: data }, { status: marketId ? 200 : 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof MarketValidationError || error instanceof SyntaxError) {
      return NextResponse.json({ error: error instanceof SyntaxError ? "Invalid JSON" : error.message }, { status: 400 });
    }
    console.error("[admin-markets] Unexpected save failure", { marketId: marketId ?? null, actorId: user.id });
    return NextResponse.json({ error: "Could not save city. Reload the list before retrying." }, { status: 503 });
  }
}
