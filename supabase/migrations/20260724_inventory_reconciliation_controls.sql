-- Make aggregate online capacity and physical asset counts explicitly
-- reconcilable, auditable, and safe for booking assignment.

ALTER TABLE public.products
  ADD CONSTRAINT products_stock_total_nonnegative
    CHECK (stock_total >= 0) NOT VALID,
  ADD CONSTRAINT products_stock_available_valid
    CHECK (stock_available >= 0 AND stock_available <= stock_total) NOT VALID;

ALTER TABLE public.products VALIDATE CONSTRAINT products_stock_total_nonnegative;
ALTER TABLE public.products VALIDATE CONSTRAINT products_stock_available_valid;

CREATE TABLE IF NOT EXISTS public.inventory_stock_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  previous_stock_total INT NOT NULL,
  new_stock_total INT NOT NULL,
  previous_online_capacity INT NOT NULL,
  new_online_capacity INT NOT NULL,
  source TEXT NOT NULL DEFAULT 'admin_inventory',
  actor_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS inventory_stock_events_product_idx
  ON public.inventory_stock_events (product_id, created_at DESC);

ALTER TABLE public.inventory_stock_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.inventory_stock_events FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.update_product_inventory_capacity(
  p_product_id UUID,
  p_stock_total INT,
  p_online_capacity INT,
  p_actor_id UUID DEFAULT NULL
)
RETURNS SETOF public.products
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_product public.products;
  v_physical_count INT;
