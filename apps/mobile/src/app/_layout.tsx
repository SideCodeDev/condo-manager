import * as SplashScreen from "expo-splash-screen";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import {
  findNodeHandle,
  TextInput,
  useColorScheme,
  type GestureResponderEvent,
} from "react-native";
import {
  ClerkLoaded,
  ClerkLoading,
  ClerkProvider,
  Show,
  useAuth,
} from "@clerk/expo";
import { AuthView } from "@clerk/expo-native-components";
import { tokenCache } from "@clerk/expo/token-cache";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

import "../global.css";

import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native-css/components";

const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL!;
const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

const convex = new ConvexReactClient(convexUrl);

function blurTextInputOnOutsidePress(event: GestureResponderEvent) {
  const focusedInput = TextInput.State.currentlyFocusedInput();

  if (
    focusedInput &&
    findNodeHandle(focusedInput as never) !== Number(event.nativeEvent.target)
  ) {
    focusedInput.blur();
  }

  return false;
}

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    // Expo's font loader requires a static asset require for Metro bundling.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    "DM Sans": require("@condo-manager/ui/fonts/DMSans-VariableFont_opsz,wght.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) void SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <ClerkProvider publishableKey={clerkPublishableKey} tokenCache={tokenCache}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <ClerkLoading>
            <SafeAreaView className="flex-1">
              <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" />
              </View>
            </SafeAreaView>
          </ClerkLoading>
          <ClerkLoaded>
            <View
              className="flex-1"
              onStartShouldSetResponderCapture={blurTextInputOnOutsidePress}
            >
              <Show when="signed-in">
                <Stack screenOptions={{ headerShown: false }} />
              </Show>
              <Show when="signed-out">
                <AuthView isDismissible={false} mode="signInOrUp" />
              </Show>
            </View>
          </ClerkLoaded>
        </ThemeProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
