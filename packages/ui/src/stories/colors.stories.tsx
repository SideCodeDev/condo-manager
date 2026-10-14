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
  { name: "white", className: "bg-white" },
  { name: "neutral-50", className: "bg-neutral-50" },
  { name: "neutral-100", className: "bg-neutral-100" },
  { name: "neutral-200", className: "bg-neutral-200" },
  { name: "neutral-300", className: "bg-neutral-300" },
  { name: "neutral-400", className: "bg-neutral-400" },
  { name: "neutral-500", className: "bg-neutral-500" },
  { name: "neutral-600", className: "bg-neutral-600" },
  { name: "neutral-700", className: "bg-neutral-700" },
  { name: "neutral-800", className: "bg-neutral-800" },
  { name: "neutral-900", className: "bg-neutral-900" },
  { name: "neutral-950", className: "bg-neutral-950" },
  { name: "black", className: "bg-black" },
];

const brand: Swatch[] = [
  { name: "primary", className: "bg-primary" },
  { name: "primary-500", className: "bg-primary" },
  { name: "primary-100", className: "bg-primary-100" },
  { name: "primary-200", className: "bg-primary-200" },
  { name: "primary-300", className: "bg-primary-300" },
  { name: "primary-400", className: "bg-primary-400" },
  { name: "primary-600", className: "bg-primary-600" },
  { name: "primary-700", className: "bg-primary-700" },
  { name: "primary-800", className: "bg-primary-800" },
  { name: "primary-900", className: "bg-primary-900" },
  { name: "primary-1000", className: "bg-primary-1000" },
  { name: "secondary", className: "bg-secondary" },
  { name: "secondary-500", className: "bg-secondary" },
  { name: "secondary-100", className: "bg-secondary-100" },
  { name: "secondary-200", className: "bg-secondary-200" },
  { name: "secondary-300", className: "bg-secondary-300" },
  { name: "secondary-400", className: "bg-secondary-400" },
  { name: "secondary-600", className: "bg-secondary-600" },
  { name: "secondary-700", className: "bg-secondary-700" },
  { name: "secondary-800", className: "bg-secondary-800" },
  { name: "secondary-900", className: "bg-secondary-900" },
  { name: "secondary-1000", className: "bg-secondary-1000" },
];

const semantic: Swatch[] = [
  { name: "red", className: "bg-red" },
  { name: "red-50", className: "bg-red-50" },
  { name: "red-100", className: "bg-red-100" },
  { name: "red-200", className: "bg-red-200" },
  { name: "red-300", className: "bg-red-300" },
  { name: "red-400", className: "bg-red-400" },
  { name: "red-500", className: "bg-red" },
  { name: "red-600", className: "bg-red-600" },
  { name: "red-700", className: "bg-red-700" },
  { name: "red-800", className: "bg-red-800" },
  { name: "red-900", className: "bg-red-900" },
  { name: "orange", className: "bg-orange" },
  { name: "orange-50", className: "bg-orange-50" },
  { name: "orange-100", className: "bg-orange-100" },
  { name: "orange-200", className: "bg-orange-200" },
  { name: "orange-300", className: "bg-orange-300" },
  { name: "orange-400", className: "bg-orange-400" },
  { name: "orange-500", className: "bg-orange" },
  { name: "orange-600", className: "bg-orange-600" },
  { name: "orange-700", className: "bg-orange-700" },
  { name: "orange-800", className: "bg-orange-800" },
  { name: "orange-900", className: "bg-orange-900" },
  { name: "green", className: "bg-green" },
  { name: "green-50", className: "bg-green-50" },
  { name: "green-100", className: "bg-green-100" },
  { name: "green-200", className: "bg-green-200" },
  { name: "green-300", className: "bg-green-300" },
  { name: "green-400", className: "bg-green-400" },
  { name: "green-500", className: "bg-green" },
  { name: "green-600", className: "bg-green-600" },
  { name: "green-700", className: "bg-green-700" },
  { name: "green-800", className: "bg-green-800" },
  { name: "green-900", className: "bg-green-900" },
];

function ColorSwatch({ name, className }: Swatch) {
  return (
    <View className="w-24 gap-1">
      <View
        accessibilityLabel={name}
        className={`h-12 w-full rounded-md border border-neutral-200 ${className}`}
      />
      <Text className="font-p-3 text-neutral-700">{name}</Text>
      <Text className="font-p-3 text-neutral-500">{className}</Text>
    </View>
  );
}

function ColorGroup({ title, swatches }: { title: string; swatches: Swatch[] }) {
  return (
    <View className="gap-3">
      <Text className="font-h4 border-b border-neutral-200 pb-1 text-neutral-600">
        {title}
      </Text>
      <View className="flex-row flex-wrap gap-4">
        {swatches.map((swatch) => (
          <ColorSwatch key={swatch.name} {...swatch} />
        ))}
      </View>
    </View>
  );
}

function AllColorGroups() {
  return (
    <View className="gap-8">
      <ColorGroup title="Neutral" swatches={neutral} />
      <ColorGroup title="Brand" swatches={brand} />
      <ColorGroup title="Semantic" swatches={semantic} />
    </View>
  );
}

export const Neutral: Story = {
  render: () => <ColorGroup title="Neutral" swatches={neutral} />,
};

export const Brand: Story = {
  render: () => <ColorGroup title="Brand" swatches={brand} />,
};

export const Semantic: Story = {
  render: () => <ColorGroup title="Semantic" swatches={semantic} />,
};

export const AllColors: Story = { render: () => <AllColorGroups /> };
