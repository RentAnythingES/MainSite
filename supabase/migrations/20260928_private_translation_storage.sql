-- Private translation storage. Does not enable routes, booking locales or markets.
-- Applied by the migration runner inside its transaction; no production writes here.
create table public.locales (
  code text primary key check (code ~ '^[a-z]{2,3}(-[A-Z]{2})?$'),
  name text not null,
  is_public boolean not null default false
);
insert into public.locales(code,name,is_public) values
  ('en','English',true), ('es','Español',true), ('de','Deutsch',false);
alter table public.locales enable row level security;
create policy "Public read enabled locales" on public.locales for select
  to anon, authenticated using (is_public);
revoke all on public.locales from public, anon, authenticated;
grant select on public.locales to anon, authenticated;
grant all on public.locales to service_role;

create table public.market_locales (
  market_id uuid not null references public.markets(id) on delete cascade,
  locale text not null references public.locales(code),
  is_public boolean not null default false,
  is_booking_enabled boolean not null default false,
  is_indexable boolean not null default false,
  primary key(market_id,locale),
  check (not is_booking_enabled or is_public),
  check (not is_indexable or is_public)
);
-- Preserve existing settings; legacy markets.supported_locales remains authoritative
-- until application readers are deliberately migrated to this additional gate.
insert into public.market_locales(market_id,locale,is_public,is_booking_enabled,is_indexable)
select m.id,l.code,m.is_public,m.is_booking_enabled and m.is_public,m.is_indexable
from public.markets m join public.locales l on l.code = any(m.supported_locales);
insert into public.market_locales(market_id,locale)
select id,'de' from public.markets;
alter table public.market_locales enable row level security;
create policy "Public read enabled market locales" on public.market_locales for select
  to anon, authenticated using (
    is_public and exists(select 1 from public.locales l where l.code=locale and l.is_public)
    and exists(select 1 from public.markets m where m.id=market_id and m.is_active and m.is_public)
  );
revoke all on public.market_locales from public, anon, authenticated;
grant select on public.market_locales to anon, authenticated;
grant all on public.market_locales to service_role;

alter table public.product_localizations drop constraint product_localizations_locale_check;
alter table public.product_faqs drop constraint product_faqs_locale_check;
alter table public.product_localizations add constraint product_localizations_locale_fkey
  foreign key(locale) references public.locales(code);
alter table public.product_faqs add constraint product_faqs_locale_fkey
  foreign key(locale) references public.locales(code);

-- An omitted state retains the existing EN/ES authoring workflow. New languages
-- always start as drafts. Explicit state is reserved for trusted server writers.
create function public.initialize_translation_publication() returns trigger
language plpgsql set search_path = public as $$
begin
  if new.publication_status is null then
    new.publication_status := case when new.locale in ('en','es') then 'published' else 'draft' end;
  end if;
  return new;
end $$;
revoke all on function public.initialize_translation_publication() from public, anon, authenticated;

alter table public.product_localizations add column publication_status text
  check (publication_status in ('draft','reviewed','published','stale'));
alter table public.product_faqs add column publication_status text
  check (publication_status in ('draft','reviewed','published','stale'));
update public.product_localizations set publication_status='published';
update public.product_faqs set publication_status='published';
alter table public.product_localizations alter column publication_status set not null;
alter table public.product_faqs alter column publication_status set not null;
create trigger initialize_translation_publication before insert on public.product_localizations
  for each row execute function public.initialize_translation_publication();
create trigger initialize_translation_publication before insert on public.product_faqs
  for each row execute function public.initialize_translation_publication();

-- Restrictive policies also constrain any existing permissive SELECT policies.
create policy "Translation publication gate" on public.product_localizations
  as restrictive for select to anon, authenticated using (
    publication_status='published'
    and exists(select 1 from public.locales l where l.code=locale and l.is_public)
  );
create policy "FAQ publication gate" on public.product_faqs
  as restrictive for select to anon, authenticated using (
    publication_status='published'
    and exists(select 1 from public.locales l where l.code=locale and l.is_public)
  );
