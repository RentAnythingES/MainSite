-- Per-product optional extra services (assembly & set-up, disassembly).
create table if not exists public.product_extra_services (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references public.products(id) on delete cascade,
  service_type text not null check (service_type in ('assembly', 'disassembly')),
  fee_cents integer not null default 0 check (fee_cents >= 0),
  is_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, service_type)
);

alter table public.product_extra_services enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'product_extra_services' and policyname = 'Public read enabled extra services'
  ) then
    create policy "Public read enabled extra services"
      on public.product_extra_services for select
      using (is_enabled = true);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'product_extra_services_updated_at'
  ) then
    create trigger product_extra_services_updated_at
      before update on public.product_extra_services for each row execute function update_updated_at();
  end if;
end $$;

-- Selected extra services travel with the draft and the resulting booking.
alter table public.booking_drafts
  add column if not exists extra_services jsonb not null default '[]'::jsonb,
  add column if not exists extra_services_fee_cents integer not null default 0 check (extra_services_fee_cents >= 0),
  add column if not exists requires_confirmation boolean not null default false;

alter table public.bookings
  add column if not exists extra_services jsonb not null default '[]'::jsonb,
  add column if not exists extra_services_fee_cents integer not null default 0 check (extra_services_fee_cents >= 0),
  add column if not exists requires_confirmation boolean not null default false,
  add column if not exists confirmation_requested_at timestamptz,
  add column if not exists confirmed_at timestamptz,
  add column if not exists confirmed_by text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'bookings_confirmation_status_check'
  ) then
    alter table public.bookings add column if not exists confirmation_status text;
    alter table public.bookings
      add constraint bookings_confirmation_status_check
      check (confirmation_status is null or confirmation_status in ('pending', 'approved', 'rejected'));
  end if;
end $$;

-- Standard delivery/pick-up window is 10:00-19:00 Europe/Madrid; Sunday needs manual arrangement.
alter table public.service_zones
  alter column delivery_operating_hours set default
    '{"monday":{"open":"10:00","close":"19:00"},"tuesday":{"open":"10:00","close":"19:00"},"wednesday":{"open":"10:00","close":"19:00"},"thursday":{"open":"10:00","close":"19:00"},"friday":{"open":"10:00","close":"19:00"},"saturday":{"open":"10:00","close":"19:00"},"sunday":null}'::jsonb;

update public.service_zones
set delivery_operating_hours =
  '{"monday":{"open":"10:00","close":"19:00"},"tuesday":{"open":"10:00","close":"19:00"},"wednesday":{"open":"10:00","close":"19:00"},"thursday":{"open":"10:00","close":"19:00"},"friday":{"open":"10:00","close":"19:00"},"saturday":{"open":"10:00","close":"19:00"},"sunday":null}'::jsonb
where is_active = true;
