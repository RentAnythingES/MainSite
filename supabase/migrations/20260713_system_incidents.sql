create table if not exists public.system_incidents (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  severity text not null default 'error'
    check (severity in ('info', 'warning', 'error', 'critical')),
  event_type text not null,
  message text not null,
  context jsonb not null default '{}'::jsonb,
  resolved_at timestamptz,
  resolved_by uuid,
  created_at timestamptz not null default now()
);

create index if not exists system_incidents_unresolved_idx
  on public.system_incidents (created_at desc)
  where resolved_at is null;

alter table public.system_incidents enable row level security;

revoke all on table public.system_incidents from anon, authenticated;

comment on table public.system_incidents is
  'Server-only operational incident trail for payment, webhook, and booking failures.';
