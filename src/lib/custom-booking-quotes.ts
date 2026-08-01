import type { CustomQuoteLineItem, FulfillmentMode } from "@/lib/types";

export const CUSTOM_QUOTE_TIMEZONE = "Europe/Madrid";
export const MAX_CUSTOM_QUOTE_LINES = 12;

export function isMissingCustomQuotesSchema(error: { code?: string | null; message?: string | null } | null | undefined) {
  const message = (error?.message || "").toLowerCase();
  return error?.code === "42P01"
    || error?.code === "42703"
    || error?.code === "PGRST204"
    || error?.code === "PGRST205"
    || message.includes("relation \"booking_custom_quotes\" does not exist")
    || message.includes("column \"custom_quote_id\" does not exist")
    || message.includes("column \"custom_line_items\" does not exist");
}

export function cleanOptionalText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return null;
  const cleaned = value.trim();
  return cleaned ? cleaned.slice(0, maxLength) : null;
}

export function parseCustomQuoteLines(value: unknown): CustomQuoteLineItem[] {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_CUSTOM_QUOTE_LINES) {
    throw new Error(`Add between 1 and ${MAX_CUSTOM_QUOTE_LINES} quote lines`);
  }

  return value.map((line) => {
    const candidate = line as { description?: unknown; amountCents?: unknown };
    const description = cleanOptionalText(candidate.description, 160);
    const amountCents = Number(candidate.amountCents);

    if (!description) throw new Error("Every quote line needs a description");
    if (!Number.isInteger(amountCents) || amountCents <= 0 || amountCents > 10_000_000) {
      throw new Error("Every quote line needs a positive amount");
    }

    return { description, amountCents };
  });
}

export function customQuoteTotal(lines: CustomQuoteLineItem[]) {
  return lines.reduce((total, line) => total + line.amountCents, 0);
}

export function parseFulfillmentMode(value: unknown): FulfillmentMode {
  if (value === "customer_pickup" || value === "delivery_only" || value === "delivery_and_collection") {
    return value;
  }
  throw new Error("Choose a valid fulfillment arrangement");
}

export function parseQuoteDate(value: unknown, fieldName: string) {
  if (typeof value !== "string") throw new Error(`${fieldName} is required`);
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error(`${fieldName} is invalid`);
  return date;
}

export function customQuotePublicPath(token: string) {
  return `/booking/quote/${token}`;
}
