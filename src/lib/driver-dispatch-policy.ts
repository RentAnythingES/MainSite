const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
export const DRIVER_REMINDER_INTERVAL_MS = 4 * HOUR;

export function driverDispatchStartsAt(createdAt: string, dueAt: string) {
  const created = Date.parse(createdAt);
  const due = Date.parse(dueAt);
  if (!Number.isFinite(created) || !Number.isFinite(due)) return NaN;
  return due - created > 7 * DAY ? due - 6 * DAY : created;
}

export function isDriverWorkingTime(now: Date) {
  const hour = Number(new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Madrid", hour: "2-digit", hourCycle: "h23",
  }).format(now));
  return hour >= 8 && hour < 20;
}

export type DispatchState = {
  status: string;
  first_notified_at: string | null;
  last_notified_at: string | null;
  admin_alerted_at: string | null;
};

export function getDriverDispatchActions(
  state: DispatchState, createdAt: string, dueAt: string, now: Date,
) {
  const due = Date.parse(dueAt);
  const ready = state.status === "open" && Number.isFinite(due)
    && now.getTime() >= driverDispatchStartsAt(createdAt, dueAt);
  return {
    notifyDrivers: ready && (
      !state.first_notified_at || (isDriverWorkingTime(now)
        && now.getTime() - Date.parse(state.last_notified_at || state.first_notified_at) >= DRIVER_REMINDER_INTERVAL_MS)
    ),
    // A delayed scheduler must still raise a missed urgent alert after the due time.
    alertAdmin: ready && !state.admin_alerted_at && now.getTime() >= due - 2 * HOUR,
  };
}
