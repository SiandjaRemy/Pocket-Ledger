import { COLORS } from "@/src/constants/colors";
import { GroupWithStats } from "@/src/types/group";
import { FlatList, RefreshControl } from "react-native";
import EmptyState from "../../shared/EmptyComponent";
import ErrorState from "../../shared/ErrorComponent";
import LoadingState from "../../shared/LoadingComponent";
import SwipeableGroupCard from "./SwipeableGroupCard";

interface GroupListProps {
  groups: GroupWithStats[];
  isLoading: boolean;
  isError: boolean;
  error: Error | any;
  refetch: () => void;
  isRefetching: boolean;
}

const GroupsList: React.FC<GroupListProps> = ({
  groups,
  isLoading,
  isError = false,
  error,
  refetch,
  isRefetching,
}) => {
  if (isLoading) {
    return <LoadingState />;
  }

  if (isError && error) {
    return (
      <ErrorState
        error={error}
        onRetry={refetch}
        message="Unable to load groups"
      />
    );
  }

  return (
    <FlatList
      data={groups}
      renderItem={({ item }) => (
        <SwipeableGroupCard key={item.id} group={item} />
      )}
      keyExtractor={(item) => item.id.toString()}
      contentContainerClassName="pb-5 grow gap-2"
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <EmptyState
          title="No groups found"
          message="Create your first group and start recording your expenses"
        />
      }
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          colors={[COLORS.blue]}
          tintColor={COLORS.blue}
        />
      }
    />
  );
};

export default GroupsList;
