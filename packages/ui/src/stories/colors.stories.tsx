import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { Text, View } from "react-native-css/components";

function ColorsShowcase() {
  return null;
}

const meta = {
  title: "Design Tokens/Colors",
  component: ColorsShowcase,
  tags: ["autodocs"],
  parameters: { controls: { disable: true } },
} satisfies Meta<typeof ColorsShowcase>;

export default meta;
type Story = StoryObj<typeof meta>;

type Swatch = { name: string; className: string };
const neutral: Swatch[] = [
  { name: "black", className: "bg-black" },
  { name: "neutral-950", className: "bg-neutral-950" },
  { name: "neutral-900", className: "bg-neutral-900" },
  { name: "neutral-800", className: "bg-neutral-800" },
  { name: "neutral-700", className: "bg-neutral-700" },
  { name: "neutral-600", className: "bg-neutral-600" },
  { name: "neutral-500", className: "bg-neutral-500" },
  { name: "neutral-400", className: "bg-neutral-400" },
  { name: "neutral-300", className: "bg-neutral-300" },
  { name: "neutral-200", className: "bg-neutral-200" },
  { name: "neutral-100", className: "bg-neutral-100" },
  { name: "neutral-50", className: "bg-neutral-50" },
  { name: "white", className: "bg-white" },
];

const palettes = [
  { name: "Primary", swatches: [
    { name: "Primary-1000", className: "bg-primary-1000" }, { name: "Primary-900", className: "bg-primary-900" },
    { name: "Primary-800", className: "bg-primary-800" }, { name: "Primary-700", className: "bg-primary-700" },
    { name: "Primary-600", className: "bg-primary-600" }, { name: "Primary-500", className: "bg-primary" },
    { name: "Primary-400", className: "bg-primary-400" }, { name: "Primary-300", className: "bg-primary-300" },
    { name: "Primary-200", className: "bg-primary-200" }, { name: "Primary-100", className: "bg-primary-100" },
  ] },
  { name: "Secondary", swatches: [
    { name: "Secondary-1000", className: "bg-secondary-1000" }, { name: "Secondary-900", className: "bg-secondary-900" },
    { name: "Secondary-800", className: "bg-secondary-800" }, { name: "Secondary-700", className: "bg-secondary-700" },
    { name: "Secondary-600", className: "bg-secondary-600" }, { name: "Secondary-500", className: "bg-secondary" },
    { name: "Secondary-400", className: "bg-secondary-400" }, { name: "Secondary-300", className: "bg-secondary-300" },
    { name: "Secondary-200", className: "bg-secondary-200" }, { name: "Secondary-100", className: "bg-secondary-100" },
  ] },
];

const otherPalettes = [
  { name: "Red", swatches: [
    { name: "Red-900", className: "bg-red-900" }, { name: "Red-800", className: "bg-red-800" }, { name: "Red-700", className: "bg-red-700" },
    { name: "Red-600", className: "bg-red-600" }, { name: "Red-500", className: "bg-red" }, { name: "Red-400", className: "bg-red-400" },
    { name: "Red-300", className: "bg-red-300" }, { name: "Red-200", className: "bg-red-200" }, { name: "Red-100", className: "bg-red-100" }, { name: "Red-50", className: "bg-red-50" },
  ] },
  { name: "Orange", swatches: [
    { name: "Orange-900", className: "bg-orange-900" }, { name: "Orange-800", className: "bg-orange-800" }, { name: "Orange-700", className: "bg-orange-700" },
    { name: "Orange-600", className: "bg-orange-600" }, { name: "Orange-500", className: "bg-orange" }, { name: "Orange-400", className: "bg-orange-400" },
    { name: "Orange-300", className: "bg-orange-300" }, { name: "Orange-200", className: "bg-orange-200" }, { name: "Orange-100", className: "bg-orange-100" }, { name: "Orange-50", className: "bg-orange-50" },
  ] },
  { name: "Green", swatches: [
    { name: "Green-900", className: "bg-green-900" }, { name: "Green-800", className: "bg-green-800" }, { name: "Green-700", className: "bg-green-700" },
    { name: "Green-600", className: "bg-green-600" }, { name: "Green-500", className: "bg-green" }, { name: "Green-400", className: "bg-green-400" },
    { name: "Green-300", className: "bg-green-300" }, { name: "Green-200", className: "bg-green-200" }, { name: "Green-100", className: "bg-green-100" }, { name: "Green-50", className: "bg-green-50" },
  ] },
];

function ColorSwatch({ name, className }: Swatch) {
  return (
    <View className="w-24 gap-1">
      <View accessibilityLabel={name} className={`h-12 w-full rounded-md border border-neutral-200 ${className}`} />
      <Text className="font-p-3 text-neutral-700">{name}</Text>
      <Text className="font-p-3 text-neutral-500">{className}</Text>
    </View>
  );
}

function ColorGroup({ title, swatches }: { title: string; swatches: Swatch[] }) {
  return (
    <View className="gap-3 rounded-lg bg-white p-4">
      <Text className="font-h5 text-neutral-950">{title}</Text>
      <View className="flex-row flex-wrap gap-4">
        {swatches.map((swatch) => <ColorSwatch key={swatch.name} {...swatch} />)}
      </View>
    </View>
  );
}

function PaletteGroup({ title, groups }: { title: string; groups: { name: string; swatches: Swatch[] }[] }) {
  return (
    <View className="gap-4">
      <Text className="font-h4 text-neutral-950">{title}</Text>
      {groups.map((palette) => <ColorGroup key={palette.name} title={palette.name} swatches={palette.swatches} />)}
    </View>
  );
}

export const Neutral: Story = { render: () => <ColorGroup title="Neutral" swatches={neutral} /> };
export const Brand: Story = { render: () => <PaletteGroup title="Brand" groups={palettes} /> };
export const Other: Story = { render: () => <PaletteGroup title="Other" groups={otherPalettes} /> };
export const AllColors: Story = {
  render: () => (
    <View className="gap-8 bg-neutral-50 p-4">
      <ColorGroup title="Neutral" swatches={neutral} />
      <PaletteGroup title="Brand" groups={palettes} />
      <PaletteGroup title="Other" groups={otherPalettes} />
    </View>
  ),
};
