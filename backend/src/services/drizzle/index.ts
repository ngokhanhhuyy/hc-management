import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { relations } from "./relations";
import { users, menuItems, menuCategories, seatings, orders, orderItems } from "./schemas";

export const database = drizzle(process.env.DATABASE_URL!, { relations });

export type Database = typeof database;
export type User = typeof users.$inferSelect;
export type MenuItem = typeof menuItems.$inferSelect;
export type MenuCategory = typeof menuCategories.$inferSelect;
export type Seating = typeof seatings.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;

export * from "./schemas";
