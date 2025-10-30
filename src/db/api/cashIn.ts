import { NewCashInType } from "@/src/types/cashIn";
import { eq } from "drizzle-orm";
import { DrizzleDb } from ".";
import { cashIn } from "../schema";

export const getCashInsForGroup = (db: DrizzleDb, groupId: number) => {
  return db.select().from(cashIn).where(eq(cashIn.groupId, groupId)).all();
};

export const addCashIn = async (db: DrizzleDb, newCashIn: NewCashInType) => {
  return db.insert(cashIn).values(newCashIn).returning().get();
};

export const deleteCashIn = (db: DrizzleDb, cashInId: number) => {
  return db.delete(cashIn).where(eq(cashIn.id, cashInId)).run();
};
