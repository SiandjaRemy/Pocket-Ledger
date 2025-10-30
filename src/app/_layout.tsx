import { drizzle } from "drizzle-orm/expo-sqlite";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { openDatabaseSync, SQLiteProvider } from "expo-sqlite";
import { Suspense, useEffect } from "react";
import { ActivityIndicator, StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import "@/global.css";

import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
// Import your migrations
import migrations from "../drizzle/migrations";
import QueryProvider from "../providers/QueryProvider";

export const DATABASE_NAME = "pocket_ledger";

// Keep the splash screen visible
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    // The Suspense boundary handles the database loading state
    <Suspense fallback={<ActivityIndicator size="large" style={{ flex: 1 }} />}>
      <StatusBar barStyle="dark-content" />

      <SQLiteProvider databaseName={DATABASE_NAME} useSuspense>
        {/* This component loads the migrations and hides the splash 
          screen *after* the DB is open and migrations are done.
        */}
        <GestureHandlerRootView style={{ flex: 1 }}>
          <MigrationsLoader>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="index" options={{ headerShown: false }} />
            </Stack>
          </MigrationsLoader>
        </GestureHandlerRootView>
      </SQLiteProvider>
    </Suspense>
  );
}

// This new component runs inside the SQLiteProvider
function MigrationsLoader({ children }: { children: React.ReactNode }) {
  const expoDb = openDatabaseSync(DATABASE_NAME);
  const db = drizzle(expoDb);

  // Use the new useMigrations hook
  const { success, error } = useMigrations(db, migrations);

  useEffect(() => {
    if (error) {
      // Handle the error
      console.error("Migration error:", error);
      // You might want to show a user-facing error message here
    }

    if (success) {
      // Migrations are done, hide the splash screen
      SplashScreen.hideAsync();
    }
  }, [success, error]);

  // If migrations are still running (success is false) and there's no error,
  // the Suspense fallback (ActivityIndicator) will still be shown.
  // Once success is true, we render the app's children (the Stack).
  return success ? <QueryProvider>{children}</QueryProvider> : null;
}
