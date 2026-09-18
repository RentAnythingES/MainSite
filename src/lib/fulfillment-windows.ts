export const CUSTOMER_FULFILLMENT_WINDOWS = [
  { value: "10:00", end: "13:00", label: { en: "Morning", es: "Mañana" } },
  { value: "14:00", end: "16:00", label: { en: "Midday", es: "Mediodía" } },
  { value: "18:00", end: "20:00", label: { en: "Evening", es: "Tarde" } },
] as const;

const WINDOW_VALUES = new Set<string>(CUSTOMER_FULFILLMENT_WINDOWS.map((window) => window.value));

export function isCustomerFulfillmentWindow(value: string) {
  return WINDOW_VALUES.has(value);
}

export function formatCustomerFulfillmentWindow(value: string, locale: "en" | "es" = "en") {
  const window = CUSTOMER_FULFILLMENT_WINDOWS.find((candidate) => candidate.value === value);
  return window ? `${window.label[locale]} · ${window.value}–${window.end}` : value;
}
