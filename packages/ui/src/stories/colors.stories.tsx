import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { StyleSheet, Text, View } from "react-native";

import { colorTokens, colors, fontFamilies, typography } from "../theme";

function ColorsShowcase() {
  return null;
}

const meta = {
  title: "Design Tokens/Colors",
  component: ColorsShowcase,
  tags: ["autodocs"],
  parameters: {
    controls: { disable: true },
  },
} satisfies Meta<typeof ColorsShowcase>;

export default meta;
type Story = StoryObj<typeof meta>;

type Swatch = {
  name: string;
  hex: string;
};

const neutral: Swatch[] = [
  { name: "neutral-0", hex: colorTokens["neutral-0"] },
  { name: "neutral-50", hex: colorTokens["neutral-50"] },
  { name: "neutral-100", hex: colorTokens["neutral-100"] },
  { name: "neutral-200", hex: colorTokens["neutral-200"] },
  { name: "neutral-300", hex: colorTokens["neutral-300"] },
  { name: "neutral-400", hex: colorTokens["neutral-400"] },
  { name: "neutral-500", hex: colorTokens["neutral-500"] },
  { name: "neutral-600", hex: colorTokens["neutral-600"] },
  { name: "neutral-700", hex: colorTokens["neutral-700"] },
  { name: "neutral-800", hex: colorTokens["neutral-800"] },
  { name: "neutral-900", hex: colorTokens["neutral-900"] },
  { name: "neutral-950", hex: colorTokens["neutral-950"] },
  { name: "neutral-1000", hex: colorTokens["neutral-1000"] },
];

const functional: Swatch[] = [
  { name: "green", hex: colorTokens.green },
  { name: "green-600", hex: colorTokens["green-600"] },
  { name: "green-700", hex: colorTokens["green-700"] },
  { name: "yellow", hex: colorTokens.yellow },
  { name: "yellow-600", hex: colorTokens["yellow-600"] },
  { name: "yellow-900", hex: colorTokens["yellow-900"] },
  { name: "red", hex: colorTokens.red },
  { name: "red-600", hex: colorTokens["red-600"] },
];

const brand: Swatch[] = [
  { name: "primary", hex: colorTokens.primary },
  { name: "primary-50", hex: colorTokens["primary-50"] },
  { name: "primary-100", hex: colorTokens["primary-100"] },
  { name: "primary-200", hex: colorTokens["primary-200"] },
  { name: "primary-600", hex: colorTokens["primary-600"] },
  { name: "primary-700", hex: colorTokens["primary-700"] },
  { name: "primary-900", hex: colorTokens["primary-900"] },
  { name: "secondary", hex: colorTokens.secondary },
];

function ColorSwatch({ name, hex }: Swatch) {
  return (
    <View style={styles.swatch}>
      <View
        accessibilityLabel={`${name}: ${hex}`}
        style={[styles.color, { backgroundColor: hex }]}
      />
      <Text style={styles.label}>{name}</Text>
      <Text style={styles.value}>{hex}</Text>
    </View>
  );
}

function ColorGroup({ title, swatches }: { title: string; swatches: Swatch[] }) {
  return (
    <View style={styles.group}>
      <Text style={styles.heading}>{title}</Text>
      <View style={styles.row}>
        {swatches.map((swatch) => (
          <ColorSwatch key={swatch.name} {...swatch} />
        ))}
      </View>
    </View>
  );
}

function AllColorGroups() {
  return (
    <View style={styles.page}>
      <ColorGroup title="Neutral" swatches={neutral} />
      <ColorGroup title="Functional" swatches={functional} />
      <ColorGroup title="Brand" swatches={brand} />
    </View>
  );
}

export const Neutral: Story = {
  render: () => <ColorGroup title="Neutral" swatches={neutral} />,
};

export const Functional: Story = {
  render: () => <ColorGroup title="Functional" swatches={functional} />,
};

export const Brand: Story = {
  render: () => <ColorGroup title="Brand" swatches={brand} />,
};

export const AllColors: Story = {
  render: () => <AllColorGroups />,
};

const styles = StyleSheet.create({
  page: {
    gap: 32,
  },
  group: {
    gap: 12,
  },
  heading: {
    ...typography.desktopH4,
    borderBottomColor: colors.neutral[200],
    borderBottomWidth: 1,
    color: colors.neutral[500],
    fontFamily: fontFamilies.sans,
    paddingBottom: 4,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  swatch: {
    gap: 4,
    width: 96,
  },
  color: {
    borderColor: colors.neutral[200],
    borderRadius: 6,
    borderWidth: 1,
    height: 48,
    width: "100%",
  },
  label: {
    ...typography.p4,
    color: colors.neutral[600],
    fontFamily: fontFamilies.sans,
  },
  value: {
    color: colors.neutral[400],
    fontFamily: fontFamilies.sans,
    fontSize: 10,
    lineHeight: 20,
  },
});
