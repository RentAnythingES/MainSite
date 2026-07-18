# Analytics Setup
> Last updated: 2026-07-18

## Provider

The website currently uses Google Analytics 4 through `gtag.js`.

Environment variable:

- `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- Legacy fallback also supported: `NEXT_PUBLIC_GA_ID`

Implementation:

- Script/page views: `src/components/GoogleAnalytics.tsx`
- Event helper: `src/lib/analytics.ts`
- Core Web Vitals: `src/components/WebVitalsReporter.tsx`
- Config health check: `GET /api/admin/health`

## Consent

- Google Analytics does not load until the visitor selects **Allow analytics**.
- The choice is stored locally as `rentanything_analytics_consent`.
- Visitors can reopen the preference panel with the persistent **Cookie settings** button.
- Rejecting analytics does not affect catalogue browsing, availability, or Checkout.
- The cookie policy documents the provider, purpose, and retention period.

## Booking Funnel Events

All booking events include:

- `event_category: booking`
- `app: rentanything_web`

Current events:

| Event | Trigger |
|-------|---------|
| `availability_check_started` | Customer clicks "Check Availability" |
| `availability_check_available` | API returns available |
| `availability_check_unavailable` | API returns unavailable |
| `availability_check_failed_open` | Availability API fails and widget falls back open |
| `booking_form_opened` | Customer opens the booking details form |
| `booking_draft_created` | Server creates a booking draft/hold |
| `booking_draft_failed` | Draft/hold creation fails |
| `checkout_redirect_started` | Customer is redirected to Stripe Checkout |
| `checkout_redirect_failed_whatsapp` | Checkout creation fails and falls back to WhatsApp |
| `checkout_exception_whatsapp` | Checkout request throws and falls back to WhatsApp |
| `whatsapp_clicked_available` | Customer clicks WhatsApp when item is available |
| `whatsapp_clicked_unavailable` | Customer clicks WhatsApp when item is unavailable |
| `checkout_success_status_loaded` | Success page loads backend payment/booking status |

## Before Relying On Analytics

- Confirm `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set in Vercel Production and Preview.
- Confirm events appear in GA4 Realtime during a manual availability check.
- Confirm checkout success emits `checkout_success_status_loaded` during the controlled Stripe test.
- Verify both consent paths after each analytics integration change: rejected must send no GA requests; granted must appear in Realtime.


## Bundle Events

| Event | Trigger | Key params |
|-------|---------|------------|
| `bundle_configurator_whatsapp_click` | User sends a configured kit request to WhatsApp | `bundle_slug`, `selected_items`, `selected_addons`, `has_dates`, `has_area` |

## Core Web Vitals

Next.js reports real-user performance to GA4 with the `web_vital` event after
analytics consent is granted. Metrics observed before the visitor makes a consent
choice are held in memory only; they are sent after consent or discarded when
analytics is rejected.

Event parameters:

| Parameter | Purpose |
|-----------|---------|
| `metric_name` | LCP, INP, CLS, FCP, TTFB or another Next.js metric |
| `metric_value` | Integer metric value; CLS is multiplied by 1,000 |
| `metric_delta` | Change since the previous report for the same page load |
| `metric_id` | Unique page-load metric identifier for percentile analysis |
| `metric_rating` | `good`, `needs-improvement` or `poor` |
| `navigation_type` | Initial navigation, reload, back/forward or restore |
| `page_path` | Route and query string where the metric was recorded |

For reusable GA4 reports, register `metric_name`, `metric_rating`,
`navigation_type` and `page_path` as event-scoped custom dimensions, plus
`metric_value` as a custom metric. Use Explorations to compare LCP, INP and CLS by
landing-page template and device category. Field data will accumulate only from
visitors who grant analytics consent.
