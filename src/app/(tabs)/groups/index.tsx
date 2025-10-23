// app/(tabs)/group/index.tsx
import { useAddGroup } from "@/src/hooks/groups/useAddGroups";
import { useGetGroups } from "@/src/hooks/groups/useGroups";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GroupListScreen() {
  const [newGroupName, setNewGroupName] = useState("");

  const { data: groups, isLoading, isError, refetch } = useGetGroups();

  const { mutate: addGroup, isPending: isAdding } = useAddGroup();

  const handleAddNewGroup = () => {
    if (newGroupName.trim() === "") {
      alert("Please enter a group name.");
      return;
    }
    addGroup(
      { name: newGroupName.trim() },
      {
        onSuccess: () => {
          setNewGroupName("");
        },
        onError: (err) => {
          console.error(err);
          alert("Failed to add group.");
        },
      }
    );
  };

  // 1. Loading State
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center p-5">
        <ActivityIndicator size="large" />
        <Text className="mt-2 text-gray-600">Loading Groups...</Text>
      </View>
    );
  }

  // 2. Error State
  if (isError) {
    return (
      <View className="flex-1 justify-center items-center p-5">
        <Text className="text-red-500 mb-2">Failed to load groups.</Text>
        <Button title="Retry" onPress={() => refetch()} />
      </View>
    );
  }

  // 3. Main UI
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* --- Add Group Form --- */}
      <View className="p-3 border-b border-gray-200">
        <TextInput
          className="h-10 border border-gray-400 rounded-md px-3 mb-3 text-base"
          placeholder="New group name (e.g., 'Vacation 2025')"
          value={newGroupName}
          onChangeText={setNewGroupName}
          editable={!isAdding}
        />
        <Button
          title={isAdding ? "Adding..." : "Add Group"}
          onPress={handleAddNewGroup}
          disabled={isAdding}
        />
      </View>

      {/* --- Group List --- */}
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable
            // Add platform-specific active state
            className="p-5 border-b border-gray-200 flex-row justify-between items-center active:bg-gray-100"
            onPress={() => router.push(`/group/${item.id}`)}
          >
            <Text className="text-lg">{item.name}</Text>
            <Text className="text-lg text-gray-400">&gt;</Text>
          </Pressable>
        )}
        // 4. Empty State
        ListEmptyComponent={() => (
          <View className="flex-1 justify-center items-center p-5 mt-20">
            <Text className="text-gray-500">No groups found.</Text>
            <Text className="text-gray-500">
              Add your first group to get started!
            </Text>
          </View>
        )}
        onRefresh={refetch}
        refreshing={isLoading}
      />
    </SafeAreaView>
  );
}
