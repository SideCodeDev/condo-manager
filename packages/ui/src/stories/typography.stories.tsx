import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import type { TextStyle } from "react-native";
import { StyleSheet, Text, View } from "react-native";

import {
  colors,
  fontFamilies,
  typography,
  type TypographyTokenName,
} from "../theme";

function TypographyShowcase() {
  return null;
}

const meta = {
  title: "Design Tokens/Typography",
  component: TypographyShowcase,
  tags: ["autodocs"],
  parameters: {
    controls: { disable: true },
  },
} satisfies Meta<typeof TypographyShowcase>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleText = "The quick brown fox jumps over the lazy dog";

const weights: { label: string; value: TextStyle["fontWeight"] }[] = [
  { label: "Extra Bold", value: "800" },
  { label: "Bold", value: "700" },
  { label: "Semi-bold", value: "600" },
  { label: "Medium", value: "500" },
  { label: "Regular", value: "400" },
  { label: "Light", value: "300" },
  { label: "Extra Light", value: "200" },
];

type FontDefinition = {
  label: string;
  token: TypographyTokenName;
};

const uiElements: FontDefinition[] = [
  { label: "font-ui-1", token: "ui1" },
  { label: "font-ui-2", token: "ui2" },
  { label: "font-ui-3", token: "ui3" },
  { label: "font-ui-4", token: "ui4" },
  { label: "font-ui-5", token: "ui5" },
  { label: "font-ui-6", token: "ui6" },
  { label: "font-ui-7", token: "ui7" },
  { label: "font-ui-8", token: "ui8" },
  { label: "font-ui-9", token: "ui9" },
  { label: "font-ui-10", token: "ui10" },
];

const paragraphs: FontDefinition[] = [
  { label: "font-p-1", token: "p1" },
  { label: "font-p-2", token: "p2" },
  { label: "font-p-3", token: "p3" },
  { label: "font-p-4", token: "p4" },
];

const desktopHeadings: FontDefinition[] = [
  { label: "font-desktop-h1", token: "desktopH1" },
  { label: "font-desktop-h2", token: "desktopH2" },
  { label: "font-desktop-h3", token: "desktopH3" },
  { label: "font-desktop-h4", token: "desktopH4" },
];

const mobileHeadings: FontDefinition[] = [
  { label: "font-mobile-d1", token: "mobileD1" },
  { label: "font-mobile-d2", token: "mobileD2" },
  { label: "font-mobile-h1", token: "mobileH1" },
  { label: "font-mobile-h2", token: "mobileH2" },
];

function FontRow({ label, token }: FontDefinition) {
  return (
    <View style={styles.fontRow}>
      <Text style={styles.tokenLabel}>{label}</Text>
      <View>
        {weights.map((weight) => (
          <View key={weight.label} style={styles.weightRow}>
            <Text style={styles.weightLabel}>{weight.label}</Text>
            <Text
              style={[
                styles.sample,
                typography[token],
                { fontWeight: weight.value },
              ]}
            >
              {sampleText}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function FontGroup({
  title,
  definitions,
}: {
  title?: string;
  definitions: FontDefinition[];
}) {
  return (
    <View style={styles.group}>
      {title ? <Text style={styles.heading}>{title}</Text> : null}
      {definitions.map((definition) => (
        <FontRow key={definition.token} {...definition} />
      ))}
    </View>
  );
}

export const UIElements: Story = {
  render: () => <FontGroup definitions={uiElements} />,
};

export const Paragraphs: Story = {
  render: () => <FontGroup definitions={paragraphs} />,
};

export const DesktopHeadings: Story = {
  render: () => <FontGroup definitions={desktopHeadings} />,
};

export const MobileHeadings: Story = {
  render: () => <FontGroup definitions={mobileHeadings} />,
};

export const AllFonts: Story = {
  render: () => (
    <View style={styles.page}>
      <FontGroup title="UI Elements" definitions={uiElements} />
      <FontGroup title="Paragraphs" definitions={paragraphs} />
      <FontGroup title="Desktop Headings" definitions={desktopHeadings} />
      <FontGroup title="Mobile Headings" definitions={mobileHeadings} />
    </View>
  ),
};

const styles = StyleSheet.create({
  page: {
    gap: 40,
  },
  group: {
    gap: 32,
  },
  heading: {
    ...typography.desktopH4,
    borderBottomColor: colors.neutral[200],
    borderBottomWidth: 1,
    color: colors.neutral[500],
    fontFamily: fontFamilies.sans,
    paddingBottom: 4,
  },
  fontRow: {
    gap: 4,
  },
  tokenLabel: {
    ...typography.p4,
    color: colors.neutral[500],
    fontFamily: fontFamilies.sans,
  },
  weightRow: {
    alignItems: "baseline",
    flexDirection: "row",
    gap: 12,
  },
  weightLabel: {
    ...typography.p4,
    color: colors.neutral[400],
    flexShrink: 0,
    fontFamily: fontFamilies.sans,
    width: 80,
  },
  sample: {
    color: colors.neutral[1000],
    fontFamily: fontFamilies.sans,
    flexShrink: 1,
  },
});
