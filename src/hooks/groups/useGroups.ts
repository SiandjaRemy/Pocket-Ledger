import { useDb } from "@/src/db";
import { getGroupById, getGroups } from "@/src/db/api/groups";
import { useQuery } from "@tanstack/react-query";
import { GROUP_LIST_KEY, SINGLE_GROUP_KEY } from "../keys";

// Hook to get all groups
export const useGetGroups = () => {
  const db = useDb();
  return useQuery({
    queryKey: GROUP_LIST_KEY,
    queryFn: () => getGroups(db),
  });
};

// Hook to get a single group by its ID
export const useGetGroup = (id: number) => {
  const db = useDb();
  return useQuery({
    queryKey: [SINGLE_GROUP_KEY, id],
    queryFn: () => getGroupById(db, id),
  });
};
