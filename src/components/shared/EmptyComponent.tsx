import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface EmptyStateProps {
  title?: string; // Optional prop
  message?: string; // Optional prop
}

export default function EmptyState({
  title = "No data yet",
  message = "",
}: EmptyStateProps) {
  return (
    <View className="flex flex-col items-center justify-center py-12">
      <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-4">
        <MaterialCommunityIcons
          name="timer-sand-empty"
          size={32}
          color="black"
        />
      </View>
      <Text className="text-lg font-medium text-gray-900 mb-2 text-center">
        {title}
      </Text>
      <Text className="text-gray-600 text-center max-w-md">{message}</Text>
    </View>
  );
}
