import BaseModal from "@/src/components/ui/modals/BaseModal";
import { useAddCashOut } from "@/src/hooks/cashOut/useAddCashOut";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface AddCashOutModalProps {
  visible: boolean;
  onCancel: () => void;
  groupId: number;
  availableBalance: number; // Add this prop to check if cash out is allowed
}

const AddCashOutModal: React.FC<AddCashOutModalProps> = ({
  visible,
  onCancel,
  groupId,
  availableBalance,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    reason: "",
  });

  const addCashOutMutation = useAddCashOut();

  // Reset form when modal opens
  useEffect(() => {
    if (visible) {
      setFormData({ name: "", amount: "", reason: "" });
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

    if (!formData.reason.trim()) {
      Alert.alert("Error", "Please enter a reason for the expense");
      return;
    }

    // Check if amount exceeds available balance
    const amountInCents = Math.round(amount * 100);
    if (amountInCents > availableBalance) {
      Alert.alert(
        "Error",
        `Amount exceeds available balance of $${(availableBalance / 100).toFixed(2)}`
      );
      return;
    }

    try {
      const transactionData = {
        name: formData.name.trim(),
        amount: amountInCents,
        reason: formData.reason.trim(),
        groupId,
      };

      await addCashOutMutation.mutateAsync(transactionData);
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
        {/* Show available balance */}
        <View className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <Text className="text-sm font-medium text-blue-800 text-center">
            Available Balance: XAF {(availableBalance / 100).toFixed(2)}
          </Text>
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
            placeholder="0.00"
            keyboardType="decimal-pad"
            className="border border-gray-300 rounded-lg px-4 py-3 text-base"
          />
        </View>

        {/* Reason Input */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-1">
            Reason *
          </Text>
          <TextInput
            value={formData.reason}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, reason: text }))
            }
            placeholder="What was this for?"
            className="border border-gray-300 rounded-lg px-4 py-3 text-base"
          />
        </View>

        {/* Buttons */}
        <View className="flex flex-row gap-3">
          <TouchableOpacity
            onPress={handleClose}
            className="flex-1 py-3 px-4 border border-gray-300 rounded-lg"
            disabled={addCashOutMutation.isPending}
          >
            <Text className="text-gray-700 font-semibold text-center">
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit}
            className="flex-1 py-3 px-4 bg-red-500 rounded-lg"
            disabled={
              addCashOutMutation.isPending ||
              !formData.name.trim() ||
              !formData.amount ||
              !formData.reason.trim()
            }
          >
            {addCashOutMutation.isPending ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="text-white font-semibold text-center">
                Add Expense
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <BaseModal visible={visible} onClose={onCancel} title="Add Expense">
      {renderContent()}
    </BaseModal>
  );
};

export default AddCashOutModal;
