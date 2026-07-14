create table if not exists public.inventory_units (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  asset_code text not null unique,
  serial_number text,
  status text not null default 'available' check (status in ('available', 'reserved', 'rented', 'maintenance', 'damaged', 'retired')),
  condition text not null default 'good' check (condition in ('new', 'good', 'fair', 'poor')),
  location text,
  notes text,
  acquired_at date,
  last_inspected_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.inventory_unit_events (
  id uuid primary key default gen_random_uuid(),
  inventory_unit_id uuid not null references public.inventory_units(id) on delete cascade,
  event_type text not null,
  from_status text,
  to_status text,
  note text,
  actor_id uuid,
  created_at timestamptz not null default now()
);

create index if not exists inventory_units_product_idx on public.inventory_units(product_id);
create index if not exists inventory_units_status_idx on public.inventory_units(status);
create index if not exists inventory_unit_events_unit_idx on public.inventory_unit_events(inventory_unit_id, created_at desc);

alter table public.inventory_units enable row level security;
alter table public.inventory_unit_events enable row level security;
revoke all on public.inventory_units, public.inventory_unit_events from anon, authenticated;
