# Analytics Setup
> Last updated: 2026-07-08

## Provider

The website currently uses Google Analytics 4 through `gtag.js`.

Environment variable:

- `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- Legacy fallback also supported: `NEXT_PUBLIC_GA_ID`

Implementation:

- Script/page views: `src/components/GoogleAnalytics.tsx`
- Event helper: `src/lib/analytics.ts`
- Config health check: `GET /api/admin/health`

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
- Add consent/cookie banner logic if switching from basic anonymous measurement to richer tracking.


## Bundle Events

| Event | Trigger | Key params |
|-------|---------|------------|
| `bundle_configurator_whatsapp_click` | User sends a configured kit request to WhatsApp | `bundle_slug`, `selected_items`, `selected_addons`, `has_dates`, `has_area` |
