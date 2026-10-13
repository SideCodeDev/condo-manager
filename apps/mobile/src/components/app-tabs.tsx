import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useColorScheme } from "react-native";

import { Colors } from "@/constants/theme";

// NativeTabs expects a Metro asset reference for its icon source.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const homeIcon = require("@/assets/images/tabIcons/home.png");

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === "unspecified" ? "light" : scheme];

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      labelStyle={{ selected: { color: colors.text } }}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon src={homeIcon} renderingMode="template" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
