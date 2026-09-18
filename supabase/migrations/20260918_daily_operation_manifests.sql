-- Makes the daily Telegram operations manifest idempotent even if Vercel retries the cron.
create table if not exists public.daily_operation_manifests (
  id uuid primary key default uuid_generate_v4(),
  manifest_date date not null,
  channel text not null default 'telegram',
  sent_at timestamptz not null default now(),
  unique (manifest_date, channel)
);

alter table public.daily_operation_manifests enable row level security;
revoke all on public.daily_operation_manifests from anon, authenticated;
