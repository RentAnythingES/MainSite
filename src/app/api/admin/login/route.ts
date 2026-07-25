import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isAdminUser } from "@/lib/admin-auth";

async function ensureBootstrapAdmin(email: string, password: string) {
  const bootstrapEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const bootstrapPassword = process.env.ADMIN_PASSWORD?.trim();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!bootstrapEmail || !bootstrapPassword || !url || !serviceRoleKey) {
    return;
  }

  if (email.trim().toLowerCase() !== bootstrapEmail || password !== bootstrapPassword) {
    return;
  }

  const adminClient = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      app_metadata: { role: "admin" },
      user_metadata: { email_verified: true },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!message.includes("already") && !message.includes("exists")) {
      console.warn("[admin/login] bootstrap admin setup failed:", message);
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anonKey) {
      return NextResponse.json({ error: "Server not configured" }, { status: 500 });
    }

    await ensureBootstrapAdmin(email, password);

    const supabase = createClient(url, anonKey, {
      auth: { persistSession: false },
    });

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.session) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    if (!isAdminUser(data.user)) {
      await supabase.auth.signOut();
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    // Set tokens as httpOnly cookies
    const response = NextResponse.json({ success: true, user: data.user?.email });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    };

    response.cookies.set("sb-access-token", data.session.access_token, cookieOptions);
    response.cookies.set("sb-refresh-token", data.session.refresh_token, cookieOptions);

    return response;
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
