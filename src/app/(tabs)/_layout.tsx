import { COLORS } from "@/src/constants/colors";
import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: "#e5e5e5",
        },
        tabBarActiveTintColor: COLORS.blue, // Your main blue color
        tabBarInactiveTintColor: COLORS.gray, // Gray color
      }}
    >
      <Tabs.Screen
        name="HomeScreen"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          headerShown: false,
          title: "Groups",
          tabBarIcon: ({ color, size }) => (
            <Feather name="folder" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
