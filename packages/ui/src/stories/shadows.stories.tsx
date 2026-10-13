import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { StyleSheet, Text, View } from "react-native";

import { colors, fontFamilies, shadows, typography } from "../theme";

function ShadowsShowcase() {
  return null;
}

const meta = {
  title: "Design Tokens/Shadows",
  component: ShadowsShowcase,
  tags: ["autodocs"],
  parameters: {
    controls: { disable: true },
  },
} satisfies Meta<typeof ShadowsShowcase>;

export default meta;
type Story = StoryObj<typeof meta>;

type ShadowSwatchProps = {
  name: string;
  value: string;
};

const shadowTokens: ShadowSwatchProps[] = [
  { name: "shadow-card", value: shadows.card },
  { name: "shadow-1", value: shadows[1] },
  { name: "shadow-2", value: shadows[2] },
  { name: "shadow-floating", value: shadows.floating },
];

function ShadowSwatch({ name, value }: ShadowSwatchProps) {
  return (
    <View style={styles.swatch}>
      <View style={[styles.tile, { boxShadow: value }]} />
      <View>
        <Text style={styles.label}>{name}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );
}

export const AllShadows: Story = {
  render: () => (
    <View style={styles.page}>
      {shadowTokens.map((shadow) => (
        <ShadowSwatch key={shadow.name} {...shadow} />
      ))}
    </View>
  ),
};

export const Card: Story = {
  render: () => <ShadowSwatch name="shadow-card" value={shadows.card} />,
};

export const Shadow1: Story = {
  render: () => <ShadowSwatch name="shadow-1" value={shadows[1]} />,
};

export const Shadow2: Story = {
  render: () => <ShadowSwatch name="shadow-2" value={shadows[2]} />,
};

export const Floating: Story = {
  render: () => (
    <ShadowSwatch name="shadow-floating" value={shadows.floating} />
  ),
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.neutral[50],
    borderRadius: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 40,
    padding: 32,
  },
  swatch: {
    alignItems: "flex-start",
    gap: 12,
    width: 192,
  },
  tile: {
    backgroundColor: colors.neutral[0],
    borderRadius: 12,
    height: 96,
    width: 192,
  },
  label: {
    ...typography.p3,
    color: colors.neutral[950],
    fontFamily: fontFamilies.sans,
    fontWeight: "500",
  },
  value: {
    ...typography.p4,
    color: colors.neutral[400],
    fontFamily: fontFamilies.sans,
  },
});
