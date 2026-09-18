-- Group delivery dispatch: one row per delivery/pick-up request posted to the
-- Telegram courier group, with an atomic claim so only one courier can take it.
create table if not exists public.delivery_requests (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  event_type text not null check (event_type in ('delivery', 'pickup')),
  event_date date not null,
  status text not null default 'open' check (status in ('open', 'claimed', 'cancelled')),
  group_chat_id text,
  group_message_id bigint,
  claimed_by_telegram_user_id bigint,
  claimed_by_label text,
  claimed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (booking_id, event_type, event_date)
);

alter table public.delivery_requests enable row level security;
revoke all on public.delivery_requests from anon, authenticated;
