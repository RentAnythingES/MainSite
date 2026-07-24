-- Atomically transition a booking to a terminal state and release all aggregate
-- inventory records. Stripe refunds are confirmed by application code before
-- this function is called.

CREATE OR REPLACE FUNCTION public.transition_booking_terminal_status(
  p_booking_id UUID,
  p_expected_status public.booking_status,
  p_new_status public.booking_status
)
RETURNS SETOF public.bookings
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_current_status public.booking_status;
  v_now TIMESTAMPTZ := clock_timestamp();
BEGIN
  IF p_new_status NOT IN ('cancelled', 'refunded', 'completed') THEN
    RAISE EXCEPTION 'Target status must release inventory';
  END IF;

  SELECT status
  INTO v_current_status
  FROM public.bookings
  WHERE id = p_booking_id
  FOR UPDATE;

  IF v_current_status IS NULL THEN
    RAISE EXCEPTION 'Booking not found';
  END IF;

  IF v_current_status <> p_expected_status THEN
    RAISE EXCEPTION 'Booking status changed from % to %', p_expected_status, v_current_status;
  END IF;

  IF
    (p_new_status = 'cancelled' AND v_current_status NOT IN ('pending', 'confirmed', 'paid'))
    OR (p_new_status = 'refunded' AND v_current_status <> 'paid')
    OR (p_new_status = 'completed' AND v_current_status <> 'returning')
  THEN
    RAISE EXCEPTION 'Invalid terminal transition from % to %', v_current_status, p_new_status;
  END IF;

  UPDATE public.bookings
  SET
    status = p_new_status,
    cancelled_at = CASE
      WHEN p_new_status = 'cancelled' THEN v_now
      ELSE cancelled_at
    END,
    completed_at = CASE
      WHEN p_new_status = 'completed' THEN v_now
      ELSE completed_at
    END,
    updated_at = v_now
  WHERE id = p_booking_id;

  DELETE FROM public.blocked_dates
  WHERE booking_id = p_booking_id;

  DELETE FROM public.booking_inventory_blocks
  WHERE booking_id = p_booking_id;

  RETURN QUERY
  SELECT booking.*
  FROM public.bookings AS booking
  WHERE booking.id = p_booking_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.transition_booking_terminal_status(UUID, public.booking_status, public.booking_status) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.transition_booking_terminal_status(UUID, public.booking_status, public.booking_status) FROM anon;
REVOKE EXECUTE ON FUNCTION public.transition_booking_terminal_status(UUID, public.booking_status, public.booking_status) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.transition_booking_terminal_status(UUID, public.booking_status, public.booking_status) TO service_role;
