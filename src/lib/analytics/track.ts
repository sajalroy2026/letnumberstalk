import { supabase } from "@/integrations/supabase/client";

export type AnalyticsEvent =
  | "visit"
  | "assessment_started"
  | "assessment_completed"
  | "report_generated";

const SESSION_STORAGE_KEY = "lnt-session-key";

/** Anonymous, per-tab identifier. Never leaves the browser except as an opaque string. */
function sessionKey(): string | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    let key = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!key) {
      key = Math.random().toString(36).slice(2) + Date.now().toString(36);
      window.sessionStorage.setItem(SESSION_STORAGE_KEY, key);
    }
    return key;
  } catch {
    return undefined;
  }
}

/**
 * Records an anonymous usage event. No entered figures, no personal data —
 * an event name, the page path, an optional sector label and a per-tab key.
 */
export function track(event: AnalyticsEvent, sector?: string) {
  if (typeof window === "undefined") return;
  void supabase
    .from("analytics_events")
    .insert({
      event,
      path: window.location.pathname.slice(0, 128),
      sector: sector ? sector.slice(0, 64) : null,
      session_key: sessionKey() ?? null,
    })
    .then(() => undefined);
}
