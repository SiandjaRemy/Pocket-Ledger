import { groups } from "../db/schema";

export type GroupType = typeof groups.$inferSelect;

export type NewGroupType = typeof groups.$inferInsert;

export type UpdateGroupType = Partial<Omit<GroupType, "id">> & { id: number };

export type GroupWithStats = GroupType & {
  transactionCount: number;
  totalIncome: number;
  totalExpenses: number;
  netBalance: number; // You might want this too
};
