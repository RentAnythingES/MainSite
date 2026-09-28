alter table public.agent_messages add column read_at timestamptz;
create table public.agent_unavailability (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.rental_agents(id) on delete cascade,
  start_date date not null,
  end_date date not null,
  reason text not null default '' check(length(reason)<=500),
  created_at timestamptz not null default now(),
  check(isfinite(start_date) and isfinite(end_date) and end_date>=start_date)
);
create index agent_unavailability_agent_dates on public.agent_unavailability(agent_id,start_date,end_date);
alter table public.agent_unavailability enable row level security;
revoke all on public.agent_unavailability from anon,authenticated;
grant all on public.agent_unavailability to service_role;

create function public.agent_availability_action(p_agent_id uuid,p_action text,p_id uuid default null,p_start date default null,p_end date default null,p_reason text default '')
returns void language plpgsql security definer set search_path='' as $$
declare a public.rental_agents;
begin
  select * into a from public.rental_agents where id=p_agent_id for update;
  if a.id is null or not a.is_active or a.auth_locked or a.must_change_password or a.profile_completed_at is null then raise exception 'Complete onboarding before updating availability'; end if;
  if p_action='remove' then
    delete from public.agent_unavailability where id=p_id and agent_id=a.id;
    if not found then raise exception 'Unavailable period not found'; end if;
  elsif p_action='add' then
    if p_start is null or p_end is null or not isfinite(p_start) or not isfinite(p_end) or p_end<p_start then raise exception 'Choose a valid date range'; end if;
    if exists(select 1 from public.agent_order_assignments x join public.bookings b on b.id=x.booking_id
      where x.agent_id=a.id and x.status in ('offered','accepted') and b.status in ('paid','delivering','active','returning') and b.start_date<=p_end and b.end_date>=p_start) then
      raise exception 'An open assignment overlaps these dates. Decline the offer or ask the admin to reassign it first';
    end if;
    if exists(select 1 from public.agent_unavailability where agent_id=a.id and start_date<=p_end and end_date>=p_start) then raise exception 'These dates overlap an existing unavailable period'; end if;
    insert into public.agent_unavailability(agent_id,start_date,end_date,reason) values(a.id,p_start,p_end,p_reason);
  else raise exception 'Unsupported availability action'; end if;
  insert into public.agent_audit_events(agent_id,actor_user_id,action,details)
    values(a.id,a.user_id,'availability_'||p_action,jsonb_build_object('start',p_start,'end',p_end,'id',p_id));
end $$;
revoke all on function public.agent_availability_action(uuid,text,uuid,date,date,text) from public,anon,authenticated;
grant execute on function public.agent_availability_action(uuid,text,uuid,date,date,text) to service_role;

create function public.check_agent_assignment_availability()
returns trigger language plpgsql security definer set search_path='' as $$
begin
  perform 1 from public.rental_agents where id=new.agent_id for update;
  if new.status in ('offered','accepted') and exists(select 1 from public.agent_unavailability u join public.bookings b on b.id=new.booking_id
    where u.agent_id=new.agent_id and u.start_date<=b.end_date and u.end_date>=b.start_date) then raise exception 'The agent is unavailable during this rental. Choose another agent or update availability first'; end if;
  return new;
end $$;
create trigger agent_assignment_availability before insert or update of agent_id,status on public.agent_order_assignments
  for each row execute function public.check_agent_assignment_availability();
revoke all on function public.check_agent_assignment_availability() from public,anon,authenticated;

create function public.mark_agent_messages_read(p_agent_id uuid,p_ids uuid[])
returns void language plpgsql security definer set search_path='' as $$
begin
  update public.agent_messages m set read_at=now()
    where m.id=any(p_ids) and m.agent_id=p_agent_id and m.direction='customer' and m.read_at is null
    and exists(select 1 from public.agent_order_assignments x join public.bookings b on b.id=x.booking_id
      join public.rental_agents a on a.id=x.agent_id join public.agent_territories t on t.agent_id=a.id and t.market_id=b.market_id
      where x.booking_id=m.booking_id and x.agent_id=p_agent_id and x.status='accepted'
        and a.is_active and not a.auth_locked and not a.must_change_password and a.profile_completed_at is not null);
end $$;
revoke all on function public.mark_agent_messages_read(uuid,uuid[]) from public,anon,authenticated;
grant execute on function public.mark_agent_messages_read(uuid,uuid[]) to service_role;
