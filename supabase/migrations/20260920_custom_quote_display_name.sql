-- Customer-facing title for staff-authored custom booking quotes.
-- The inventory product remains separate so stock checks and reservations stay accurate.

alter table public.booking_custom_quotes
  add column if not exists display_name text not null default 'Custom Quote';

alter table public.booking_custom_quotes
  drop constraint if exists booking_custom_quotes_display_name_not_blank;

alter table public.booking_custom_quotes
  add constraint booking_custom_quotes_display_name_not_blank
  check (length(btrim(display_name)) between 1 and 160);

comment on column public.booking_custom_quotes.display_name is
  'Customer-facing custom quote title; separate from the catalogue product used for inventory.';
