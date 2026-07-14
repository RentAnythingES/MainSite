create table if not exists public.monitoring_runs (
  id uuid primary key default gen_random_uuid(),
  status text not null check (status in ('healthy','warning','error')),
  fingerprint text not null,
  issues jsonb not null default '[]'::jsonb,
  metrics jsonb not null default '{}'::jsonb,
  alert_sent boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists monitoring_runs_created_idx on public.monitoring_runs(created_at desc);
create index if not exists monitoring_runs_fingerprint_idx on public.monitoring_runs(fingerprint, created_at desc);
alter table public.monitoring_runs enable row level security;
revoke all on public.monitoring_runs from anon, authenticated;
