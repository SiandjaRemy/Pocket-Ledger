import { COLORS } from "@/src/constants/colors";
import { Transaction } from "@/src/db/schema";
import { FlatList, RefreshControl } from "react-native";
import EmptyState from "../../shared/EmptyComponent";
import ErrorState from "../../shared/ErrorComponent";
import LoadingState from "../../shared/LoadingComponent";
import TransactionCard from "./TransactionCard";

interface TransactionsListtProps {
  transactions: Transaction[];
  isLoading: boolean;
  isError: boolean;
  error: Error | any;
  refetch: () => void;
  isRefetching: boolean;
}

const TransactionsList: React.FC<TransactionsListtProps> = ({
  transactions,
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
        message="Unable to load transactions"
      />
    );
  }

  return (
    <FlatList
      data={transactions}
      renderItem={({ item }) => (
        <TransactionCard key={item.id} transaction={item} />
      )}
      keyExtractor={(item) => `${item.type}-${item.id.toString()}`}
      contentContainerClassName="pb-5 grow gap-2"
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <EmptyState
          title="No transactions found"
          message="Create your first cash in"
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

export default TransactionsList;
