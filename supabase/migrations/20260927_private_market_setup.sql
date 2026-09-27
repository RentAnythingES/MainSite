-- Phase 1: private city setup. Apply after the installed multi-market and fulfillment migrations.
-- No existing market flags, prices, inventory, or booking records are changed.
-- The migration runner owns the transaction and ledger write.

create table public.market_audit_events (
  id uuid primary key default gen_random_uuid(),
  market_id uuid not null references public.markets(id),
  actor_id uuid not null,
  action text not null check (action in ('created', 'updated')),
  previous_config jsonb,
  next_config jsonb not null,
  created_at timestamptz not null default now()
);
create index market_audit_events_market_time_idx on public.market_audit_events(market_id, created_at desc);
alter table public.market_audit_events enable row level security;
revoke all on public.market_audit_events from public, anon, authenticated;
grant select, insert on public.market_audit_events to service_role;

create function public.save_private_market(
  p_actor_id uuid, p_config jsonb, p_market_id uuid default null,
  p_expected_updated_at timestamptz default null
) returns public.markets
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  prior public.markets;
  saved public.markets;
  locales text[];
begin
  if not exists (select 1 from auth.users where id = p_actor_id and raw_app_meta_data->>'role' = 'admin') then
    raise exception 'Platform administrator required' using errcode = '42501';
  end if;
  if jsonb_typeof(p_config) is distinct from 'object' or
    p_config - array['slug','name','country_code','timezone','currency','default_locale','supported_locales'] <> '{}'::jsonb then
    raise exception 'Unsupported market configuration' using errcode = '22023';
  end if;
  if jsonb_typeof(p_config->'supported_locales') is distinct from 'array' then
    raise exception 'Languages required' using errcode = '22023';
  end if;
  select array_agg(value) into locales from jsonb_array_elements_text(p_config->'supported_locales');
  if coalesce(p_config->>'slug','') !~ '^[a-z][a-z0-9]*(-[a-z0-9]+)*$'
    or length(p_config->>'slug') > 64
    or p_config->>'slug' ~ '^[a-z]{2,3}(-[a-z]{2})?$'
    or p_config->>'slug' = any(array['about','admin','api','blog','booking','colaboraciones','contact','cookies','discover','faq','how-it-works','internal','partners','privacy','product','refunds','rental','review','terms','newsletter','robots','sitemap'])
    or length(btrim(coalesce(p_config->>'name',''))) not between 2 and 100
    or coalesce(p_config->>'country_code','') !~ '^[A-Z]{2}$'
    or coalesce(p_config->>'currency','') <> 'eur'
    or coalesce(p_config->>'timezone','') !~ '^[A-Za-z_]+/[A-Za-z_]+(/[A-Za-z_]+)?$'
    or not exists(select 1 from pg_timezone_names where name = p_config->>'timezone')
    or coalesce(cardinality(locales),0) not between 1 and 2
    or not locales <@ array['en','es']::text[]
    or exists(select 1 from unnest(locales) l where l is null)
    or cardinality(locales) <> (select count(distinct l) from unnest(locales) l)
    or not coalesce((p_config->>'default_locale') = any(locales),false) then
    raise exception 'Invalid market configuration' using errcode = '22023';
  end if;
  if p_market_id is null then
    if p_expected_updated_at is not null then raise exception 'Unexpected revision' using errcode = '22023'; end if;
    insert into public.markets(slug,name,country_code,timezone,currency,default_locale,supported_locales,
      is_default,is_active,is_public,is_booking_enabled,is_indexable)
    values(p_config->>'slug',btrim(p_config->>'name'),p_config->>'country_code',p_config->>'timezone',
      p_config->>'currency',p_config->>'default_locale',locales,false,false,false,false,false)
    returning * into saved;
  else
    select * into prior from public.markets where id = p_market_id for update;
    if not found then raise exception 'Market not found' using errcode = 'P0002'; end if;
    if p_expected_updated_at is null or prior.updated_at <> p_expected_updated_at then
      raise exception 'Market changed; reload before saving' using errcode = '40001';
    end if;
    if prior.slug <> p_config->>'slug' then raise exception 'City slug is immutable' using errcode = '22023'; end if;
    -- Public/default/operating cities keep their operational configuration during Phase 1.
    if (prior.is_default or prior.is_active or prior.is_public or prior.is_booking_enabled or prior.is_indexable) and
      (prior.country_code <> p_config->>'country_code' or prior.timezone <> p_config->>'timezone' or
       prior.currency <> p_config->>'currency' or prior.default_locale <> p_config->>'default_locale' or
       prior.supported_locales <> locales) then
      raise exception 'Only the name of an operating city may be changed here' using errcode = '22023';
    end if;
    update public.markets set name=btrim(p_config->>'name'), country_code=p_config->>'country_code',
      timezone=p_config->>'timezone',currency=p_config->>'currency',default_locale=p_config->>'default_locale',
      supported_locales=locales where id=p_market_id returning * into saved;
  end if;
  insert into public.market_audit_events(market_id,actor_id,action,previous_config,next_config)
  values(saved.id,p_actor_id,case when p_market_id is null then 'created' else 'updated' end,
    case when p_market_id is null then null else to_jsonb(prior) end,to_jsonb(saved));
  return saved;
end $$;
revoke all on function public.save_private_market(uuid,jsonb,uuid,timestamptz) from public, anon, authenticated;
grant execute on function public.save_private_market(uuid,jsonb,uuid,timestamptz) to service_role;

-- Restrictive policies also constrain any pre-existing permissive read policy.
create policy "Public pickup requires public market" on public.pickup_locations
  as restrictive for select to anon, authenticated using (
    is_active and exists(select 1 from public.markets m where m.id=market_id and m.is_active and m.is_public)
  );
create policy "Public zone requires public market" on public.service_zones
  as restrictive for select to anon, authenticated using (
    is_active and automatic_checkout_enabled and
    exists(select 1 from public.markets m where m.id=market_id and m.is_active and m.is_public)
  );

-- RLS filters rows, not fields. Keep operational notes/contact details service-only.
revoke select on public.pickup_locations, public.service_zones from anon, authenticated;
grant select(id,market_id,slug,name,address,city,pickup_instructions,customer_instructions,
  lead_time_hours,opening_hours,sort_order,is_active) on public.pickup_locations to anon, authenticated;
grant select(id,market_id,slug,name,city,description,customer_instructions,lead_time_hours,
  same_day_cutoff,delivery_window,collection_window,delivery_fee_cents,collection_fee_cents,
  roundtrip_fee_cents,express_surcharge_cents,minimum_order_cents,automatic_checkout_enabled,
  sort_order,is_active) on public.service_zones to anon, authenticated;
