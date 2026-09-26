-- Operational delivery-mileage ledger. Customer pricing remains on the booking;
-- this table records the internal cost of the actual delivery or collection trip.
create table if not exists public.delivery_accounting_settings (
  id boolean primary key default true check (id = true),
  warehouse_origin text not null default 'Carrer Obispo Muñoz, 73, 46100 Burjassot, Valencia, Spain',
  mileage_cost_per_km_cents integer not null default 35 check (mileage_cost_per_km_cents >= 0),
  default_driver_name text not null default 'Fadi',
  updated_at timestamptz not null default now()
);

insert into public.delivery_accounting_settings (id)
values (true)
on conflict (id) do nothing;

create table if not exists public.delivery_trip_accounting (
  id uuid primary key default uuid_generate_v4(),
  delivery_request_id uuid unique references public.delivery_requests(id) on delete set null,
  booking_id uuid references public.bookings(id) on delete set null,
  event_type text not null check (event_type in ('delivery', 'pickup')),
  event_date date not null,
  origin_address text not null,
  destination_address text not null,
  distance_meters integer check (distance_meters is null or distance_meters >= 0),
  distance_status text not null default 'pending' check (distance_status in ('calculated', 'unavailable', 'manual')),
  routing_error text,
  mileage_cost_per_km_cents integer not null check (mileage_cost_per_km_cents >= 0),
  trip_cost_cents integer check (trip_cost_cents is null or trip_cost_cents >= 0),
  driver_name text not null default 'Fadi',
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists delivery_trip_accounting_event_date_idx
  on public.delivery_trip_accounting (event_date desc);
create index if not exists delivery_trip_accounting_booking_id_idx
  on public.delivery_trip_accounting (booking_id);

alter table public.delivery_accounting_settings enable row level security;
alter table public.delivery_trip_accounting enable row level security;
revoke all on public.delivery_accounting_settings from anon, authenticated;
revoke all on public.delivery_trip_accounting from anon, authenticated;

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'delivery_accounting_settings_updated_at') then
    create trigger delivery_accounting_settings_updated_at
      before update on public.delivery_accounting_settings
      for each row execute function public.update_updated_at();
  end if;
  if not exists (select 1 from pg_trigger where tgname = 'delivery_trip_accounting_updated_at') then
    create trigger delivery_trip_accounting_updated_at
      before update on public.delivery_trip_accounting
      for each row execute function public.update_updated_at();
  end if;
end $$;
