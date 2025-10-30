import { COLORS } from "@/src/constants/colors";
import { ActivityIndicator, Text, View } from "react-native";

export default function LoadingState() {
  return (
    <View className="flex flex-col items-center justify-center py-12">
      <ActivityIndicator size="large" color={COLORS.blue} />
      <Text className="text-gray-600 mt-4">Loading transactions...</Text>
    </View>
  );
}
