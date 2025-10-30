import BaseModal from "@/src/components/ui/modals/BaseModal";
import { useAddCashIn } from "@/src/hooks/cashIn/useAddCashIn";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface AddCashInModalProps {
  visible: boolean;
  onCancel: () => void;
  groupId: number;
}

const AddCashInModal: React.FC<AddCashInModalProps> = ({
  visible,
  onCancel,
  groupId,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    source: "",
  });

  const addCashInMutation = useAddCashIn();

  // Reset form when modal opens
  useEffect(() => {
    if (visible) {
      setFormData({ name: "", amount: "", source: "" });
    }
  }, [visible]);

  const handleSubmit = async () => {
    const amount = parseFloat(formData.amount);

    // Validation
    if (
      !formData.name.trim() ||
      !formData.amount ||
      isNaN(amount) ||
      amount <= 0
    ) {
      Alert.alert("Error", "Please enter a valid description and amount");
      return;
    }

    if (!formData.source.trim()) {
      Alert.alert("Error", "Please enter a source for the income");
      return;
    }

    try {
      const transactionData = {
        name: formData.name.trim(),
        amount: Math.round(amount * 100), // Convert to cents
        source: formData.source.trim(),
        groupId,
      };

      await addCashInMutation.mutateAsync(transactionData);
      onCancel();
    } catch (error) {
      Alert.alert("Error", JSON.stringify(error));
    }
  };

  const handleClose = () => {
    onCancel();
  };

  const renderContent = () => {
    return (
      <View className={`w-full rounded-xl px-4 py-4 bg-white`}>
        {/* Amount Input */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-1">
            Amount (XAF) *
          </Text>
          <TextInput
            value={formData.amount}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, amount: text }))
            }
            placeholder="0"
            keyboardType="decimal-pad"
            className="border border-gray-300 rounded-lg px-4 py-3 text-base"
          />
        </View>

        {/* Source Input */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-1">
            Source *
          </Text>
          <TextInput
            value={formData.source}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, source: text }))
            }
            placeholder="Where did this come from?"
            className="border border-gray-300 rounded-lg px-4 py-3 text-base"
          />
        </View>

        {/* Description Input */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-1">
            Description *
          </Text>
          <TextInput
            value={formData.name}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, name: text }))
            }
            placeholder="Enter description"
            className="border border-gray-300 rounded-lg px-4 py-3 text-base"
            autoFocus={true}
          />
        </View>

        {/* Buttons */}
        <View className="flex flex-row gap-3">
          <TouchableOpacity
            onPress={handleClose}
            className="flex-1 py-3 px-4 border border-gray-300 rounded-lg"
            disabled={addCashInMutation.isPending}
          >
            <Text className="text-gray-700 font-semibold text-center">
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit}
            className="flex-1 py-3 px-4 bg-green-500 rounded-lg"
            disabled={
              addCashInMutation.isPending ||
              !formData.name.trim() ||
              !formData.amount ||
              !formData.source.trim()
            }
          >
            {addCashInMutation.isPending ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="text-white font-semibold text-center">
                Add Income
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <BaseModal visible={visible} onClose={onCancel} title="Add Income">
      {renderContent()}
    </BaseModal>
  );
};

export default AddCashInModal;
