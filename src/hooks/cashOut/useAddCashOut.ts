import { useDb } from "@/src/db";
import { addCashOut } from "@/src/db/api/cashOut";
import { NewCashOutType } from "@/src/types/cashOut";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  GROUP_LIST_KEY,
  GROUP_TRANSACTIONS_LIST_KEY,
  LATEST_TRANSACTIONS_LIST_KEY,
  TRANSACTIONS_STATISTICS_KEY,
} from "../keys";

export const useAddCashOut = () => {
  const db = useDb();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newCashOut: NewCashOutType) => addCashOut(db, newCashOut),
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
