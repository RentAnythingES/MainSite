-- Product-level fixed-asset register. Purchase figures are entered by staff;
-- no historic acquisition cost or date is inferred from catalogue data.
create table if not exists public.product_asset_accounting (
  product_id uuid primary key references public.products(id) on delete cascade,
  purchase_date date,
  purchase_cost_cents integer not null default 0 check (purchase_cost_cents >= 0),
  purchased_by text not null default 'Fadi' check (purchased_by in ('Fadi', 'Johannes')),
  useful_life_months integer not null default 36 check (useful_life_months > 0 and useful_life_months <= 240),
  residual_value_cents integer not null default 0 check (residual_value_cents >= 0),
  depreciation_method text not null default 'straight_line' check (depreciation_method = 'straight_line'),
  notes text,
  updated_at timestamptz not null default now(),
  check (residual_value_cents <= purchase_cost_cents)
);

insert into public.product_asset_accounting (product_id)
select id from public.products
on conflict (product_id) do nothing;

create or replace function public.create_product_asset_accounting()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  insert into public.product_asset_accounting (product_id)
  values (new.id)
  on conflict (product_id) do nothing;
  return new;
end;
$$;

drop trigger if exists product_asset_accounting_for_new_product on public.products;
create trigger product_asset_accounting_for_new_product
  after insert on public.products
  for each row execute function public.create_product_asset_accounting();

alter table public.product_asset_accounting enable row level security;
revoke all on public.product_asset_accounting from anon, authenticated;

drop trigger if exists product_asset_accounting_updated_at on public.product_asset_accounting;
create trigger product_asset_accounting_updated_at
  before update on public.product_asset_accounting
  for each row execute function public.update_updated_at();
