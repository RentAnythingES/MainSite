-- Add governed multi-category product discovery without changing product identity,
-- canonical routes, bookings, inventory, pricing, or the compatibility primary
-- category stored in products.category_id.

create table public.product_category_memberships (
  product_id uuid not null references public.products(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete restrict,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (product_id, category_id)
);

create unique index product_category_memberships_one_primary
  on public.product_category_memberships(product_id)
  where is_primary;

create index product_category_memberships_category
  on public.product_category_memberships(category_id, product_id);

comment on table public.product_category_memberships is
  'One primary category plus optional governed secondary discovery categories per product.';
comment on column public.product_category_memberships.is_primary is
  'Primary controls the compatibility hierarchy; secondary rows add discovery only.';

insert into public.product_category_memberships (product_id, category_id, is_primary)
select id, category_id, true
from public.products;

create or replace function public.sync_product_primary_category_membership()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  delete from public.product_category_memberships
   where product_id = new.id
     and category_id = new.category_id
     and not is_primary;

  update public.product_category_memberships
     set category_id = new.category_id,
         updated_at = now()
   where product_id = new.id
     and is_primary;

  if not found then
    insert into public.product_category_memberships (product_id, category_id, is_primary)
    values (new.id, new.category_id, true);
  end if;

  return new;
end;
$$;

create trigger products_sync_primary_category_membership
after insert or update of category_id on public.products
for each row execute function public.sync_product_primary_category_membership();

create or replace function public.replace_product_secondary_categories(
  p_product_id uuid,
  p_category_ids uuid[] default '{}'::uuid[]
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  primary_category_id uuid;
  normalized_category_ids uuid[] := coalesce(p_category_ids, '{}'::uuid[]);
begin
  select category_id
    into primary_category_id
    from public.products
   where id = p_product_id;

  if not found then
    raise exception 'Product % does not exist', p_product_id;
  end if;

  if primary_category_id = any(normalized_category_ids) then
    raise exception 'Primary category cannot also be a secondary category';
  end if;

  if cardinality(normalized_category_ids) <>
     (select count(distinct requested.category_id)
        from unnest(normalized_category_ids) as requested(category_id)) then
    raise exception 'Secondary category IDs must be unique';
  end if;

  if exists (
    select 1
      from unnest(normalized_category_ids) as requested(category_id)
      left join public.categories category on category.id = requested.category_id
     where category.id is null
  ) then
    raise exception 'One or more secondary categories do not exist';
  end if;

  delete from public.product_category_memberships
   where product_id = p_product_id
     and not is_primary;

  insert into public.product_category_memberships (product_id, category_id, is_primary)
  select p_product_id, requested.category_id, false
    from unnest(normalized_category_ids) as requested(category_id);
end;
$$;

create or replace function public.assert_product_primary_category_membership()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  affected_product_id uuid := coalesce(new.product_id, old.product_id);
  expected_category_id uuid;
  matching_primary_count integer;
begin
  select category_id
    into expected_category_id
    from public.products
   where id = affected_product_id;

  if not found then
    return null;
  end if;

  select count(*)
    into matching_primary_count
    from public.product_category_memberships
   where product_id = affected_product_id
     and is_primary
     and category_id = expected_category_id;

  if matching_primary_count <> 1 then
    raise exception 'Product % must have exactly one primary membership matching products.category_id', affected_product_id;
  end if;

  return null;
end;
$$;

create constraint trigger product_category_memberships_primary_guard
after insert or update or delete on public.product_category_memberships
deferrable initially deferred
for each row execute function public.assert_product_primary_category_membership();

alter table public.product_category_memberships enable row level security;

create policy product_category_memberships_public_read
  on public.product_category_memberships
  for select
  using (true);

grant select on public.product_category_memberships to anon, authenticated;
grant all on public.product_category_memberships to service_role;
revoke all on function public.replace_product_secondary_categories(uuid, uuid[]) from public, anon, authenticated;
grant execute on function public.replace_product_secondary_categories(uuid, uuid[]) to service_role;

do $$
declare
  product_count integer;
  primary_count integer;
begin
  select count(*) into product_count from public.products;
  select count(*) into primary_count
    from public.product_category_memberships membership
    join public.products product
      on product.id = membership.product_id
     and product.category_id = membership.category_id
   where membership.is_primary;

  if primary_count <> product_count then
    raise exception 'Primary membership backfill mismatch: products %, matching primaries %', product_count, primary_count;
  end if;
end
$$;
