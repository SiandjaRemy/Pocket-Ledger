import BaseModal from "@/src/components/ui/modals/BaseModal";
import { useAddGroup } from "@/src/hooks/groups/useAddGroups";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface AddGroupModalProps {
  visible: boolean;
  onCancel: () => void;
}

const AddGroupModal: React.FC<AddGroupModalProps> = ({ visible, onCancel }) => {
  const [groupName, setGroupName] = useState("");
  const createGroupMutation = useAddGroup();

  const handleSubmit = async () => {
    if (!groupName.trim()) {
      Alert.alert("Error", "Please enter a group name");
      return;
    }

    try {
      await createGroupMutation.mutateAsync({
        name: groupName.trim(),
      });

      setGroupName("");
      onCancel();
    } catch (error) {
      Alert.alert("Error", JSON.stringify(error));
    }
  };

  const handleClose = () => {
    setGroupName("");
    onCancel();
  };

  const renderContent = () => {
    return (
      <View className={`w-full rounded-xl px-4 py-4 bg-white`}>
        {/* Input */}
        <TextInput
          value={groupName}
          onChangeText={setGroupName}
          placeholder="Enter group name"
          className="border border-gray-300 rounded-lg px-4 py-3 text-lg mb-6"
          autoFocus={true}
        />

        {/* Buttons */}
        <View className="flex flex-row gap-3">
          <TouchableOpacity
            onPress={handleClose}
            className="flex-1 py-3 px-4 border border-gray-300 rounded-lg"
            disabled={createGroupMutation.isPending}
          >
            <Text className="text-gray-700 font-semibold text-center">
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit}
            className="flex-1 py-3 px-4 bg-blue-500 rounded-lg"
            disabled={createGroupMutation.isPending || !groupName.trim()}
          >
            {createGroupMutation.isPending ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="text-white font-semibold text-center">
                Create
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <BaseModal visible={visible} onClose={onCancel} title="Create new Group">
      {renderContent()}
    </BaseModal>
  );
};

export default AddGroupModal;
