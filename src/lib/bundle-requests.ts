export const BUNDLE_REQUEST_STATUSES = ["new", "contacted", "quoted", "converted", "closed"] as const;

export type BundleRequestStatus = (typeof BUNDLE_REQUEST_STATUSES)[number];

export const BUNDLE_REQUEST_CONSENT_VERSION = "kit-request-2026-07-21";
export const BUNDLE_REQUEST_CONSENT_TEXT =
  "I agree that RentAnything.es may use these details to answer and manage my kit request.";

export function isMissingBundleRequestsTable(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const candidate = error as { code?: string; message?: string };
  return candidate.code === "42P01" || Boolean(candidate.message?.includes("bundle_requests"));
}

export function cleanBundleRequestText(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value.trim().replace(/\s+/g, " ");
  return cleaned ? cleaned.slice(0, maxLength) : null;
}

export function isBundleRequestStatus(value: unknown): value is BundleRequestStatus {
  return typeof value === "string" && BUNDLE_REQUEST_STATUSES.includes(value as BundleRequestStatus);
}
