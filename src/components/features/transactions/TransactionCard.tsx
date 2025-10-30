import { COLORS } from "@/src/constants/colors";
import { TransactionType } from "@/src/types/transaction";
import { formatAmount } from "@/src/utils/formatAmount";
import { formatDate } from "@/src/utils/formatDate";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function TransactionCard({
  transaction,
}: {
  transaction: TransactionType;
}) {
  const isCashIn = transaction.type === "cash_in";
  const amount = Math.abs(transaction.amount);

  return (
    <View className="bg-white rounded-xl border border-gray-200 p-3 mb-2 shadow-sm">
      <View className="flex-row items-center justify-between">
        {/* Left Section - Icon and Main Info */}
        <View className="flex-row items-center flex-1">
          {/* Icon with colored background */}
          <View
            className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
              isCashIn ? "bg-green-100" : "bg-red-100"
            }`}
          >
            <MaterialIcons
              name={isCashIn ? "arrow-upward" : "arrow-downward"}
              size={20}
              color={isCashIn ? COLORS.green : COLORS.red}
            />
          </View>

          {/* Transaction Details */}
          <View className="flex-1">
            <Text
              className="font-semibold text-gray-900 text-sm mb-1"
              numberOfLines={1}
            >
              {transaction.name}
            </Text>
            <View className="flex-row items-center">
              <Feather name="calendar" size={12} color="#6b7280" />
              <Text className="text-xs text-gray-500 ml-1">
                {formatDate(transaction.createdAt)}
              </Text>
            </View>
          </View>
        </View>

        {/* Right Section - Amount */}
        <View className="items-end ml-2">
          <View
            className={`px-2 py-1 rounded-lg ${
              isCashIn ? "bg-green-50" : "bg-red-50"
            }`}
          >
            <Text
              className={`font-bold text-sm ${
                isCashIn ? "text-green-700" : "text-red-700"
              }`}
            >
              {isCashIn ? "+" : "-"}
              {formatAmount(amount)}
            </Text>
          </View>

          {/* Transaction Type Badge */}
          <View
            className={`mt-1 px-2 py-1 rounded-full ${
              isCashIn ? "bg-green-500/10" : "bg-red-500/10"
            }`}
          >
            <Text
              className={`text-xs font-medium ${
                isCashIn ? "text-green-700" : "text-red-700"
              }`}
            >
              {transaction.type.replace("_", " ")}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
