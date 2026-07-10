import { pgTable, unique, text, timestamp, uuid, boolean } from "drizzle-orm/pg-core";
import { users } from "./Users.model.ts";

export const projects = pgTable("projects",{
        id: uuid("id").primaryKey().defaultRandom(),

        userId: uuid("user_id").notNull().references(() => users.id, {onDelete: "cascade",}),

        name: text("name").notNull(),

        isActive: boolean("is_active").default(true).notNull(),

        createdAt: timestamp("created_at", {withTimezone: true,}).defaultNow().notNull(),

        updatedAt: timestamp("updated_at", {withTimezone: true,})
            .defaultNow()
            .notNull(),
    },
    (table) => ({
        uniqueUserProjectName: unique().on(
            table.userId,
            table.name
        ),
    })
);

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;
