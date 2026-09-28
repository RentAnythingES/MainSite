create table public.agent_applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  country_code text not null check (country_code ~ '^[A-Z]{2}$'),
  city text not null,
  business_name text not null default '',
  area_of_operations text not null,
  experience text not null default '',
  equipment text not null default '',
  consent_at timestamptz not null default now(),
  consent_version text not null default 'agent-application-v1',
  status text not null default 'new' check (status in ('new','reviewing','approved','rejected')),
  admin_notes text not null default '',
  created_at timestamptz not null default now()
);

create table public.rental_agents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id),
  application_id uuid unique references public.agent_applications(id),
  email text not null unique,
  full_name text not null,
  phone text not null default '',
  contact_email text not null default '',
  address text not null default '',
  business_name text not null default '',
  area_of_operations text not null default '',
  languages text not null default '',
  availability_notes text not null default '',
  is_active boolean not null default true,
  must_change_password boolean not null default true,
  security_version integer not null default 1,
  auth_locked boolean not null default false,
  profile_completed_at timestamptz,
  created_at timestamptz not null default now()
);
create table public.agent_territories (
  agent_id uuid not null references public.rental_agents(id) on delete cascade,
  market_id uuid not null references public.markets(id),
  primary key (agent_id, market_id)
);
create table public.agent_sessions (
  token_hash text primary key,
  agent_id uuid not null references public.rental_agents(id) on delete cascade,
  expires_at timestamptz not null,
  security_version integer not null,
  created_at timestamptz not null default now()
);
create index agent_sessions_agent_idx on public.agent_sessions(agent_id);
create table public.agent_drivers (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.rental_agents(id),
  name text not null,
  phone text not null,
  vehicle text not null default '',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
create table public.agent_order_assignments (
  booking_id uuid primary key references public.bookings(id),
  agent_id uuid not null references public.rental_agents(id),
  status text not null default 'offered' check (status in ('offered','accepted','declined')),
  decline_reason text not null default '',
  delivery_driver_id uuid references public.agent_drivers(id),
  collection_driver_id uuid references public.agent_drivers(id),
  delivery_scheduled_at timestamptz,
  collection_scheduled_at timestamptz,
  customer_token uuid not null unique default gen_random_uuid(),
  assigned_at timestamptz not null default now(),
  assigned_by uuid references auth.users(id)
);
create index agent_order_assignments_agent_idx on public.agent_order_assignments(agent_id);
create table public.agent_order_events (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id),
  agent_id uuid not null references public.rental_agents(id),
  actor_user_id uuid references auth.users(id),
  action text not null,
  note text not null default '',
  created_at timestamptz not null default now()
);
create table public.agent_messages (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id),
  agent_id uuid not null references public.rental_agents(id),
  direction text not null check (direction in ('agent','customer')),
  body text not null check (length(body) between 1 and 5000),
  status text not null default 'queued' check (status in ('queued','sent','failed','received')),
  provider_id text,
  created_at timestamptz not null default now()
);
create index agent_messages_booking_idx on public.agent_messages(booking_id, created_at);
create table public.agent_audit_events (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid references public.rental_agents(id),
  actor_user_id uuid references auth.users(id),
  action text not null,
  details jsonb not null default '{}',
  created_at timestamptz not null default now()
);

