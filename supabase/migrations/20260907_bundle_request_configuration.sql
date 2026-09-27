-- Additive: existing request names and dates remain readable by older staff clients.
alter table public.bundle_requests
  add column if not exists request_key uuid,
  add column if not exists request_hash text,
  add column if not exists selection_snapshot jsonb,
  add column if not exists start_time time,
  add column if not exists end_time time,
  add column if not exists booking_id uuid references public.bookings(id) on delete set null;

create unique index if not exists bundle_requests_request_key_idx
  on public.bundle_requests(request_key) where request_key is not null;

comment on column public.bundle_requests.selection_snapshot is
  'Versioned component IDs, numeric quantities and canonical names captured when requested. Legacy name arrays are retained.';
comment on column public.bundle_requests.request_key is
  'Client retry key. A key can be replayed only when its normalised request hash matches.';
comment on column public.bundle_requests.booking_id is
  'Optional staff-verified booking attribution; not a reservation or payment instruction.';
