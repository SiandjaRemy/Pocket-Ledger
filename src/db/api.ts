import { desc, eq, sql } from "drizzle-orm";
import { unionAll } from "drizzle-orm/sqlite-core"; // <-- Add unionAll and other required imports
import {
  NewCashIn,
  NewCashOut,
  NewGroup,
  cashIn,
  cashOut,
  groups,
} from "./schema";

// Type alias for clarity
type DrizzleDb = ReturnType<typeof import("./index").useDb>;

// --- GROUP FUNCTIONS ---

export const getGroups = (db: DrizzleDb) => {
  return db.select().from(groups).all();
};

export const getGroupById = (db: DrizzleDb, id: number) => {
  // .get() is optimized for returning a single object
  return db.select().from(groups).where(eq(groups.id, id)).get();
};

export const addGroup = (db: DrizzleDb, newGroup: NewGroup) => {
  return db.insert(groups).values(newGroup).returning().get();
};

export const deleteGroup = (db: DrizzleDb, id: number) => {
  return db.delete(groups).where(eq(groups.id, id)).run();
};

// --- COMBINED TRANSACTIONS FUNCTIONS ---

// This query gets a combined, sorted feed for a specific group
export const getCombinedTransactionsForGroup = (
  db: DrizzleDb,
  groupId: number
) => {
  // Select from cashIn, adding a 'type' field
  const cashInQuery = db
    .select({
      id: cashIn.id,
      type: sql<"cash_in">`'cash_in'`,
      name: cashIn.name,
      amount: cashIn.amount,
      createdAt: cashIn.createdAt,
      groupId: cashIn.groupId,
    })
    .from(cashIn)
    .where(eq(cashIn.groupId, groupId));

  // Select from cashOut, adding a 'type' field and a 'name' (from reason)
  const cashOutQuery = db
    .select({
      id: cashOut.id,
      type: sql<"cash_in">`'cash_out'`.as("type"),
      name: cashOut.reason, // Use 'reason' as the display 'name'
      amount: sql<number>`-${cashOut.amount}`, // Note: Corrected template literal usage
      createdAt: cashOut.createdAt,
      groupId: cashOut.groupId,
    })
    .from(cashOut)
    .where(eq(cashOut.groupId, groupId));

  // Combine them
  const combinedQuery = unionAll(cashInQuery, cashOutQuery).as("transactions"); // Alias is necessary for the next step

  return db.select().from(combinedQuery).orderBy(desc(combinedQuery.createdAt));
};

// For your home screen (latest, all groups)
export const getLatestTransactions = (db: DrizzleDb, limit = 10) => {
  // (Same cashInQuery and cashOutQuery as above, just remove the .where() clauses)

  // Example for cashInQuery (no WHERE)
  const cashInQuery = db
    .select({
      id: cashIn.id,
      type: sql<"cash_in">`'cash_in'`,
      name: cashIn.name,
      amount: cashIn.amount,
      createdAt: cashIn.createdAt,
      groupId: cashIn.groupId,
    })
    .from(cashIn);
  // Example for cashOutQuery (no WHERE)
  const cashOutQuery = db
    .select({
      id: cashOut.id,
      type: sql<"cash_in">`'cash_out'`.as("type"),
      name: cashOut.reason, // Use 'reason' as the display 'name'
      amount: sql<number>`-${cashOut.amount}`, // Note: Corrected template literal usage
      createdAt: cashOut.createdAt,
      groupId: cashOut.groupId,
    })
    .from(cashOut);

  const combinedQuery = unionAll(cashInQuery, cashOutQuery).as("transactions"); // Alias is necessary for the next step

  return db
    .select()
    .from(combinedQuery)
    .orderBy(desc(combinedQuery.createdAt))
    .limit(limit);
};

// --- CASH IN FUNCTIONS ---

export const getCashInsForGroup = (db: DrizzleDb, groupId: number) => {
  return db.select().from(cashIn).where(eq(cashIn.groupId, groupId)).all();
};

export const addCashIn = (db: DrizzleDb, newCashIn: NewCashIn) => {
  return db.insert(cashIn).values(newCashIn).returning().get();
};

export const deleteCashIn = (db: DrizzleDb, cashInId: number) => {
  return db.delete(cashIn).where(eq(cashIn.id, cashInId)).run();
};

// --- CASH OUT FUNCTIONS ---

export const getCashOutsForGroup = (db: DrizzleDb, groupId: number) => {
  return db.select().from(cashOut).where(eq(cashOut.groupId, groupId)).all();
};

export const addCashOut = (db: DrizzleDb, newCashOut: NewCashOut) => {
  return db.insert(cashOut).values(newCashOut).returning().get();
};

export const deleteCashOut = (db: DrizzleDb, cashOutId: number) => {
  return db.delete(cashOut).where(eq(cashOut.id, cashOutId)).run();
};
