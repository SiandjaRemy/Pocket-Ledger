import GroupsList from "@/src/components/features/groups/GroupList";
import AddGroupModal from "@/src/components/features/groups/modals/AddGroupModal";
import { useGetGroups } from "@/src/hooks/groups/useGroups";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GroupsScreen() {
  const {
    data: groups,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useGetGroups();
  const [isModalVisible, setIsModalVisible] = useState(false);

  // ✅ Only count active groups
  const activeCount = groups?.filter((g) => g.isActive).length || 0;

  return (
    <SafeAreaView className="flex-1 pt-4">
      <View className="flex-1 px-4">
        {/* Header */}
        <View className="mb-4">
          <Text className="text-3xl font-bold text-gray-900">Groups</Text>
          <Text className="text-gray-600 mt-2">
            {isLoading
              ? "Loading..."
              : `Active: ${activeCount} ${
                  activeCount === 1 ? "group" : "groups"
                }`}
          </Text>
        </View>

        {/* Add Group Button */}
        <TouchableOpacity
          onPress={() => setIsModalVisible(true)}
          className="bg-blue-500 py-3 px-4 rounded-lg mb-6 flex-row items-center justify-center"
        >
          <Text className="text-white font-semibold text-lg mr-2">+</Text>
          <Text className="text-white font-semibold text-lg">
            Add New Group
          </Text>
        </TouchableOpacity>

        {/* Content Area */}
        <GroupsList
          groups={groups || []}
          isLoading={isLoading}
          isError={isError}
          error={error}
          refetch={refetch}
          isRefetching={isRefetching}
        />

        {/* Add Group Modal */}
        <AddGroupModal
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
        />
      </View>
    </SafeAreaView>
  );
}
