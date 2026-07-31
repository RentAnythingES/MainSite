-- Multi-market foundation.
--
-- This migration normalizes the existing Valencia operation without changing the
-- public product, pricing, availability, or checkout contracts. The legacy
-- product-level stock and pricing tables remain the authoritative Valencia write
-- path during the compatibility period.

do $$
begin
  if to_regclass('public.booking_custom_quotes') is null then
    raise exception
      '20260731_multi_market_foundation.sql requires 20260725_custom_booking_quotes.sql';
  end if;
end
$$;

create table if not exists public.markets (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  market_type text not null default 'city'
    check (market_type in ('city', 'region')),
  country_code text not null,
  timezone text not null,
  currency text not null,
  default_locale text not null default 'en',
  supported_locales text[] not null default array['en']::text[],
  is_default boolean not null default false,
  is_active boolean not null default false,
  is_booking_enabled boolean not null default false,
  is_public boolean not null default false,
  is_indexable boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint markets_slug_format
    check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint markets_country_code_format
    check (country_code ~ '^[A-Z]{2}$'),
  constraint markets_currency_format
    check (currency ~ '^[a-z]{3}$'),
  constraint markets_default_locale_supported
    check (default_locale = any(supported_locales)),
  constraint markets_supported_locales_not_empty
    check (cardinality(supported_locales) > 0),
  constraint markets_public_requires_active
    check (not is_public or is_active),
  constraint markets_booking_requires_active
    check (not is_booking_enabled or is_active),
  constraint markets_indexable_requires_public
    check (not is_indexable or is_public)
);

create unique index if not exists markets_single_default_idx
  on public.markets (is_default)
  where is_default;

insert into public.markets (
  slug,
  name,
  market_type,
  country_code,
  timezone,
  currency,
  default_locale,
  supported_locales,
  is_default,
  is_active,
  is_booking_enabled,
  is_public,
  is_indexable
)
values (
  'valencia',
  'Valencia',
  'city',
  'ES',
  'Europe/Madrid',
  'eur',
  'en',
  array['en', 'es']::text[],
  true,
  true,
  true,
  true,
  true
)
on conflict (slug) do update
set
  name = excluded.name,
  market_type = excluded.market_type,
  country_code = excluded.country_code,
  timezone = excluded.timezone,
  currency = excluded.currency,
  default_locale = excluded.default_locale,
  supported_locales = excluded.supported_locales,
  is_default = true,
  is_active = true,
  is_booking_enabled = true,
  is_public = true,
  is_indexable = true,
  updated_at = now();

create table if not exists public.product_offers (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  market_id uuid not null references public.markets(id) on delete restrict,
  is_active boolean not null default false,
  stock_total integer not null default 0,
  online_capacity integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint product_offers_product_market_unique
    unique (product_id, market_id),
  constraint product_offers_stock_total_nonnegative
    check (stock_total >= 0),
  constraint product_offers_online_capacity_valid
    check (online_capacity >= 0 and online_capacity <= stock_total)
);

create index if not exists product_offers_market_active_idx
  on public.product_offers (market_id, is_active, product_id);

