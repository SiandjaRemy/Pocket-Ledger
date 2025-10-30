import QuickStats from "@/src/components/features/home/QuickStats";
import TransactionsList from "@/src/components/features/transactions/TransactionsList";
import { useLatestTransactions } from "@/src/hooks/transactions/useLatestTransactions";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const {
    data: transactions,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useLatestTransactions();

  return (
    <SafeAreaView className="flex-1 bg-gray-50 pt-4">
      <View className="flex-1 max-w-4xl mx-auto w-full px-4">
        {/* Header */}
        <View className="mb-4">
          <Text className="text-3xl font-bold text-gray-900">
            Financial Overview
          </Text>
          <Text className="text-gray-600 mt-2">
            Latest transactions across all groups
          </Text>
        </View>

        {/* Quick stats */}
        <QuickStats />

        {/* Main Content */}
        <View className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-1">
          {/* Section Header */}
          <View className="px-6 py-4 border-b border-gray-200 items-center gap-2 flex flex-row">
            <Text className="text-lg font-semibold text-gray-800 flex flex-row items-center">
              {transactions && transactions?.length > 0 ? (
                <>
                  <MaterialIcons name="attach-money" size={18} color="black" />
                  <Text className="text-lg font-semibold text-gray-800 flex flex-row items-center">
                    {transactions?.length} Latest Transactions
                  </Text>
                </>
              ) : (
                <Text className="text-lg font-semibold text-gray-800 flex flex-row items-center">
                  No transactions to display
                </Text>
              )}
            </Text>
          </View>

          {/* Content Area */}
          <View className="flex-1 p-4">
            <TransactionsList
              transactions={transactions || []}
              isLoading={isLoading}
              isError={isError}
              error={error}
              refetch={refetch}
              isRefetching={isRefetching}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
