import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const summarySchema = z.object({ days: z.number().int().min(1).max(365).default(30) });

export type AnalyticsSummary = {
  totals: { visits: number; starts: number; completions: number; reports: number };
  completionRate: number;
  sectors: { sector: string; count: number }[];
  daily: { day: string; visits: number; starts: number; completions: number }[];
};

export const getAnalyticsSummary = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => summarySchema.parse(data ?? {}))
  .handler(async ({ data }): Promise<AnalyticsSummary> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const since = new Date(Date.now() - data.days * 24 * 60 * 60 * 1000).toISOString();
    const { data: rows, error } = await supabaseAdmin
      .from("analytics_events")
      .select("event, sector, created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(50000);

    if (error) throw new Error(error.message);

    const events = rows ?? [];
    const count = (name: string) => events.filter((e) => e.event === name).length;

    const totals = {
      visits: count("visit"),
      starts: count("assessment_started"),
      completions: count("assessment_completed"),
      reports: count("report_generated"),
    };

    const sectorMap = new Map<string, number>();
    for (const e of events) {
      if (e.event !== "assessment_started" || !e.sector) continue;
      sectorMap.set(e.sector, (sectorMap.get(e.sector) ?? 0) + 1);
    }

    const dayMap = new Map<string, { visits: number; starts: number; completions: number }>();
    for (const e of events) {
      const day = String(e.created_at).slice(0, 10);
      const bucket = dayMap.get(day) ?? { visits: 0, starts: 0, completions: 0 };
      if (e.event === "visit") bucket.visits += 1;
      if (e.event === "assessment_started") bucket.starts += 1;
      if (e.event === "assessment_completed") bucket.completions += 1;
      dayMap.set(day, bucket);
    }

    return {
      totals,
      completionRate: totals.starts ? Math.round((totals.completions / totals.starts) * 100) : 0,
      sectors: [...sectorMap.entries()]
        .map(([sector, c]) => ({ sector, count: c }))
        .sort((a, b) => b.count - a.count),
      daily: [...dayMap.entries()]
        .map(([day, v]) => ({ day, ...v }))
        .sort((a, b) => (a.day < b.day ? -1 : 1)),
    };
  });
