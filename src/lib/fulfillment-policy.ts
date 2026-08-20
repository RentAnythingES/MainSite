import type { OperatingDay, WeeklyOperatingHours } from "./types";

export const FULFILLMENT_TIME_ZONE = "Europe/Madrid";

export const DEFAULT_DELIVERY_OPERATING_HOURS: WeeklyOperatingHours = {
  monday: { open: "09:00", close: "20:00" },
  tuesday: { open: "09:00", close: "20:00" },
  wednesday: { open: "09:00", close: "20:00" },
  thursday: { open: "09:00", close: "20:00" },
  friday: { open: "09:00", close: "20:00" },
  saturday: { open: "09:00", close: "20:00" },
  sunday: { open: "09:00", close: "20:00" },
};

export type FulfillmentPolicyReason =
  | "standard_eligible"
  | "express_eligible"
  | "same_day_too_soon"
  | "future_date_too_soon"
  | "outside_operating_hours"
  | "closed_day"
  | "express_disabled"
  | "policy_unconfigured"
  | "start_in_past"
  | "end_not_after_start"
  | "invalid_valencia_time";

interface FulfillmentPolicyRequest {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}

export interface FulfillmentPolicyConfig {
  futureDateLeadHours: number;
  automaticExpressEnabled: boolean;
  expressMinLeadHours: number;
  operatingHours: unknown;
  baseFeeCents: number;
  expressSurchargeCents: number;
}

export interface FulfillmentPolicyInput {
  request: FulfillmentPolicyRequest;
  config: FulfillmentPolicyConfig;
  now?: Date;
}

interface NormalizedRequest {
  startAt: string;
  endAt: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  timeZone: typeof FULFILLMENT_TIME_ZONE;
}

interface PolicyResultBase {
  reason: FulfillmentPolicyReason;
  leadTimeMinutes: number | null;
  requested: NormalizedRequest | null;
  fees: {
    baseFeeCents: number;
    expressSurchargeCents: number;
    totalFeeCents: number;
  };
}

export interface CheckoutPolicyResult extends PolicyResultBase {
  decision: "standard_checkout" | "express_checkout";
  deliveryType: "standard" | "express";
}

export interface ManualPolicyResult extends PolicyResultBase {
  decision: "manual_confirmation";
  deliveryType: null;
}

export interface InvalidPolicyResult extends PolicyResultBase {
  decision: "invalid";
  deliveryType: null;
}

export type FulfillmentPolicyResult =
  | CheckoutPolicyResult
  | ManualPolicyResult
  | InvalidPolicyResult;

interface ZonedParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

const madridFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: FULFILLMENT_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

