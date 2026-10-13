import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { StyleSheet, Text, View } from "react-native";

import { Loader } from "./loader";
import { colors, fontFamilies, typography } from "../theme";

const meta = {
  title: "UI/Misc/Loader",
  component: Loader,
  tags: ["autodocs"],
  args: {
    size: 36,
  },
  argTypes: {
    size: {
      control: { min: 12, step: 1, type: "number" },
    },
  },
} satisfies Meta<typeof Loader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <View style={styles.row}>
      {[24, 36, 48].map((size) => (
        <View key={size} style={styles.example}>
          <Loader size={size} />
          <Text style={styles.label}>{size}px</Text>
        </View>
      ))}
    </View>
  ),
};

const styles = StyleSheet.create({
  example: {
    alignItems: "center",
    gap: 8,
  },
  label: {
    ...typography.p4,
    color: colors.neutral[500],
    fontFamily: fontFamilies.sans,
  },
  row: {
    alignItems: "flex-end",
    flexDirection: "row",
    gap: 24,
  },
});
