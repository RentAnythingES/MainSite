-- Tracks which delivery/pick-up reminder notifications have already been sent,
-- so the daily cron stays idempotent even if it runs more than once for the same day.
create table if not exists public.booking_reminder_notifications (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  event_type text not null check (event_type in ('delivery', 'pickup')),
  event_date date not null,
  channel text not null default 'telegram',
  sent_at timestamptz not null default now(),
  unique (booking_id, event_type, event_date, channel)
);

create index if not exists booking_reminder_notifications_lookup_idx
  on public.booking_reminder_notifications (event_date, event_type);

alter table public.booking_reminder_notifications enable row level security;
revoke all on public.booking_reminder_notifications from anon, authenticated;
