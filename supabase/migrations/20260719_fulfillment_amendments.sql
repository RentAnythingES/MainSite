create table if not exists public.booking_fulfillment_amendments (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  public_token uuid not null default uuid_generate_v4() unique,
  status text not null default 'quoted'
    check (status in ('quoted', 'checkout_created', 'paid', 'cancelled', 'expired')),
  fulfillment_mode fulfillment_mode not null
    check (fulfillment_mode in ('delivery_only', 'delivery_and_collection')),
  delivery_zone_id uuid references public.service_zones(id) on delete set null,
  collection_zone_id uuid references public.service_zones(id) on delete set null,
  delivery_address text not null,
  collection_address text,
  delivery_notes text,
  collection_notes text,
  delivery_fee_cents integer not null default 0 check (delivery_fee_cents >= 0),
  collection_fee_cents integer not null default 0 check (collection_fee_cents >= 0),
  currency text not null default 'eur',
  is_custom_quote boolean not null default false,
  quote_notes text,
  original_fulfillment_snapshot jsonb not null default '{}'::jsonb,
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text,
  quoted_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '7 days'),
  paid_at timestamptz,
  applied_at timestamptz,
  cancelled_at timestamptz,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    fulfillment_mode = 'delivery_only'
    or collection_address is not null
  ),
  check (delivery_fee_cents + collection_fee_cents > 0)
);

create unique index if not exists booking_fulfillment_amendments_one_open_idx
  on public.booking_fulfillment_amendments (booking_id)
  where status in ('quoted', 'checkout_created');

create index if not exists booking_fulfillment_amendments_booking_idx
  on public.booking_fulfillment_amendments (booking_id, created_at desc);

create index if not exists booking_fulfillment_amendments_status_idx
  on public.booking_fulfillment_amendments (status, expires_at);

alter table public.booking_fulfillment_amendments enable row level security;
revoke all on public.booking_fulfillment_amendments from anon, authenticated;

drop trigger if exists booking_fulfillment_amendments_updated_at on public.booking_fulfillment_amendments;
create trigger booking_fulfillment_amendments_updated_at
  before update on public.booking_fulfillment_amendments
  for each row execute function public.update_updated_at();

create or replace function public.apply_paid_fulfillment_amendment(
  p_amendment_id uuid,
  p_checkout_session_id text,
  p_payment_intent_id text,
  p_paid_at timestamptz default now()
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  amendment public.booking_fulfillment_amendments%rowtype;
  current_booking public.bookings%rowtype;
  amendment_total integer;
begin
  select * into amendment
  from public.booking_fulfillment_amendments
  where id = p_amendment_id
  for update;

  if not found then
    raise exception 'Fulfillment amendment not found';
  end if;

  if amendment.status = 'paid' then
    return false;
  end if;

  if amendment.status not in ('quoted', 'checkout_created') then
    raise exception 'Fulfillment amendment cannot be paid from status %', amendment.status;
  end if;

  select * into current_booking
  from public.bookings
  where id = amendment.booking_id
  for update;

  if not found then
    raise exception 'Booking not found for fulfillment amendment';
  end if;

  if current_booking.status not in ('confirmed', 'paid') then
    raise exception 'Booking status % no longer permits fulfillment changes', current_booking.status;
  end if;

  if current_booking.fulfillment_mode <> 'customer_pickup' then
    raise exception 'Booking fulfillment has already changed';
  end if;

  amendment_total := amendment.delivery_fee_cents + amendment.collection_fee_cents;

  update public.bookings
  set
    fulfillment_mode = amendment.fulfillment_mode,
    pickup_location_id = null,
    delivery_zone_id = amendment.delivery_zone_id,
    collection_zone_id = amendment.collection_zone_id,
    delivery_address = amendment.delivery_address,
    collection_address = amendment.collection_address,
    delivery_notes = amendment.delivery_notes,
    collection_notes = amendment.collection_notes,
    delivery_fee_cents = amendment.delivery_fee_cents,
    collection_fee_cents = amendment.collection_fee_cents,
    total_cents = coalesce(total_cents, 0) + amendment_total,
    updated_at = now()
  where id = amendment.booking_id;

  update public.booking_fulfillment_amendments
  set
    status = 'paid',
    stripe_checkout_session_id = p_checkout_session_id,
    stripe_payment_intent_id = p_payment_intent_id,
    paid_at = p_paid_at,
    applied_at = now(),
    updated_at = now()
  where id = p_amendment_id;

  return true;
end;
$$;

revoke all on function public.apply_paid_fulfillment_amendment(uuid, text, text, timestamptz) from public, anon, authenticated;

comment on table public.booking_fulfillment_amendments is
  'Quoted post-booking changes from customer pickup to paid delivery services.';
