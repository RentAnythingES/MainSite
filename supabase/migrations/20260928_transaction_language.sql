-- Requires 20260928_private_translation_storage.sql. Preserve unknown historical
-- languages rather than inventing a backfill from email, country or browser hints.
alter table public.booking_drafts add column locale text references public.locales(code);
alter table public.bookings add column locale text references public.locales(code);
