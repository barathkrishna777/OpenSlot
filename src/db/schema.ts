import { pgTable, text, varchar } from "drizzle-orm/pg-core";

export const userPreferences = pgTable("user_preferences", {
  userId: varchar("user_id", { length: 256 }).primaryKey(),
  defaultTimezone: text("default_timezone").default("America/New_York"),
  workingHoursStart: varchar("working_hours_start", { length: 5 }).default(
    "09:00"
  ),
  workingHoursEnd: varchar("working_hours_end", { length: 5 }).default(
    "17:00"
  ),
});
