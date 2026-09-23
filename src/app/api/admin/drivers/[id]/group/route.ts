import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { createDeliveryDriverInviteLink, removeDeliveryDriverFromGroup } from "@/lib/telegram";
import { createAdminClient } from "@/lib/supabase-admin";

async function loadDriver(id: string) {
  const { data, error } = await createAdminClient().from("delivery_drivers")
    .select("id,full_name,telegram_user_id,is_active")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as { id: string; full_name: string; telegram_user_id: number; is_active: boolean } | null;
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();
  const { id } = await params;
  const driver = await loadDriver(id).catch(() => null);
  if (!driver) return NextResponse.json({ error: "Driver not found" }, { status: 404 });
  if (!driver.is_active) return NextResponse.json({ error: "Reactivate the driver before creating an invite" }, { status: 409 });

  const invite = await createDeliveryDriverInviteLink(driver.full_name);
  if (!invite.ok) return NextResponse.json({ error: invite.error || "Could not create Telegram invite" }, { status: 502 });
  const { data, error } = await createAdminClient().from("delivery_drivers")
    .update({ group_membership_status: "invited", invited_at: new Date().toISOString(), removed_at: null })
    .eq("id", id).select("*").single();
  if (error) return NextResponse.json({ error: "Invite created but driver record could not be updated" }, { status: 500 });
  return NextResponse.json({ driver: data, inviteLink: invite.inviteLink });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();
  const { id } = await params;
  const driver = await loadDriver(id).catch(() => null);
  if (!driver) return NextResponse.json({ error: "Driver not found" }, { status: 404 });

  const removed = await removeDeliveryDriverFromGroup(driver.telegram_user_id);
  if (!removed.ok) return NextResponse.json({ error: removed.error || "Could not remove the driver from Telegram" }, { status: 502 });
  const { data, error } = await createAdminClient().from("delivery_drivers")
    .update({ is_active: false, group_membership_status: "removed", removed_at: new Date().toISOString() })
    .eq("id", id).select("*").single();
  if (error) return NextResponse.json({ error: "Driver was removed from Telegram but record update failed" }, { status: 500 });
  return NextResponse.json({ driver: data });
}
