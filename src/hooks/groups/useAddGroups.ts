import { useDb } from "@/src/db";
import { addGroup } from "@/src/db/api";
import { NewGroup } from "@/src/db/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GROUP_LIST_KEY } from "../keys";

export const useAddGroup = () => {
  const db = useDb();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newGroup: NewGroup) => {
      // Ensure addGroup returns a promise
      const result = await addGroup(db, newGroup);
      return result; // This should be a promise resolving to the added group
    },
    onSuccess: () => {
      // When this mutation succeeds,
      // invalidate the 'groups' query to force a re-fetch.
      // This makes your list update automatically!
      queryClient.invalidateQueries({ queryKey: GROUP_LIST_KEY });
    },
    onError: (err) => {
      console.error(err);
    },
  });
};
