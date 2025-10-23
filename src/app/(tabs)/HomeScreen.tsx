import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="groups" options={{ headerShown: false }} />
      <Tabs.Screen name="HomeScreen" options={{ headerShown: false }} />
    </Tabs>
  );
}
