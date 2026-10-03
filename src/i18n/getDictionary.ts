import type { Locale, Dictionary } from "@/i18n/types";
import en from "./dictionaries/en";
import es from "./dictionaries/es";
import de from "./dictionaries/de";

const dictionaries: Record<Locale, Dictionary> = { en, es, de };

export function getDictionary(locale: Locale): Dictionary {
  if (!Object.hasOwn(dictionaries, locale)) throw new Error("Unsupported dictionary language");
  return dictionaries[locale];
}

export type { Locale, Dictionary };
