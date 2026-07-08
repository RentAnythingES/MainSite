type AnalyticsParams = Record<string, string | number | boolean | null | undefined>;

export function trackEvent(eventName: string, params: AnalyticsParams = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", eventName, {
    ...params,
    app: "rentanything_web",
  });
}

export function trackBookingEvent(
  eventName: string,
  params: AnalyticsParams & { productSlug?: string } = {}
) {
  trackEvent(eventName, {
    event_category: "booking",
    ...params,
  });
}
