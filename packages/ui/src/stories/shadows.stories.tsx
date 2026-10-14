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

type ShadowGroupDefinition = {
  title: string;
  description: string;
  levels: readonly string[];
};

const shadowGroups: ShadowGroupDefinition[] = [
  {
    title: "Top",
    description: "When applying this drop shadow to an element like a card, include a border. The shadow alone does not provide sufficient edge definition.",
    levels: ["shadow-top-0", "shadow-top-1", "shadow-top-2", "shadow-top-3", "shadow-top-4"],
  },
  {
    title: "Center",
    description: "This drop shadow does not require a border, but in some cases it might be better to include one.",
    levels: ["shadow-center-0", "shadow-center-1", "shadow-center-2", "shadow-center-3", "shadow-center-4"],
  },
  {
    title: "Bottom",
    description: "When applying this drop shadow to an element like a card, include a border. The shadow alone does not provide sufficient edge definition.",
    levels: ["shadow-bottom-0", "shadow-bottom-1", "shadow-bottom-2", "shadow-bottom-3", "shadow-bottom-4"],
  },
] as const;

function ShadowGroup({ group }: { group: ShadowGroupDefinition }) {
  return (
    <View className="gap-3">
      <View className="gap-1">
        <Text className="font-p-1 font-bold text-neutral-950">{group.title}</Text>
        <Text className="font-p-3 text-neutral-700">{group.description}</Text>
      </View>
      <View className="flex-row flex-wrap gap-3 px-2 py-2">
        {group.levels.map((className, index) => (
          <View className={`h-14 min-w-36 w-36 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white ${className}`} key={className}>
            <Text className="font-p-2 font-bold text-neutral-800">{index}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function ShadowSections({ groups = shadowGroups }: { groups?: ShadowGroupDefinition[] }) {
  return (
    <View className="gap-8 rounded-xl bg-white p-6">
      {groups.map((group) => <ShadowGroup key={group.title} group={group} />)}
    </View>
  );
}

export const AllShadows: Story = { render: () => <ShadowSections /> };
export const Top: Story = { render: () => <ShadowSections groups={[shadowGroups[0]]} /> };
export const Center: Story = { render: () => <ShadowSections groups={[shadowGroups[1]]} /> };
export const Bottom: Story = { render: () => <ShadowSections groups={[shadowGroups[2]]} /> };
