-- A hidden placeholder preserves the normal booking/checkout schema for a
-- staff-authored custom product without reserving a real catalogue item.

do $$
declare
  default_category_id uuid;
begin
  select id
  into default_category_id
  from public.categories
  order by sort_order, id
  limit 1;

  if default_category_id is null then
    raise exception 'A category is required before creating the custom quote placeholder product';
  end if;

  insert into public.products (
    slug, name, brand, description, emoji, image_url, category_id,
    subcategory, subcategory_slug, city, stock_total, stock_available,
    is_active, features, specs
  )
  values (
    'custom-quote', 'Custom Quote', '',
    'Internal placeholder used only for staff-authored custom quotes.',
    '🧾', null, default_category_id,
    'custom', 'custom', 'valencia', 1000000, 1000000,
    false, '[]'::jsonb, '{}'::jsonb
  )
  on conflict (slug) do nothing;
end
$$;

comment on table public.booking_custom_quotes is
  'Private staff-authored pre-booking quotes. The hidden custom-quote product is used only when no catalogue product is selected.';

-- A custom product is intentionally not a stock-tracked item. Keep the ordinary
-- custom-quote checkout flow, but do not create an inventory hold for its hidden
-- placeholder product.
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
  is_custom_product boolean;
begin
  select * into quote
  from public.booking_custom_quotes
  where public_token = p_public_token
  for update;

  if not found then raise exception 'Custom quote not found'; end if;
  if quote.status = 'paid' then raise exception 'Custom quote has already been paid'; end if;
  if quote.status = 'cancelled' then raise exception 'Custom quote has been cancelled'; end if;
  if quote.status = 'expired' or quote.expires_at <= now() or quote.rental_start_at <= now() then
    update public.booking_custom_quotes set status = 'expired' where id = quote.id;
    raise exception 'Custom quote has expired';
  end if;

  if quote.booking_draft_id is not null then
    select * into existing_draft from public.booking_drafts where id = quote.booking_draft_id;
    if found and existing_draft.status in ('draft', 'checkout_created') and existing_draft.expires_at > now() then
      return existing_draft.id;
    end if;
  end if;

  resolved_delivery_address := coalesce(nullif(trim(p_delivery_address), ''), quote.delivery_address);
  resolved_collection_address := coalesce(nullif(trim(p_collection_address), ''), quote.collection_address);
  if quote.fulfillment_mode = 'customer_pickup' and quote.pickup_location_id is null then raise exception 'Pickup location is required'; end if;
  if quote.fulfillment_mode in ('delivery_only', 'delivery_and_collection') and nullif(trim(resolved_delivery_address), '') is null then raise exception 'Delivery address is required'; end if;
  if quote.fulfillment_mode = 'delivery_and_collection' and nullif(trim(resolved_collection_address), '') is null then raise exception 'Collection address is required'; end if;

  select exists(select 1 from public.products where id = quote.product_id and slug = 'custom-quote') into is_custom_product;
  if not is_custom_product and exists (
    select 1 from public.blocked_dates
    where product_id = quote.product_id
      and blocked_date >= (quote.rental_start_at at time zone quote.timezone)::date
      and blocked_date <= (quote.rental_end_at at time zone quote.timezone)::date
  ) then raise exception 'Product is not available for the quoted dates'; end if;

  rental_days := greatest(1, ceil(extract(epoch from (quote.rental_end_at - quote.rental_start_at)) / 86400.0)::integer);

  insert into public.booking_drafts (
    id, product_id, quantity, customer_name, customer_email, customer_phone,
    rental_start_at, rental_end_at, timezone, rental_days, fulfillment_mode,
    delivery_type, pickup_location_id, delivery_address, collection_address,
    delivery_notes, collection_notes, billing_name, billing_address,
    invoice_requested, currency, per_day_cents, rental_subtotal_cents,
    delivery_fee_cents, collection_fee_cents, total_cents, deposit_cents,
    pricing_snapshot, custom_quote_id, custom_line_items, custom_terms,
    custom_internal_notes, status, expires_at
  ) values (
    new_draft_id, quote.product_id, quote.quantity, trim(p_customer_name),
    lower(trim(p_customer_email)), nullif(trim(p_customer_phone), ''),
    quote.rental_start_at, quote.rental_end_at, quote.timezone, rental_days,
    quote.fulfillment_mode, 'standard', quote.pickup_location_id,
    resolved_delivery_address, resolved_collection_address, quote.delivery_notes,
    quote.collection_notes, trim(p_customer_name), '{}'::jsonb, false,
    quote.currency, 0, quote.total_cents, 0, 0, quote.total_cents, 0,
    jsonb_build_object('source', 'custom_quote', 'customQuoteId', quote.id,
      'lineItems', quote.line_items, 'customerTerms', quote.customer_terms,
      'displayName', quote.display_name),
    quote.id, quote.line_items, quote.customer_terms, quote.internal_notes,
    'draft', now() + interval '30 minutes'
  );

  if is_custom_product then
    inventory_reserved := true;
  else
    select public.reserve_booking_inventory(quote.product_id, new_draft_id,
      quote.rental_start_at, quote.rental_end_at, quote.quantity) into inventory_reserved;
  end if;
  if not inventory_reserved then raise exception 'Product is not available for the quoted dates'; end if;

  update public.booking_custom_quotes
  set customer_name = trim(p_customer_name), customer_email = lower(trim(p_customer_email)),
      customer_phone = nullif(trim(p_customer_phone), ''), delivery_address = resolved_delivery_address,
      collection_address = resolved_collection_address, booking_draft_id = new_draft_id, status = 'open'
  where id = quote.id;
  return new_draft_id;
end;
$$;

revoke all on function public.accept_custom_booking_quote(uuid, text, text, text, text, text)
  from public, anon, authenticated;
grant execute on function public.accept_custom_booking_quote(uuid, text, text, text, text, text)
  to service_role;
