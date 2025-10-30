import { cashIn } from "../db/schema";

export type CashInType = typeof cashIn.$inferSelect;

export type NewCashInType = typeof cashIn.$inferInsert;