const operatingDays: OperatingDay[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

function getZonedParts(instant: Date): ZonedParts {
  const parts = madridFormatter.formatToParts(instant);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value);

  return {
    year: value("year"),
    month: value("month"),
    day: value("day"),
    hour: value("hour"),
    minute: value("minute"),
  };
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function formatDate(parts: ZonedParts): string {
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`;
}

function formatTime(parts: ZonedParts): string {
  return `${pad(parts.hour)}:${pad(parts.minute)}`;
}

function parseWallClock(date: string, time: string): ZonedParts | null {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  const timeMatch = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(time);
  if (!dateMatch || !timeMatch) return null;

  const parts = {
    year: Number(dateMatch[1]),
    month: Number(dateMatch[2]),
    day: Number(dateMatch[3]),
    hour: Number(timeMatch[1]),
    minute: Number(timeMatch[2]),
  };
  const check = new Date(
    Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute),
  );

  if (
    check.getUTCFullYear() !== parts.year ||
    check.getUTCMonth() !== parts.month - 1 ||
    check.getUTCDate() !== parts.day
  ) {
    return null;
  }

  return parts;
}

function sameWallClock(left: ZonedParts, right: ZonedParts): boolean {
  return (
    left.year === right.year &&
    left.month === right.month &&
    left.day === right.day &&
    left.hour === right.hour &&
    left.minute === right.minute
  );
}

export function valenciaWallClockToDate(date: string, time: string): Date | null {
  const requested = parseWallClock(date, time);
  if (!requested) return null;

  const wallClockUtc = Date.UTC(
    requested.year,
    requested.month - 1,
    requested.day,
    requested.hour,
    requested.minute,
  );
  let candidateMs = wallClockUtc;

  for (let attempt = 0; attempt < 4; attempt += 1) {
    const candidateParts = getZonedParts(new Date(candidateMs));
    const representedWallClock = Date.UTC(
      candidateParts.year,
      candidateParts.month - 1,
      candidateParts.day,
      candidateParts.hour,
      candidateParts.minute,
    );
    const adjustment = wallClockUtc - representedWallClock;
    candidateMs += adjustment;
    if (adjustment === 0) break;
  }

  const candidate = new Date(candidateMs);
  if (!sameWallClock(getZonedParts(candidate), requested)) return null;

  const oneHour = 60 * 60 * 1000;
  if (
    sameWallClock(getZonedParts(new Date(candidateMs - oneHour)), requested) ||
    sameWallClock(getZonedParts(new Date(candidateMs + oneHour)), requested)
  ) {
    return null;
  }

  return candidate;
}

function parseMinutes(value: unknown): number | null {
  if (typeof value !== "string") return null;
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value);
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

function getOperatingState(
  operatingHours: unknown,
  date: string,
  time: string,
): "open" | "closed" | "outside" | "unconfigured" {
  if (!operatingHours || typeof operatingHours !== "object" || Array.isArray(operatingHours)) {
    return "unconfigured";
  }

  const parsedDate = parseWallClock(date, "00:00");
  if (!parsedDate) return "unconfigured";
  const day = operatingDays[
    new Date(Date.UTC(parsedDate.year, parsedDate.month - 1, parsedDate.day)).getUTCDay()
  ];
  const window = (operatingHours as Partial<WeeklyOperatingHours>)[day];
  if (window === null) return "closed";
  if (!window || typeof window !== "object") return "unconfigured";

  const open = parseMinutes(window.open);
  const close = parseMinutes(window.close);
  const requested = parseMinutes(time);
  if (open === null || close === null || requested === null || close < open) {
    return "unconfigured";
  }
  return requested >= open && requested <= close ? "open" : "outside";
}

function manualResult(
  reason: FulfillmentPolicyReason,
  requested: NormalizedRequest,
  leadTimeMinutes: number,
  baseFeeCents: number,
): ManualPolicyResult {
  return {
    decision: "manual_confirmation",
    deliveryType: null,
    reason,
    leadTimeMinutes,
    requested,
    fees: {
      baseFeeCents,
      expressSurchargeCents: 0,
      totalFeeCents: baseFeeCents,
    },
  };
}

function invalidResult(reason: FulfillmentPolicyReason, baseFeeCents: number): InvalidPolicyResult {
  return {
    decision: "invalid",
    deliveryType: null,
    reason,
    leadTimeMinutes: null,
    requested: null,
    fees: {
      baseFeeCents,
      expressSurchargeCents: 0,
      totalFeeCents: baseFeeCents,
    },
  };
}

export function evaluateFulfillmentPolicy({
  request,
  config,
  now = new Date(),
}: FulfillmentPolicyInput): FulfillmentPolicyResult {
  const baseFeeCents = Math.max(0, Math.trunc(config.baseFeeCents));
  const start = valenciaWallClockToDate(request.startDate, request.startTime);
  const end = valenciaWallClockToDate(request.endDate, request.endTime);
  if (!start || !end || !Number.isFinite(now.getTime())) {
    return invalidResult("invalid_valencia_time", baseFeeCents);
  }
  if (end.getTime() <= start.getTime()) {
    return invalidResult("end_not_after_start", baseFeeCents);
  }

  const requested: NormalizedRequest = {
    ...request,
    startAt: start.toISOString(),
    endAt: end.toISOString(),
    timeZone: FULFILLMENT_TIME_ZONE,
  };
  const leadTimeMinutes = (start.getTime() - now.getTime()) / 60000;
  if (leadTimeMinutes < 0) {
    return {
      ...invalidResult("start_in_past", baseFeeCents),
      leadTimeMinutes,
      requested,
    };
  }

  const today = formatDate(getZonedParts(now));
  if (request.startDate < today) {
    return {
      ...invalidResult("start_in_past", baseFeeCents),
      leadTimeMinutes,
      requested,
    };
  }

  const sameDay = request.startDate === today;
  const requiredLeadHours = sameDay
    ? config.expressMinLeadHours
    : config.futureDateLeadHours;
  if (!Number.isFinite(requiredLeadHours) || requiredLeadHours < 0) {
    return manualResult("policy_unconfigured", requested, leadTimeMinutes, baseFeeCents);
  }
  if (leadTimeMinutes < requiredLeadHours * 60) {
    return manualResult(
      sameDay ? "same_day_too_soon" : "future_date_too_soon",
      requested,
      leadTimeMinutes,
      baseFeeCents,
    );
  }

  if (sameDay && !config.automaticExpressEnabled) {
    return manualResult("express_disabled", requested, leadTimeMinutes, baseFeeCents);
  }
  if (
    sameDay &&
    (!Number.isFinite(config.expressSurchargeCents) || config.expressSurchargeCents <= 0)
  ) {
    return manualResult("policy_unconfigured", requested, leadTimeMinutes, baseFeeCents);
  }

  const operatingState = getOperatingState(
    config.operatingHours,
    request.startDate,
    request.startTime,
  );
  if (operatingState !== "open") {
    const reason =
      operatingState === "closed"
        ? "closed_day"
        : operatingState === "outside"
          ? "outside_operating_hours"
          : "policy_unconfigured";
    return manualResult(reason, requested, leadTimeMinutes, baseFeeCents);
  }

  const expressSurchargeCents = sameDay
    ? Math.trunc(config.expressSurchargeCents)
    : 0;
  return {
    decision: sameDay ? "express_checkout" : "standard_checkout",
    deliveryType: sameDay ? "express" : "standard",
    reason: sameDay ? "express_eligible" : "standard_eligible",
    leadTimeMinutes,
    requested,
    fees: {
      baseFeeCents,
      expressSurchargeCents,
      totalFeeCents: baseFeeCents + expressSurchargeCents,
    },
  };
}

export function formatValenciaDateTime(instant: Date): { date: string; time: string } {
  const parts = getZonedParts(instant);
  return { date: formatDate(parts), time: formatTime(parts) };
}
