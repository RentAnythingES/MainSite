-- Make booking operations lifecycle-safe and auditable at the database boundary.

CREATE TABLE IF NOT EXISTS public.booking_status_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  from_status public.booking_status,
  to_status public.booking_status NOT NULL,
  source TEXT NOT NULL DEFAULT 'database',
  actor_user_id UUID,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_booking_status_events_booking
  ON public.booking_status_events (booking_id, created_at DESC);

ALTER TABLE public.booking_status_events ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.record_booking_status_event()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_source TEXT := NULLIF(current_setting('rentanything.transition_source', true), '');
  v_actor TEXT := NULLIF(current_setting('rentanything.transition_actor', true), '');
BEGIN
  IF TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.booking_status_events (
      booking_id,
      from_status,
      to_status,
      source,
      actor_user_id
    )
    VALUES (
      NEW.id,
      CASE WHEN TG_OP = 'INSERT' THEN NULL ELSE OLD.status END,
      NEW.status,
      COALESCE(v_source, CASE WHEN TG_OP = 'INSERT' THEN 'booking_created' ELSE 'database' END),
      CASE WHEN v_actor IS NULL THEN NULL ELSE v_actor::UUID END
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS bookings_status_audit ON public.bookings;
CREATE TRIGGER bookings_status_audit
  AFTER INSERT OR UPDATE OF status ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.record_booking_status_event();

CREATE OR REPLACE FUNCTION public.seed_booking_ops_tasks()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.booking_ops_tasks (booking_id, task_key, label, sort_order)
  VALUES
    (NEW.id, 'customer_contacted', 'Customer contacted', 10),
    (NEW.id, 'equipment_prepared', 'Equipment prepared', 20),
    (NEW.id, 'handoff_confirmed', 'Handoff confirmed', 30),
    (NEW.id, 'return_scheduled', 'Return scheduled', 40),
    (NEW.id, 'return_inspected', 'Return inspected', 50)
  ON CONFLICT (booking_id, task_key) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS bookings_seed_ops_tasks ON public.bookings;
CREATE TRIGGER bookings_seed_ops_tasks
  AFTER INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.seed_booking_ops_tasks();

-- Backfill both checklists and the initial status event for existing bookings.
INSERT INTO public.booking_ops_tasks (booking_id, task_key, label, sort_order)
SELECT booking.id, task.task_key, task.label, task.sort_order
FROM public.bookings AS booking
CROSS JOIN (
  VALUES
    ('customer_contacted', 'Customer contacted', 10),
    ('equipment_prepared', 'Equipment prepared', 20),
    ('handoff_confirmed', 'Handoff confirmed', 30),
    ('return_scheduled', 'Return scheduled', 40),
    ('return_inspected', 'Return inspected', 50)
) AS task(task_key, label, sort_order)
ON CONFLICT (booking_id, task_key) DO NOTHING;

INSERT INTO public.booking_status_events (booking_id, from_status, to_status, source, created_at)
SELECT booking.id, NULL, booking.status, 'status_backfill', booking.created_at
FROM public.bookings AS booking
WHERE NOT EXISTS (
  SELECT 1
  FROM public.booking_status_events AS event
  WHERE event.booking_id = booking.id
);

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
  v_now TIMESTAMPTZ := clock_timestamp();
BEGIN
  SELECT status INTO v_current_status
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
    OR (v_current_status = 'delivering' AND p_new_status = 'active')
    OR (v_current_status = 'active' AND p_new_status = 'returning')
    OR (v_current_status = 'returning' AND p_new_status = 'completed')
  ) THEN
    RAISE EXCEPTION 'Invalid booking transition from % to %', v_current_status, p_new_status;
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
  v_status public.booking_status;
  v_original_status public.booking_status;
  v_task public.booking_ops_tasks;
  v_source TEXT := 'ops_checklist:' || p_task_key;
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

  SELECT status INTO v_status
  FROM public.bookings
  WHERE id = p_booking_id
  FOR UPDATE;
  IF v_status IS NULL THEN RAISE EXCEPTION 'Booking not found'; END IF;
  v_original_status := v_status;

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
    note = p_note
  WHERE booking_id = p_booking_id AND task_key = p_task_key
  RETURNING * INTO v_task;

  IF p_is_done AND v_status NOT IN ('cancelled', 'refunded', 'completed') THEN
    IF p_task_key = 'equipment_prepared' AND v_status = 'paid' THEN
      PERFORM public.transition_booking_status(p_booking_id, v_status, 'delivering', v_source, p_actor_user_id);
      v_status := 'delivering';
    ELSIF p_task_key = 'handoff_confirmed' THEN
      IF v_status = 'paid' THEN
        PERFORM public.transition_booking_status(p_booking_id, v_status, 'delivering', v_source, p_actor_user_id);
        v_status := 'delivering';
      END IF;
      IF v_status = 'delivering' THEN
        PERFORM public.transition_booking_status(p_booking_id, v_status, 'active', v_source, p_actor_user_id);
        v_status := 'active';
      END IF;
    ELSIF p_task_key = 'return_scheduled' AND v_status = 'active' THEN
      PERFORM public.transition_booking_status(p_booking_id, v_status, 'returning', v_source, p_actor_user_id);
      v_status := 'returning';
    ELSIF p_task_key = 'return_inspected' THEN
      IF v_status = 'active' THEN
        PERFORM public.transition_booking_status(p_booking_id, v_status, 'returning', v_source, p_actor_user_id);
        v_status := 'returning';
      END IF;
      IF v_status = 'returning' THEN
        PERFORM public.transition_booking_status(p_booking_id, v_status, 'completed', v_source, p_actor_user_id);
        v_status := 'completed';
      END IF;
    END IF;
  END IF;

  RETURN jsonb_build_object(
    'task', to_jsonb(v_task),
    'booking_status', v_status,
    'previous_booking_status', v_original_status,
    'status_changed', v_status IS DISTINCT FROM v_original_status
  );
END;
$$;

REVOKE ALL ON FUNCTION public.transition_booking_status(UUID, public.booking_status, public.booking_status, TEXT, UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.transition_booking_status(UUID, public.booking_status, public.booking_status, TEXT, UUID) TO service_role;

REVOKE ALL ON FUNCTION public.update_booking_ops_task(UUID, TEXT, BOOLEAN, TEXT, UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_booking_ops_task(UUID, TEXT, BOOLEAN, TEXT, UUID) TO service_role;
