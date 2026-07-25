-- Flexible staff-authored quotes that feed the normal booking draft and Checkout flow.
-- Custom lines are immutable quote snapshots, not catalogue products or inventory items.

create table if not exists public.booking_custom_quotes (
  id uuid primary key default uuid_generate_v4(),
  public_token uuid not null default uuid_generate_v4() unique,
  status text not null default 'open'
    check (status in ('open', 'checkout_created', 'paid', 'cancelled', 'expired')),
  product_id uuid not null references public.products(id) on delete restrict,
  quantity integer not null default 1 check (quantity > 0),
  customer_name text,
  customer_email text,
  customer_phone text,
  rental_start_at timestamptz not null,
  rental_end_at timestamptz not null,
  timezone text not null default 'Europe/Madrid',
  fulfillment_mode fulfillment_mode not null,
  pickup_location_id uuid references public.pickup_locations(id) on delete set null,
  delivery_address text,
  collection_address text,
  delivery_notes text,
  collection_notes text,
  currency text not null default 'eur',
  line_items jsonb not null default '[]'::jsonb,
  total_cents integer not null check (total_cents > 0),
  customer_terms text,
  internal_notes text,
  booking_draft_id uuid,
  booking_id uuid references public.bookings(id) on delete set null,
  expires_at timestamptz not null default (now() + interval '3 days'),
  checkout_created_at timestamptz,
  paid_at timestamptz,
  cancelled_at timestamptz,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (rental_end_at > rental_start_at),
  check (jsonb_typeof(line_items) = 'array')
);

alter table public.booking_drafts
  add column if not exists custom_quote_id uuid references public.booking_custom_quotes(id) on delete set null,
  add column if not exists custom_line_items jsonb not null default '[]'::jsonb,
  add column if not exists custom_terms text,
  add column if not exists custom_internal_notes text;

alter table public.bookings
  add column if not exists custom_quote_id uuid references public.booking_custom_quotes(id) on delete set null,
  add column if not exists custom_line_items jsonb not null default '[]'::jsonb,
  add column if not exists custom_terms text,
  add column if not exists custom_internal_notes text;

alter table public.booking_custom_quotes
  drop constraint if exists booking_custom_quotes_booking_draft_id_fkey;

alter table public.booking_custom_quotes
  add constraint booking_custom_quotes_booking_draft_id_fkey
  foreign key (booking_draft_id) references public.booking_drafts(id) on delete set null;

create index if not exists booking_custom_quotes_status_idx
  on public.booking_custom_quotes (status, expires_at);

create index if not exists booking_custom_quotes_product_period_idx
  on public.booking_custom_quotes (product_id, rental_start_at, rental_end_at);

create index if not exists booking_drafts_custom_quote_idx
  on public.booking_drafts (custom_quote_id);

alter table public.booking_custom_quotes enable row level security;
revoke all on public.booking_custom_quotes from anon, authenticated;

drop trigger if exists booking_custom_quotes_updated_at on public.booking_custom_quotes;
create trigger booking_custom_quotes_updated_at
  before update on public.booking_custom_quotes
  for each row execute function public.update_updated_at();

