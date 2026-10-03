-- Preserve reviewed feedback history while accepting newly recorded languages.
alter table public.booking_reviews drop constraint booking_reviews_locale_check;
alter table public.booking_reviews add constraint booking_reviews_locale_fkey
 foreign key(locale) references public.locales(code);
