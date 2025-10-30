import { GeneralStatsType } from "@/src/types/transaction";
import { desc, eq, sql } from "drizzle-orm";
import { unionAll } from "drizzle-orm/sqlite-core";
import { DrizzleDb } from ".";
import { cashIn, cashOut, groups } from "../schema";

// This query gets a combined, sorted feed for a specific group
export const getCombinedTransactionsForGroup = (
  db: DrizzleDb,
  groupId: number
) => {
  // Select from cashIn, adding a 'type' field
  const cashInQuery = db
    .select({
      id: cashIn.id,
      type: sql<"cash_in">`'cash_in'`.as("type"),
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
      amount: sql<number>`${cashOut.amount}`, // Note: Corrected template literal usage
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
      type: sql<"cash_in">`'cash_in'`.as("type"),
      name: cashIn.name,
      amount: cashIn.amount,
      createdAt: cashIn.createdAt,
      groupId: cashIn.groupId,
    })
    .from(cashIn)
    .innerJoin(groups, eq(cashIn.groupId, groups.id)) // Join with groups table
    .where(eq(groups.isActive, true)); // Only active groups

  // Example for cashOutQuery (no WHERE)
  const cashOutQuery = db
    .select({
      id: cashOut.id,
      type: sql<"cash_in">`'cash_out'`.as("type"),
      name: cashOut.reason, // Use 'reason' as the display 'name'
      amount: sql<number>`${cashOut.amount}`, // Note: Corrected template literal usage
      createdAt: cashOut.createdAt,
      groupId: cashOut.groupId,
    })
    .from(cashOut)
    .innerJoin(groups, eq(cashOut.groupId, groups.id)) // Join with groups table
    .where(eq(groups.isActive, true)); // Only active groups

  const combinedQuery = unionAll(cashInQuery, cashOutQuery).as("transactions"); // Alias is necessary for the next step

  return db
    .select()
    .from(combinedQuery)
    .orderBy(desc(combinedQuery.createdAt))
    .limit(limit);
};

export async function getGeneralStatistics(
  db: DrizzleDb
): Promise<GeneralStatsType> {
  // Get income stats from active groups
  const incomeStats = db
    .select({
      totalIncome: sql<number>`COALESCE(SUM(${cashIn.amount}), 0)`,
      incomeCount: sql<number>`COUNT(${cashIn.id})`,
    })
    .from(cashIn)
    .innerJoin(groups, eq(cashIn.groupId, groups.id))
    .where(eq(groups.isActive, true))
    .get();

  // Get expense stats from active groups
  const expenseStats = db
    .select({
      totalExpenses: sql<number>`COALESCE(SUM(${cashOut.amount}), 0)`,
      expenseCount: sql<number>`COUNT(${cashOut.id})`,
    })
    .from(cashOut)
    .innerJoin(groups, eq(cashOut.groupId, groups.id))
    .where(eq(groups.isActive, true))
    .get();

  const totalIncome = incomeStats?.totalIncome ?? 0;
  const totalExpenses = expenseStats?.totalExpenses ?? 0;
  const incomeCount = incomeStats?.incomeCount ?? 0;
  const expenseCount = expenseStats?.expenseCount ?? 0;

  return {
    transactionCount: incomeCount + expenseCount,
    totalIncome,
    totalExpenses,
    netBalance: totalIncome - totalExpenses,
  };
}
