import {
  useDeactivateGroup,
  useDeleteGroup,
  useReactivateGroup,
} from "@/src/hooks/groups/useUpdateGroup";
import { GroupWithStats } from "@/src/types/group";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import Swipeable, {
  SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated, { FadeInUp } from "react-native-reanimated";
import GroupCardContent from "./GroupCardContent";

export default function SwipeableGroupCard({
  group,
}: {
  group: GroupWithStats;
}) {
  const router = useRouter();
  const swipeableRef = useRef<SwipeableMethods>(null);

  const deactivateMutation = useDeactivateGroup();
  const reactivateMutation = useReactivateGroup();
  const deleteMutation = useDeleteGroup();

  const handleNavigateToGroup = (id: number) => {
    router.push({
      pathname: "/(tabs)/groups/[id]",
      params: { id: id.toString() },
    });
  };

  const handleDeactivate = () => {
    Alert.alert(
      "Deactivate Group",
      `Are you sure you want to deactivate "${group.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Deactivate",
          style: "destructive",
          onPress: () => {
            deactivateMutation.mutate(group.id);
            swipeableRef.current?.close();
          },
        },
      ]
    );
  };

  const handleReactivate = () => {
    swipeableRef.current?.close();
    reactivateMutation.mutate(group.id);
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Group",
      `This will permanently delete "${group.name}" and all its transactions. This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteMutation.mutate(group.id);
            swipeableRef.current?.close();
          },
        },
      ]
    );
  };

  const renderRightActions = () => (
    <View
      className="flex-row gap-2 p-4"
      style={{ width: 180, marginVertical: 4 }}
    >
      {/* Activate/Deactivate Button */}
      <TouchableOpacity
        onPress={group.isActive ? handleDeactivate : handleReactivate}
        className={`flex-1 justify-center items-center px-3 py-2 rounded-xl ${
          group.isActive ? "bg-orange-500" : "bg-green-600"
        }`}
      >
        <Animated.View entering={FadeInUp.duration(500).springify()}>
          <MaterialIcons
            name={group.isActive ? "pause-circle-outline" : "play-arrow"}
            size={26}
            color="white"
          />
        </Animated.View>
        <Text className="text-white text-xs mt-1 font-medium text-center">
          {group.isActive ? "Deactivate" : "Activate"}
        </Text>
      </TouchableOpacity>

      {/* Delete Button */}
      <TouchableOpacity
        onPress={handleDelete}
        className="flex-1 justify-center items-center px-3 py-2 bg-red-500 rounded-xl"
      >
        <Animated.View entering={FadeInUp.duration(500).springify()}>
          <MaterialIcons name="delete" size={26} color="white" />
        </Animated.View>
        <Text className="text-white text-xs mt-1 font-medium text-center">
          Delete
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Swipeable
      ref={swipeableRef}
      friction={2}
      rightThreshold={40}
      overshootRight={false}
      renderRightActions={renderRightActions}
    >
      <GroupCardContent group={group} onPress={handleNavigateToGroup} />
    </Swipeable>
  );
}
