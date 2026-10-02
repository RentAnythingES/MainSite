alter table public.delivery_requests
  add column if not exists first_notified_at timestamptz,
  add column if not exists last_notified_at timestamptz,
  add column if not exists admin_alerted_at timestamptz,
  add column if not exists dispatch_lock_token uuid,
  add column if not exists dispatch_lock_until timestamptz;

-- Existing broadcasts must not be treated as new jobs after deployment.
update public.delivery_requests
set first_notified_at = created_at, last_notified_at = created_at
where group_message_id is not null and first_notified_at is null;

create or replace function public.acquire_driver_dispatch(p_request_id uuid, p_token uuid)
returns setof public.delivery_requests
language sql security definer set search_path = public as $$
  update public.delivery_requests r
  set dispatch_lock_token = p_token, dispatch_lock_until = now() + interval '2 minutes'
  where r.id = p_request_id and r.status = 'open'
    and (r.dispatch_lock_until is null or r.dispatch_lock_until < now())
    and exists (
      select 1 from public.bookings b where b.id = r.booking_id
        and b.status in ('paid', 'delivering', 'active', 'returning')
        and ((r.event_type = 'delivery' and b.fulfillment_mode in ('delivery_only', 'delivery_and_collection')
              and r.event_date = (b.rental_start_at at time zone 'Europe/Madrid')::date)
          or (r.event_type = 'pickup' and b.fulfillment_mode = 'delivery_and_collection'
              and r.event_date = (b.rental_end_at at time zone 'Europe/Madrid')::date))
    )
  returning r.*;
$$;
revoke all on function public.acquire_driver_dispatch(uuid, uuid) from public, anon, authenticated;
grant execute on function public.acquire_driver_dispatch(uuid, uuid) to service_role;

-- Previously posted buttons must not assign cancelled or rescheduled work.
create or replace function public.validate_delivery_request_claim()
returns trigger language plpgsql set search_path = public as $$
begin
  if new.status = 'claimed' and old.status = 'open' and not exists (
    select 1 from public.bookings b where b.id = new.booking_id
      and b.status in ('paid', 'delivering', 'active', 'returning')
      and ((new.event_type = 'delivery' and b.fulfillment_mode in ('delivery_only', 'delivery_and_collection')
            and new.event_date = (b.rental_start_at at time zone 'Europe/Madrid')::date)
        or (new.event_type = 'pickup' and b.fulfillment_mode = 'delivery_and_collection'
            and new.event_date = (b.rental_end_at at time zone 'Europe/Madrid')::date))
  ) then
    return null;
  end if;
  return new;
end;
$$;
drop trigger if exists validate_delivery_request_claim on public.delivery_requests;
create trigger validate_delivery_request_claim before update on public.delivery_requests
for each row execute function public.validate_delivery_request_claim();

create or replace function public.cancel_stale_delivery_requests()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.delivery_requests r set status = 'cancelled'
  where r.booking_id = new.id and r.status in ('open', 'claimed') and (
    new.status in ('cancelled', 'refunded', 'completed')
    or (r.event_type = 'delivery' and (new.fulfillment_mode not in ('delivery_only', 'delivery_and_collection')
      or r.event_date is distinct from (new.rental_start_at at time zone 'Europe/Madrid')::date))
    or (r.event_type = 'pickup' and (new.fulfillment_mode is distinct from 'delivery_and_collection'
      or r.event_date is distinct from (new.rental_end_at at time zone 'Europe/Madrid')::date))
  );
  return new;
end;
$$;
drop trigger if exists cancel_stale_delivery_requests on public.bookings;
create trigger cancel_stale_delivery_requests after update of status, fulfillment_mode, rental_start_at, rental_end_at
on public.bookings for each row execute function public.cancel_stale_delivery_requests();
