import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { Text, View } from "react-native-css/components";

function TypographyShowcase() {
  return null;
}

const meta = {
  title: "Design Tokens/Typography",
  component: TypographyShowcase,
  tags: ["autodocs"],
  parameters: { controls: { disable: true } },
} satisfies Meta<typeof TypographyShowcase>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleText = "The quick brown fox jumps over the lazy dog";
const typographyTokens = [
  { label: "Display", className: "font-display", size: "64px", lineHeight: "72px" },
  { label: "H1", className: "font-h1", size: "56px", lineHeight: "64px" },
  { label: "H2", className: "font-h2", size: "48px", lineHeight: "56px" },
  { label: "H3", className: "font-h3", size: "40px", lineHeight: "48px" },
  { label: "H4", className: "font-h4", size: "32px", lineHeight: "40px" },
  { label: "H5", className: "font-h5", size: "24px", lineHeight: "32px" },
  { label: "H6", className: "font-h6", size: "20px", lineHeight: "28px" },
  { label: "P1", className: "font-p-1", size: "16px", lineHeight: "24px" },
  { label: "P2", className: "font-p-2", size: "14px", lineHeight: "22px" },
  { label: "P3", className: "font-p-3", size: "12px", lineHeight: "20px" },
] as const;

const weights = [
  { label: "Bold", className: "font-bold" },
  { label: "Medium", className: "font-medium" },
  { label: "Regular", className: "font-normal" },
  { label: "Light", className: "font-light" },
] as const;

function WeightShowcase({ label, className }: (typeof weights)[number]) {
  return (
    <View className="overflow-hidden rounded-lg bg-white">
      <View className="flex-row items-center justify-between bg-neutral-950 px-4 py-6">
        <Text className="font-h5 font-bold text-secondary">DM Sans – {label}</Text>
        <Text className="font-h5 text-secondary">Aa</Text>
      </View>
      <View className="px-4">
        {typographyTokens.map((token) => (
          <View className="gap-2 border-b border-neutral-200 py-3" key={token.label}>
            <View className="flex-row items-center justify-between">
              <Text className="rounded bg-neutral-200 px-2 font-p-3 text-neutral-800">{label} / {token.label}</Text>
              <View className="flex-row gap-6">
                <Text className="font-p-3 text-neutral-700">{token.size}</Text>
                <Text className="font-p-3 text-neutral-700">{token.lineHeight}</Text>
              </View>
            </View>
            <Text className={`${token.className} ${className}`}>{sampleText}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function WeightGroup({ weightsToShow = weights }: { weightsToShow?: typeof weights }) {
  return (
    <View className="gap-6">
      {weightsToShow.map((weight) => <WeightShowcase key={weight.label} {...weight} />)}
    </View>
  );
}

export const Bold: Story = { render: () => <WeightShowcase {...weights[0]} /> };
export const Medium: Story = { render: () => <WeightShowcase {...weights[1]} /> };
export const Regular: Story = { render: () => <WeightShowcase {...weights[2]} /> };
export const Light: Story = { render: () => <WeightShowcase {...weights[3]} /> };
export const AllWeights: Story = { render: () => <WeightGroup /> };
