type type = "cash_in" | "cash_out";

export type TransactionType = {
  id: number;
  type: type;
  name: string;
  amount: number;
  createdAt: string; // Assuming 'text' for date/time
  groupId: number;
};

export type GeneralStatsType = {
  transactionCount: number;
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
};
