import React, { useEffect, useRef } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";

import * as SplashScreen from "expo-splash-screen";

import "./../../global.css";
import { useAuthStore } from "../stores/authStore";
import Storage from "../utils/storage";
import { useSocketStore } from "../stores/socketStore";
import WebSocketHandler from "../handlers/WebSocketHandler";
import QueryProvider from "../providers/QueryProvider";

import Toast from "react-native-toast-message";
import GlobalLoadingOverlay from "../components/shared/GlobalLoadingOverlay";
import {
  ActivityIndicator,
  AppState,
  AppStateStatus,
  Text,
  View,
} from "react-native";
import { COLORS } from "../constants/colors";
import { toastConfig } from "../components/CustomToast";
import * as NavigationBar from "expo-navigation-bar";

import * as Notifications from "expo-notifications";
import { NetworkProvider, useNetwork } from "../providers/NetworkProvider";
import { isTokenExpired } from "../utils/decodeToken";

// import { usePrevious } from '@uidotdev/usehooks'; // or your preferred hook

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 400,
  fade: true,
});

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    "BebasNeue-Regular": require("../assets/fonts/BebasNeue-Regular.ttf"),
    "SpaceMono-Regular": require("../assets/fonts/SpaceMono-Regular.ttf"),
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  useEffect(() => {
    if (error) {
      console.error("Font loading error:", error);
      return;
    }

    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(console.error);
    }
  }, [fontsLoaded, error]);

  useEffect(() => {
    // Hide the Android navigation bar
    NavigationBar.setVisibilityAsync("hidden");
    return () => {
      NavigationBar.setVisibilityAsync("visible");
    };
  }, []);

  const { checkAuth, isAuthenticated, hasCheckedAuth, isAppLoading } =
    useAuthStore();

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Websocket connection management

  // In your root layout
  const { isInternetReachable, isConnected } = useNetwork();
  const { isSocketConnected, isSocketConnecting, connect, disconnect } =
    useSocketStore();

  const tokenRef = useRef<string | null>(null);
  const appStateRef = useRef<AppStateStatus>(null);

  // Main socket connection management - SIMPLIFIED and ROBUST
  useEffect(() => {
    const manageSocket = async () => {
      if (isAuthenticated) {
        const accessToken = await Storage.getItemAsync("access_token");

        // Update the tokenRef with the current token
        tokenRef.current = accessToken;

        if (!accessToken || isTokenExpired(accessToken)) {
          console.log("Skipping WebSocket connect — invalid/expired token");
          disconnect(true);
          return;
        }
        if (!isSocketConnected && !isSocketConnecting) {
          console.log("🔌 Connecting WebSocket");
          connect(accessToken);
        }
      } else {
        tokenRef.current = null; // Clear token when not authenticated
        disconnect(true);
      }
    };
    manageSocket();
  }, [isAuthenticated]);

  // App state management - OPTIMIZED
  useEffect(() => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      const previousState = appStateRef.current;
      appStateRef.current = nextAppState;

      console.log(`App state changed: ${previousState} → ${nextAppState}`);

      // Only handle specific transitions
      if (previousState === "background" && nextAppState === "active") {
        // App came to foreground
        if (isAuthenticated && tokenRef.current) {
          // Always attempt reconnect when coming to foreground, regardless of current state
          // This handles cases where the connection might have died in background
          console.log("App came to foreground, reconnecting WebSocket...");
          // Get fresh token to ensure it's not expired
          const freshToken = await Storage.getItemAsync("access_token");
          tokenRef.current = freshToken;

          if (freshToken && !isTokenExpired(freshToken)) {
            // Always attempt reconnect when coming to foreground
            connect(freshToken);
          } else {
            console.log("No valid token available for reconnection");
          }
        }
      } else if (nextAppState === "background" && isSocketConnected) {
        // App went to background - use temporary disconnect
        console.log("App going to background, temporary WebSocket disconnect");
        disconnect(false); // Temporary disconnect
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, [isAuthenticated, isSocketConnected]); // Simpler dependencies

  // Network state monitoring - SIMPLIFIED
  useEffect(() => {
    if (
      isConnected &&
      isInternetReachable &&
      isAuthenticated &&
      tokenRef.current &&
      !isSocketConnected &&
      !isSocketConnecting
    ) {
      if (!isTokenExpired(tokenRef.current)) {
        console.log("Network restored → reconnecting WebSocket");
        connect(tokenRef.current);
      }
    }
  }, [isConnected, isInternetReachable]);

  // Conditional components
  const isAppReady = fontsLoaded && hasCheckedAuth && !isAppLoading;
  if (!isAppReady) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }
  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-white px-6">
        <Text className="text-center text-red-500 text-lg">
          An error occurred while loading fonts. Please restart the app.
        </Text>
      </View>
    );
  }

  return (
    <QueryProvider>
      <NetworkProvider>
        <WebSocketHandler />
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="onboarding"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(auth)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(drawer)"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
        <GlobalLoadingOverlay />
        <Toast config={toastConfig} />
      </NetworkProvider>
    </QueryProvider>
  );
};

export default RootLayout;
