/**
 * Single source of truth for plan limits.
 *
 * IMPORTANT: the `slug` values here must exactly match the Plan slugs you
 * configure in the Clerk Dashboard (Billing -> Plans). Clerk webhooks send
 * us the slug, not an internal id, so this is the join key between
 * "what Clerk thinks the user bought" and "what limits we enforce".
 */

export const PLAN_SLUGS = ["free", "basic", "pro"] as const;
export type PlanSlug = (typeof PLAN_SLUGS)[number];

export interface PlanLimits {
    slug: PlanSlug;
    label: string;
    /** Hard monthly API call quota. Resets on the subscription's billing period. */
    apiCallsPerMonth: number;
    /** Burst limit to stop runaway scripts within a single plan tier. */
    requestsPerMinute: number;
    /** Max number of projects a user on this plan may own concurrently. */
    maxProjects: number;
}

export const PLAN_LIMITS: Record<PlanSlug, PlanLimits> = {
  free: {
    slug: "free",
    label: "Free",
    apiCallsPerMonth: 1_000,
    requestsPerMinute: 20,
    maxProjects: 10,
  },
  basic: {
    slug: "basic",
    label: "Basic",
    apiCallsPerMonth: 20_000,
    requestsPerMinute: 60,
    maxProjects: 50,
  },
  pro: {
    slug: "pro",
    label: "Pro",
    apiCallsPerMonth: 200_000,
    requestsPerMinute: 200,
    maxProjects: 500,
  },
};

export function isPlanSlug(value: string): value is PlanSlug {
    return (PLAN_SLUGS as readonly string[]).includes(value);
}

export function getPlanLimits(slug: string): PlanLimits {
    if (isPlanSlug(slug)) return PLAN_LIMITS[slug];
    // Unknown plan slug from Clerk (e.g. plan renamed in dashboard but not
    // here yet) — fail safe to the most restrictive tier rather than throwing,
    // so a config drift doesn't take down the API.
    return PLAN_LIMITS.free;
}