create table if not exists public.offer_pricing_tiers (
  id uuid primary key default gen_random_uuid(),
  product_offer_id uuid not null references public.product_offers(id) on delete cascade,
  source_pricing_tier_id uuid unique references public.pricing_tiers(id) on delete cascade,
  min_days integer not null check (min_days > 0),
  per_day_cents integer not null check (per_day_cents >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint offer_pricing_tiers_offer_days_unique
    unique (product_offer_id, min_days)
);

create index if not exists offer_pricing_tiers_offer_idx
  on public.offer_pricing_tiers (product_offer_id, min_days);

create table if not exists public.offer_quantity_discounts (
  id uuid primary key default gen_random_uuid(),
  product_offer_id uuid not null references public.product_offers(id) on delete cascade,
  source_quantity_discount_id uuid unique
    references public.product_quantity_discounts(id) on delete cascade,
  min_quantity integer not null check (min_quantity > 1),
  discount_bps integer not null check (discount_bps between 1 and 10000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint offer_quantity_discounts_offer_quantity_unique
    unique (product_offer_id, min_quantity)
);

create index if not exists offer_quantity_discounts_offer_idx
  on public.offer_quantity_discounts (product_offer_id, min_quantity);

create table if not exists public.inventory_locations (
  id uuid primary key default gen_random_uuid(),
  market_id uuid not null references public.markets(id) on delete restrict,
  slug text not null,
  name text not null,
  location_type text not null default 'storage'
    check (location_type in ('depot', 'storage', 'pickup', 'partner')),
  address_line_1 text,
  address_line_2 text,
  locality text,
  postal_code text,
  country_code text not null,
  is_active boolean not null default true,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint inventory_locations_slug_format
    check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint inventory_locations_country_code_format
    check (country_code ~ '^[A-Z]{2}$'),
  constraint inventory_locations_market_slug_unique
    unique (market_id, slug),
  constraint inventory_locations_id_market_unique
    unique (id, market_id),
  constraint inventory_locations_public_requires_active
    check (not is_public or is_active)
);

create index if not exists inventory_locations_market_active_idx
  on public.inventory_locations (market_id, is_active);

insert into public.inventory_locations (
  market_id,
  slug,
  name,
  location_type,
  locality,
  country_code,
  is_active,
  is_public
)
select
  market.id,
  'valencia-unassigned',
  'Valencia unassigned inventory',
  'storage',
  'Valencia',
  'ES',
  true,
  false
from public.markets market
where market.slug = 'valencia'
on conflict (market_id, slug) do nothing;

-- Copy the current Valencia product-level commercial state into local offers.
insert into public.product_offers (
  product_id,
  market_id,
  is_active,
  stock_total,
  online_capacity
)
select
  product.id,
  market.id,
  product.is_active,
  product.stock_total,
  product.stock_available
from public.products product
cross join public.markets market
where market.slug = 'valencia'
on conflict (product_id, market_id) do update
set
  is_active = excluded.is_active,
  stock_total = excluded.stock_total,
  online_capacity = excluded.online_capacity,
  updated_at = now();

insert into public.offer_pricing_tiers (
  product_offer_id,
  source_pricing_tier_id,
  min_days,
  per_day_cents
)
select
  offer.id,
  tier.id,
  tier.min_days,
  tier.per_day_cents
from public.pricing_tiers tier
join public.product_offers offer on offer.product_id = tier.product_id
join public.markets market
  on market.id = offer.market_id
  and market.slug = 'valencia'
on conflict (source_pricing_tier_id) do update
set
  product_offer_id = excluded.product_offer_id,
  min_days = excluded.min_days,
  per_day_cents = excluded.per_day_cents,
  updated_at = now();

insert into public.offer_quantity_discounts (
  product_offer_id,
  source_quantity_discount_id,
  min_quantity,
  discount_bps
)
select
  offer.id,
  discount.id,
  discount.min_quantity,
  discount.discount_bps
from public.product_quantity_discounts discount
join public.product_offers offer on offer.product_id = discount.product_id
join public.markets market
  on market.id = offer.market_id
  and market.slug = 'valencia'
on conflict (source_quantity_discount_id) do update
set
  product_offer_id = excluded.product_offer_id,
  min_quantity = excluded.min_quantity,
  discount_bps = excluded.discount_bps,
  updated_at = now();

-- Add market context without removing any legacy relationship.
alter table public.pickup_locations
  add column if not exists market_id uuid references public.markets(id) on delete restrict;

alter table public.service_zones
  add column if not exists market_id uuid references public.markets(id) on delete restrict;

alter table public.inventory_units
  add column if not exists market_id uuid references public.markets(id) on delete restrict,
  add column if not exists product_offer_id uuid references public.product_offers(id) on delete restrict,
  add column if not exists inventory_location_id uuid;

alter table public.booking_drafts
  add column if not exists market_id uuid references public.markets(id) on delete restrict,
  add column if not exists product_offer_id uuid references public.product_offers(id) on delete restrict;

alter table public.bookings
  add column if not exists market_id uuid references public.markets(id) on delete restrict,
  add column if not exists product_offer_id uuid references public.product_offers(id) on delete restrict;

alter table public.booking_custom_quotes
  add column if not exists market_id uuid references public.markets(id) on delete restrict,
  add column if not exists product_offer_id uuid references public.product_offers(id) on delete restrict;

alter table public.booking_inventory_blocks
  add column if not exists market_id uuid references public.markets(id) on delete restrict,
  add column if not exists product_offer_id uuid references public.product_offers(id) on delete restrict;

alter table public.blocked_dates
  add column if not exists market_id uuid references public.markets(id) on delete restrict,
  add column if not exists product_offer_id uuid references public.product_offers(id) on delete restrict;

alter table public.inventory_stock_events
  add column if not exists market_id uuid references public.markets(id) on delete restrict,
  add column if not exists product_offer_id uuid references public.product_offers(id) on delete restrict;

alter table public.booking_fulfillment_amendments
  add column if not exists market_id uuid references public.markets(id) on delete restrict;

alter table public.bundle_requests
  add column if not exists market_id uuid references public.markets(id) on delete restrict;

-- Backfill fulfillment configuration.
update public.pickup_locations location
set market_id = market.id
from public.markets market
where location.market_id is null
  and market.slug = 'valencia';

update public.service_zones zone
set market_id = market.id
from public.markets market
where zone.market_id is null
  and market.slug = 'valencia';

-- Backfill physical inventory without guessing its real depot.
update public.inventory_units unit
set
  market_id = offer.market_id,
  product_offer_id = offer.id,
  inventory_location_id = inventory_location.id
from public.product_offers offer
join public.markets market
  on market.id = offer.market_id
  and market.slug = 'valencia'
join public.inventory_locations inventory_location
  on inventory_location.market_id = market.id
  and inventory_location.slug = 'valencia-unassigned'
where unit.product_id = offer.product_id
  and (
    unit.market_id is null
    or unit.product_offer_id is null
    or unit.inventory_location_id is null
  );

-- Backfill every booking-critical row to its existing Valencia product offer.
update public.booking_drafts draft
set
  market_id = offer.market_id,
  product_offer_id = offer.id
from public.product_offers offer
join public.markets market
  on market.id = offer.market_id
  and market.slug = 'valencia'
where draft.product_id = offer.product_id
  and (draft.market_id is null or draft.product_offer_id is null);

update public.bookings booking
set
  market_id = offer.market_id,
  product_offer_id = offer.id
from public.product_offers offer
join public.markets market
  on market.id = offer.market_id
  and market.slug = 'valencia'
where booking.product_id = offer.product_id
  and (booking.market_id is null or booking.product_offer_id is null);

update public.booking_custom_quotes quote
set
  market_id = offer.market_id,
  product_offer_id = offer.id
from public.product_offers offer
join public.markets market
  on market.id = offer.market_id
  and market.slug = 'valencia'
where quote.product_id = offer.product_id
  and (quote.market_id is null or quote.product_offer_id is null);

update public.booking_inventory_blocks block
set
  market_id = offer.market_id,
  product_offer_id = offer.id
from public.product_offers offer
join public.markets market
  on market.id = offer.market_id
  and market.slug = 'valencia'
where block.product_id = offer.product_id
  and (block.market_id is null or block.product_offer_id is null);

update public.blocked_dates blocked
set
  market_id = offer.market_id,
  product_offer_id = offer.id
from public.product_offers offer
join public.markets market
  on market.id = offer.market_id
  and market.slug = 'valencia'
where blocked.product_id = offer.product_id
  and (blocked.market_id is null or blocked.product_offer_id is null);

update public.inventory_stock_events event
set
  market_id = offer.market_id,
  product_offer_id = offer.id
from public.product_offers offer
join public.markets market
  on market.id = offer.market_id
  and market.slug = 'valencia'
where event.product_id = offer.product_id
  and (event.market_id is null or event.product_offer_id is null);

update public.booking_fulfillment_amendments amendment
set market_id = booking.market_id
from public.bookings booking
where amendment.booking_id = booking.id
  and amendment.market_id is null;

update public.bundle_requests request
set market_id = market.id
from public.markets market
where request.market_id is null
  and market.slug = 'valencia';

create or replace function public.default_market_id()
returns uuid
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  resolved_market_id uuid;
begin
  select market.id
  into resolved_market_id
  from public.markets market
  where market.is_default
  limit 1;

  if resolved_market_id is null then
    raise exception 'No default market is configured';
  end if;

  return resolved_market_id;
end;
$$;

create or replace function public.set_default_market_context()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.market_id is null then
    new.market_id := public.default_market_id();
  end if;
  return new;
end;
$$;

create or replace function public.set_product_offer_context()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  resolved_offer public.product_offers%rowtype;
begin
  if new.product_offer_id is not null then
    select offer.*
    into resolved_offer
    from public.product_offers offer
    where offer.id = new.product_offer_id;

    if resolved_offer.id is null then
      raise exception 'Product offer not found';
    end if;

    if new.product_id is not null and new.product_id <> resolved_offer.product_id then
      raise exception 'Product does not match product offer';
    end if;

    if new.market_id is not null and new.market_id <> resolved_offer.market_id then
      raise exception 'Market does not match product offer';
    end if;
  else
    if new.product_id is null then
      raise exception 'Product is required to resolve a product offer';
    end if;

    if new.market_id is null then
      new.market_id := public.default_market_id();
    end if;

    select offer.*
    into resolved_offer
    from public.product_offers offer
    where offer.product_id = new.product_id
      and offer.market_id = new.market_id;

    if resolved_offer.id is null then
      raise exception 'Product is not configured in the selected market';
    end if;
  end if;

  new.product_id := resolved_offer.product_id;
  new.market_id := resolved_offer.market_id;
  new.product_offer_id := resolved_offer.id;
  return new;
end;
$$;

create or replace function public.validate_fulfillment_market_context()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  row_json jsonb := to_jsonb(new);
  pickup_id uuid;
  delivery_zone_id uuid;
  collection_zone_id uuid;
begin
  pickup_id := nullif(row_json ->> 'pickup_location_id', '')::uuid;
  delivery_zone_id := nullif(row_json ->> 'delivery_zone_id', '')::uuid;
  collection_zone_id := nullif(row_json ->> 'collection_zone_id', '')::uuid;

  if pickup_id is not null and not exists (
    select 1
    from public.pickup_locations location
    where location.id = pickup_id
      and location.market_id = new.market_id
  ) then
    raise exception 'Pickup location does not belong to the selected market';
  end if;

  if delivery_zone_id is not null and not exists (
    select 1
    from public.service_zones zone
    where zone.id = delivery_zone_id
      and zone.market_id = new.market_id
  ) then
    raise exception 'Delivery zone does not belong to the selected market';
  end if;

  if collection_zone_id is not null and not exists (
    select 1
    from public.service_zones zone
    where zone.id = collection_zone_id
      and zone.market_id = new.market_id
  ) then
    raise exception 'Collection zone does not belong to the selected market';
  end if;

  return new;
end;
$$;

create or replace function public.set_inventory_location_context()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  resolved_location public.inventory_locations%rowtype;
begin
  if new.inventory_location_id is null then
    select location.*
    into resolved_location
    from public.inventory_locations location
    where location.market_id = new.market_id
      and location.slug = 'valencia-unassigned'
    limit 1;

    if resolved_location.id is null then
      raise exception 'An inventory location is required for the selected market';
    end if;

    new.inventory_location_id := resolved_location.id;
  else
    select location.*
    into resolved_location
    from public.inventory_locations location
    where location.id = new.inventory_location_id;

    if resolved_location.id is null then
      raise exception 'Inventory location not found';
    end if;

    if resolved_location.market_id <> new.market_id then
      raise exception 'Inventory location does not belong to the selected market';
    end if;
  end if;

  return new;
end;
$$;

create or replace function public.set_fulfillment_amendment_market_context()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  booking_market_id uuid;
begin
  select booking.market_id
  into booking_market_id
  from public.bookings booking
  where booking.id = new.booking_id;

  if booking_market_id is null then
    raise exception 'Booking market could not be resolved';
  end if;

  if new.market_id is not null and new.market_id <> booking_market_id then
    raise exception 'Fulfillment amendment market does not match booking';
  end if;

  new.market_id := booking_market_id;
  return new;
end;
$$;

create or replace function public.validate_inventory_assignment_market()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  booking_market_id uuid;
  booking_offer_id uuid;
  unit_market_id uuid;
  unit_offer_id uuid;
begin
  select booking.market_id, booking.product_offer_id
  into booking_market_id, booking_offer_id
  from public.bookings booking
  where booking.id = new.booking_id;

  select unit.market_id, unit.product_offer_id
  into unit_market_id, unit_offer_id
  from public.inventory_units unit
  where unit.id = new.inventory_unit_id;

  if booking_market_id is null or unit_market_id is null then
    raise exception 'Booking and inventory unit must have market context';
  end if;

  if booking_market_id <> unit_market_id or booking_offer_id <> unit_offer_id then
    raise exception 'Inventory unit does not belong to the booking market offer';
  end if;

  return new;
end;
$$;

create or replace function public.validate_inventory_block_owner_market()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  owner_market_id uuid;
  owner_offer_id uuid;
begin
  if new.booking_draft_id is not null then
    select draft.market_id, draft.product_offer_id
    into owner_market_id, owner_offer_id
    from public.booking_drafts draft
    where draft.id = new.booking_draft_id;

    if owner_market_id is null then
      raise exception 'Inventory block booking draft has no market context';
    end if;
    if owner_market_id <> new.market_id or owner_offer_id <> new.product_offer_id then
      raise exception 'Inventory block does not match its booking draft market offer';
    end if;
  end if;

  if new.booking_id is not null then
    select booking.market_id, booking.product_offer_id
    into owner_market_id, owner_offer_id
    from public.bookings booking
    where booking.id = new.booking_id;

    if owner_market_id is null then
      raise exception 'Inventory block booking has no market context';
    end if;
    if owner_market_id <> new.market_id or owner_offer_id <> new.product_offer_id then
      raise exception 'Inventory block does not match its booking market offer';
    end if;
  end if;

  return new;
end;
$$;

create or replace function public.validate_booking_draft_market()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  draft_market_id uuid;
  draft_offer_id uuid;
begin
  if new.booking_draft_id is null then
    return new;
  end if;

  select draft.market_id, draft.product_offer_id
  into draft_market_id, draft_offer_id
  from public.booking_drafts draft
  where draft.id = new.booking_draft_id;

  if draft_market_id is null then
    raise exception 'Booking draft has no market context';
  end if;
  if draft_market_id <> new.market_id or draft_offer_id <> new.product_offer_id then
    raise exception 'Booking does not match its booking draft market offer';
  end if;

  return new;
end;
$$;

-- Keep the existing Valencia write path authoritative during compatibility.
create or replace function public.sync_default_product_offer()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  resolved_market_id uuid := public.default_market_id();
begin
  insert into public.product_offers (
    product_id,
    market_id,
    is_active,
    stock_total,
    online_capacity
  )
  values (
    new.id,
    resolved_market_id,
    new.is_active,
    new.stock_total,
    new.stock_available
  )
  on conflict (product_id, market_id) do update
  set
    is_active = excluded.is_active,
    stock_total = excluded.stock_total,
    online_capacity = excluded.online_capacity,
    updated_at = now();

  return new;
end;
$$;

create or replace function public.sync_default_offer_pricing_tier()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  resolved_offer_id uuid;
begin
  select offer.id
  into resolved_offer_id
  from public.product_offers offer
  where offer.product_id = new.product_id
    and offer.market_id = public.default_market_id();

  if resolved_offer_id is null then
    raise exception 'Default-market product offer not found';
  end if;

  insert into public.offer_pricing_tiers (
    product_offer_id,
    source_pricing_tier_id,
    min_days,
    per_day_cents
  )
  values (
    resolved_offer_id,
    new.id,
    new.min_days,
    new.per_day_cents
  )
  on conflict (source_pricing_tier_id) do update
  set
    product_offer_id = excluded.product_offer_id,
    min_days = excluded.min_days,
    per_day_cents = excluded.per_day_cents,
    updated_at = now();

  return new;
end;
$$;

create or replace function public.sync_default_offer_quantity_discount()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  resolved_offer_id uuid;
begin
  select offer.id
  into resolved_offer_id
  from public.product_offers offer
  where offer.product_id = new.product_id
    and offer.market_id = public.default_market_id();

  if resolved_offer_id is null then
    raise exception 'Default-market product offer not found';
  end if;

  insert into public.offer_quantity_discounts (
    product_offer_id,
    source_quantity_discount_id,
    min_quantity,
    discount_bps
  )
  values (
    resolved_offer_id,
    new.id,
    new.min_quantity,
    new.discount_bps
  )
  on conflict (source_quantity_discount_id) do update
  set
    product_offer_id = excluded.product_offer_id,
    min_quantity = excluded.min_quantity,
    discount_bps = excluded.discount_bps,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists pickup_locations_market_context on public.pickup_locations;
create trigger pickup_locations_market_context
  before insert or update on public.pickup_locations
  for each row execute function public.set_default_market_context();

drop trigger if exists service_zones_market_context on public.service_zones;
create trigger service_zones_market_context
  before insert or update on public.service_zones
  for each row execute function public.set_default_market_context();

drop trigger if exists bundle_requests_market_context on public.bundle_requests;
create trigger bundle_requests_market_context
  before insert or update on public.bundle_requests
  for each row execute function public.set_default_market_context();

drop trigger if exists inventory_units_10_offer_context on public.inventory_units;
create trigger inventory_units_10_offer_context
  before insert or update on public.inventory_units
  for each row execute function public.set_product_offer_context();

drop trigger if exists inventory_units_20_location_context on public.inventory_units;
create trigger inventory_units_20_location_context
  before insert or update on public.inventory_units
  for each row execute function public.set_inventory_location_context();

drop trigger if exists booking_drafts_10_offer_context on public.booking_drafts;
create trigger booking_drafts_10_offer_context
  before insert or update on public.booking_drafts
  for each row execute function public.set_product_offer_context();

drop trigger if exists booking_drafts_20_fulfillment_market on public.booking_drafts;
create trigger booking_drafts_20_fulfillment_market
  before insert or update on public.booking_drafts
  for each row execute function public.validate_fulfillment_market_context();

drop trigger if exists bookings_10_offer_context on public.bookings;
create trigger bookings_10_offer_context
  before insert or update on public.bookings
  for each row execute function public.set_product_offer_context();

drop trigger if exists bookings_15_draft_market on public.bookings;
create trigger bookings_15_draft_market
  before insert or update on public.bookings
  for each row execute function public.validate_booking_draft_market();

drop trigger if exists bookings_20_fulfillment_market on public.bookings;
create trigger bookings_20_fulfillment_market
  before insert or update on public.bookings
  for each row execute function public.validate_fulfillment_market_context();

drop trigger if exists booking_custom_quotes_10_offer_context on public.booking_custom_quotes;
create trigger booking_custom_quotes_10_offer_context
  before insert or update on public.booking_custom_quotes
  for each row execute function public.set_product_offer_context();

drop trigger if exists booking_custom_quotes_20_fulfillment_market on public.booking_custom_quotes;
create trigger booking_custom_quotes_20_fulfillment_market
  before insert or update on public.booking_custom_quotes
  for each row execute function public.validate_fulfillment_market_context();

drop trigger if exists booking_inventory_blocks_offer_context on public.booking_inventory_blocks;
drop trigger if exists booking_inventory_blocks_10_offer_context on public.booking_inventory_blocks;
create trigger booking_inventory_blocks_10_offer_context
  before insert or update on public.booking_inventory_blocks
  for each row execute function public.set_product_offer_context();

drop trigger if exists booking_inventory_blocks_20_owner_market on public.booking_inventory_blocks;
create trigger booking_inventory_blocks_20_owner_market
  before insert or update on public.booking_inventory_blocks
  for each row execute function public.validate_inventory_block_owner_market();

drop trigger if exists blocked_dates_offer_context on public.blocked_dates;
create trigger blocked_dates_offer_context
  before insert or update on public.blocked_dates
  for each row execute function public.set_product_offer_context();

drop trigger if exists inventory_stock_events_offer_context on public.inventory_stock_events;
create trigger inventory_stock_events_offer_context
  before insert or update on public.inventory_stock_events
  for each row execute function public.set_product_offer_context();

drop trigger if exists booking_fulfillment_amendments_10_market_context
  on public.booking_fulfillment_amendments;
create trigger booking_fulfillment_amendments_10_market_context
  before insert or update on public.booking_fulfillment_amendments
  for each row execute function public.set_fulfillment_amendment_market_context();

drop trigger if exists booking_fulfillment_amendments_20_fulfillment_market
  on public.booking_fulfillment_amendments;
create trigger booking_fulfillment_amendments_20_fulfillment_market
  before insert or update on public.booking_fulfillment_amendments
  for each row execute function public.validate_fulfillment_market_context();

drop trigger if exists booking_inventory_unit_assignments_market_guard
  on public.booking_inventory_unit_assignments;
create trigger booking_inventory_unit_assignments_market_guard
  before insert or update on public.booking_inventory_unit_assignments
  for each row execute function public.validate_inventory_assignment_market();

drop trigger if exists products_sync_default_offer on public.products;
create trigger products_sync_default_offer
  after insert or update of is_active, stock_total, stock_available on public.products
  for each row execute function public.sync_default_product_offer();

drop trigger if exists pricing_tiers_sync_default_offer on public.pricing_tiers;
create trigger pricing_tiers_sync_default_offer
  after insert or update on public.pricing_tiers
  for each row execute function public.sync_default_offer_pricing_tier();

drop trigger if exists product_quantity_discounts_sync_default_offer
  on public.product_quantity_discounts;
create trigger product_quantity_discounts_sync_default_offer
  after insert or update on public.product_quantity_discounts
  for each row execute function public.sync_default_offer_quantity_discount();

-- Offer-scoped reservation is the future multi-market write path. The existing
-- product-scoped function remains as a Valencia-compatible wrapper.
create or replace function public.reserve_product_offer_inventory(
  p_product_offer_id uuid,
  p_booking_draft_id uuid,
  p_starts_at timestamptz,
  p_ends_at timestamptz,
  p_quantity integer default 1
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  resolved_product_id uuid;
  resolved_market_id uuid;
  resolved_stock_total integer;
  resolved_online_capacity integer;
  effective_capacity integer;
  overlapping_quantity integer;
  draft_offer_id uuid;
  draft_market_id uuid;
begin
  if p_ends_at <= p_starts_at then
    raise exception 'Rental end must be after rental start';
  end if;
  if p_quantity <= 0 then
    raise exception 'Quantity must be positive';
  end if;

  select
    offer.product_id,
    offer.market_id,
    offer.stock_total,
    offer.online_capacity
  into
    resolved_product_id,
    resolved_market_id,
    resolved_stock_total,
    resolved_online_capacity
  from public.product_offers offer
  join public.markets market on market.id = offer.market_id
  where offer.id = p_product_offer_id
    and offer.is_active
    and market.is_active
    and market.is_booking_enabled
  for update of offer;

  if resolved_product_id is null then
    raise exception 'Product offer is not available for booking';
  end if;

  select draft.product_offer_id, draft.market_id
  into draft_offer_id, draft_market_id
  from public.booking_drafts draft
  where draft.id = p_booking_draft_id;

  if draft_offer_id is null then
    raise exception 'Booking draft has no market offer';
  end if;
  if draft_offer_id <> p_product_offer_id or draft_market_id <> resolved_market_id then
    raise exception 'Booking draft does not belong to the selected market offer';
  end if;

  effective_capacity := least(resolved_stock_total, resolved_online_capacity);
  if p_quantity > effective_capacity then
    return false;
  end if;

  select coalesce(sum(block.quantity), 0)
  into overlapping_quantity
  from public.booking_inventory_blocks block
  left join public.booking_drafts draft on draft.id = block.booking_draft_id
  where block.product_offer_id = p_product_offer_id
    and block.starts_at < p_ends_at
    and block.ends_at > p_starts_at
    and (
      block.booking_id is not null
      or (
        block.booking_draft_id is not null
        and draft.status in ('draft', 'checkout_created')
        and draft.expires_at > now()
      )
    );

  if overlapping_quantity + p_quantity > effective_capacity then
    return false;
  end if;

  insert into public.booking_inventory_blocks (
    product_id,
    market_id,
    product_offer_id,
    booking_draft_id,
    starts_at,
    ends_at,
    quantity,
    reason
  )
  values (
    resolved_product_id,
    resolved_market_id,
    p_product_offer_id,
    p_booking_draft_id,
    p_starts_at,
    p_ends_at,
    p_quantity,
    'checkout_hold'
  );

  return true;
end;
$$;

create or replace function public.reserve_booking_inventory(
  p_product_id uuid,
  p_booking_draft_id uuid,
  p_starts_at timestamptz,
  p_ends_at timestamptz,
  p_quantity integer default 1
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  resolved_offer_id uuid;
begin
  select offer.id
  into resolved_offer_id
  from public.product_offers offer
  join public.markets market
    on market.id = offer.market_id
    and market.is_default
  where offer.product_id = p_product_id
    and offer.is_active;

  if resolved_offer_id is null then
    raise exception 'Product not found';
  end if;

  return public.reserve_product_offer_inventory(
    resolved_offer_id,
    p_booking_draft_id,
    p_starts_at,
    p_ends_at,
    p_quantity
  );
end;
$$;

-- Refuse to finalize the migration if any Valencia row cannot be normalized.
do $$
begin
  if (select count(*) from public.markets where is_default) <> 1 then
    raise exception 'Exactly one default market is required';
  end if;

  if exists (
    select 1
    from public.products product
    left join public.product_offers offer
      on offer.product_id = product.id
      and offer.market_id = public.default_market_id()
    where offer.id is null
  ) then
    raise exception 'One or more products do not have a default-market offer';
  end if;

  if exists (
    select 1
    from public.products product
    join public.product_offers offer
      on offer.product_id = product.id
      and offer.market_id = public.default_market_id()
    where offer.is_active is distinct from product.is_active
      or offer.stock_total is distinct from product.stock_total
      or offer.online_capacity is distinct from product.stock_available
  ) then
    raise exception 'Default-market offer inventory does not match legacy product inventory';
  end if;

  if exists (
    select 1
    from public.pricing_tiers tier
    left join public.offer_pricing_tiers offer_tier
      on offer_tier.source_pricing_tier_id = tier.id
    where offer_tier.id is null
      or offer_tier.min_days is distinct from tier.min_days
      or offer_tier.per_day_cents is distinct from tier.per_day_cents
  ) then
    raise exception 'Default-market offer pricing does not match legacy pricing';
  end if;

  if exists (
    select 1
    from public.product_quantity_discounts discount
    left join public.offer_quantity_discounts offer_discount
      on offer_discount.source_quantity_discount_id = discount.id
    where offer_discount.id is null
      or offer_discount.min_quantity is distinct from discount.min_quantity
      or offer_discount.discount_bps is distinct from discount.discount_bps
  ) then
    raise exception 'Default-market offer discounts do not match legacy discounts';
  end if;

  if exists (
    select 1 from public.pickup_locations where market_id is null
    union all
    select 1 from public.service_zones where market_id is null
    union all
    select 1 from public.inventory_units
      where market_id is null or product_offer_id is null or inventory_location_id is null
    union all
    select 1 from public.booking_drafts
      where market_id is null or product_offer_id is null
    union all
    select 1 from public.bookings
      where market_id is null or product_offer_id is null
    union all
    select 1 from public.booking_custom_quotes
      where market_id is null or product_offer_id is null
    union all
    select 1 from public.booking_inventory_blocks
      where market_id is null or product_offer_id is null
    union all
    select 1 from public.blocked_dates
      where market_id is null or product_offer_id is null
    union all
    select 1 from public.inventory_stock_events
      where market_id is null or product_offer_id is null
    union all
    select 1 from public.booking_fulfillment_amendments where market_id is null
    union all
    select 1 from public.bundle_requests where market_id is null
  ) then
    raise exception 'One or more operational rows are missing market context';
  end if;
end
$$;

alter table public.pickup_locations
  alter column market_id set not null;

alter table public.service_zones
  alter column market_id set not null;

alter table public.inventory_units
  alter column market_id set not null,
  alter column product_offer_id set not null,
  alter column inventory_location_id set not null;

alter table public.booking_drafts
  alter column market_id set not null,
  alter column product_offer_id set not null;

alter table public.bookings
  alter column market_id set not null,
  alter column product_offer_id set not null;

alter table public.booking_custom_quotes
  alter column market_id set not null,
  alter column product_offer_id set not null;

alter table public.booking_inventory_blocks
  alter column market_id set not null,
  alter column product_offer_id set not null;

alter table public.blocked_dates
  alter column market_id set not null,
  alter column product_offer_id set not null;

alter table public.inventory_stock_events
  alter column market_id set not null,
  alter column product_offer_id set not null;

alter table public.booking_fulfillment_amendments
  alter column market_id set not null;

alter table public.bundle_requests
  alter column market_id set not null;

alter table public.product_offers
  add constraint product_offers_identity_unique
  unique (id, product_id, market_id);

alter table public.pickup_locations
  add constraint pickup_locations_id_market_unique unique (id, market_id);

alter table public.service_zones
  add constraint service_zones_id_market_unique unique (id, market_id);

alter table public.inventory_units
  add constraint inventory_units_offer_context_fkey
    foreign key (product_offer_id, product_id, market_id)
    references public.product_offers (id, product_id, market_id)
    on delete restrict,
  add constraint inventory_units_location_market_fkey
    foreign key (inventory_location_id, market_id)
    references public.inventory_locations (id, market_id)
    on delete restrict;

alter table public.booking_drafts
  add constraint booking_drafts_offer_context_fkey
    foreign key (product_offer_id, product_id, market_id)
    references public.product_offers (id, product_id, market_id)
    on delete restrict,
  add constraint booking_drafts_pickup_market_fkey
    foreign key (pickup_location_id, market_id)
    references public.pickup_locations (id, market_id),
  add constraint booking_drafts_delivery_zone_market_fkey
    foreign key (delivery_zone_id, market_id)
    references public.service_zones (id, market_id),
  add constraint booking_drafts_collection_zone_market_fkey
    foreign key (collection_zone_id, market_id)
    references public.service_zones (id, market_id);

alter table public.bookings
  add constraint bookings_offer_context_fkey
    foreign key (product_offer_id, product_id, market_id)
    references public.product_offers (id, product_id, market_id)
    on delete restrict,
  add constraint bookings_pickup_market_fkey
    foreign key (pickup_location_id, market_id)
    references public.pickup_locations (id, market_id),
  add constraint bookings_delivery_zone_market_fkey
    foreign key (delivery_zone_id, market_id)
    references public.service_zones (id, market_id),
  add constraint bookings_collection_zone_market_fkey
    foreign key (collection_zone_id, market_id)
    references public.service_zones (id, market_id);

alter table public.booking_custom_quotes
  add constraint booking_custom_quotes_offer_context_fkey
    foreign key (product_offer_id, product_id, market_id)
    references public.product_offers (id, product_id, market_id)
    on delete restrict,
  add constraint booking_custom_quotes_pickup_market_fkey
    foreign key (pickup_location_id, market_id)
    references public.pickup_locations (id, market_id);

alter table public.booking_inventory_blocks
  add constraint booking_inventory_blocks_offer_context_fkey
    foreign key (product_offer_id, product_id, market_id)
    references public.product_offers (id, product_id, market_id)
    on delete cascade;

alter table public.blocked_dates
  add constraint blocked_dates_offer_context_fkey
    foreign key (product_offer_id, product_id, market_id)
    references public.product_offers (id, product_id, market_id)
    on delete cascade;

alter table public.inventory_stock_events
  add constraint inventory_stock_events_offer_context_fkey
    foreign key (product_offer_id, product_id, market_id)
    references public.product_offers (id, product_id, market_id)
    on delete cascade;

alter table public.booking_fulfillment_amendments
  add constraint booking_fulfillment_amendments_delivery_zone_market_fkey
    foreign key (delivery_zone_id, market_id)
    references public.service_zones (id, market_id),
  add constraint booking_fulfillment_amendments_collection_zone_market_fkey
    foreign key (collection_zone_id, market_id)
    references public.service_zones (id, market_id);

-- Slugs are local to a market. Keep the legacy product/date uniqueness during
-- compatibility, while also establishing the future offer-level key.
alter table public.pickup_locations
  drop constraint if exists pickup_locations_slug_key;

alter table public.pickup_locations
  add constraint pickup_locations_market_slug_unique unique (market_id, slug);

alter table public.service_zones
  drop constraint if exists service_zones_slug_key;

alter table public.service_zones
  add constraint service_zones_market_slug_unique unique (market_id, slug);

alter table public.blocked_dates
  add constraint blocked_dates_offer_date_unique
  unique (product_offer_id, blocked_date);

create index if not exists booking_drafts_offer_period_idx
  on public.booking_drafts (product_offer_id, rental_start_at, rental_end_at);

create index if not exists bookings_offer_period_idx
  on public.bookings (product_offer_id, rental_start_at, rental_end_at);

create index if not exists booking_inventory_blocks_offer_period_idx
  on public.booking_inventory_blocks (product_offer_id, starts_at, ends_at);

create index if not exists blocked_dates_offer_date_idx
  on public.blocked_dates (product_offer_id, blocked_date);

create index if not exists inventory_units_offer_status_idx
  on public.inventory_units (product_offer_id, status);

create index if not exists inventory_stock_events_offer_created_idx
  on public.inventory_stock_events (product_offer_id, created_at desc);

create index if not exists booking_custom_quotes_offer_period_idx
  on public.booking_custom_quotes (product_offer_id, rental_start_at, rental_end_at);

create index if not exists booking_fulfillment_amendments_market_status_idx
  on public.booking_fulfillment_amendments (market_id, status, expires_at);

create index if not exists bundle_requests_market_created_idx
  on public.bundle_requests (market_id, created_at desc);

alter table public.markets enable row level security;
alter table public.product_offers enable row level security;
alter table public.offer_pricing_tiers enable row level security;
alter table public.offer_quantity_discounts enable row level security;
alter table public.inventory_locations enable row level security;

revoke all on public.offer_quantity_discounts, public.inventory_locations
  from anon, authenticated;

grant select on public.markets, public.product_offers, public.offer_pricing_tiers
  to anon, authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'markets'
      and policyname = 'Public read public markets'
  ) then
    create policy "Public read public markets"
      on public.markets
      for select
      using (is_public = true and is_active = true);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'product_offers'
      and policyname = 'Public read active product offers'
  ) then
    create policy "Public read active product offers"
      on public.product_offers
      for select
      using (
        is_active = true
        and exists (
          select 1
          from public.products product
          where product.id = product_offers.product_id
            and product.is_active = true
        )
        and exists (
          select 1
          from public.markets market
          where market.id = product_offers.market_id
            and market.is_active = true
            and market.is_public = true
        )
      );
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'offer_pricing_tiers'
      and policyname = 'Public read active offer pricing'
  ) then
    create policy "Public read active offer pricing"
      on public.offer_pricing_tiers
      for select
      using (
        exists (
          select 1
          from public.product_offers offer
          join public.products product on product.id = offer.product_id
          join public.markets market on market.id = offer.market_id
          where offer.id = offer_pricing_tiers.product_offer_id
            and offer.is_active = true
            and product.is_active = true
            and market.is_active = true
            and market.is_public = true
        )
      );
  end if;
end
$$;

drop trigger if exists markets_updated_at on public.markets;
create trigger markets_updated_at
  before update on public.markets
  for each row execute function public.update_updated_at();

drop trigger if exists product_offers_updated_at on public.product_offers;
create trigger product_offers_updated_at
  before update on public.product_offers
  for each row execute function public.update_updated_at();

drop trigger if exists offer_pricing_tiers_updated_at on public.offer_pricing_tiers;
create trigger offer_pricing_tiers_updated_at
  before update on public.offer_pricing_tiers
  for each row execute function public.update_updated_at();

drop trigger if exists offer_quantity_discounts_updated_at on public.offer_quantity_discounts;
create trigger offer_quantity_discounts_updated_at
  before update on public.offer_quantity_discounts
  for each row execute function public.update_updated_at();

drop trigger if exists inventory_locations_updated_at on public.inventory_locations;
create trigger inventory_locations_updated_at
  before update on public.inventory_locations
  for each row execute function public.update_updated_at();

revoke all on function public.default_market_id() from public, anon, authenticated;
revoke all on function public.set_default_market_context() from public, anon, authenticated;
revoke all on function public.set_product_offer_context() from public, anon, authenticated;
revoke all on function public.validate_fulfillment_market_context() from public, anon, authenticated;
revoke all on function public.set_inventory_location_context() from public, anon, authenticated;
revoke all on function public.set_fulfillment_amendment_market_context() from public, anon, authenticated;
revoke all on function public.validate_inventory_assignment_market() from public, anon, authenticated;
revoke all on function public.validate_inventory_block_owner_market() from public, anon, authenticated;
revoke all on function public.validate_booking_draft_market() from public, anon, authenticated;
revoke all on function public.sync_default_product_offer() from public, anon, authenticated;
revoke all on function public.sync_default_offer_pricing_tier() from public, anon, authenticated;
revoke all on function public.sync_default_offer_quantity_discount() from public, anon, authenticated;
revoke all on function public.reserve_product_offer_inventory(uuid, uuid, timestamptz, timestamptz, integer)
  from public, anon, authenticated;
revoke all on function public.reserve_booking_inventory(uuid, uuid, timestamptz, timestamptz, integer)
  from public, anon, authenticated;
grant execute on function public.reserve_product_offer_inventory(uuid, uuid, timestamptz, timestamptz, integer)
  to service_role;
grant execute on function public.reserve_booking_inventory(uuid, uuid, timestamptz, timestamptz, integer)
  to service_role;

comment on table public.markets is
  'Customer-facing service markets. A market may be a city or region and is independent of legal/operator structure.';
comment on table public.product_offers is
  'Market-specific commercial and inventory state for a global catalogue product.';
comment on table public.offer_pricing_tiers is
  'Market-offer rental pricing. source_pricing_tier_id identifies compatibility-mirrored Valencia rows.';
comment on table public.offer_quantity_discounts is
  'Market-offer quantity discounts. source_quantity_discount_id identifies compatibility-mirrored Valencia rows.';
comment on table public.inventory_locations is
  'Structured physical inventory locations within a market; not automatically customer-facing.';
