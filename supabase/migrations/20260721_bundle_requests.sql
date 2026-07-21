create table if not exists public.bundle_requests (
  id uuid primary key default gen_random_uuid(),
  request_ref text not null unique,
  bundle_slug text not null check (bundle_slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  bundle_name text not null check (char_length(bundle_name) between 1 and 160),
  customer_name text not null check (char_length(customer_name) between 1 and 120),
  customer_email text not null check (char_length(customer_email) between 3 and 254),
  customer_phone text check (customer_phone is null or char_length(customer_phone) <= 50),
  start_date date not null,
  end_date date not null,
  accommodation_area text not null check (char_length(accommodation_area) between 1 and 240),
  selected_items jsonb not null default '[]'::jsonb check (jsonb_typeof(selected_items) = 'array'),
  selected_addons jsonb not null default '[]'::jsonb check (jsonb_typeof(selected_addons) = 'array'),
  customer_notes text check (customer_notes is null or char_length(customer_notes) <= 2000),
  locale text not null default 'en' check (locale in ('en', 'es')),
  status text not null default 'new' check (status in ('new', 'contacted', 'quoted', 'converted', 'closed')),
  consent_version text not null,
  consent_text text not null check (char_length(consent_text) between 1 and 500),
  consented_at timestamptz not null default now(),
  source text not null default 'kit_configurator',
  source_path text check (source_path is null or char_length(source_path) <= 500),
  ip_address inet,
  user_agent text check (user_agent is null or char_length(user_agent) <= 1000),
  admin_notes text check (admin_notes is null or char_length(admin_notes) <= 2000),
  notification_email_sent boolean not null default false,
  confirmation_email_sent boolean not null default false,
  contacted_at timestamptz,
  quoted_at timestamptz,
  converted_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bundle_requests_dates_check check (end_date >= start_date)
);

create index if not exists bundle_requests_status_created_idx
  on public.bundle_requests(status, created_at desc);

create index if not exists bundle_requests_email_created_idx
  on public.bundle_requests(customer_email, created_at desc);

alter table public.bundle_requests enable row level security;
revoke all on public.bundle_requests from anon, authenticated;

comment on table public.bundle_requests is
  'Private customer kit requests captured before WhatsApp handoff and managed by authenticated staff.';
