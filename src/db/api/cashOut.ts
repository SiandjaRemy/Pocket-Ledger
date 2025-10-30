import { NewCashOutType } from "@/src/types/cashOut";
import { eq } from "drizzle-orm";
import { DrizzleDb } from ".";
import { cashOut } from "../schema";

export const getCashOutsForGroup = (db: DrizzleDb, groupId: number) => {
  return db.select().from(cashOut).where(eq(cashOut.groupId, groupId)).all();
};

export const addCashOut = async (db: DrizzleDb, newCashOut: NewCashOutType) => {
  return db.insert(cashOut).values(newCashOut).returning().get();
};

export const deleteCashOut = (db: DrizzleDb, cashOutId: number) => {
  return db.delete(cashOut).where(eq(cashOut.id, cashOutId)).run();
};
