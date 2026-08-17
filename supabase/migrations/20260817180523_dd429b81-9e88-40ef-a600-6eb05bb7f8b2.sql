CREATE TABLE public.analytics_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event text NOT NULL,
  path text,
  sector text,
  session_key text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX analytics_events_created_at_idx ON public.analytics_events (created_at DESC);
CREATE INDEX analytics_events_event_idx ON public.analytics_events (event);

GRANT INSERT ON public.analytics_events TO anon;
GRANT INSERT ON public.analytics_events TO authenticated;
GRANT ALL ON public.analytics_events TO service_role;

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone may record an anonymous event"
ON public.analytics_events
FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(event) <= 64
  AND (path IS NULL OR char_length(path) <= 128)
  AND (sector IS NULL OR char_length(sector) <= 64)
  AND (session_key IS NULL OR char_length(session_key) <= 64)
);