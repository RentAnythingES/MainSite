import type { Assignment, Driver, Market, Workspace } from "./shared";
import { dateInZone, pendingStop } from "@/lib/agent-workspace";
export type Stop = { order: Assignment; kind: "delivery" | "collection"; market?: Market; scheduled: string | null; date: string; driver?: Driver };
export function getStops(data: Workspace): Stop[] {
  return data.orders.filter(o => o.status === "accepted").flatMap(order => {
    const market = data.territories.find(t => t.market_id === order.bookings.market_id)?.markets;
    return (["delivery", "collection"] as const).filter(kind => pendingStop(order.bookings.status, kind)).map(kind => {
      const scheduled = kind === "delivery" ? order.delivery_scheduled_at : order.collection_scheduled_at;
      return { order, kind, market, scheduled, date: scheduled ? dateInZone(scheduled, market?.timezone) : kind === "delivery" ? order.bookings.start_date : order.bookings.end_date, driver: data.drivers.find(d => d.id === (kind === "delivery" ? order.delivery_driver_id : order.collection_driver_id)) };
    });
  }).sort((a, b) => a.date.localeCompare(b.date) || (a.scheduled || "9999").localeCompare(b.scheduled || "9999"));
}
export function stopTime(stop: Stop) {
  return stop.scheduled ? new Intl.DateTimeFormat("en-GB", { timeZone: stop.market?.timezone || "UTC", hour: "2-digit", minute: "2-digit" }).format(new Date(stop.scheduled)) : "Time to confirm";
}
