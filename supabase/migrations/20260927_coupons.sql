-- Coupons are server/admin-only. Draft pricing snapshots preserve the agreed discount.
create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[A-Z0-9_-]{3,40}$'),
  discount_type text not null check (discount_type in ('percentage', 'fixed')),
  value integer not null check (value > 0 and (discount_type <> 'percentage' or value <= 10000)),
  scope text not null check (scope in ('all', 'products', 'categories')),
  product_ids uuid[] not null default '{}',
  category_ids uuid[] not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  check (
    (scope = 'all' and cardinality(product_ids) = 0 and cardinality(category_ids) = 0) or
    (scope = 'products' and cardinality(product_ids) > 0 and cardinality(category_ids) = 0) or
    (scope = 'categories' and cardinality(category_ids) > 0 and cardinality(product_ids) = 0)
  )
);
alter table public.coupons enable row level security;
revoke all on public.coupons from anon, authenticated;
grant all on public.coupons to service_role;
