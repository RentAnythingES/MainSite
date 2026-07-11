-- RentAnything.es — Booking operations checklist
-- Additive table for internal per-booking handoff/return tasks.

create table if not exists booking_ops_tasks (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid not null references bookings(id) on delete cascade,
  task_key text not null,
  label text not null,
  sort_order int not null default 0,
  is_done boolean not null default false,
  completed_at timestamptz,
  completed_by uuid,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint booking_ops_tasks_task_key_check check (
    task_key in (
      'customer_contacted',
      'equipment_prepared',
      'handoff_confirmed',
      'return_scheduled',
      'return_inspected'
    )
  ),
  constraint booking_ops_tasks_unique_key unique (booking_id, task_key)
);

create index if not exists idx_booking_ops_tasks_booking
  on booking_ops_tasks (booking_id, sort_order);

alter table booking_ops_tasks enable row level security;

drop trigger if exists booking_ops_tasks_updated_at on booking_ops_tasks;
create trigger booking_ops_tasks_updated_at
  before update on booking_ops_tasks
  for each row
  execute function update_updated_at();
