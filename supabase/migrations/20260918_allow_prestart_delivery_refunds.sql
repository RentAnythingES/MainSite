-- A booking may be refunded before its scheduled rental start, even if staff have
-- already marked it out for delivery. Active rentals remain ineligible.
CREATE OR REPLACE FUNCTION public.transition_booking_status(
  p_booking_id UUID,
  p_expected_status public.booking_status,
  p_new_status public.booking_status,
  p_source TEXT DEFAULT 'admin',
  p_actor_user_id UUID DEFAULT NULL
)
RETURNS SETOF public.bookings
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_current_status public.booking_status;
  v_rental_start_at TIMESTAMPTZ;
  v_now TIMESTAMPTZ := clock_timestamp();
BEGIN
  SELECT status, rental_start_at INTO v_current_status, v_rental_start_at
  FROM public.bookings
  WHERE id = p_booking_id
  FOR UPDATE;

  IF v_current_status IS NULL THEN
    RAISE EXCEPTION 'Booking not found';
  END IF;
  IF v_current_status <> p_expected_status THEN
    RAISE EXCEPTION 'Booking status changed from % to %', p_expected_status, v_current_status;
  END IF;
  IF NOT (
    (v_current_status = 'pending' AND p_new_status IN ('confirmed', 'cancelled'))
    OR (v_current_status = 'confirmed' AND p_new_status IN ('paid', 'cancelled'))
    OR (v_current_status = 'paid' AND p_new_status IN ('delivering', 'cancelled', 'refunded'))
    OR (v_current_status = 'delivering' AND p_new_status IN ('active', 'refunded'))
    OR (v_current_status = 'active' AND p_new_status = 'returning')
    OR (v_current_status = 'returning' AND p_new_status = 'completed')
  ) THEN
    RAISE EXCEPTION 'Invalid booking transition from % to %', v_current_status, p_new_status;
  END IF;
  IF p_new_status = 'refunded' AND (v_rental_start_at IS NULL OR v_rental_start_at <= v_now) THEN
    RAISE EXCEPTION 'A booking can only be refunded before its rental has started';
  END IF;

  PERFORM set_config('rentanything.transition_source', COALESCE(NULLIF(p_source, ''), 'admin'), true);
  PERFORM set_config('rentanything.transition_actor', COALESCE(p_actor_user_id::TEXT, ''), true);

  UPDATE public.bookings
  SET
    status = p_new_status,
    paid_at = CASE WHEN p_new_status = 'paid' THEN v_now ELSE paid_at END,
    cancelled_at = CASE WHEN p_new_status = 'cancelled' THEN v_now ELSE cancelled_at END,
    completed_at = CASE WHEN p_new_status = 'completed' THEN v_now ELSE completed_at END,
    updated_at = v_now
  WHERE id = p_booking_id;

  IF p_new_status IN ('cancelled', 'refunded', 'completed') THEN
    DELETE FROM public.blocked_dates WHERE booking_id = p_booking_id;
    DELETE FROM public.booking_inventory_blocks WHERE booking_id = p_booking_id;
  END IF;

  RETURN QUERY SELECT booking.* FROM public.bookings AS booking WHERE booking.id = p_booking_id;
END;
$$;
