-- Registered drivers are the only Telegram users allowed to claim a delivery
-- request. Customer details are never posted to the group.
create table if not exists public.delivery_drivers (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null check (char_length(trim(full_name)) between 2 and 120),
  phone text,
  telegram_user_id bigint not null unique,
  telegram_username text,
  is_active boolean not null default true,
  group_membership_status text not null default 'invited'
    check (group_membership_status in ('invited', 'active', 'removed')),
  invited_at timestamptz,
  joined_at timestamptz,
  removed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists delivery_drivers_active_telegram_user_id_idx
  on public.delivery_drivers (telegram_user_id)
  where is_active = true;

alter table public.delivery_drivers enable row level security;
revoke all on public.delivery_drivers from anon, authenticated;
