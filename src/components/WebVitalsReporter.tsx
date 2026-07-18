"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useReportWebVitals } from "next/web-vitals";
import {
  readAnalyticsConsent,
  subscribeToAnalyticsConsent,
} from "@/components/CookieConsent";

type WebVitalMetric = Parameters<Parameters<typeof useReportWebVitals>[0]>[0];

const pendingMetrics = new Map<string, WebVitalMetric>();

function sendMetric(metric: WebVitalMetric) {
  if (typeof window.gtag !== "function") return false;

  window.gtag("event", "web_vital", {
    metric_name: metric.name,
    metric_value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
    metric_delta: Math.round(metric.name === "CLS" ? metric.delta * 1000 : metric.delta),
    metric_id: metric.id,
    metric_rating: metric.rating,
    navigation_type: metric.navigationType,
    page_path: `${window.location.pathname}${window.location.search}`,
    non_interaction: true,
  });
  return true;
}

function flushMetrics() {
  if (readAnalyticsConsent() !== "granted") return;

  for (const [metricId, metric] of pendingMetrics) {
    if (sendMetric(metric)) pendingMetrics.delete(metricId);
  }
}

function reportWebVital(metric: WebVitalMetric) {
  const consent = readAnalyticsConsent();
  if (consent === "denied") return;

  pendingMetrics.set(metric.id, metric);
  flushMetrics();
}

export default function WebVitalsReporter() {
  const consent = useSyncExternalStore(
    subscribeToAnalyticsConsent,
    readAnalyticsConsent,
    () => null,
  );

  useReportWebVitals(reportWebVital);

  useEffect(() => {
    if (consent === "denied") {
      pendingMetrics.clear();
      return;
    }

    flushMetrics();
    window.addEventListener("rentanything:analytics-ready", flushMetrics);
    return () => window.removeEventListener("rentanything:analytics-ready", flushMetrics);
  }, [consent]);

  return null;
}
