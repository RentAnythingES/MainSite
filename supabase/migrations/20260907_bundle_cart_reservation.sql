-- Fix the unassigned PL/pgSQL record variable colliding with the SQL item alias.
-- Preserves atomic offer locks, capacity rules and existing grants/signature.
create or replace function public.reserve_booking_cart_inventory(
  p_booking_draft_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  resolved_market_id uuid;
  resolved_start_at timestamptz;
  resolved_end_at timestamptz;
  resolved_timezone text;
  cart_line record;
  effective_capacity integer;
  overlapping_quantity integer;
begin
  select draft.market_id, draft.rental_start_at, draft.rental_end_at, draft.timezone
  into resolved_market_id, resolved_start_at, resolved_end_at, resolved_timezone
  from public.booking_drafts draft
  where draft.id = p_booking_draft_id
    and draft.status = 'draft'
    and draft.expires_at > now()
  for update;

  if resolved_market_id is null then
    raise exception 'Open booking draft not found';
  end if;
  if not exists (
    select 1 from public.booking_draft_items
    where booking_draft_id = p_booking_draft_id
  ) then
    raise exception 'Booking draft has no items';
  end if;

  -- Lock every offer in deterministic order so concurrent carts cannot deadlock.
  perform offer.id
  from public.product_offers offer
  join public.booking_draft_items item
    on item.product_offer_id = offer.id
  where item.booking_draft_id = p_booking_draft_id
  order by offer.id
  for update of offer;

  for cart_line in
    select
      draft_item.product_id,
      draft_item.product_offer_id,
      draft_item.market_id,
      draft_item.quantity,
      offer.stock_total,
      offer.online_capacity,
      offer.is_active,
      market.is_active as market_active,
      market.is_booking_enabled
    from public.booking_draft_items draft_item
    join public.product_offers offer on offer.id = draft_item.product_offer_id
    join public.markets market on market.id = draft_item.market_id
    where draft_item.booking_draft_id = p_booking_draft_id
    order by draft_item.product_offer_id
  loop
    if cart_line.market_id <> resolved_market_id
      or not cart_line.is_active
      or not cart_line.market_active
      or not cart_line.is_booking_enabled
    then
      return false;
    end if;

    effective_capacity := least(cart_line.stock_total, cart_line.online_capacity);
    if cart_line.quantity > effective_capacity then
      return false;
    end if;

    if exists (
      select 1
      from public.blocked_dates blocked
      where blocked.product_offer_id = cart_line.product_offer_id
        and blocked.blocked_date >= (resolved_start_at at time zone resolved_timezone)::date
        and blocked.blocked_date <= (resolved_end_at at time zone resolved_timezone)::date
    ) then
      return false;
    end if;

    select coalesce(sum(block.quantity), 0)
    into overlapping_quantity
    from public.booking_inventory_blocks block
    left join public.booking_drafts draft on draft.id = block.booking_draft_id
    where block.product_offer_id = cart_line.product_offer_id
      and block.starts_at < resolved_end_at
      and block.ends_at > resolved_start_at
      and (
        block.booking_id is not null
        or (
          block.booking_draft_id is not null
          and block.booking_draft_id <> p_booking_draft_id
          and draft.status in ('draft', 'checkout_created')
          and draft.expires_at > now()
        )
      );

    if overlapping_quantity + cart_line.quantity > effective_capacity then
      return false;
    end if;
  end loop;

  insert into public.booking_inventory_blocks (
    product_id, market_id, product_offer_id, booking_draft_id,
    starts_at, ends_at, quantity, reason
  )
  select
    item.product_id,
    item.market_id,
    item.product_offer_id,
    p_booking_draft_id,
    resolved_start_at,
    resolved_end_at,
    item.quantity,
    'checkout_hold'
  from public.booking_draft_items item
  where item.booking_draft_id = p_booking_draft_id
    and not exists (
      select 1 from public.booking_inventory_blocks existing
      where existing.booking_draft_id = p_booking_draft_id
        and existing.product_offer_id = item.product_offer_id
        and existing.booking_id is null
    );

  return true;
end;
$$;
