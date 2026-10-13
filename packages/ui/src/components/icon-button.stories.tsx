import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { Trash } from "lucide-react-native";

import { IconButton } from "./icon-button";

const meta = {
  title: "UI/Buttons/IconButton",
  component: IconButton,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["round", "square"],
    },
    size: {
      control: "select",
      options: ["large", "small"],
    },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
    asChild: { table: { disable: true } },
  },
  args: {
    variant: "round",
    size: "large",
    disabled: false,
    loading: false,
  },
  render: (args) => (
    <IconButton {...args} accessibilityLabel="Delete">
      <Trash />
    </IconButton>
  ),
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Round: Story = {};

export const Square: Story = {
  args: { variant: "square" },
};

export const Small: Story = {
  args: { size: "small" },
};

export const SmallSquare: Story = {
  args: { size: "small", variant: "square" },
};

export const Loading: Story = {
  args: { loading: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};
