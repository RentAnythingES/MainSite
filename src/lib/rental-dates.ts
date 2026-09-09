export interface RentalWindow {
  start: Date;
  end: Date;
  days: number;
}

function parseRentalDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;

  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function calendarDayNumber(value: string): number {
  const [year, month, day] = value.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

export function getRentalWindow(startValue: string, endValue: string): RentalWindow | null {
  const start = parseRentalDate(startValue);
  const end = parseRentalDate(endValue);

  if (!start || !end) return null;

  const diff = calendarDayNumber(endValue) - calendarDayNumber(startValue);
  if (diff <= 0) return null;

  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return { start, end, days };
}
