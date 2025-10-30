import { useGeneralStatistics } from "@/src/hooks/transactions/useGeneralStatistics";
import { formatAmount } from "@/src/utils/formatAmount";
import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import ErrorState from "../../shared/ErrorComponent";
import StatCard from "./StatCard";

export default function QuickStats() {
  const { data: stats, isLoading, error, refetch } = useGeneralStatistics();

  return (
    <View className="mb-6">
      <Text className="text-lg font-semibold text-gray-900 mb-4">Overview</Text>

      {isLoading ? (
        <View className="flex flex-row flex-wrap justify-between gap-3">
          {[1, 2, 3, 4].map((item) => (
            <View
              key={item}
              className="bg-gray-100 border border-gray-200 rounded-xl p-4 flex-1 min-w-[45%]"
            >
              <View className="flex-row items-center justify-between mb-2">
                <View className="h-4 bg-gray-300 rounded w-20 animate-pulse" />
                <View className="w-8 h-8 rounded-full bg-gray-300 animate-pulse" />
              </View>
              <View className="h-6 bg-gray-300 rounded animate-pulse" />
            </View>
          ))}
        </View>
      ) : error ? (
        <ErrorState
          error={error}
          title="Failed to load statistics"
          message="There was an error loading your financial overview."
          onRetry={refetch}
        />
      ) : !stats ? (
        <EmptyStats />
      ) : (
        <View className="flex flex-row flex-wrap justify-between gap-3">
          {/* Transactions Count */}
          <StatCard
            title="Total Transactions"
            value={stats.transactionCount.toString()}
            icon="layers"
            color="blue"
            isAmount={false}
          />

          {/* Total Income */}
          <StatCard
            title="Total Income"
            value={formatAmount(stats.totalIncome).toString()}
            icon="trending-up"
            color="green"
            isAmount={true}
            currency="XAF"
          />

          {/* Total Expenses */}
          <StatCard
            title="Total Expenses"
            value={formatAmount(stats.totalExpenses).toString()}
            icon="trending-down"
            color="red"
            isAmount={true}
            currency="XAF"
          />

          {/* Net Balance */}
          <StatCard
            title="Net Balance"
            value={formatAmount(stats.netBalance).toString()}
            icon="dollar-sign"
            color={stats.netBalance >= 0 ? "green" : "red"}
            isAmount={true}
            currency="XAF"
          />
        </View>
      )}
    </View>
  );
}

// Empty State (if no data exists)
function EmptyStats() {
  return (
    <View className="mb-6">
      <Text className="text-lg font-semibold text-gray-900 mb-4">Overview</Text>
      <View className="bg-gray-50 border border-gray-200 rounded-xl p-6 items-center">
        <Feather name="bar-chart-2" size={32} color="#9ca3af" />
        <Text className="text-gray-600 font-medium mt-2 text-center">
          No financial data yet
        </Text>
        <Text className="text-gray-500 text-sm text-center mt-1">
          Start adding transactions to see your overview
        </Text>
      </View>
    </View>
  );
}
