import { useDb } from "@/src/db";
import { getLatestTransactions } from "@/src/db/api/transactions";
import { useQuery } from "@tanstack/react-query";
import { LATEST_TRANSACTIONS_LIST_KEY } from "../keys";

// Hook to get all the latest transactions (cash in or cash out)
export const useLatestTransactions = () => {
  const db = useDb();
  return useQuery({
    queryKey: LATEST_TRANSACTIONS_LIST_KEY,
    queryFn: () => getLatestTransactions(db),
  });
};
