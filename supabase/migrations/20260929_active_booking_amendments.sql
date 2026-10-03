-- Preserve atomic application and replay protection; allow paid active bookings only before rental start.
CREATE OR REPLACE FUNCTION public.apply_paid_fulfillment_amendment(p_amendment_id uuid, p_checkout_session_id text, p_payment_intent_id text, p_paid_at timestamp with time zone DEFAULT now()) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'pg_temp'
    AS $$
declare
  amendment public.booking_fulfillment_amendments%rowtype;
  current_booking public.bookings%rowtype;
  amendment_total integer;
begin
  select * into amendment
  from public.booking_fulfillment_amendments
  where id = p_amendment_id
  for update;

  if not found then
    raise exception 'Fulfillment amendment not found';
  end if;

  if amendment.status = 'paid' then
    return false;
  end if;

  if amendment.status not in ('quoted', 'checkout_created') then
    raise exception 'Fulfillment amendment cannot be paid from status %', amendment.status;
  end if;

  select * into current_booking
  from public.bookings
  where id = amendment.booking_id
  for update;

  if not found then
    raise exception 'Booking not found for fulfillment amendment';
  end if;

  if current_booking.status not in ('confirmed', 'paid', 'active') then
    raise exception 'Booking status % no longer permits fulfillment changes', current_booking.status;
  end if;

  if current_booking.rental_start_at is null or current_booking.rental_start_at <= now() then
    raise exception 'Rental has already started or has no verified start time';
  end if;

  if current_booking.fulfillment_mode <> 'customer_pickup' then
    raise exception 'Booking fulfillment has already changed';
  end if;

  amendment_total := amendment.delivery_fee_cents + amendment.collection_fee_cents;

  update public.bookings
  set
    fulfillment_mode = amendment.fulfillment_mode,
    pickup_location_id = null,
    delivery_zone_id = amendment.delivery_zone_id,
    collection_zone_id = amendment.collection_zone_id,
    delivery_address = amendment.delivery_address,
    collection_address = amendment.collection_address,
    delivery_notes = amendment.delivery_notes,
    collection_notes = amendment.collection_notes,
    delivery_fee_cents = amendment.delivery_fee_cents,
    collection_fee_cents = amendment.collection_fee_cents,
    total_cents = coalesce(total_cents, 0) + amendment_total,
    updated_at = now()
  where id = amendment.booking_id;

  update public.booking_fulfillment_amendments
  set
    status = 'paid',
    stripe_checkout_session_id = p_checkout_session_id,
    stripe_payment_intent_id = p_payment_intent_id,
    paid_at = p_paid_at,
    applied_at = now(),
    updated_at = now()
  where id = p_amendment_id;

  return true;
end;
$$;
