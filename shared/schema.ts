import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Monument table schema
export const monuments = pgTable("monuments", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  coordinates: json("coordinates").notNull().$type<[number, number]>(),
  description: text("description").notNull(),
  yearBuilt: text("year_built").notNull(),
  dynasty: text("dynasty").notNull(),
  primaryModel: text("primary_model").notNull(),
  historicalModels: json("historical_models").notNull().$type<{
    past: string;
    ancient: string;
  }>(),
  facts: json("facts").notNull().$type<string[]>(),
  visitingHours: text("visiting_hours").notNull(),
  entryFee: text("entry_fee"),
  UNESCO: boolean("unesco").default(false),
});

// Monument visit records
export const monumentVisits = pgTable("monument_visits", {
  id: serial("id").primaryKey(),
  monumentId: text("monument_id").notNull().references(() => monuments.id),
  userId: integer("user_id").references(() => users.id),
  visitedAt: timestamp("visited_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertMonumentSchema = createInsertSchema(monuments);
export const insertMonumentVisitSchema = createInsertSchema(monumentVisits);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Monument = typeof monuments.$inferSelect;
export type MonumentVisit = typeof monumentVisits.$inferSelect;
