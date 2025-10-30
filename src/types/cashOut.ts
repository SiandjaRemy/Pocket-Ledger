import { cashOut } from "../db/schema";

export type CashOutType = typeof cashOut.$inferSelect;

export type NewCashOutType = typeof cashOut.$inferInsert;
