import { pgTable, text, timestamp, uuid, boolean, pgEnum, integer } from "drizzle-orm/pg-core";
import { users } from "./Users.model.ts"

/**
 * Membership / Subscription state — mirrors Clerk Billing's Subscription
 * Item model (https://clerk.com/docs/guides/development/webhooks/billing).
 *
 * Source of truth: Clerk. This table is a read replica we keep in sync via
 * webhooks (`subscriptionItem.*` events) so we can query plan/limits
 * locally without calling Clerk's API on every request.
 *
 * `planSlug` MUST match a key in PLAN_LIMITS (src/config/plans.ts) and a
 * Plan slug configured in the Clerk Dashboard.
 *
 * Clerk subscription item statuses (real values, not invented):
 *   active | upcoming | ended | canceled | abandoned | incomplete | past_due
 */
export const planEnum = pgEnum("plan_slug", ["free", "basic", "pro"]);

export const subscriptionStatusEnum = pgEnum("subscription_status", [
    "active",
    "upcoming",
    "ended",
    "canceled",
    "abandoned",
    "incomplete",
    "past_due",
]);

export const memberships = pgTable("memberships", {
    id: uuid("id").primaryKey().defaultRandom(),
  // one active membership row per user; plan changes UPDATE this row
    userId: uuid("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),

    // Clerk identifiers — needed to map inbound webhook payloads back to this row.
    clerkSubscriptionId: text("clerk_subscription_id"), // top-level Subscription id
    clerkSubscriptionItemId: text("clerk_subscription_item_id").unique(), // active item id
    clerkOrganizationId: text("clerk_organization_id"), // set only for org-level billing

    plan: planEnum("plan").notNull().default("free"),
    status: subscriptionStatusEnum("status").notNull().default("active"),

    // Billing period — drives the monthly API quota reset (see usageCounters).
    currentPeriodStart: timestamp("current_period_start", { withTimezone: true }),
    currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
    cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false).notNull(),

  // Usage snapshot cached here for cheap reads (authoritative counter lives
  // in usageCounters; this is denormalized for the "GET /me/membership" endpoint).
    projectCount: integer("project_count").default(0).notNull(),

    lastSyncedAt: timestamp("last_synced_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Membership = typeof memberships.$inferSelect;
export type NewMembership = typeof memberships.$inferInsert;
