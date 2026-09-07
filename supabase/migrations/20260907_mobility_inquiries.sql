-- Admin-only register for mobility leads arriving through WhatsApp, email,
-- phone, the website, or partners. No public write policy is granted.

create table if not exists public.mobility_inquiries (
  id uuid primary key default uuid_generate_v4(),
  item_requested text not null check (char_length(item_requested) between 1 and 200),
  start_date date,
  end_date date,
  location text,
  language text not null default 'en' check (language in ('en', 'es', 'other')),
  source_channel text not null check (source_channel in ('whatsapp', 'email', 'phone', 'website', 'partner', 'other')),
  landing_page text,
  source_detail text,
  customer_name text,
  customer_contact text,
  status text not null default 'new' check (status in ('new', 'contacted', 'quoted', 'won', 'lost')),
  outcome text,
  loss_reason text check (loss_reason is null or loss_reason in ('no_stock', 'price', 'fit_suitability', 'timing', 'delivery_area', 'no_response', 'competitor', 'other')),
  admin_notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint mobility_inquiries_date_order check (start_date is null or end_date is null or end_date > start_date),
  constraint mobility_inquiries_loss_reason check (status = 'lost' or loss_reason is null)
);

create index if not exists mobility_inquiries_created_at_idx
  on public.mobility_inquiries(created_at desc);

create index if not exists mobility_inquiries_status_idx
  on public.mobility_inquiries(status, created_at desc);

alter table public.mobility_inquiries enable row level security;

revoke all on public.mobility_inquiries from anon, authenticated;
grant all on public.mobility_inquiries to service_role;

comment on table public.mobility_inquiries is
  'Admin-entered mobility lead register for demand, conversion, capacity-loss and source analysis.';
