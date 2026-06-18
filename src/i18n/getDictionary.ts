import type { Locale, Dictionary } from "@/i18n/types";
import en from "./dictionaries/en";
import es from "./dictionaries/es";

const dictionaries: Record<Locale, Dictionary> = { en, es };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.en;
}

export type { Locale, Dictionary };
