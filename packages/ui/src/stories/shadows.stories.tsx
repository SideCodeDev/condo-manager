import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { Text, View } from "react-native-css/components";

function ShadowsShowcase() {
  return null;
}

const meta = {
  title: "Design Tokens/Shadows",
  component: ShadowsShowcase,
  tags: ["autodocs"],
  parameters: { controls: { disable: true } },
} satisfies Meta<typeof ShadowsShowcase>;

export default meta;
type Story = StoryObj<typeof meta>;

type ShadowToken = { name: string; className: string };

const topShadows: ShadowToken[] = [
  { name: "shadow-top-0", className: "shadow-top-0" },
  { name: "shadow-top-1", className: "shadow-top-1" },
  { name: "shadow-top-2", className: "shadow-top-2" },
  { name: "shadow-top-3", className: "shadow-top-3" },
  { name: "shadow-top-4", className: "shadow-top-4" },
];

const centerShadows: ShadowToken[] = [
  { name: "shadow-center-0", className: "shadow-center-0" },
  { name: "shadow-center-1", className: "shadow-center-1" },
  { name: "shadow-center-2", className: "shadow-center-2" },
  { name: "shadow-center-3", className: "shadow-center-3" },
  { name: "shadow-center-4", className: "shadow-center-4" },
];

const bottomShadows: ShadowToken[] = [
  { name: "shadow-bottom-0", className: "shadow-bottom-0" },
  { name: "shadow-bottom-1", className: "shadow-bottom-1" },
  { name: "shadow-bottom-2", className: "shadow-bottom-2" },
  { name: "shadow-bottom-3", className: "shadow-bottom-3" },
  { name: "shadow-bottom-4", className: "shadow-bottom-4" },
];

const glassShadows: ShadowToken[] = [
  { name: "shadow-glass", className: "shadow-glass" },
  { name: "shadow-glass-focus", className: "shadow-glass-focus" },
];

function ShadowSwatch({
  name,
  className,
  surfaceClassName = "bg-white",
}: ShadowToken & { surfaceClassName?: string }) {
  return (
    <View className="w-48 items-start gap-3 p-8">
      <View className={`h-24 w-48 rounded-xl ${surfaceClassName} ${className}`} />
      <View>
        <Text className="font-p-3 font-medium text-neutral-950">{name}</Text>
        <Text className="font-p-3 text-neutral-500">{className}</Text>
      </View>
    </View>
  );
}

function ShadowGroup({ title, tokens }: { title: string; tokens: ShadowToken[] }) {
  return (
    <View className="gap-4">
      <Text className="font-h4 text-neutral-950">{title}</Text>
      <View className="flex-row flex-wrap gap-4">
        {tokens.map((token) => (
          <ShadowSwatch key={token.name} {...token} />
        ))}
      </View>
    </View>
  );
}

export const AllShadows: Story = {
  render: () => (
    <View className="gap-10 rounded-xl bg-neutral-50 p-8">
      <ShadowGroup title="Top" tokens={topShadows} />
      <ShadowGroup title="Center" tokens={centerShadows} />
      <ShadowGroup title="Bottom" tokens={bottomShadows} />
      <View className="gap-4">
        <Text className="font-h4 text-neutral-950">Glass</Text>
        <View className="flex-row flex-wrap gap-4">
          <ShadowSwatch
            {...glassShadows[0]}
            surfaceClassName="bg-neutral-900"
          />
          <ShadowSwatch
            {...glassShadows[1]}
            surfaceClassName="bg-neutral-100"
          />
        </View>
      </View>
    </View>
  ),
};

export const Top: Story = {
  render: () => <ShadowGroup title="Top" tokens={topShadows} />,
};

export const Center: Story = {
  render: () => <ShadowGroup title="Center" tokens={centerShadows} />,
};

export const Bottom: Story = {
  render: () => <ShadowGroup title="Bottom" tokens={bottomShadows} />,
};

export const Glass: Story = {
  render: () => (
    <View className="flex-row flex-wrap gap-4">
      <ShadowSwatch {...glassShadows[0]} surfaceClassName="bg-neutral-900" />
      <ShadowSwatch {...glassShadows[1]} surfaceClassName="bg-neutral-100" />
    </View>
  ),
};
