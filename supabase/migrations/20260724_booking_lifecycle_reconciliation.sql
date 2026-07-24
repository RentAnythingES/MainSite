-- Reconcile evidence-backed checklist milestones without advancing future rentals.

CREATE OR REPLACE FUNCTION public.reconcile_booking_lifecycle(
  p_booking_id UUID,
  p_source TEXT DEFAULT 'lifecycle_reconciliation',
  p_actor_user_id UUID DEFAULT NULL
)
RETURNS public.booking_status
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_status public.booking_status;
  v_start_at TIMESTAMPTZ;
  v_end_at TIMESTAMPTZ;
  v_equipment_prepared BOOLEAN;
  v_handoff_confirmed BOOLEAN;
  v_return_scheduled BOOLEAN;
  v_return_inspected BOOLEAN;
  v_now TIMESTAMPTZ := clock_timestamp();
BEGIN
  SELECT status, rental_start_at, rental_end_at
  INTO v_status, v_start_at, v_end_at
  FROM public.bookings
  WHERE id = p_booking_id
  FOR UPDATE;

  IF v_status IS NULL THEN RAISE EXCEPTION 'Booking not found'; END IF;
  IF v_status IN ('cancelled', 'refunded', 'completed') THEN RETURN v_status; END IF;

  SELECT
    COALESCE(bool_or(is_done) FILTER (WHERE task_key = 'equipment_prepared'), false),
    COALESCE(bool_or(is_done) FILTER (WHERE task_key = 'handoff_confirmed'), false),
    COALESCE(bool_or(is_done) FILTER (WHERE task_key = 'return_scheduled'), false),
    COALESCE(bool_or(is_done) FILTER (WHERE task_key = 'return_inspected'), false)
  INTO
    v_equipment_prepared,
    v_handoff_confirmed,
    v_return_scheduled,
    v_return_inspected
  FROM public.booking_ops_tasks
  WHERE booking_id = p_booking_id;

  IF
    v_status = 'paid'
    AND (v_equipment_prepared OR v_handoff_confirmed)
    AND (v_start_at IS NULL OR v_start_at <= v_now)
  THEN
    PERFORM public.transition_booking_status(p_booking_id, v_status, 'delivering', p_source, p_actor_user_id);
    v_status := 'delivering';
  END IF;

  IF
    v_status = 'delivering'
    AND v_handoff_confirmed
    AND (v_start_at IS NULL OR v_start_at <= v_now)
  THEN
    PERFORM public.transition_booking_status(p_booking_id, v_status, 'active', p_source, p_actor_user_id);
    v_status := 'active';
  END IF;

  IF
    v_status = 'active'
    AND (v_return_scheduled OR v_return_inspected)
    AND (v_end_at IS NULL OR v_end_at <= v_now)
  THEN
    PERFORM public.transition_booking_status(p_booking_id, v_status, 'returning', p_source, p_actor_user_id);
    v_status := 'returning';
  END IF;

  IF
    v_status = 'returning'
    AND v_return_inspected
    AND (v_end_at IS NULL OR v_end_at <= v_now)
  THEN
    PERFORM public.transition_booking_status(p_booking_id, v_status, 'completed', p_source, p_actor_user_id);
    v_status := 'completed';
  END IF;

  RETURN v_status;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_booking_ops_task(
  p_booking_id UUID,
  p_task_key TEXT,
  p_is_done BOOLEAN,
  p_note TEXT DEFAULT NULL,
  p_actor_user_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_original_status public.booking_status;
  v_status public.booking_status;
  v_task public.booking_ops_tasks;
BEGIN
  IF p_task_key NOT IN (
    'customer_contacted',
    'equipment_prepared',
    'handoff_confirmed',
    'return_scheduled',
    'return_inspected'
  ) THEN
    RAISE EXCEPTION 'Unknown checklist task';
  END IF;

  SELECT status INTO v_original_status
  FROM public.bookings
  WHERE id = p_booking_id
  FOR UPDATE;
  IF v_original_status IS NULL THEN RAISE EXCEPTION 'Booking not found'; END IF;

  INSERT INTO public.booking_ops_tasks (booking_id, task_key, label, sort_order)
  SELECT p_booking_id, task.task_key, task.label, task.sort_order
  FROM (
    VALUES
      ('customer_contacted', 'Customer contacted', 10),
      ('equipment_prepared', 'Equipment prepared', 20),
      ('handoff_confirmed', 'Handoff confirmed', 30),
      ('return_scheduled', 'Return scheduled', 40),
      ('return_inspected', 'Return inspected', 50)
  ) AS task(task_key, label, sort_order)
  ON CONFLICT (booking_id, task_key) DO NOTHING;

  UPDATE public.booking_ops_tasks
  SET
    is_done = p_is_done,
    completed_at = CASE WHEN p_is_done THEN clock_timestamp() ELSE NULL END,
    completed_by = CASE WHEN p_is_done THEN p_actor_user_id ELSE NULL END,
    note = COALESCE(p_note, note)
  WHERE booking_id = p_booking_id AND task_key = p_task_key
  RETURNING * INTO v_task;

  v_status := public.reconcile_booking_lifecycle(
    p_booking_id,
    'ops_checklist:' || p_task_key,
    p_actor_user_id
  );

  RETURN jsonb_build_object(
    'task', to_jsonb(v_task),
    'booking_status', v_status,
    'previous_booking_status', v_original_status,
    'status_changed', v_status IS DISTINCT FROM v_original_status
  );
END;
$$;

REVOKE ALL ON FUNCTION public.reconcile_booking_lifecycle(UUID, TEXT, UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reconcile_booking_lifecycle(UUID, TEXT, UUID) TO service_role;

REVOKE ALL ON FUNCTION public.update_booking_ops_task(UUID, TEXT, BOOLEAN, TEXT, UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_booking_ops_task(UUID, TEXT, BOOLEAN, TEXT, UUID) TO service_role;

-- Bring already-completed historical checklists into line without touching
-- future rentals or generating customer email for old operational work.
DO $$
DECLARE
  booking_record RECORD;
BEGIN
  FOR booking_record IN
    SELECT id
    FROM public.bookings
    WHERE status IN ('paid', 'delivering', 'active', 'returning')
  LOOP
    PERFORM public.reconcile_booking_lifecycle(
      booking_record.id,
      'historical_checklist_reconciliation',
      NULL
    );
  END LOOP;
END;
$$;

INSERT INTO public.booking_reviews (booking_id, product_id, locale)
SELECT booking.id, booking.product_id, 'en'
FROM public.bookings AS booking
WHERE booking.status = 'completed'
  AND NOT EXISTS (
    SELECT 1 FROM public.booking_reviews review WHERE review.booking_id = booking.id
  );
