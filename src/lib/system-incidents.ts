import { createAdminClient } from "@/lib/supabase-admin";

type IncidentSeverity = "info" | "warning" | "error" | "critical";

interface SystemIncidentInput {
  source: string;
  eventType: string;
  message: string;
  severity?: IncidentSeverity;
  context?: Record<string, unknown>;
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return typeof error === "string" ? error : "Unknown error";
}

export async function recordSystemIncident(input: SystemIncidentInput): Promise<void> {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("system_incidents").insert({
      source: input.source,
      event_type: input.eventType,
      severity: input.severity || "error",
      message: input.message,
      context: input.context || {},
    });

    if (error) {
      console.error("[system-incidents] Failed to persist incident:", error.message);
    }
  } catch (error) {
    console.error("[system-incidents] Incident recorder unavailable:", errorMessage(error));
  }
}

export function getIncidentErrorMessage(error: unknown): string {
  return errorMessage(error);
}
