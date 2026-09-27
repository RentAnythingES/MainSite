-- Multi-item booking foundation.
-- Keeps booking_drafts/bookings primary-product columns for compatibility while
-- normalizing every priced and inventory-reserved item below the parent record.

create table if not exists public.booking_draft_items (
  id uuid primary key default uuid_generate_v4(),
  booking_draft_id uuid not null references public.booking_drafts(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  market_id uuid not null references public.markets(id) on delete restrict,
  product_offer_id uuid not null references public.product_offers(id) on delete restrict,
  name_snapshot text not null,
  quantity integer not null check (quantity > 0),
  rental_days integer not null check (rental_days > 0),
  per_day_cents integer not null check (per_day_cents >= 0),
  unit_rental_subtotal_cents integer not null check (unit_rental_subtotal_cents >= 0),
  quantity_discount_bps integer not null default 0 check (quantity_discount_bps between 0 and 9999),
  quantity_discount_cents integer not null default 0 check (quantity_discount_cents >= 0),
  rental_subtotal_cents integer not null check (rental_subtotal_cents >= 0),
  pricing_snapshot jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint booking_draft_items_offer_product_market_fk
    foreign key (product_offer_id, product_id, market_id)
    references public.product_offers(id, product_id, market_id) on delete restrict,
  constraint booking_draft_items_unique_offer unique (booking_draft_id, product_offer_id)
);

create table if not exists public.booking_items (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  booking_draft_item_id uuid references public.booking_draft_items(id) on delete set null,
  product_id uuid not null references public.products(id) on delete restrict,
  market_id uuid not null references public.markets(id) on delete restrict,
  product_offer_id uuid not null references public.product_offers(id) on delete restrict,
  name_snapshot text not null,
  quantity integer not null check (quantity > 0),
  rental_days integer not null check (rental_days > 0),
  per_day_cents integer not null check (per_day_cents >= 0),
  unit_rental_subtotal_cents integer not null check (unit_rental_subtotal_cents >= 0),
  quantity_discount_bps integer not null default 0 check (quantity_discount_bps between 0 and 9999),
  quantity_discount_cents integer not null default 0 check (quantity_discount_cents >= 0),
  rental_subtotal_cents integer not null check (rental_subtotal_cents >= 0),
  pricing_snapshot jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint booking_items_offer_product_market_fk
    foreign key (product_offer_id, product_id, market_id)
    references public.product_offers(id, product_id, market_id) on delete restrict,
  constraint booking_items_unique_offer unique (booking_id, product_offer_id)
);

create index if not exists booking_draft_items_draft_idx
  on public.booking_draft_items(booking_draft_id, sort_order);
create index if not exists booking_items_booking_idx
  on public.booking_items(booking_id, sort_order);
create index if not exists booking_items_offer_idx
  on public.booking_items(product_offer_id, booking_id);

alter table public.booking_draft_items enable row level security;
alter table public.booking_items enable row level security;
revoke all on public.booking_draft_items, public.booking_items from public, anon, authenticated;
grant all on public.booking_draft_items, public.booking_items to service_role;

drop trigger if exists booking_draft_items_offer_context on public.booking_draft_items;
create trigger booking_draft_items_offer_context
  before insert or update on public.booking_draft_items
  for each row execute function public.set_product_offer_context();

drop trigger if exists booking_items_offer_context on public.booking_items;
create trigger booking_items_offer_context
  before insert or update on public.booking_items
  for each row execute function public.set_product_offer_context();

create or replace function public.ensure_primary_booking_draft_item()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.booking_draft_items (
    booking_draft_id, product_id, market_id, product_offer_id, name_snapshot,
    quantity, rental_days, per_day_cents, unit_rental_subtotal_cents,
    quantity_discount_bps, quantity_discount_cents, rental_subtotal_cents,
    pricing_snapshot, sort_order
  )
  select
    new.id, new.product_id, new.market_id, new.product_offer_id, product.name,
    new.quantity, new.rental_days, new.per_day_cents,
    new.per_day_cents * new.rental_days,
    0,
    greatest(0, (new.per_day_cents * new.rental_days * new.quantity) - new.rental_subtotal_cents),
    new.rental_subtotal_cents,
    new.pricing_snapshot,
    0
  from public.products product
  where product.id = new.product_id
  on conflict (booking_draft_id, product_offer_id) do nothing;
  return new;
end;
$$;

create or replace function public.assign_booking_inventory_unit(
  p_booking_id uuid,
  p_inventory_unit_id uuid,
  p_actor_id uuid default null,
  p_notes text default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  resolved_booking_status public.booking_status;
  resolved_unit_product_id uuid;
  resolved_unit_offer_id uuid;
  required_item_quantity integer;
  active_item_assignments integer;
  resolved_assignment_id uuid;
begin
  select booking.status into resolved_booking_status
  from public.bookings booking
  where booking.id = p_booking_id
  for update;

  if resolved_booking_status is null then raise exception 'Booking not found'; end if;
  if resolved_booking_status not in ('confirmed', 'paid', 'delivering', 'active') then
    raise exception 'Inventory can only be assigned to an open confirmed rental';
  end if;

  select unit.product_id, unit.product_offer_id
  into resolved_unit_product_id, resolved_unit_offer_id
  from public.inventory_units unit
  where unit.id = p_inventory_unit_id and unit.status = 'available'
  for update;

  if resolved_unit_product_id is null then
    raise exception 'Inventory unit is not available';
  end if;

  select item.quantity into required_item_quantity
  from public.booking_items item
  where item.booking_id = p_booking_id
    and item.product_offer_id = resolved_unit_offer_id;

  if required_item_quantity is null then
    raise exception 'Inventory unit does not belong to an item in this booking';
  end if;

  select count(*)::integer into active_item_assignments
  from public.booking_inventory_unit_assignments assignment
  join public.inventory_units unit on unit.id = assignment.inventory_unit_id
  where assignment.booking_id = p_booking_id
    and unit.product_offer_id = resolved_unit_offer_id
    and assignment.status in ('assigned', 'handed_over');

  if active_item_assignments >= required_item_quantity then
    raise exception 'This booking item already has its required % physical unit(s)', required_item_quantity;
  end if;

  insert into public.booking_inventory_unit_assignments (
    booking_id, inventory_unit_id, assigned_by, notes
  ) values (
    p_booking_id, p_inventory_unit_id, p_actor_id, nullif(trim(p_notes), '')
  ) returning id into resolved_assignment_id;

  update public.inventory_units
  set status = 'reserved', updated_at = now()
  where id = p_inventory_unit_id;

  insert into public.inventory_unit_events (
    inventory_unit_id, event_type, from_status, to_status, note, actor_id
  ) values (
    p_inventory_unit_id, 'booking_assigned', 'available', 'reserved',
    'Booking ' || p_booking_id::text, p_actor_id
  );

  return resolved_assignment_id;
end;
$$;

create or replace function public.ensure_primary_booking_item()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.booking_items (
    booking_id, booking_draft_item_id, product_id, market_id, product_offer_id,
    name_snapshot, quantity, rental_days, per_day_cents,
    unit_rental_subtotal_cents, quantity_discount_bps,
    quantity_discount_cents, rental_subtotal_cents, pricing_snapshot, sort_order
  )
  select
    new.id,
    draft_item.id,
    new.product_id,
    new.market_id,
    new.product_offer_id,
    product.name,
    new.quantity,
    new.rental_days,
    new.per_day_cents,
    new.per_day_cents * new.rental_days,
    0,
    greatest(0, (new.per_day_cents * new.rental_days * new.quantity) - new.subtotal_cents),
    new.subtotal_cents,
    new.pricing_snapshot,
    0
  from public.products product
  left join public.booking_draft_items draft_item
    on draft_item.booking_draft_id = new.booking_draft_id
    and draft_item.product_offer_id = new.product_offer_id
  where product.id = new.product_id
  on conflict (booking_id, product_offer_id) do nothing;
  return new;
end;
$$;

drop trigger if exists booking_drafts_90_primary_item on public.booking_drafts;
create trigger booking_drafts_90_primary_item
  after insert on public.booking_drafts
  for each row execute function public.ensure_primary_booking_draft_item();

drop trigger if exists bookings_90_primary_item on public.bookings;
create trigger bookings_90_primary_item
  after insert on public.bookings
  for each row execute function public.ensure_primary_booking_item();

insert into public.booking_draft_items (
  booking_draft_id, product_id, market_id, product_offer_id, name_snapshot,
  quantity, rental_days, per_day_cents, unit_rental_subtotal_cents,
  quantity_discount_bps, quantity_discount_cents, rental_subtotal_cents,
  pricing_snapshot, sort_order
)
select
  draft.id, draft.product_id, draft.market_id, draft.product_offer_id, product.name,
  draft.quantity, draft.rental_days, draft.per_day_cents,
  draft.per_day_cents * draft.rental_days,
  0,
  greatest(0, (draft.per_day_cents * draft.rental_days * draft.quantity) - draft.rental_subtotal_cents),
  draft.rental_subtotal_cents,
  draft.pricing_snapshot,
  0
from public.booking_drafts draft
join public.products product on product.id = draft.product_id
on conflict (booking_draft_id, product_offer_id) do nothing;

insert into public.booking_items (
  booking_id, booking_draft_item_id, product_id, market_id, product_offer_id,
  name_snapshot, quantity, rental_days, per_day_cents,
  unit_rental_subtotal_cents, quantity_discount_bps,
  quantity_discount_cents, rental_subtotal_cents, pricing_snapshot, sort_order
)
select
  booking.id,
  draft_item.id,
  booking.product_id,
  booking.market_id,
  booking.product_offer_id,
  product.name,
  booking.quantity,
  booking.rental_days,
  booking.per_day_cents,
  booking.per_day_cents * booking.rental_days,
  0,
  greatest(0, (booking.per_day_cents * booking.rental_days * booking.quantity) - booking.subtotal_cents),
  booking.subtotal_cents,
  booking.pricing_snapshot,
  0
from public.bookings booking
join public.products product on product.id = booking.product_id
left join public.booking_draft_items draft_item
  on draft_item.booking_draft_id = booking.booking_draft_id
  and draft_item.product_offer_id = booking.product_offer_id
on conflict (booking_id, product_offer_id) do nothing;

create or replace function public.validate_inventory_block_owner_market()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  owner_market_id uuid;
begin
  if new.booking_draft_id is not null then
    select draft.market_id into owner_market_id
    from public.booking_drafts draft
    where draft.id = new.booking_draft_id;

    if owner_market_id is null or owner_market_id <> new.market_id then
      raise exception 'Inventory block does not match its booking draft market';
    end if;
    if not exists (
      select 1 from public.booking_draft_items item
      where item.booking_draft_id = new.booking_draft_id
        and item.product_offer_id = new.product_offer_id
    ) then
      raise exception 'Inventory block product is not part of its booking draft';
    end if;
  end if;

  if new.booking_id is not null then
    select booking.market_id into owner_market_id
    from public.bookings booking
    where booking.id = new.booking_id;

    if owner_market_id is null or owner_market_id <> new.market_id then
      raise exception 'Inventory block does not match its booking market';
    end if;
    if not exists (
      select 1 from public.booking_items item
      where item.booking_id = new.booking_id
        and item.product_offer_id = new.product_offer_id
    ) then
      raise exception 'Inventory block product is not part of its booking';
    end if;
  end if;

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
  unit_market_id uuid;
  unit_offer_id uuid;
begin
  select booking.market_id into booking_market_id
  from public.bookings booking
  where booking.id = new.booking_id;

  select unit.market_id, unit.product_offer_id
  into unit_market_id, unit_offer_id
  from public.inventory_units unit
  where unit.id = new.inventory_unit_id;

  if booking_market_id is null or unit_market_id is null then
    raise exception 'Booking and inventory unit must have market context';
  end if;
  if booking_market_id <> unit_market_id or not exists (
    select 1 from public.booking_items item
    where item.booking_id = new.booking_id
      and item.product_offer_id = unit_offer_id
  ) then
    raise exception 'Inventory unit does not belong to an item in this booking';
  end if;
  return new;
end;
$$;

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
  item record;
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

  for item in
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
    if item.market_id <> resolved_market_id
      or not item.is_active
      or not item.market_active
      or not item.is_booking_enabled
    then
      return false;
    end if;

    effective_capacity := least(item.stock_total, item.online_capacity);
    if item.quantity > effective_capacity then
      return false;
    end if;

    if exists (
      select 1
      from public.blocked_dates blocked
      where blocked.product_offer_id = item.product_offer_id
        and blocked.blocked_date >= (resolved_start_at at time zone resolved_timezone)::date
        and blocked.blocked_date <= (resolved_end_at at time zone resolved_timezone)::date
    ) then
      return false;
    end if;

    select coalesce(sum(block.quantity), 0)
    into overlapping_quantity
    from public.booking_inventory_blocks block
    left join public.booking_drafts draft on draft.id = block.booking_draft_id
    where block.product_offer_id = item.product_offer_id
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

    if overlapping_quantity + item.quantity > effective_capacity then
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

create or replace function public.transition_booking_inventory_unit(
  p_booking_id uuid,
  p_assignment_id uuid,
  p_action text,
  p_actor_id uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  resolved_assignment public.booking_inventory_unit_assignments;
  resolved_booking_status public.booking_status;
  required_total_quantity integer;
  from_unit_status text;
  to_unit_status text;
  to_assignment_status text;
begin
  select booking.status into resolved_booking_status
  from public.bookings booking
  where booking.id = p_booking_id
  for update;
  if resolved_booking_status is null then raise exception 'Booking not found'; end if;

  select coalesce(sum(item.quantity), 0)::integer into required_total_quantity
  from public.booking_items item
  where item.booking_id = p_booking_id;
  if required_total_quantity <= 0 then
    raise exception 'Booking has no reservable items';
  end if;

  select * into resolved_assignment
  from public.booking_inventory_unit_assignments assignment
  where assignment.id = p_assignment_id and assignment.booking_id = p_booking_id
  for update;
  if resolved_assignment.id is null then raise exception 'Assignment not found'; end if;

  if p_action = 'hand_over' and resolved_assignment.status = 'assigned' then
    if resolved_booking_status not in ('paid', 'delivering', 'active') then
      raise exception 'Booking must be paid before physical handover';
    end if;
    from_unit_status := 'reserved';
    to_unit_status := 'rented';
    to_assignment_status := 'handed_over';
  elsif p_action = 'return' and resolved_assignment.status = 'handed_over' then
    if resolved_booking_status not in ('active', 'returning') then
      raise exception 'Booking must be active or returning before physical return';
    end if;
    from_unit_status := 'rented';
    to_unit_status := 'available';
    to_assignment_status := 'returned';
  elsif p_action = 'release' and resolved_assignment.status = 'assigned' then
    from_unit_status := 'reserved';
    to_unit_status := 'available';
    to_assignment_status := 'released';
  else
    raise exception 'Invalid inventory assignment transition';
  end if;

  perform 1 from public.inventory_units
  where id = resolved_assignment.inventory_unit_id and status = from_unit_status
  for update;
  if not found then raise exception 'Inventory unit status is inconsistent with assignment'; end if;

  update public.booking_inventory_unit_assignments
  set
    status = to_assignment_status,
    handed_over_at = case when p_action = 'hand_over' then now() else handed_over_at end,
    returned_at = case when p_action = 'return' then now() else returned_at end,
    released_at = case when p_action in ('return', 'release') then now() else released_at end
  where id = p_assignment_id;

  update public.inventory_units
  set
    status = to_unit_status,
    updated_at = now(),
    last_inspected_at = case when p_action = 'return' then now() else last_inspected_at end
  where id = resolved_assignment.inventory_unit_id;

  insert into public.inventory_unit_events (
    inventory_unit_id, event_type, from_status, to_status, note, actor_id
  ) values (
    resolved_assignment.inventory_unit_id,
    'booking_' || p_action,
    from_unit_status,
    to_unit_status,
    'Booking ' || p_booking_id::text,
    p_actor_id
  );

  if p_action = 'hand_over' then
    if (
      select count(*) from public.booking_inventory_unit_assignments
      where booking_id = p_booking_id and status = 'handed_over'
    ) >= required_total_quantity then
      update public.booking_ops_tasks
      set is_done = true, completed_at = coalesce(completed_at, now()),
          completed_by = coalesce(completed_by, p_actor_id)
      where booking_id = p_booking_id and task_key = 'handoff_confirmed';

      if resolved_booking_status = 'paid' then
        perform public.transition_booking_status(
          p_booking_id, resolved_booking_status, 'delivering',
          'inventory_assignment:hand_over', p_actor_id
        );
        resolved_booking_status := 'delivering';
      end if;
      if resolved_booking_status = 'delivering' then
        perform public.transition_booking_status(
          p_booking_id, resolved_booking_status, 'active',
          'inventory_assignment:hand_over', p_actor_id
        );
      end if;
    end if;
  elsif p_action = 'return' then
    update public.booking_ops_tasks
    set is_done = true, completed_at = coalesce(completed_at, now()),
        completed_by = coalesce(completed_by, p_actor_id)
    where booking_id = p_booking_id and task_key = 'return_scheduled';

    if resolved_booking_status = 'active' then
      perform public.transition_booking_status(
        p_booking_id, resolved_booking_status, 'returning',
        'inventory_assignment:return', p_actor_id
      );
      resolved_booking_status := 'returning';
    end if;
    if resolved_booking_status = 'returning' and not exists (
      select 1 from public.booking_inventory_unit_assignments
      where booking_id = p_booking_id and status in ('assigned', 'handed_over')
    ) then
      update public.booking_ops_tasks
      set is_done = true, completed_at = coalesce(completed_at, now()),
          completed_by = coalesce(completed_by, p_actor_id)
      where booking_id = p_booking_id and task_key = 'return_inspected';

      perform public.transition_booking_status(
        p_booking_id, resolved_booking_status, 'completed',
        'inventory_assignment:return', p_actor_id
      );
    end if;
  end if;

  return p_assignment_id;
end;
$$;

revoke all on function public.ensure_primary_booking_draft_item() from public, anon, authenticated;
revoke all on function public.ensure_primary_booking_item() from public, anon, authenticated;
revoke all on function public.reserve_booking_cart_inventory(uuid) from public, anon, authenticated;
revoke all on function public.assign_booking_inventory_unit(uuid, uuid, uuid, text) from public, anon, authenticated;
revoke all on function public.transition_booking_inventory_unit(uuid, uuid, text, uuid) from public, anon, authenticated;
grant execute on function public.reserve_booking_cart_inventory(uuid) to service_role;
grant execute on function public.assign_booking_inventory_unit(uuid, uuid, uuid, text) to service_role;
grant execute on function public.transition_booking_inventory_unit(uuid, uuid, text, uuid) to service_role;

comment on table public.booking_draft_items is
  'Server-priced product lines belonging to one temporary booking draft.';
comment on table public.booking_items is
  'Immutable product-line snapshots belonging to one paid booking.';
