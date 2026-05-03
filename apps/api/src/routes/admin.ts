import { Router } from "express";
import { z } from "zod";
import { pdfQueue } from "../services/queue";
import { supabaseAdmin } from "../services/supabase";

export const adminRouter = Router();

const updateUserSchema = z
  .object({
    role: z.string().min(1).optional(),
    plan_id: z.string().uuid().nullable().optional()
  })
  .refine((body) => body.role !== undefined || body.plan_id !== undefined, {
    message: "role or plan_id is required"
  });

function startOfTodayIso(): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.toISOString();
}

function normalizePlan(value: unknown): Record<string, unknown> | null {
  if (Array.isArray(value)) {
    return (value[0] as Record<string, unknown> | undefined) ?? null;
  }

  return (value as Record<string, unknown> | null) ?? null;
}

function parsePositiveInteger(value: unknown, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

adminRouter.get("/stats", async (_req, res, next) => {
  try {
    const todayIso = startOfTodayIso();

    const [
      { count: totalUsers, error: usersError },
      { count: opsToday, error: operationsError },
      { count: activeSubscriptions, error: subscriptionsError }
    ] = await Promise.all([
      supabaseAdmin.from("users").select("*", { count: "exact", head: true }),
      supabaseAdmin
        .from("operations")
        .select("*", { count: "exact", head: true })
        .gt("created_at", todayIso),
      supabaseAdmin
        .from("subscriptions")
        .select("*", { count: "exact", head: true })
        .eq("status", "active")
    ]);

    const error = usersError ?? operationsError ?? subscriptionsError;
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({
      total_users: totalUsers ?? 0,
      ops_today: opsToday ?? 0,
      active_subscriptions: activeSubscriptions ?? 0
    });
  } catch (error) {
    next(error);
  }
});

adminRouter.get("/users", async (req, res, next) => {
  try {
    const page = parsePositiveInteger(req.query.page, 1);
    const limit = Math.min(parsePositiveInteger(req.query.limit, 20), 100);
    const search =
      typeof req.query.search === "string" && req.query.search.trim()
        ? req.query.search.trim()
        : undefined;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabaseAdmin
      .from("users")
      .select("*, plans!inner(name)", { count: "exact" });

    if (search) {
      query = query.ilike("email", `%${search}%`);
    }

    const { data, count, error } = await query.range(from, to);

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    const users = (data ?? []).map((user) => {
      const plan = normalizePlan(user.plans);
      const { plans: _plans, ...rest } = user;
      return {
        ...rest,
        plan_name: typeof plan?.name === "string" ? plan.name : null
      };
    });

    res.json({
      users,
      total: count ?? 0,
      page,
      limit
    });
  } catch (error) {
    next(error);
  }
});

adminRouter.patch("/users/:id", async (req, res, next) => {
  try {
    const body = updateUserSchema.parse(req.body);
    const update: { role?: string; plan_id?: string | null } = {};

    if (body.role !== undefined) {
      update.role = body.role;
    }

    if (body.plan_id !== undefined) {
      update.plan_id = body.plan_id;
    }

    const { data, error } = await supabaseAdmin
      .from("users")
      .update(update)
      .eq("id", req.params.id)
      .select("*")
      .single();

    if (error || !data) {
      res.status(400).json({ error: error?.message ?? "Unable to update user" });
      return;
    }

    res.json({ user: data });
  } catch (error) {
    next(error);
  }
});

adminRouter.get("/jobs", async (_req, res, next) => {
  try {
    const jobs = await pdfQueue.getJobs(
      ["completed", "failed", "delayed", "active", "waiting", "paused"],
      0,
      49,
      false
    );

    const mappedJobs = await Promise.all(
      jobs.map(async (job) => {
        const status = await job.getState();
        const processingMs =
          job.processedOn && job.finishedOn ? job.finishedOn - job.processedOn : null;

        return {
          id: job.id,
          tool:
            typeof job.data === "object" && job.data !== null && "tool" in job.data
              ? job.data.tool
              : job.name,
          status,
          created_at: job.timestamp ? new Date(job.timestamp).toISOString() : null,
          processing_ms: processingMs
        };
      })
    );

    res.json({ jobs: mappedJobs });
  } catch (error) {
    next(error);
  }
});

adminRouter.delete("/users/:id", async (req, res, next) => {
  try {
    const { error } = await supabaseAdmin.from("users").delete().eq("id", req.params.id);

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});
