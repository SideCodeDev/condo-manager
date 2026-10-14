import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { Text, View } from "react-native-css/components";

import { Loader } from "./loader";

const meta = {
  title: "UI/Misc/Loader",
  component: Loader,
  tags: ["autodocs"],
  args: {
    size: 36,
    className: "bg-primary",
  },
  argTypes: {
    size: { control: { min: 12, step: 1, type: "number" } },
    className: { control: "text" },
  },
} satisfies Meta<typeof Loader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <View className="flex-row items-end gap-6">
      {[24, 36, 48].map((size) => (
        <View className="items-center gap-2" key={size}>
          <Loader className="bg-primary" size={size} />
          <Text className="font-p-3 text-neutral-500">{size}px</Text>
        </View>
      ))}
    </View>
  ),
};
