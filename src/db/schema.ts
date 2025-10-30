import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// --- Groups Table (Updated) ---
// Stores the main group entities.

export const groups = sqliteTable("groups", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true), // true by default

  // Auto-generated creation date
  createdAt: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),

  // Auto-updated modification date
  updatedAt: text("updated_at")
    .notNull()
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});

// --- Cash In Table ---
// Stores all income transactions, linked to a group.

export const cashIn = sqliteTable("cash_in", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(), // e.g., "Client Payment", "Donation"
  amount: integer("amount").notNull(), // Amount in cents (see good practices)
  source: text("source").notNull(), // e.g., "Client X", "Online Store"

  // Foreign key linking to the 'groups' table
  groupId: integer("group_id")
    .notNull()
    .references(() => groups.id, { onDelete: "cascade" }), // See practices

  createdAt: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at")
    .notNull()
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});

// --- Cash Out Table ---
// Stores all expense transactions, linked to a group.

export const cashOut = sqliteTable("cash_out", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  amount: integer("amount").notNull(), // Amount in cents
  reason: text("reason").notNull(), // e.g., "Office Supplies", "Software License"

  // Foreign key linking to the 'groups' table
  groupId: integer("group_id")
    .notNull()
    .references(() => groups.id, { onDelete: "cascade" }),

  // Optional foreign key linking to a specific 'cash_in' transaction
  cashInId: integer("cash_in_id").references(() => cashIn.id, {
    onDelete: "set null",
  }), // See practices

  createdAt: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at")
    .notNull()
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});
