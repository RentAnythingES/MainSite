import { createClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase admin client (service role, bypasses RLS)
 * Use ONLY in API routes and server components, never expose to client
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey || url.includes("placeholder")) {
    throw new Error("Supabase admin credentials not configured");
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
