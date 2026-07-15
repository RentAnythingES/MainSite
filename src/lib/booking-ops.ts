import type { SupabaseClient } from "@supabase/supabase-js";

export const DEFAULT_OPS_TASKS = [
  { task_key: "customer_contacted", label: "Customer contacted", sort_order: 10 },
  { task_key: "equipment_prepared", label: "Equipment prepared", sort_order: 20 },
  { task_key: "handoff_confirmed", label: "Handoff confirmed", sort_order: 30 },
  { task_key: "return_scheduled", label: "Return scheduled", sort_order: 40 },
  { task_key: "return_inspected", label: "Return inspected", sort_order: 50 },
] as const;

export type BookingOpsTaskKey = (typeof DEFAULT_OPS_TASKS)[number]["task_key"];

export function isMissingBookingOpsTasksTable(error: unknown) {
  const code = (error as { code?: string } | null)?.code;
  return code === "42P01" || code === "PGRST205";
}

export function getDefaultOpsTasks(bookingId: string) {
  return DEFAULT_OPS_TASKS.map((task) => ({
    booking_id: bookingId,
    task_key: task.task_key,
    label: task.label,
    sort_order: task.sort_order,
    is_done: false,
  }));
}

export async function ensureBookingOpsTasks(
  supabase: SupabaseClient,
  bookingId: string
) {
  const { error } = await supabase
    .from("booking_ops_tasks")
    .upsert(getDefaultOpsTasks(bookingId), {
      onConflict: "booking_id,task_key",
      ignoreDuplicates: true,
    });

  if (error && !isMissingBookingOpsTasksTable(error)) {
    throw error;
  }
}
