-- Requires the private locale registry. Storage support does not enable public
-- German requests: the API still enforces the guarded local preview.
alter table public.bundle_requests drop constraint bundle_requests_locale_check;
alter table public.bundle_requests add constraint bundle_requests_locale_fkey
  foreign key (locale) references public.locales(code);
