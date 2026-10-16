import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { Plus, Trash } from "lucide-react-native";
import { View } from "react-native-css/components";

import { GlassButton } from "./glass-button";

const meta = {
  title: "UI/Buttons/GlassButton",
  component: GlassButton,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
    asChild: { table: { disable: true } },
  },
  args: {
    disabled: false,
    loading: false,
  },
  decorators: [
    (Story) => (
      <View className="w-fit grow-0 self-start rounded-xl bg-[linear-gradient(90deg,_#103CE7_3.99%,_#64E9FF_95.74%)] p-6">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof GlassButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const IconOnly: Story = {
  render: (args) => (
    <GlassButton {...args} accessibilityLabel="Delete">
      <Trash />
    </GlassButton>
  ),
};

export const TextOnly: Story = {
  render: (args) => <GlassButton {...args}>Delete</GlassButton>,
};

export const IconAndText: Story = {
  render: (args) => (
    <GlassButton {...args}>
      <Plus />
      Add item
    </GlassButton>
  ),
};

export const Loading: Story = {
  args: { loading: true },
  render: (args) => <GlassButton {...args}>Delete</GlassButton>,
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <GlassButton {...args} accessibilityLabel="Delete">
      <Trash />
    </GlassButton>
  ),
};
