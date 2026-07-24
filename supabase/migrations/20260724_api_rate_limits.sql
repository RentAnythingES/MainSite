-- Distributed API rate limiting for public mutation endpoints.
--
-- Keys are HMAC hashes created server-side. No raw IP address or email address
-- is stored in this table.

CREATE TABLE IF NOT EXISTS public.api_rate_limits (
  route TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  window_started_at TIMESTAMPTZ NOT NULL,
  request_count INT NOT NULL DEFAULT 1 CHECK (request_count > 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (route, key_hash, window_started_at)
);

CREATE INDEX IF NOT EXISTS idx_api_rate_limits_window
  ON public.api_rate_limits (window_started_at);

ALTER TABLE public.api_rate_limits ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.api_rate_limits FROM PUBLIC;
REVOKE ALL ON TABLE public.api_rate_limits FROM anon;
REVOKE ALL ON TABLE public.api_rate_limits FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.api_rate_limits TO service_role;

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
  current_time TIMESTAMPTZ := clock_timestamp();
  window_start TIMESTAMPTZ;
  current_count INT;
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

  window_start := to_timestamp(
    floor(extract(epoch FROM current_time) / p_window_seconds) * p_window_seconds
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
    window_start,
    1,
    current_time
  )
  ON CONFLICT (route, key_hash, window_started_at)
  DO UPDATE SET
    request_count = public.api_rate_limits.request_count + 1,
    updated_at = EXCLUDED.updated_at
  RETURNING request_count INTO current_count;

  RETURN QUERY SELECT
    current_count <= p_limit,
    greatest(p_limit - current_count, 0),
    greatest(
      ceil(
        extract(
          epoch FROM (window_start + make_interval(secs => p_window_seconds) - current_time)
        )
      )::INT,
      1
    );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.consume_api_rate_limit(TEXT, TEXT, INT, INT) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.consume_api_rate_limit(TEXT, TEXT, INT, INT) FROM anon;
REVOKE EXECUTE ON FUNCTION public.consume_api_rate_limit(TEXT, TEXT, INT, INT) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.consume_api_rate_limit(TEXT, TEXT, INT, INT) TO service_role;
