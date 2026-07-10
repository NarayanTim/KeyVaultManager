import {unique, pgTable, text, timestamp, uuid, boolean } from "drizzle-orm/pg-core";
import { projects } from "./Project.model.ts";

export const projectKeys = pgTable("project_keys", {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }).unique(),
    keyHash: text("key_hash").notNull().unique(),
    lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type ProjectKey    = typeof projectKeys.$inferSelect;
export type InsertProjectKey = typeof projectKeys.$inferInsert;
