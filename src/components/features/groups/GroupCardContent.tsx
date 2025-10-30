import { GroupWithStats } from "@/src/types/group";
import { formatAmount } from "@/src/utils/formatAmount";
import { formatDate, formatTime } from "@/src/utils/formatDate";
import { Feather } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

export default function GroupCardContent({
  group,
  onPress,
}: {
  group: GroupWithStats;
  onPress: (id: number) => void;
}) {
  const isPositiveBalance = group.netBalance >= 0;
  const expensePercent =
    group.totalIncome > 0
      ? Math.min(100, (group.totalExpenses / group.totalIncome) * 100)
      : 0;

  const isActive = group.isActive;

  return (
    <TouchableOpacity
      onPress={() => isActive && onPress(group.id)}
      activeOpacity={0.9}
      disabled={!isActive}
      className={`rounded-2xl border p-4 shadow-sm ${
        isActive
          ? "bg-white border-gray-200"
          : "bg-gray-100 border-gray-300 opacity-80"
      }`}
    >
      {/* HEADER */}
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center flex-1">
          <View
            className={`w-12 h-12 rounded-full items-center justify-center mr-3 ${
              isActive ? "bg-blue-100" : "bg-gray-200"
            }`}
          >
            <Text
              className={`font-bold text-base ${
                isActive ? "text-blue-600" : "text-gray-500"
              }`}
            >
              {group.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View className="flex-1">
            <Text
              className={`text-lg font-semibold ${
                isActive ? "text-gray-900" : "text-gray-500"
              }`}
              numberOfLines={1}
            >
              {group.name}
            </Text>
            <Text
              className={`text-sm ${
                isActive ? "text-gray-500" : "text-gray-400"
              }`}
            >
              {group.transactionCount} transactions
            </Text>
          </View>
        </View>

        {isActive ? (
          <Feather name="chevron-right" size={22} color="#9ca3af" />
        ) : (
          <View className="bg-gray-300 px-2 py-1 rounded-full">
            <Text className="text-xs text-gray-700 font-medium">Inactive</Text>
          </View>
        )}
      </View>

      {/* FINANCIAL SUMMARY */}
      <View
        className={`rounded-xl p-3 mb-3 ${
          isActive ? "bg-gray-50" : "bg-gray-200"
        }`}
      >
        <View className="flex-row justify-between mb-2">
          <View className="flex-1">
            <Text className="text-xs text-gray-500 mb-0.5">Income</Text>
            <Text
              className={`text-sm font-semibold ${
                isActive ? "text-green-600" : "text-gray-500"
              }`}
            >
              {formatAmount(group.totalIncome)}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-xs text-gray-500 mb-0.5">Expenses</Text>
            <Text
              className={`text-sm font-semibold ${
                isActive ? "text-red-500" : "text-gray-500"
              }`}
            >
              {formatAmount(group.totalExpenses)}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-xs text-gray-500 mb-0.5">Balance</Text>
            <Text
              className={`text-sm font-bold ${
                isActive
                  ? isPositiveBalance
                    ? "text-green-600"
                    : "text-red-600"
                  : "text-gray-500"
              }`}
            >
              {formatAmount(group.netBalance)}
            </Text>
          </View>
        </View>

        {/* PROGRESS BAR */}
        {group.totalIncome > 0 && (
          <View>
            <View
              className={`h-2 rounded-full overflow-hidden ${
                isActive ? "bg-gray-200" : "bg-gray-300"
              }`}
            >
              <View
                className={`h-full rounded-full ${
                  isActive ? "bg-green-500" : "bg-gray-400"
                }`}
                style={{ width: `${expensePercent}%` }}
              />
            </View>
            <Text className="text-xs text-gray-500 text-right mt-1">
              {Math.round(expensePercent)}% spent
            </Text>
          </View>
        )}
      </View>

      {/* FOOTER (DATE + TIME) */}
      <View className="flex flex-row justify-between">
        <View>
          <Text className="text-xs text-gray-500">
            Created: {formatDate(group.createdAt)}
          </Text>
          <Text className="text-xs text-gray-400">
            Time: {formatTime(group.createdAt)}
          </Text>
        </View>
        {!isActive && (
          <View className="flex-row items-center">
            <Feather name="pause-circle" size={14} color="#9ca3af" />
            <Text className="text-xs text-gray-400 ml-1">Inactive group</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
