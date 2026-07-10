import { pgTable, unique, text, timestamp, uuid, integer, boolean } from "drizzle-orm/pg-core";
import { projects } from "./project.model";


export const secrets = pgTable("secrets", {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
    secretName: text("secret_name").notNull(),
    encryptedValue: text("encrypted_value").notNull().unique(),  // AES-256-GCM recommended
    isActive:boolean("is_active").default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    uniqueProjectSecretName: unique().on(table.projectId, table.secretName),
}));

export type Secret = typeof secrets.$inferSelect;
export type InsertSecret = typeof secrets.$inferInsert;
