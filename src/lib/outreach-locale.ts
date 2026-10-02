import { isLocale, localeRegistry, type Locale } from "@/i18n/config";
import { privateGermanPreviewEnabled } from "@/lib/localization-preview";

/** New requests may use private languages only in the guarded local preview. */
export function outreachLocale(value: unknown): Locale {
  if (value === undefined || value === null) return "en";
  if (!isLocale(value)) throw new Error("Unsupported language");
  if (!localeRegistry[value].public && !privateGermanPreviewEnabled()) {
    throw new Error("Language is not available");
  }
  return value;
}
