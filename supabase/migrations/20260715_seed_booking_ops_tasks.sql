-- Seed the standard operations checklist for bookings created before the
-- booking_ops_tasks table was introduced. Safe to rerun.

insert into public.booking_ops_tasks (booking_id, task_key, label, sort_order)
select
  booking.id,
  task.task_key,
  task.label,
  task.sort_order
from public.bookings as booking
cross join (
  values
    ('customer_contacted', 'Customer contacted', 10),
    ('equipment_prepared', 'Equipment prepared', 20),
    ('handoff_confirmed', 'Handoff confirmed', 30),
    ('return_scheduled', 'Return scheduled', 40),
    ('return_inspected', 'Return inspected', 50)
) as task(task_key, label, sort_order)
on conflict (booking_id, task_key) do nothing;
