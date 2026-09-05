import { pgTable, text, serial, doublePrecision, timestamp, integer } from "drizzle-orm/pg-core";

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  unit: text("unit").notNull(), // e.g. "reps", "km", "minutes"
  description: text("description"),
  color: text("color").notNull().default("#171717"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const entries = pgTable("entries", {
  id: serial("id").primaryKey(),
  activityId: integer("activity_id")
    .notNull()
    .references(() => activities.id, { onDelete: "cascade" }),
  date: text("date").notNull(), // stored as YYYY-MM-DD
  quantity: doublePrecision("quantity").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
