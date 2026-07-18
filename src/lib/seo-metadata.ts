type ProductMetadataLocale = "en" | "es";

const MAX_TITLE_LENGTH = 60;
const MIN_DESCRIPTION_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 160;

function truncateAtWord(value: string, maximumLength: number): string {
  if (value.length <= maximumLength) return value;
  const shortened = value.slice(0, maximumLength - 1);
  const lastSpace = shortened.lastIndexOf(" ");
  return `${shortened.slice(0, lastSpace > maximumLength * 0.7 ? lastSpace : undefined).trim()}…`;
}

export function getProductMetadataTitle({
  name,
  customTitle,
  lowestPrice,
  locale,
}: {
  name: string;
  customTitle?: string;
  lowestPrice?: number;
  locale: ProductMetadataLocale;
}): string {
  const candidates = locale === "es"
    ? [
        customTitle,
        lowestPrice === undefined ? undefined : `Alquiler ${name} Valencia — desde €${lowestPrice}/día`,
        `Alquiler ${name} en Valencia`,
        `${name} en alquiler · Valencia`,
      ]
    : [
        customTitle,
        lowestPrice === undefined ? undefined : `Rent ${name} in Valencia — from €${lowestPrice}/day`,
        `Rent ${name} in Valencia`,
        `${name} Rental · Valencia`,
      ];

  const validCandidate = candidates.find((candidate) => candidate && candidate.length <= MAX_TITLE_LENGTH);
  return validCandidate || truncateAtWord(candidates.find(Boolean) as string, MAX_TITLE_LENGTH);
}

export function getProductMetadataDescription({
  description,
  customDescription,
  locale,
}: {
  description: string;
  customDescription?: string;
  locale: ProductMetadataLocale;
}): string {
  let value = (customDescription || description).trim();
  if (value.length < MIN_DESCRIPTION_LENGTH) {
    const suffix = locale === "es"
      ? " Consulta disponibilidad y opciones de recogida o entrega para tu estancia en Valencia."
      : " Check availability, pickup and delivery options for your Valencia stay.";
    value = `${value.replace(/[.!?]?$/, ".")}${suffix}`;
  }
  return truncateAtWord(value, MAX_DESCRIPTION_LENGTH);
}