do $$ declare t text; begin
  foreach t in array array['agent_applications','rental_agents','agent_territories','agent_sessions','agent_drivers','agent_order_assignments','agent_order_events','agent_messages','agent_audit_events'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on public.%I from anon, authenticated', t);
    execute format('grant all on public.%I to service_role', t);
  end loop;
end $$;

create function public.assign_agent_order(p_agent_id uuid, p_booking_id uuid, p_actor uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare b public.bookings; a public.rental_agents;
begin
  select * into b from public.bookings where id = p_booking_id for update;
  select * into a from public.rental_agents where id = p_agent_id for update;
  if b.id is null or a.id is null or not a.is_active or b.status not in ('paid','delivering','active','returning') then
    raise exception 'Choose an active agent and an open paid booking';
  end if;
  if not exists(select 1 from public.agent_territories where agent_id = a.id and market_id = b.market_id) then
    raise exception 'This booking is outside the agent territory';
  end if;
  insert into public.agent_order_assignments(booking_id,agent_id,assigned_by)
    values(b.id,a.id,p_actor)
    on conflict(booking_id) do update set agent_id = excluded.agent_id, assigned_by = p_actor,
      assigned_at = now(), status = 'offered', decline_reason = '', customer_token = gen_random_uuid(),
      delivery_driver_id = null, collection_driver_id = null, delivery_scheduled_at = null, collection_scheduled_at = null;
  insert into public.agent_order_events(booking_id,agent_id,actor_user_id,action) values(b.id,a.id,p_actor,'assigned');
end $$;
revoke all on function public.assign_agent_order(uuid,uuid,uuid) from public, anon, authenticated;
grant execute on function public.assign_agent_order(uuid,uuid,uuid) to service_role;

create function public.agent_order_action(p_agent_id uuid, p_booking_id uuid, p_action text, p_payload jsonb default '{}')
returns jsonb language plpgsql security definer set search_path = '' as $$
declare a public.rental_agents; b public.bookings; assignment public.agent_order_assignments;
  target public.booking_status; note text := left(coalesce(p_payload->>'note',''),2000);
  delivery_driver uuid; collection_driver uuid; delivery_at timestamptz; collection_at timestamptz;
begin
  select * into b from public.bookings where id = p_booking_id for update;
  select * into a from public.rental_agents where id = p_agent_id for update;
  select * into assignment from public.agent_order_assignments where booking_id = p_booking_id and agent_id = p_agent_id for update;
  if a.id is null or not a.is_active or a.auth_locked or a.must_change_password or a.profile_completed_at is null
     or b.id is null or assignment.booking_id is null
     or not exists(select 1 from public.agent_territories where agent_id = a.id and market_id = b.market_id) then
    raise exception 'Order access denied';
  end if;
  if b.status not in ('paid','delivering','active','returning') then raise exception 'Order is no longer open'; end if;
  if p_action in ('accept','decline') then
    if assignment.status <> 'offered' then raise exception 'This offer has already been answered'; end if;
    if p_action = 'decline' and length(trim(note)) < 3 then raise exception 'Enter a reason for declining'; end if;
    update public.agent_order_assignments set status = case when p_action = 'accept' then 'accepted' else 'declined' end,
      decline_reason = case when p_action = 'decline' then note else '' end where booking_id = b.id;
  else
    if assignment.status <> 'accepted' then raise exception 'Accept this assignment first'; end if;
    if p_action = 'status' then
      target := (p_payload->>'status')::public.booking_status;
      if target is null or target not in ('delivering','active','returning','completed') then raise exception 'Agents cannot change payments or cancel orders'; end if;
      if b.requires_confirmation and b.confirmation_status is distinct from 'approved' then raise exception 'Admin confirmation is still required'; end if;
      perform public.transition_booking_status(b.id,b.status,target,'agent',a.user_id);
    elsif p_action = 'schedule' then
      delivery_driver := nullif(p_payload->>'deliveryDriverId','')::uuid;
      collection_driver := nullif(p_payload->>'collectionDriverId','')::uuid;
      delivery_at := nullif(p_payload->>'deliveryAt','')::timestamptz;
      collection_at := nullif(p_payload->>'collectionAt','')::timestamptz;
      if exists(select 1 from unnest(array[delivery_driver,collection_driver]) d(id)
        where d.id is not null and not exists(select 1 from public.agent_drivers where id = d.id and agent_id = a.id and is_active)) then raise exception 'Choose one of your active drivers'; end if;
      if delivery_at is not null and collection_at is not null and collection_at <= delivery_at then raise exception 'Collection must follow delivery'; end if;
      update public.agent_order_assignments set delivery_driver_id = delivery_driver, collection_driver_id = collection_driver,
        delivery_scheduled_at = delivery_at, collection_scheduled_at = collection_at where booking_id = b.id;
    elsif p_action = 'note' then
      if length(trim(note)) < 1 then raise exception 'Enter an operational note'; end if;
    elsif p_action = 'message' then
      if length(trim(coalesce(p_payload->>'body',''))) not between 1 and 5000 then raise exception 'Enter a message of up to 5000 characters'; end if;
      insert into public.agent_messages(id,booking_id,agent_id,direction,body)
        values((p_payload->>'messageId')::uuid,b.id,a.id,'agent',p_payload->>'body') on conflict(id) do nothing;
    else raise exception 'Unsupported action'; end if;
  end if;
  insert into public.agent_order_events(booking_id,agent_id,actor_user_id,action,note)
    values(b.id,a.id,a.user_id,p_action,case when p_action = 'status' then target::text else note end);
  return jsonb_build_object('ok',true,'status',coalesce(target,b.status));
end $$;
revoke all on function public.agent_order_action(uuid,uuid,text,jsonb) from public, anon, authenticated;
grant execute on function public.agent_order_action(uuid,uuid,text,jsonb) to service_role;

create function public.set_agent_territories(p_agent_id uuid, p_markets uuid[])
returns void language plpgsql security definer set search_path = '' as $$
begin
  perform 1 from public.rental_agents where id = p_agent_id for update;
  if not found then raise exception 'Agent not found'; end if;
  if cardinality(p_markets) < 1 then raise exception 'Assign at least one city'; end if;
  if exists(select 1 from public.agent_order_assignments a join public.bookings b on b.id=a.booking_id
    where a.agent_id=p_agent_id and a.status <> 'declined' and b.status in ('paid','delivering','active','returning') and not(b.market_id=any(p_markets))) then
    raise exception 'Reassign open orders before removing their city';
  end if;
  delete from public.agent_territories where agent_id=p_agent_id;
  insert into public.agent_territories(agent_id,market_id) select p_agent_id,unnest(p_markets);
end $$;
revoke all on function public.set_agent_territories(uuid,uuid[]) from public,anon,authenticated;
grant execute on function public.set_agent_territories(uuid,uuid[]) to service_role;

create function public.reply_agent_message(p_token uuid,p_body text,p_message_id uuid)
returns void language plpgsql security definer set search_path='' as $$
declare x public.agent_order_assignments; b public.bookings; a public.rental_agents;
begin
  select b1.* into b from public.bookings b1 join public.agent_order_assignments x1 on x1.booking_id=b1.id where x1.customer_token=p_token for update of b1;
  select a1.* into a from public.rental_agents a1 join public.agent_order_assignments x1 on x1.agent_id=a1.id where x1.customer_token=p_token for update of a1;
  select * into x from public.agent_order_assignments where customer_token=p_token for update;
  if x.booking_id is null or x.status <> 'accepted' or not a.is_active or b.status not in ('paid','delivering','active','returning')
    or not exists(select 1 from public.agent_territories where agent_id=a.id and market_id=b.market_id) then raise exception 'Conversation unavailable'; end if;
  insert into public.agent_messages(id,booking_id,agent_id,direction,body,status) values(p_message_id,b.id,a.id,'customer',p_body,'received') on conflict(id) do nothing;
end $$;
revoke all on function public.reply_agent_message(uuid,text,uuid) from public,anon,authenticated;
grant execute on function public.reply_agent_message(uuid,text,uuid) to service_role;
