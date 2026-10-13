import * as SplashScreen from "expo-splash-screen";
import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

import "../global.css";

import AppTabs from "@/components/app-tabs";

const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;

function requireEnvironmentVariable(value: string | undefined, name: string) {
  if (!value) throw new Error(`Set ${name} in apps/mobile/.env`);
  return value;
}

const convex = new ConvexReactClient(
  requireEnvironmentVariable(convexUrl, "EXPO_PUBLIC_CONVEX_URL"),
);
const publishableKey = requireEnvironmentVariable(
  clerkPublishableKey,
  "EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY",
);

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
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <AppTabs />
        </ThemeProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
