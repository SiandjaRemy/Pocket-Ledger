import { Feather } from "@expo/vector-icons";
import React from "react";
import { Modal, StatusBar, Text, TouchableOpacity, View } from "react-native";

interface BaseModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const BaseModal: React.FC<BaseModalProps> = ({
  visible,
  onClose,
  title,
  children,
}) => {
  return (
    <>
      {visible && (
        <StatusBar barStyle="light-content" backgroundColor={"black"} />
      )}
      <Modal
        visible={visible}
        animationType="fade"
        transparent={true}
        onRequestClose={onClose}
      >
        <View className="flex-1 bg-black/50 justify-center">
          <View className="bg-white mx-5 rounded-xl max-h-[85%]">
            {/* Header */}
            <View className="flex-row px-5 py-3 ">
              <Text className="text-xl font-bold text-gray-800 text-center w-full">
                {title}
              </Text>
            </View>
            {/* Content */}
            {children}
          </View>

          {/* Emergency close button */}
          <TouchableOpacity
            className="absolute top-10 right-5 bg-red-500 w-10 h-10 rounded-full items-center justify-center"
            onPress={onClose}
          >
            <Feather name="x" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

export default BaseModal;
