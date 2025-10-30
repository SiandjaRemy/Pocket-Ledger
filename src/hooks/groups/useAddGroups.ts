import { useDb } from "@/src/db";
import { addGroup } from "@/src/db/api/groups";
import { NewGroupType } from "@/src/types/group";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GROUP_LIST_KEY } from "../keys";

export const useAddGroup = () => {
  const db = useDb();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newGroup: NewGroupType) => {
      // Ensure addGroup returns a promise
      const result = await addGroup(db, newGroup);
      return result; // This should be a promise resolving to the added group
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GROUP_LIST_KEY });
    },
    onError: (err) => {
      console.error(err);
    },
  });
};
