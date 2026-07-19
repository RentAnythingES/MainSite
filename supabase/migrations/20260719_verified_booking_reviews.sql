create table if not exists public.booking_reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references public.bookings(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  public_token uuid not null unique default gen_random_uuid(),
  locale text not null default 'en' check (locale in ('en', 'es')),
  rating smallint check (rating between 1 and 5),
  title text check (char_length(title) <= 120),
  review_body text check (char_length(review_body) <= 2000),
  display_name text check (char_length(display_name) <= 80),
  consent_to_publish boolean not null default false,
  status text not null default 'invited'
    check (status in ('invited', 'submitted', 'approved', 'rejected')),
  invited_at timestamptz not null default now(),
  submitted_at timestamptz,
  moderated_at timestamptz,
  moderated_by uuid,
  moderation_notes text check (char_length(moderation_notes) <= 1000),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists booking_reviews_status_submitted_idx
  on public.booking_reviews(status, submitted_at desc);

create index if not exists booking_reviews_product_status_idx
  on public.booking_reviews(product_id, status, published_at desc);

alter table public.booking_reviews enable row level security;
revoke all on public.booking_reviews from anon, authenticated;

comment on table public.booking_reviews is
  'Tokenized post-rental feedback. Public display requires consent_to_publish and approved status.';
