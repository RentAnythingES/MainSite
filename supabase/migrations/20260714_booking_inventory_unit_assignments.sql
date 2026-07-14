create table if not exists public.booking_inventory_unit_assignments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  inventory_unit_id uuid not null references public.inventory_units(id) on delete restrict,
  status text not null default 'assigned' check (status in ('assigned','handed_over','returned','released')),
  assigned_by uuid,
  assigned_at timestamptz not null default now(),
  handed_over_at timestamptz,
  returned_at timestamptz,
  released_at timestamptz,
  notes text,
  unique (booking_id, inventory_unit_id)
);
create unique index if not exists booking_inventory_unit_active_unique
  on public.booking_inventory_unit_assignments(inventory_unit_id)
  where status in ('assigned','handed_over');
create index if not exists booking_inventory_unit_booking_idx on public.booking_inventory_unit_assignments(booking_id);
alter table public.booking_inventory_unit_assignments enable row level security;
revoke all on public.booking_inventory_unit_assignments from anon, authenticated;

create or replace function public.assign_booking_inventory_unit(
  p_booking_id uuid,
  p_inventory_unit_id uuid,
  p_actor_id uuid default null,
  p_notes text default null
) returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_booking_product_id uuid;
  v_booking_status text;
  v_unit_product_id uuid;
  v_assignment_id uuid;
begin
  select product_id, status
    into v_booking_product_id, v_booking_status
  from public.bookings
  where id = p_booking_id
  for update;

  if v_booking_product_id is null then
    raise exception 'Booking not found';
  end if;
  if v_booking_status in ('cancelled', 'refunded', 'completed') then
    raise exception 'Cannot assign inventory to a closed booking';
  end if;

  select product_id
    into v_unit_product_id
  from public.inventory_units
  where id = p_inventory_unit_id
    and status = 'available'
  for update;

  if v_unit_product_id is null then
    raise exception 'Inventory unit is not available';
  end if;
  if v_unit_product_id <> v_booking_product_id then
    raise exception 'Inventory unit does not belong to the booked product';
  end if;

  insert into public.booking_inventory_unit_assignments (
    booking_id, inventory_unit_id, assigned_by, notes
  ) values (
    p_booking_id, p_inventory_unit_id, p_actor_id, nullif(trim(p_notes), '')
  ) returning id into v_assignment_id;

  update public.inventory_units
  set status = 'reserved', updated_at = now()
  where id = p_inventory_unit_id;

  insert into public.inventory_unit_events (
    inventory_unit_id, event_type, from_status, to_status, note, actor_id
  ) values (
    p_inventory_unit_id, 'booking_assigned', 'available', 'reserved',
    'Booking ' || p_booking_id::text, p_actor_id
  );

  return v_assignment_id;
end;
$$;

create or replace function public.transition_booking_inventory_unit(
  p_booking_id uuid,
  p_assignment_id uuid,
  p_action text,
  p_actor_id uuid default null
) returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_assignment public.booking_inventory_unit_assignments%rowtype;
  v_from_unit_status text;
  v_to_unit_status text;
  v_to_assignment_status text;
begin
  select * into v_assignment
  from public.booking_inventory_unit_assignments
  where id = p_assignment_id and booking_id = p_booking_id
  for update;

  if v_assignment.id is null then
    raise exception 'Assignment not found';
  end if;

  if p_action = 'hand_over' and v_assignment.status = 'assigned' then
    v_from_unit_status := 'reserved';
    v_to_unit_status := 'rented';
    v_to_assignment_status := 'handed_over';
  elsif p_action = 'return' and v_assignment.status = 'handed_over' then
    v_from_unit_status := 'rented';
    v_to_unit_status := 'available';
    v_to_assignment_status := 'returned';
  elsif p_action = 'release' and v_assignment.status = 'assigned' then
    v_from_unit_status := 'reserved';
    v_to_unit_status := 'available';
    v_to_assignment_status := 'released';
  else
    raise exception 'Invalid inventory assignment transition';
  end if;

  perform 1 from public.inventory_units
  where id = v_assignment.inventory_unit_id and status = v_from_unit_status
  for update;
  if not found then
    raise exception 'Inventory unit status is inconsistent with assignment';
  end if;

  update public.booking_inventory_unit_assignments
  set status = v_to_assignment_status,
      handed_over_at = case when p_action = 'hand_over' then now() else handed_over_at end,
      returned_at = case when p_action = 'return' then now() else returned_at end,
      released_at = case when p_action in ('return', 'release') then now() else released_at end
  where id = p_assignment_id;

  update public.inventory_units
  set status = v_to_unit_status,
      updated_at = now(),
      last_inspected_at = case when p_action = 'return' then now() else last_inspected_at end
  where id = v_assignment.inventory_unit_id;

  insert into public.inventory_unit_events (
    inventory_unit_id, event_type, from_status, to_status, note, actor_id
  ) values (
    v_assignment.inventory_unit_id, 'booking_' || p_action, v_from_unit_status,
    v_to_unit_status, 'Booking ' || p_booking_id::text, p_actor_id
  );

  return p_assignment_id;
end;
$$;

revoke all on function public.assign_booking_inventory_unit(uuid, uuid, uuid, text) from public, anon, authenticated;
revoke all on function public.transition_booking_inventory_unit(uuid, uuid, text, uuid) from public, anon, authenticated;
grant execute on function public.assign_booking_inventory_unit(uuid, uuid, uuid, text) to service_role;
grant execute on function public.transition_booking_inventory_unit(uuid, uuid, text, uuid) to service_role;

create or replace function public.sync_booking_inventory_units_on_status()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_assignment record;
begin
  if new.status = old.status then
    return new;
  end if;

  if new.status = 'completed' and exists (
    select 1 from public.booking_inventory_unit_assignments
    where booking_id = new.id and status = 'handed_over'
  ) then
    raise exception 'Return assigned inventory units before completing this booking';
  end if;

  if new.status in ('cancelled', 'refunded') then
    for v_assignment in
      select id, inventory_unit_id
      from public.booking_inventory_unit_assignments
      where booking_id = new.id and status = 'assigned'
      for update
    loop
      update public.booking_inventory_unit_assignments
      set status = 'released', released_at = now()
      where id = v_assignment.id;

      update public.inventory_units
      set status = 'available', updated_at = now()
      where id = v_assignment.inventory_unit_id and status = 'reserved';

      insert into public.inventory_unit_events (
        inventory_unit_id, event_type, from_status, to_status, note
      ) values (
        v_assignment.inventory_unit_id, 'booking_release', 'reserved', 'available',
        'Booking ' || new.id::text || ' closed as ' || new.status
      );
    end loop;
  end if;

  return new;
end;
$$;

drop trigger if exists sync_booking_inventory_units_on_status on public.bookings;
create trigger sync_booking_inventory_units_on_status
before update of status on public.bookings
for each row execute function public.sync_booking_inventory_units_on_status();

revoke all on function public.sync_booking_inventory_units_on_status() from public, anon, authenticated;
