import { useDb } from "@/src/db";
import { addCashIn } from "@/src/db/api/cashIn";
import { NewCashInType } from "@/src/types/cashIn";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  GROUP_LIST_KEY,
  GROUP_TRANSACTIONS_LIST_KEY,
  LATEST_TRANSACTIONS_LIST_KEY,
  TRANSACTIONS_STATISTICS_KEY,
} from "../keys";

export const useAddCashIn = () => {
  const db = useDb();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newCashIn: NewCashInType) => addCashIn(db, newCashIn),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [GROUP_TRANSACTIONS_LIST_KEY, variables.groupId],
      });
      queryClient.invalidateQueries({ queryKey: GROUP_LIST_KEY });
      queryClient.invalidateQueries({ queryKey: LATEST_TRANSACTIONS_LIST_KEY });
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_STATISTICS_KEY });
    },
  });
};
