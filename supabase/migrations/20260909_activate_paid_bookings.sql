-- Paid bookings are operationally active immediately after payment confirmation.
update public.bookings
set status = 'active', updated_at = now()
where status = 'paid';
