import { useDb } from "@/src/db";
import { getCombinedTransactionsForGroup } from "@/src/db/api/transactions";
import { useQuery } from "@tanstack/react-query";
import { GROUP_TRANSACTIONS_LIST_KEY } from "../keys";

export const useGroupTransactions = (groupId: number) => {
  const db = useDb();

  return useQuery({
    queryKey: [GROUP_TRANSACTIONS_LIST_KEY, groupId],
    queryFn: () => getCombinedTransactionsForGroup(db, groupId),
    enabled: !!groupId,
  });
};
