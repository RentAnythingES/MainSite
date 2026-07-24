import { createHmac } from "node:crypto";
import type { NextRequest } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";

export interface RateLimitRule {
  scope: string;
  identifier: string;
  limit: number;
  windowSeconds: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

interface RateLimitRpcRow {
  allowed: boolean;
  remaining: number;
  retry_after_seconds: number;
}

function rateLimitSecret() {
  const secret =
    process.env.RATE_LIMIT_HMAC_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!secret) {
    throw new Error("Rate-limit HMAC secret is not configured");
  }

  return secret;
}

function hashIdentifier(scope: string, identifier: string) {
  return createHmac("sha256", rateLimitSecret())
    .update(`${scope}:${identifier.trim().toLowerCase()}`)
    .digest("hex");
}

export function getClientIp(request: NextRequest) {
  const forwarded =
    request.headers.get("x-vercel-forwarded-for") ||
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip");

  return forwarded?.split(",")[0]?.trim() || "unknown";
}

export async function consumeRateLimits(
  supabase: SupabaseClient,
  rules: RateLimitRule[],
): Promise<RateLimitResult> {
  const results = await Promise.all(
    rules.map(async (rule) => {
      const { data, error } = await supabase.rpc("consume_api_rate_limit", {
        p_route: rule.scope,
        p_key_hash: hashIdentifier(rule.scope, rule.identifier),
        p_limit: rule.limit,
        p_window_seconds: rule.windowSeconds,
      });

      if (error) {
        throw new Error(`Rate-limit check failed for ${rule.scope}: ${error.message}`);
      }

      const row = (Array.isArray(data) ? data[0] : data) as RateLimitRpcRow | null;
      if (!row) {
        throw new Error(`Rate-limit check returned no result for ${rule.scope}`);
      }

      return {
        allowed: row.allowed,
        remaining: row.remaining,
        retryAfterSeconds: row.retry_after_seconds,
      };
    }),
  );

  const denied = results.filter((result) => !result.allowed);
  if (denied.length > 0) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(...denied.map((result) => result.retryAfterSeconds)),
    };
  }

  return {
    allowed: true,
    remaining: Math.min(...results.map((result) => result.remaining)),
    retryAfterSeconds: 0,
  };
}
