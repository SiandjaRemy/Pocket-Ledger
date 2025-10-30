import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

interface StatCardProps {
  title: string;
  value: string;
  icon: keyof typeof Feather.glyphMap;
  color: "blue" | "green" | "red" | "gray";
  isAmount: boolean;
  currency?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  color,
  isAmount,
  currency,
}: StatCardProps) {
  const colorStyles = {
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: "text-blue-600",
    },
    green: {
      bg: "bg-green-50",
      border: "border-green-200",
      icon: "text-green-600",
    },
    red: { bg: "bg-red-50", border: "border-red-200", icon: "text-red-600" },
    gray: {
      bg: "bg-gray-50",
      border: "border-gray-200",
      icon: "text-gray-600",
    },
  };

  const { bg, border, icon: iconColor } = colorStyles[color];

  return (
    <View
      className={`${bg} ${border} border rounded-xl p-4 flex-1 min-w-[45%]`}
    >
      <View className="flex-row items-center justify-between mb-2">
        <Text
          className="text-sm font-medium text-gray-600 flex-1"
          numberOfLines={2}
        >
          {title}
        </Text>
        <View
          className={`w-8 h-8 rounded-full ${bg} items-center justify-center ml-2`}
        >
          <Feather name={icon} size={16} className={iconColor} />
        </View>
      </View>

      <View className="flex-row items-baseline">
        {isAmount && currency && (
          <Text className="text-xs text-gray-500 mr-1">{currency}</Text>
        )}
        <Text
          className={`text-lg font-bold ${
            color === "green"
              ? "text-green-700"
              : color === "red"
                ? "text-red-700"
                : color === "blue"
                  ? "text-blue-700"
                  : "text-gray-700"
          }`}
          numberOfLines={1}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}
