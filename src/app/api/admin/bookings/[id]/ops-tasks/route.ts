import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { unauthorizedResponse, verifyAdmin } from "@/lib/admin-auth";
import { DEFAULT_OPS_TASKS, isMissingBookingOpsTasksTable } from "@/lib/booking-ops";
import { sendBookingLifecycleNotification } from "@/lib/booking-status-notifications";

type OpsTaskPatchBody = {
  taskKey?: string;
  isDone?: boolean;
  note?: string | null;
};

function getErrorMessage(err: unknown) {
  if (err && typeof err === "object" && "message" in err) {
    return String((err as { message: unknown }).message);
  }
  return "Unknown error";
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();

  const { id } = await params;

  try {
    const body = await request.json() as OpsTaskPatchBody;
    const taskDefinition = DEFAULT_OPS_TASKS.find((task) => task.task_key === body.taskKey);

    if (!taskDefinition) {
      return NextResponse.json({ error: "Unknown checklist task" }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("*, product:products(name)")
      .eq("id", id)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const isDone = Boolean(body.isDone);
    const { data, error } = await supabase
      .rpc("update_booking_ops_task", {
        p_booking_id: id,
        p_task_key: taskDefinition.task_key,
        p_is_done: isDone,
        p_note: body.note ?? null,
        p_actor_user_id: user.id,
      })
      .single();

    if (error) throw error;

    const result = data as {
      task: Record<string, unknown>;
      booking_status: string;
      previous_booking_status: string;
      status_changed: boolean;
    };
    const emailSent = result.status_changed
      ? await sendBookingLifecycleNotification(
          supabase,
          booking as Record<string, unknown>,
          result.booking_status,
        )
      : false;

    return NextResponse.json({
      task: result.task,
      bookingStatus: result.booking_status,
      previousBookingStatus: result.previous_booking_status,
      statusChanged: result.status_changed,
      emailSent,
    });
  } catch (err) {
    console.error("[admin/bookings/ops-tasks] PATCH error:", err);
    if (isMissingBookingOpsTasksTable(err)) {
      return NextResponse.json(
        {
          code: "BOOKING_OPS_MIGRATION_REQUIRED",
          error: "The operations checklist is not installed yet. Apply migration 20260711_booking_ops_tasks.sql; all other booking actions remain available.",
        },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: `Failed to update checklist: ${getErrorMessage(err)}` },
      { status: 500 }
    );
  }
}