BEGIN
  IF p_stock_total < 0 OR p_online_capacity < 0 OR p_online_capacity > p_stock_total THEN
    RAISE EXCEPTION 'Online capacity must be between zero and total owned stock';
  END IF;

  SELECT * INTO v_product
  FROM public.products
  WHERE id = p_product_id
  FOR UPDATE;
  IF v_product.id IS NULL THEN RAISE EXCEPTION 'Product not found'; END IF;

  SELECT count(*)::INT INTO v_physical_count
  FROM public.inventory_units
  WHERE product_id = p_product_id AND status <> 'retired';

  IF v_physical_count > p_stock_total THEN
    RAISE EXCEPTION
      'Total owned stock cannot be lower than % registered non-retired physical units',
      v_physical_count;
  END IF;

  UPDATE public.products
  SET
    stock_total = p_stock_total,
    stock_available = p_online_capacity,
    updated_at = clock_timestamp()
  WHERE id = p_product_id;

  IF
    v_product.stock_total IS DISTINCT FROM p_stock_total
    OR v_product.stock_available IS DISTINCT FROM p_online_capacity
  THEN
    INSERT INTO public.inventory_stock_events (
      product_id,
      previous_stock_total,
      new_stock_total,
      previous_online_capacity,
      new_online_capacity,
      actor_id
    )
    VALUES (
      p_product_id,
      v_product.stock_total,
      p_stock_total,
      v_product.stock_available,
      p_online_capacity,
      p_actor_id
    );
  END IF;

  RETURN QUERY
  SELECT product.* FROM public.products AS product WHERE product.id = p_product_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.register_missing_inventory_units(
  p_product_id UUID,
  p_actor_id UUID DEFAULT NULL,
  p_location TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_product public.products;
  v_existing_count INT;
  v_missing_count INT;
  v_created_count INT := 0;
  v_sequence INT := 1;
  v_prefix TEXT;
  v_asset_code TEXT;
  v_unit_id UUID;
BEGIN
  SELECT * INTO v_product
  FROM public.products
  WHERE id = p_product_id
  FOR UPDATE;
  IF v_product.id IS NULL THEN RAISE EXCEPTION 'Product not found'; END IF;

  SELECT count(*)::INT INTO v_existing_count
  FROM public.inventory_units
  WHERE product_id = p_product_id AND status <> 'retired';

  v_missing_count := GREATEST(v_product.stock_total - v_existing_count, 0);
  v_prefix := left(regexp_replace(upper(v_product.slug), '[^A-Z0-9]+', '', 'g'), 12);
  IF v_prefix = '' THEN v_prefix := left(replace(v_product.id::TEXT, '-', ''), 8); END IF;

  WHILE v_created_count < v_missing_count LOOP
    v_asset_code := 'RA-' || v_prefix || '-' || lpad(v_sequence::TEXT, 3, '0');
    v_sequence := v_sequence + 1;
    IF EXISTS (SELECT 1 FROM public.inventory_units WHERE asset_code = v_asset_code) THEN
      CONTINUE;
    END IF;

    INSERT INTO public.inventory_units (
      product_id,
      asset_code,
      status,
      condition,
      location,
      notes
    )
    VALUES (
      p_product_id,
      v_asset_code,
      'available',
      'good',
      NULLIF(trim(p_location), ''),
      'Created from explicit aggregate-stock reconciliation'
    )
    RETURNING id INTO v_unit_id;

    INSERT INTO public.inventory_unit_events (
      inventory_unit_id,
      event_type,
      to_status,
      note,
      actor_id
    )
    VALUES (
      v_unit_id,
      'stock_reconciliation_created',
      'available',
      'Registered from declared owned stock',
      p_actor_id
    );
    v_created_count := v_created_count + 1;
  END LOOP;

  RETURN jsonb_build_object(
    'created_count', v_created_count,
    'physical_count', v_existing_count + v_created_count,
    'stock_total', v_product.stock_total
  );
END;
$$;

-- Online capacity is the concurrent quantity intentionally exposed for booking.
CREATE OR REPLACE FUNCTION public.reserve_booking_inventory(
  p_product_id UUID,
  p_booking_draft_id UUID,
  p_starts_at TIMESTAMPTZ,
  p_ends_at TIMESTAMPTZ,
  p_quantity INT DEFAULT 1
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_stock_total INT;
  v_online_capacity INT;
  v_effective_capacity INT;
  v_overlapping_quantity INT;
BEGIN
  IF p_ends_at <= p_starts_at THEN RAISE EXCEPTION 'Rental end must be after rental start'; END IF;
  IF p_quantity <= 0 THEN RAISE EXCEPTION 'Quantity must be positive'; END IF;

  SELECT stock_total, stock_available
  INTO v_stock_total, v_online_capacity
  FROM public.products
  WHERE id = p_product_id AND is_active = true
  FOR UPDATE;
  IF v_stock_total IS NULL THEN RAISE EXCEPTION 'Product not found'; END IF;

  v_effective_capacity := LEAST(v_stock_total, v_online_capacity);
  IF p_quantity > v_effective_capacity THEN RETURN false; END IF;

  SELECT COALESCE(sum(block.quantity), 0)
  INTO v_overlapping_quantity
  FROM public.booking_inventory_blocks block
  LEFT JOIN public.booking_drafts draft ON draft.id = block.booking_draft_id
  WHERE block.product_id = p_product_id
    AND block.starts_at < p_ends_at
    AND block.ends_at > p_starts_at
    AND (
      block.booking_id IS NOT NULL
      OR (
        block.booking_draft_id IS NOT NULL
        AND draft.status IN ('draft', 'checkout_created')
        AND draft.expires_at > now()
      )
    );

  IF v_overlapping_quantity + p_quantity > v_effective_capacity THEN RETURN false; END IF;

  INSERT INTO public.booking_inventory_blocks (
    product_id,
    booking_draft_id,
    starts_at,
    ends_at,
    quantity,
    reason
  )
  VALUES (
    p_product_id,
    p_booking_draft_id,
    p_starts_at,
    p_ends_at,
    p_quantity,
    'checkout_hold'
  );
  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.assign_booking_inventory_unit(
  p_booking_id UUID,
  p_inventory_unit_id UUID,
  p_actor_id UUID DEFAULT NULL,
  p_notes TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_booking_product_id UUID;
  v_booking_status public.booking_status;
  v_booking_quantity INT;
  v_active_assignments INT;
  v_unit_product_id UUID;
  v_assignment_id UUID;
BEGIN
  SELECT product_id, status, quantity
  INTO v_booking_product_id, v_booking_status, v_booking_quantity
  FROM public.bookings
  WHERE id = p_booking_id
  FOR UPDATE;

  IF v_booking_product_id IS NULL THEN RAISE EXCEPTION 'Booking not found'; END IF;
  IF v_booking_status NOT IN ('confirmed', 'paid', 'delivering', 'active') THEN
    RAISE EXCEPTION 'Inventory can only be assigned to an open confirmed rental';
  END IF;

  SELECT count(*)::INT INTO v_active_assignments
  FROM public.booking_inventory_unit_assignments
  WHERE booking_id = p_booking_id AND status IN ('assigned', 'handed_over');
  IF v_active_assignments >= v_booking_quantity THEN
    RAISE EXCEPTION 'This booking already has its required % physical unit(s)', v_booking_quantity;
  END IF;

  SELECT product_id INTO v_unit_product_id
  FROM public.inventory_units
  WHERE id = p_inventory_unit_id AND status = 'available'
  FOR UPDATE;
  IF v_unit_product_id IS NULL THEN RAISE EXCEPTION 'Inventory unit is not available'; END IF;
  IF v_unit_product_id <> v_booking_product_id THEN
    RAISE EXCEPTION 'Inventory unit does not belong to the booked product';
  END IF;

  INSERT INTO public.booking_inventory_unit_assignments (
    booking_id, inventory_unit_id, assigned_by, notes
  )
  VALUES (
    p_booking_id, p_inventory_unit_id, p_actor_id, NULLIF(trim(p_notes), '')
  )
  RETURNING id INTO v_assignment_id;

  UPDATE public.inventory_units
  SET status = 'reserved', updated_at = now()
  WHERE id = p_inventory_unit_id;

  INSERT INTO public.inventory_unit_events (
    inventory_unit_id, event_type, from_status, to_status, note, actor_id
  )
  VALUES (
    p_inventory_unit_id, 'booking_assigned', 'available', 'reserved',
    'Booking ' || p_booking_id::TEXT, p_actor_id
  );
  RETURN v_assignment_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.transition_booking_inventory_unit(
  p_booking_id UUID,
  p_assignment_id UUID,
  p_action TEXT,
  p_actor_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_assignment public.booking_inventory_unit_assignments;
  v_booking_status public.booking_status;
  v_booking_quantity INT;
  v_from_unit_status TEXT;
  v_to_unit_status TEXT;
  v_to_assignment_status TEXT;
BEGIN
  SELECT status, quantity INTO v_booking_status, v_booking_quantity
  FROM public.bookings
  WHERE id = p_booking_id
  FOR UPDATE;
  IF v_booking_status IS NULL THEN RAISE EXCEPTION 'Booking not found'; END IF;

  SELECT * INTO v_assignment
  FROM public.booking_inventory_unit_assignments
  WHERE id = p_assignment_id AND booking_id = p_booking_id
  FOR UPDATE;
  IF v_assignment.id IS NULL THEN RAISE EXCEPTION 'Assignment not found'; END IF;

  IF p_action = 'hand_over' AND v_assignment.status = 'assigned' THEN
    IF v_booking_status NOT IN ('paid', 'delivering', 'active') THEN
      RAISE EXCEPTION 'Booking must be paid before physical handover';
    END IF;
    v_from_unit_status := 'reserved';
    v_to_unit_status := 'rented';
    v_to_assignment_status := 'handed_over';
  ELSIF p_action = 'return' AND v_assignment.status = 'handed_over' THEN
    IF v_booking_status NOT IN ('active', 'returning') THEN
      RAISE EXCEPTION 'Booking must be active or returning before physical return';
    END IF;
    v_from_unit_status := 'rented';
    v_to_unit_status := 'available';
    v_to_assignment_status := 'returned';
  ELSIF p_action = 'release' AND v_assignment.status = 'assigned' THEN
    v_from_unit_status := 'reserved';
    v_to_unit_status := 'available';
    v_to_assignment_status := 'released';
  ELSE
    RAISE EXCEPTION 'Invalid inventory assignment transition';
  END IF;

  PERFORM 1 FROM public.inventory_units
  WHERE id = v_assignment.inventory_unit_id AND status = v_from_unit_status
  FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Inventory unit status is inconsistent with assignment'; END IF;

  UPDATE public.booking_inventory_unit_assignments
  SET
    status = v_to_assignment_status,
    handed_over_at = CASE WHEN p_action = 'hand_over' THEN now() ELSE handed_over_at END,
    returned_at = CASE WHEN p_action = 'return' THEN now() ELSE returned_at END,
    released_at = CASE WHEN p_action IN ('return', 'release') THEN now() ELSE released_at END
  WHERE id = p_assignment_id;

  UPDATE public.inventory_units
  SET
    status = v_to_unit_status,
    updated_at = now(),
    last_inspected_at = CASE WHEN p_action = 'return' THEN now() ELSE last_inspected_at END
  WHERE id = v_assignment.inventory_unit_id;

  INSERT INTO public.inventory_unit_events (
    inventory_unit_id, event_type, from_status, to_status, note, actor_id
  )
  VALUES (
    v_assignment.inventory_unit_id,
    'booking_' || p_action,
    v_from_unit_status,
    v_to_unit_status,
    'Booking ' || p_booking_id::TEXT,
    p_actor_id
  );

  IF p_action = 'hand_over' THEN
    IF (
      SELECT count(*)
      FROM public.booking_inventory_unit_assignments
      WHERE booking_id = p_booking_id AND status = 'handed_over'
    ) >= v_booking_quantity THEN
      UPDATE public.booking_ops_tasks
      SET
        is_done = true,
        completed_at = COALESCE(completed_at, now()),
        completed_by = COALESCE(completed_by, p_actor_id)
      WHERE booking_id = p_booking_id AND task_key = 'handoff_confirmed';

      IF v_booking_status = 'paid' THEN
        PERFORM public.transition_booking_status(
          p_booking_id, v_booking_status, 'delivering', 'inventory_assignment:hand_over', p_actor_id
        );
        v_booking_status := 'delivering';
      END IF;
      IF v_booking_status = 'delivering' THEN
        PERFORM public.transition_booking_status(
          p_booking_id, v_booking_status, 'active', 'inventory_assignment:hand_over', p_actor_id
        );
      END IF;
    END IF;
  ELSIF p_action = 'return' THEN
    UPDATE public.booking_ops_tasks
    SET
      is_done = true,
      completed_at = COALESCE(completed_at, now()),
      completed_by = COALESCE(completed_by, p_actor_id)
    WHERE booking_id = p_booking_id
      AND task_key = 'return_scheduled';

    IF v_booking_status = 'active' THEN
      PERFORM public.transition_booking_status(
        p_booking_id, v_booking_status, 'returning', 'inventory_assignment:return', p_actor_id
      );
      v_booking_status := 'returning';
    END IF;
    IF
      v_booking_status = 'returning'
      AND NOT EXISTS (
        SELECT 1
        FROM public.booking_inventory_unit_assignments
        WHERE booking_id = p_booking_id AND status IN ('assigned', 'handed_over')
      )
    THEN
      UPDATE public.booking_ops_tasks
      SET
        is_done = true,
        completed_at = COALESCE(completed_at, now()),
        completed_by = COALESCE(completed_by, p_actor_id)
      WHERE booking_id = p_booking_id AND task_key = 'return_inspected';

      PERFORM public.transition_booking_status(
        p_booking_id, v_booking_status, 'completed', 'inventory_assignment:return', p_actor_id
      );
    END IF;
  END IF;

  RETURN p_assignment_id;
END;
$$;

REVOKE ALL ON FUNCTION public.update_product_inventory_capacity(UUID, INT, INT, UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.register_missing_inventory_units(UUID, UUID, TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.reserve_booking_inventory(UUID, UUID, TIMESTAMPTZ, TIMESTAMPTZ, INT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.assign_booking_inventory_unit(UUID, UUID, UUID, TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.transition_booking_inventory_unit(UUID, UUID, TEXT, UUID) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.update_product_inventory_capacity(UUID, INT, INT, UUID) TO service_role;
GRANT EXECUTE ON FUNCTION public.register_missing_inventory_units(UUID, UUID, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.reserve_booking_inventory(UUID, UUID, TIMESTAMPTZ, TIMESTAMPTZ, INT) TO service_role;
GRANT EXECUTE ON FUNCTION public.assign_booking_inventory_unit(UUID, UUID, UUID, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.transition_booking_inventory_unit(UUID, UUID, TEXT, UUID) TO service_role;
