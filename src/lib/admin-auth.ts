import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";

export function isAdminUser(user: Pick<User, "app_metadata"> | null | undefined) {
  return user?.app_metadata?.role === "admin";
}

/**
 * Verify the admin session from a request.
 * Checks the Supabase access token stored in cookies.
 * Returns the user if valid, null otherwise.
 */
export async function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get("sb-access-token")?.value;
  if (!token) return null;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user || !isAdminUser(user)) return null;

  return user;
}

/**
 * Helper: return 401 if not admin
 */
export function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
