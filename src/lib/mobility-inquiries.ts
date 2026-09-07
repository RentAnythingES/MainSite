export const MOBILITY_INQUIRY_STATUSES = ["new", "contacted", "quoted", "won", "lost"] as const;
export const MOBILITY_INQUIRY_LANGUAGES = ["en", "es", "other"] as const;
export const MOBILITY_INQUIRY_SOURCES = ["whatsapp", "email", "phone", "website", "partner", "other"] as const;
export const MOBILITY_INQUIRY_LOSS_REASONS = [
  "no_stock",
  "price",
  "fit_suitability",
  "timing",
  "delivery_area",
  "no_response",
  "competitor",
  "other",
] as const;

export type MobilityInquiryStatus = (typeof MOBILITY_INQUIRY_STATUSES)[number];
export type MobilityInquiryLanguage = (typeof MOBILITY_INQUIRY_LANGUAGES)[number];
export type MobilityInquirySource = (typeof MOBILITY_INQUIRY_SOURCES)[number];
export type MobilityInquiryLossReason = (typeof MOBILITY_INQUIRY_LOSS_REASONS)[number];

export function cleanInquiryText(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value.trim().replace(/\s+/g, " ");
  return cleaned ? cleaned.slice(0, maxLength) : null;
}

export function cleanInquiryDate(value: unknown): string | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  if (parsed.getUTCFullYear() !== year || parsed.getUTCMonth() !== month - 1 || parsed.getUTCDate() !== day) return null;
  return value;
}

export function isInquiryStatus(value: unknown): value is MobilityInquiryStatus {
  return typeof value === "string" && MOBILITY_INQUIRY_STATUSES.includes(value as MobilityInquiryStatus);
}

export function isInquiryLanguage(value: unknown): value is MobilityInquiryLanguage {
  return typeof value === "string" && MOBILITY_INQUIRY_LANGUAGES.includes(value as MobilityInquiryLanguage);
}

export function isInquirySource(value: unknown): value is MobilityInquirySource {
  return typeof value === "string" && MOBILITY_INQUIRY_SOURCES.includes(value as MobilityInquirySource);
}

export function isInquiryLossReason(value: unknown): value is MobilityInquiryLossReason {
  return typeof value === "string" && MOBILITY_INQUIRY_LOSS_REASONS.includes(value as MobilityInquiryLossReason);
}

export function isMissingMobilityInquiriesTable(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const candidate = error as { code?: string; message?: string };
  return candidate.code === "42P01" || Boolean(candidate.message?.includes("mobility_inquiries"));
}
