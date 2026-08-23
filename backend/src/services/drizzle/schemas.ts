import { sql } from "drizzle-orm";
import { pgTable, integer, varchar, boolean, primaryKey, foreignKey } from "drizzle-orm/pg-core";
import { temporalPlainDateTime } from "./dataTypes";

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userName: varchar("userName").notNull().unique("UNIQUE_userName"),
  passwordHash: varchar("passwordHash").notNull(),
  isDeleted: boolean("isDeleted").notNull().default(false)
}, (table) => [
  primaryKey({
    name: "PK_users_id",
    columns: [table.id]
  }),
]);

export const menuItems = pgTable("menuItems", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull().unique("UNIQUE_menuItems_name"),
  unit: varchar(),
  createdDateTime: temporalPlainDateTime().notNull().default(sql`LOCALTIMESTAMP`),
  lastUpdatedDateTime: temporalPlainDateTime(),
  deletedDateTime: temporalPlainDateTime(),
  defaultAmountBeforeVatPerUnit: integer().notNull().default(0),
  defaultVatPercentagePerUnit: integer().notNull().default(0),
  categoryId: integer().references(() => menuCategories.id, { onUpdate: "cascade", onDelete: "set null" }),
  createdUserId: integer().notNull().references(() => users.id, { onUpdate: "cascade", onDelete: "restrict" }),
  lastUpdatedUserId: integer().references(() => users.id, { onUpdate: "cascade", onDelete: "restrict" }),
  deletedUserId: integer().references(() => users.id, { onUpdate: "cascade", onDelete: "restrict" })
}, (table) => [
  primaryKey({
    name: "PK_menuItems_id",
    columns: [table.id]
  }),
  foreignKey({
    name: "FK_menuItems_menuCategories_categoryId",
    columns: [table.categoryId],
    foreignColumns: [menuCategories.id]
  }),
  foreignKey({
    name: "FK_menuItems_users_createdUserId",
    columns: [table.createdUserId],
    foreignColumns: [users.id]
  }),
  foreignKey({
    name: "FK_menuItems_users_lastUpdatedUserId",
    columns: [table.lastUpdatedUserId],
    foreignColumns: [users.id]
  }),
  foreignKey({
    name: "FK_menuItems_users_deletedUserId",
    columns: [table.deletedUserId],
    foreignColumns: [users.id]
  }),
]);

export const menuCategories = pgTable("menuCategories", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull().unique("UNIQUE_menuCategories_name"),
}, (table) => [
  primaryKey({
    name: "PK_menuCategories_id",
    columns: [table.id]
  }),
]);

export const seatings = pgTable("seatings", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull().unique("UNIQUE_seatings_name"),
}, (table) => [
  primaryKey({
    name: "PK_seatings_id",
    columns: [table.id]
  }),
]);

export const orders = pgTable("orders", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  createdDateTime: temporalPlainDateTime().notNull().default(sql`LOCALTIMESTAMP`),
  lastUpdatedDateTime: temporalPlainDateTime(),
  deletedDateTime: temporalPlainDateTime(),
  finishedDateTime: temporalPlainDateTime(),
  cachedItemAmount: integer(),
  createdUserId: integer().notNull().references(() => users.id, { onUpdate: "cascade", onDelete: "restrict" }),
  lastUpdatedUserId: integer().references(() => users.id, { onUpdate: "cascade", onDelete: "restrict" }),
  deletedUserId: integer().references(() => users.id, { onUpdate: "cascade", onDelete: "restrict" }),
  finishedUserId: integer().references(() => users.id, { onUpdate: "cascade", onDelete: "restrict" }),
  seatingId: integer().references(() => seatings.id, { onUpdate: "cascade", onDelete: "restrict" }),
}, (table) => [
  primaryKey({
    name: "PK_orders_id",
    columns: [table.id]
  }),
  foreignKey({
    name: "FK_orders_users_createdUserId",
    columns: [table.createdUserId],
    foreignColumns: [users.id]
  }),
  foreignKey({
    name: "FK_orders_users_lastUpdatedUserId",
    columns: [table.lastUpdatedUserId],
    foreignColumns: [users.id]
  }),
  foreignKey({
    name: "FK_orders_users_deletedUserId",
    columns: [table.deletedUserId],
    foreignColumns: [users.id]
  }),
  foreignKey({
    name: "FK_orders_users_finishedUserId",
    columns: [table.finishedUserId],
    foreignColumns: [users.id]
  }),
  foreignKey({
    name: "FK_orders_seatings_seatingId",
    columns: [table.seatingId],
    foreignColumns: [seatings.id]
  }),
]);

export const orderItems = pgTable("orderItems", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  quantity: integer().notNull(),
  orderId: integer().notNull().references(() => orders.id, { onUpdate: "cascade", onDelete: "cascade" }),
  menuItemId: integer().references(() => menuItems.id, { onUpdate: "cascade", onDelete: "restrict" })
}, (table) => [
  primaryKey({
    name: "PK_orderItems_id",
    columns: [table.id]
  }),
  foreignKey({
    name: "FK_orderItems_order_orderId",
    columns: [table.orderId],
    foreignColumns: [orders.id]
  }),
  foreignKey({
    name: "FK_orderItems_menuItems_menuItemId",
    columns: [table.menuItemId],
    foreignColumns: [menuItems.id]
  }),
]);
