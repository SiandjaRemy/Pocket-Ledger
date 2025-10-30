import {
  GroupWithStats,
  NewGroupType,
  UpdateGroupType,
} from "@/src/types/group";
import { count, desc, eq, sql, sum } from "drizzle-orm";
import { DrizzleDb } from ".";
import { cashIn, cashOut, groups } from "../schema";

export const getGroups = (db: DrizzleDb): GroupWithStats[] => {
  // Subquery for cash in totals per group
  const cashInTotals = db
    .select({
      groupId: cashIn.groupId,
      totalIncome: sum(cashIn.amount).as("totalIncome"),
      cashInCount: count(cashIn.id).as("cashInCount"),
    })
    .from(cashIn)
    .groupBy(cashIn.groupId)
    .as("cashInTotals");

  // Subquery for cash out totals per group
  const cashOutTotals = db
    .select({
      groupId: cashOut.groupId,
      totalExpenses: sum(cashOut.amount).as("totalExpenses"),
      cashOutCount: count(cashOut.id).as("cashOutCount"),
    })
    .from(cashOut)
    .groupBy(cashOut.groupId)
    .as("cashOutTotals");

  // Main query with left joins to handle groups with no transactions
  const result = db
    .select({
      // Group fields
      id: groups.id,
      name: groups.name,
      isActive: groups.isActive,
      createdAt: groups.createdAt,
      updatedAt: groups.updatedAt,
      // Calculated fields with coalesce to handle null values
      transactionCount: sql<number>`
        COALESCE(${cashInTotals.cashInCount}, 0) + COALESCE(${cashOutTotals.cashOutCount}, 0)
      `.as("transactionCount"),
      totalIncome: sql<number>`
        COALESCE(${cashInTotals.totalIncome}, 0)
      `.as("totalIncome"),
      totalExpenses: sql<number>`
        COALESCE(${cashOutTotals.totalExpenses}, 0)
      `.as("totalExpenses"),
      netBalance: sql<number>`
        COALESCE(${cashInTotals.totalIncome}, 0) - COALESCE(${cashOutTotals.totalExpenses}, 0)
      `.as("netBalance"),
    })
    .from(groups)
    .orderBy(desc(groups.isActive), desc(groups.createdAt))
    .leftJoin(cashInTotals, eq(groups.id, cashInTotals.groupId))
    .leftJoin(cashOutTotals, eq(groups.id, cashOutTotals.groupId))
    .all();

  return result;
};

export const getGroupById = (db: DrizzleDb, id: number) => {
  return db.select().from(groups).where(eq(groups.id, id)).get();
};

export const addGroup = async (db: DrizzleDb, newGroup: NewGroupType) => {
  const result = db.insert(groups).values(newGroup).returning().get();
  return Promise.resolve(result);
};

export const updateGroup = async (
  db: DrizzleDb,
  updateData: UpdateGroupType
) => {
  const { id, ...updateFields } = updateData;

  if (Object.keys(updateFields).length === 0) {
    throw new Error("No fields to update");
  }

  const result = db
    .update(groups)
    .set({
      ...updateFields,
      updatedAt: sql`(CURRENT_TIMESTAMP)`, // Force update timestamp
    })
    .where(eq(groups.id, id))
    .returning()
    .get();

  return result;
};

// Soft delete - deactivate group
export const deactivateGroup = async (db: DrizzleDb, id: number) => {
  return updateGroup(db, { id, isActive: false });
};

// Reactivate group
export const reactivateGroup = async (db: DrizzleDb, id: number) => {
  return updateGroup(db, { id, isActive: true });
};

export const deleteGroup = async (db: DrizzleDb, id: number) => {
  const result = db.delete(groups).where(eq(groups.id, id)).run();
  return result;
};
