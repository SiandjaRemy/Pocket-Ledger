import { useDb } from "@/src/db";
import { getGeneralStatistics } from "@/src/db/api/transactions";
import { useQuery } from "@tanstack/react-query";
import { TRANSACTIONS_STATISTICS_KEY } from "../keys";

export const useGeneralStatistics = () => {
  const db = useDb();

  return useQuery({
    queryKey: TRANSACTIONS_STATISTICS_KEY,
    queryFn: () => getGeneralStatistics(db),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
