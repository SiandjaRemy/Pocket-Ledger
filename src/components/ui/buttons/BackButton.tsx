import { Entypo, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Href, useRouter } from "expo-router";
import React from "react";
import { Pressable } from "react-native";

interface BackButtonProps {
  styles?: string;
  backRoute?: Href;
  fallbackRoute?: Href;
}

const BackButton: React.FC<BackButtonProps> = ({
  styles = "",
  backRoute,
  fallbackRoute,
}) => {
  const router = useRouter();
  const navigation = useNavigation();

  const backAction = () => {
    if (backRoute) {
      router.push(backRoute);
    } else if (navigation.canGoBack()) {
      router.back();
    } else if (fallbackRoute) {
      router.replace(fallbackRoute);
    } else {
      router.replace("/"); // Default fallback
    }
  };

  return (
    <Pressable
      onPress={backAction}
      className={`p-1 rounded-lg items-start bg-primary w-9 ${styles}`}
    >
      <Entypo name="chevron-left" size={25} />
    </Pressable>
  );
};

export const SimpleBackButton: React.FC<BackButtonProps> = ({
  fallbackRoute,
}) => {
  const router = useRouter();
  const navigation = useNavigation();

  const backAction = () => {
    if (navigation.canGoBack()) {
      router.back();
    } else if (fallbackRoute) {
      router.replace(fallbackRoute);
    } else {
      router.replace("/"); // Default fallback
    }
  };

  return (
    <Pressable onPress={backAction} className="mr-3">
      <Ionicons name="arrow-back" size={24} color="#4B5563" />
    </Pressable>
  );
};

export default BackButton;
