import { Link, Stack, usePathname } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function NotFoundScreen() {
  const pathname = usePathname();

  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={styles.container}>
        <View>
          <Text>This screen doesn't exist.</Text>
        </View>
        <View>
          <Text>{pathname}</Text>
        </View>
        <Link href="/" style={styles.link}>
          <View>
            <Text>Go to home screen!</Text>
          </View>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
