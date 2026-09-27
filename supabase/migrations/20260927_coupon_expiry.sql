alter table public.coupons add column expires_on date;
update public.coupons
set expires_on = ((created_at at time zone 'Europe/Madrid')::date + interval '1 year')::date;
alter table public.coupons
  alter column expires_on set default (((current_timestamp at time zone 'Europe/Madrid')::date + interval '1 year')::date),
  alter column expires_on set not null,
  add constraint coupons_expiry_finite check (isfinite(expires_on));
