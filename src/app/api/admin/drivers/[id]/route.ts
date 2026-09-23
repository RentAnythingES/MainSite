import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase-admin";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();
  const { id } = await params;
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body || typeof body.isActive !== "boolean") return NextResponse.json({ error: "isActive is required" }, { status: 400 });

  const { data, error } = await createAdminClient().from("delivery_drivers")
    .update({ is_active: body.isActive })
    .eq("id", id)
    .select("*")
    .maybeSingle();
  if (error) return NextResponse.json({ error: "Could not update driver" }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Driver not found" }, { status: 404 });
  return NextResponse.json({ driver: data });
}
