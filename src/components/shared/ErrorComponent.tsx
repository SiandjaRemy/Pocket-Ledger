import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface ErrorStateProps {
  error: Error | undefined;
  onRetry: () => void;
  title?: string; // Optional prop for a custom error message
  message?: string; // Optional prop for a custom error message
}

export default function ErrorState({
  error,
  onRetry,
  title = "Unable to load transactions.", // Default general message
  message = "An unexpected error occurred. Please try again.", // Default general message
}: ErrorStateProps) {
  return (
    <View className="flex flex-col items-center justify-center py-12">
      <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-4">
        <MaterialIcons name="error" size={32} color="red" />
      </View>
      <Text className="text-lg font-medium text-gray-900 mb-2 text-center">
        {title}
      </Text>
      <Text className="text-gray-600 mb-4 text-center max-w-md">
        {error?.message || message}
      </Text>
      <TouchableOpacity
        onPress={onRetry}
        className="px-4 py-2 bg-blue-500 rounded-lg"
      >
        <Text className="text-white font-medium">Try Again</Text>
      </TouchableOpacity>
    </View>
  );
}
