import { useDb } from "@/src/db";
import {
  deactivateGroup,
  deleteGroup,
  reactivateGroup,
  updateGroup,
} from "@/src/db/api/groups";
import { UpdateGroupType } from "@/src/types/group";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  GROUP_LIST_KEY,
  LATEST_TRANSACTIONS_LIST_KEY,
  TRANSACTIONS_STATISTICS_KEY,
} from "../keys";

// Hook to update group
export const useUpdateGroup = () => {
  const db = useDb();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updateData: UpdateGroupType) => updateGroup(db, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GROUP_LIST_KEY });
      queryClient.invalidateQueries({ queryKey: LATEST_TRANSACTIONS_LIST_KEY });
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_STATISTICS_KEY });
    },
  });
};

// Hook to deactivate group
export const useDeactivateGroup = () => {
  const db = useDb();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deactivateGroup(db, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GROUP_LIST_KEY });
      queryClient.invalidateQueries({ queryKey: LATEST_TRANSACTIONS_LIST_KEY });
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_STATISTICS_KEY });
    },
  });
};

// Hook to reactivate group
export const useReactivateGroup = () => {
  const db = useDb();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => reactivateGroup(db, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GROUP_LIST_KEY });
      queryClient.invalidateQueries({ queryKey: LATEST_TRANSACTIONS_LIST_KEY });
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_STATISTICS_KEY });
    },
  });
};

// Hook to hard delete group
export const useDeleteGroup = () => {
  const db = useDb();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteGroup(db, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GROUP_LIST_KEY });
      queryClient.invalidateQueries({ queryKey: LATEST_TRANSACTIONS_LIST_KEY });
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_STATISTICS_KEY });
    },
  });
};
