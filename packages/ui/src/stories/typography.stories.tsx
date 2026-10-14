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

const weights = [
  { label: "Bold", className: "font-bold" },
  { label: "Medium", className: "font-medium" },
  { label: "Regular", className: "font-normal" },
  { label: "Light", className: "font-light" },
];

type FontDefinition = { label: string; className: string };

const paragraphs: FontDefinition[] = [
  { label: "font-p-1", className: "font-p-1" },
  { label: "font-p-2", className: "font-p-2" },
  { label: "font-p-3", className: "font-p-3" },
];

const semanticHeadings: FontDefinition[] = [
  { label: "font-display", className: "font-display" },
  { label: "font-h1", className: "font-h1" },
  { label: "font-h2", className: "font-h2" },
  { label: "font-h3", className: "font-h3" },
  { label: "font-h4", className: "font-h4" },
  { label: "font-h5", className: "font-h5" },
  { label: "font-h6", className: "font-h6" },
];

function FontRow({ label, className }: FontDefinition) {
  return (
    <View className="gap-1">
      <Text className="font-p-3 text-neutral-600">{label}</Text>
      {weights.map((weight) => (
        <View className="flex-row items-baseline gap-3" key={weight.label}>
          <Text className="w-20 shrink-0 font-p-3 text-neutral-500">
            {weight.label}
          </Text>
          <Text className={`${className} ${weight.className} shrink`}>
            {sampleText}
          </Text>
        </View>
      ))}
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
    <View className="gap-8">
      {title ? (
        <Text className="font-h4 border-b border-neutral-200 pb-1 text-neutral-600">
          {title}
        </Text>
      ) : null}
      {definitions.map((definition) => (
        <FontRow key={definition.label} {...definition} />
      ))}
    </View>
  );
}

export const Paragraphs: Story = {
  render: () => <FontGroup definitions={paragraphs} />,
};

export const SemanticHeadings: Story = {
  render: () => <FontGroup definitions={semanticHeadings} />,
};

export const AllFonts: Story = {
  render: () => (
    <View className="gap-10">
      <FontGroup title="Paragraphs" definitions={paragraphs} />
      <FontGroup title="Semantic Headings" definitions={semanticHeadings} />
    </View>
  ),
};
