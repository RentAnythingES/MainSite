-- Avoid collision with PostgreSQL's CURRENT_TIME keyword in the rate limiter.

CREATE OR REPLACE FUNCTION public.consume_api_rate_limit(
  p_route TEXT,
  p_key_hash TEXT,
  p_limit INT,
  p_window_seconds INT
)
RETURNS TABLE (
  allowed BOOLEAN,
  remaining INT,
  retry_after_seconds INT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_now TIMESTAMPTZ := clock_timestamp();
  v_window_start TIMESTAMPTZ;
  v_count INT;
BEGIN
  IF p_route IS NULL OR length(p_route) < 1 OR length(p_route) > 100 THEN
    RAISE EXCEPTION 'Invalid rate-limit route';
  END IF;

  IF p_key_hash IS NULL OR length(p_key_hash) <> 64 THEN
    RAISE EXCEPTION 'Invalid rate-limit key';
  END IF;

  IF p_limit < 1 OR p_limit > 10000 THEN
    RAISE EXCEPTION 'Invalid rate-limit threshold';
  END IF;

  IF p_window_seconds < 1 OR p_window_seconds > 604800 THEN
    RAISE EXCEPTION 'Invalid rate-limit window';
  END IF;

  v_window_start := to_timestamp(
    floor(extract(epoch FROM v_now) / p_window_seconds) * p_window_seconds
  );

  INSERT INTO public.api_rate_limits (
    route,
    key_hash,
    window_started_at,
    request_count,
    updated_at
  )
  VALUES (
    p_route,
    p_key_hash,
    v_window_start,
    1,
    v_now
  )
  ON CONFLICT (route, key_hash, window_started_at)
  DO UPDATE SET
    request_count = public.api_rate_limits.request_count + 1,
    updated_at = EXCLUDED.updated_at
  RETURNING request_count INTO v_count;

  RETURN QUERY SELECT
    v_count <= p_limit,
    greatest(p_limit - v_count, 0),
    greatest(
      ceil(
        extract(
          epoch FROM (v_window_start + make_interval(secs => p_window_seconds) - v_now)
        )
      )::INT,
      1
    );
END;
$$;
