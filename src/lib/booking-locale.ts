import { isLocale, type Locale } from "@/i18n/config";

/** Historical rows have no recorded language; never infer one from browser input. */
export function storedBookingLocale(value: unknown): Locale {
  if (value === null || value === undefined) return "en";
  if (!isLocale(value)) throw new Error("Invalid stored booking language");
  return value;
}
