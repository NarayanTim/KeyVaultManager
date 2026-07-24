import { pgTable, unique, text, timestamp, uuid, integer, boolean } from "drizzle-orm/pg-core";
import { projects } from "./Project.model.ts";


export const secrets = pgTable("secrets", {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
    
    key: text("key").notNull(),
    value: text("value").notNull().unique(),  // AES-256-GCM recommended
    
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    uniqueProjectSecretName: unique().on(table.projectId, table.key),
}));

export type Secret = typeof secrets.$inferSelect;
export type InsertSecret = typeof secrets.$inferInsert;