create or replace function public.accept_custom_booking_quote(
  p_public_token uuid,
  p_customer_name text,
  p_customer_email text,
  p_customer_phone text default null,
  p_delivery_address text default null,
  p_collection_address text default null
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  quote public.booking_custom_quotes%rowtype;
  existing_draft public.booking_drafts%rowtype;
  new_draft_id uuid := uuid_generate_v4();
  resolved_delivery_address text;
  resolved_collection_address text;
  rental_days integer;
  inventory_reserved boolean;
begin
  select * into quote
  from public.booking_custom_quotes
  where public_token = p_public_token
  for update;

  if not found then
    raise exception 'Custom quote not found';
  end if;

  if quote.status = 'paid' then
    raise exception 'Custom quote has already been paid';
  end if;

  if quote.status = 'cancelled' then
    raise exception 'Custom quote has been cancelled';
  end if;

  if quote.status = 'expired' or quote.expires_at <= now() or quote.rental_start_at <= now() then
    update public.booking_custom_quotes
    set status = 'expired'
    where id = quote.id;
    raise exception 'Custom quote has expired';
  end if;

  if quote.booking_draft_id is not null then
    select * into existing_draft
    from public.booking_drafts
    where id = quote.booking_draft_id;

    if found
      and existing_draft.status in ('draft', 'checkout_created')
      and existing_draft.expires_at > now()
    then
      return existing_draft.id;
    end if;
  end if;

  resolved_delivery_address := coalesce(nullif(trim(p_delivery_address), ''), quote.delivery_address);
  resolved_collection_address := coalesce(nullif(trim(p_collection_address), ''), quote.collection_address);

  if quote.fulfillment_mode = 'customer_pickup' and quote.pickup_location_id is null then
    raise exception 'Pickup location is required';
  end if;

  if quote.fulfillment_mode in ('delivery_only', 'delivery_and_collection')
    and nullif(trim(resolved_delivery_address), '') is null
  then
    raise exception 'Delivery address is required';
  end if;

  if quote.fulfillment_mode = 'delivery_and_collection'
    and nullif(trim(resolved_collection_address), '') is null
  then
    raise exception 'Collection address is required';
  end if;

  if exists (
    select 1
    from public.blocked_dates
    where product_id = quote.product_id
      and blocked_date >= (quote.rental_start_at at time zone quote.timezone)::date
      and blocked_date <= (quote.rental_end_at at time zone quote.timezone)::date
  ) then
    raise exception 'Product is not available for the quoted dates';
  end if;

  rental_days := greatest(
    1,
    ceil(extract(epoch from (quote.rental_end_at - quote.rental_start_at)) / 86400.0)::integer
  );

  insert into public.booking_drafts (
    id,
    product_id,
    quantity,
    customer_name,
    customer_email,
    customer_phone,
    rental_start_at,
    rental_end_at,
    timezone,
    rental_days,
    fulfillment_mode,
    delivery_type,
    pickup_location_id,
    delivery_address,
    collection_address,
    delivery_notes,
    collection_notes,
    billing_name,
    billing_address,
    invoice_requested,
    currency,
    per_day_cents,
    rental_subtotal_cents,
    delivery_fee_cents,
    collection_fee_cents,
    total_cents,
    deposit_cents,
    pricing_snapshot,
    custom_quote_id,
    custom_line_items,
    custom_terms,
    custom_internal_notes,
    status,
    expires_at
  )
  values (
    new_draft_id,
    quote.product_id,
    quote.quantity,
    trim(p_customer_name),
    lower(trim(p_customer_email)),
    nullif(trim(p_customer_phone), ''),
    quote.rental_start_at,
    quote.rental_end_at,
    quote.timezone,
    rental_days,
    quote.fulfillment_mode,
    'standard',
    quote.pickup_location_id,
    resolved_delivery_address,
    resolved_collection_address,
    quote.delivery_notes,
    quote.collection_notes,
    trim(p_customer_name),
    '{}'::jsonb,
    false,
    quote.currency,
    0,
    quote.total_cents,
    0,
    0,
    quote.total_cents,
    0,
    jsonb_build_object(
      'source', 'custom_quote',
      'customQuoteId', quote.id,
      'lineItems', quote.line_items,
      'customerTerms', quote.customer_terms
    ),
    quote.id,
    quote.line_items,
    quote.customer_terms,
    quote.internal_notes,
    'draft',
    now() + interval '30 minutes'
  );

  select public.reserve_booking_inventory(
    quote.product_id,
    new_draft_id,
    quote.rental_start_at,
    quote.rental_end_at,
    quote.quantity
  ) into inventory_reserved;

  if not inventory_reserved then
    raise exception 'Product is not available for the quoted dates';
  end if;

  update public.booking_custom_quotes
  set
    customer_name = trim(p_customer_name),
    customer_email = lower(trim(p_customer_email)),
    customer_phone = nullif(trim(p_customer_phone), ''),
    delivery_address = resolved_delivery_address,
    collection_address = resolved_collection_address,
    booking_draft_id = new_draft_id,
    status = 'open'
  where id = quote.id;

  return new_draft_id;
end;
$$;

revoke all on function public.accept_custom_booking_quote(uuid, text, text, text, text, text)
  from public, anon, authenticated;
grant execute on function public.accept_custom_booking_quote(uuid, text, text, text, text, text)
  to service_role;

comment on table public.booking_custom_quotes is
  'Private staff-authored pre-booking quotes. Free-form line items are quote snapshots, not catalogue inventory.';
