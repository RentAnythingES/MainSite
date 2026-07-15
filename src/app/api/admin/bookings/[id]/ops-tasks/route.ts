import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { unauthorizedResponse, verifyAdmin } from "@/lib/admin-auth";
import { DEFAULT_OPS_TASKS, ensureBookingOpsTasks, isMissingBookingOpsTasksTable } from "@/lib/booking-ops";

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
      .select("id")
      .eq("id", id)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    await ensureBookingOpsTasks(supabase, id);

    const isDone = Boolean(body.isDone);
    const updates = {
      is_done: isDone,
      completed_at: isDone ? new Date().toISOString() : null,
      completed_by: isDone ? user.id : null,
      note: body.note === undefined ? undefined : body.note,
    };

    const { data, error } = await supabase
      .from("booking_ops_tasks")
      .update(updates)
      .eq("booking_id", id)
      .eq("task_key", taskDefinition.task_key)
      .select("*")
      .single();

    if (error) throw error;

    return NextResponse.json({ task: data });
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
