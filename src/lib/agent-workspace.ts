// Shared, pure view logic. Never use these filters as a substitute for API authorization.
export function dateInZone(value: Date | string, timezone = "UTC") {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date(value));
  const get = (type: string) => parts.find(p => p.type === type)?.value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}
export function isOpenStatus(status: string) { return ["paid", "delivering", "active", "returning"].includes(status); }
export function pendingStop(status: string, kind: "delivery" | "collection") {
  return kind === "delivery" ? ["paid", "delivering"].includes(status) : isOpenStatus(status);
}
export function datesOverlap(start: string, end: string, from: string, to: string) {
  return (!to || start <= to) && (!from || end >= from);
}
export function monthDays(month: string) {
  const first = new Date(`${month}-01T12:00:00Z`);
  const offset = (first.getUTCDay() + 6) % 7;
  return Array.from({ length: 42 }, (_, i) => {
    const day = new Date(first); day.setUTCDate(first.getUTCDate() - offset + i); return day.toISOString().slice(0, 10);
  });
}
export function shiftMonth(month: string, amount: number) {
  const day = new Date(`${month}-01T12:00:00Z`); day.setUTCMonth(day.getUTCMonth() + amount); return day.toISOString().slice(0, 7);
}
