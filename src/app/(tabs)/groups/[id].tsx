import AddCashInModal from "@/src/components/features/transactions/modals/AddCashInModal";
import AddCashOutModal from "@/src/components/features/transactions/modals/AddCashOutModal";
import TransactionsList from "@/src/components/features/transactions/TransactionsList";
import ErrorState from "@/src/components/shared/ErrorComponent";
import LoadingState from "@/src/components/shared/LoadingComponent";
import { SimpleBackButton } from "@/src/components/ui/buttons/BackButton";
import { useGetGroup } from "@/src/hooks/groups/useGroups";
import { useGroupTransactions } from "@/src/hooks/transactions/useTransactions";
import { formatAmount } from "@/src/utils/formatAmount";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GroupScreen() {
  const { id } = useLocalSearchParams();
  const groupId = parseInt(Array.isArray(id) ? id[0] : id);

  const { data: groupData } = useGetGroup(groupId);

  const {
    data: transactions,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useGroupTransactions(groupId);

  const [cashInModalVisible, setCashInModalVisible] = useState(false);
  const [cashOutModalVisible, setCashOutModalVisible] = useState(false);

  // Calculate totals and available balance
  const { income, expenses, availableBalance, hasCashIn } = useMemo(() => {
    if (!transactions) {
      return {
        income: 0,
        expenses: 0,
        net: 0,
        availableBalance: 0,
        hasCashIn: false,
      };
    }

    const income = transactions
      .filter((t) => t.type === "cash_in")
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter((t) => t.type !== "cash_in")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const net = income - expenses;
    const hasCashIn = transactions.some((t) => t.type === "cash_in");

    return {
      income,
      expenses,
      net,
      availableBalance: net, // Available balance is the net amount
      hasCashIn,
    };
  }, [transactions]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !transactions) {
    return (
      <ErrorState
        error={error ? error : undefined}
        onRetry={refetch}
        message="There was an error loading transactions."
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-white px-4 pt-4 pb-6 border-b border-gray-200">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-1 gap-2">
            <View className="flex flex-row items-center gap-2">
              <SimpleBackButton />
              <Text className="text-2xl font-bold text-gray-900">
                {groupData?.name}
              </Text>
            </View>
            <Text className="text-gray-600 mt-1">
              {transactions.length} total transactions
            </Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View className="flex-row justify-between">
          <View className="items-center flex-1">
            <Text className="text-sm text-gray-600">Income</Text>
            <Text className="text-lg font-bold text-green-600">
              {formatAmount(income)}
            </Text>
          </View>
          <View className="items-center flex-1">
            <Text className="text-sm text-gray-600">Expenses</Text>
            <Text className="text-lg font-bold text-red-600">
              {formatAmount(expenses)}
            </Text>
          </View>
          <View className="items-center flex-1">
            <Text className="text-sm text-gray-600">Available</Text>
            <Text
              className={`text-lg font-bold ${
                availableBalance >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {formatAmount(availableBalance)}
            </Text>
          </View>
        </View>
      </View>

      <View className="flex flex-col grow">
        {/* Action Buttons */}
        <View className="flex-row px-4 py-4 gap-3">
          <TouchableOpacity
            onPress={() => setCashInModalVisible(true)}
            className="flex-1 bg-green-500 py-3 px-4 rounded-lg flex-row items-center justify-center"
          >
            <Feather name="plus" size={20} color="white" />
            <Text className="text-white font-semibold ml-2">Add Income</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setCashOutModalVisible(true)}
            className={`flex-1 py-3 px-4 rounded-lg flex-row items-center justify-center ${
              hasCashIn && availableBalance > 0 ? "bg-red-500" : "bg-gray-400"
            }`}
            disabled={!hasCashIn || availableBalance <= 0}
          >
            <Feather name="minus" size={20} color="white" />
            <Text className="text-white font-semibold ml-2">
              {!hasCashIn
                ? "Add Income First"
                : availableBalance <= 0
                  ? "No Funds"
                  : "Add Expense"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Help Text */}
        {!hasCashIn && (
          <View className="px-4 pb-4">
            <Text className="text-sm text-gray-600 text-center">
              Add income first to enable expense tracking
            </Text>
          </View>
        )}

        {/* Transactions List */}
        <View className="flex-1 px-4">
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

      {/* Modals */}
      <AddCashInModal
        visible={cashInModalVisible}
        onCancel={() => setCashInModalVisible(false)}
        groupId={groupId}
      />

      <AddCashOutModal
        visible={cashOutModalVisible}
        onCancel={() => setCashOutModalVisible(false)}
        groupId={groupId}
        availableBalance={availableBalance}
      />
    </SafeAreaView>
  );
}
