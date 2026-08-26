import type { Meta, StoryObj } from "@storybook/react-vite";
import { Plus } from "lucide-react";

import { FloatingButton } from "./floating-button";

const meta = {
  title: "UI/Buttons/FloatingButton",
  component: FloatingButton,
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
} satisfies Meta<typeof FloatingButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const IconOnly: Story = {
  render: (args) => (
    <FloatingButton {...args}>
      <Plus aria-hidden="true" />
      <span className="sr-only">Add</span>
    </FloatingButton>
  ),
};

export const TextOnly: Story = {
  render: (args) => (
    <FloatingButton {...args} className="px-6">
      Add item
    </FloatingButton>
  ),
};

export const IconAndText: Story = {
  render: (args) => (
    <FloatingButton {...args} className="px-6">
      <Plus aria-hidden="true" />
      Add item
    </FloatingButton>
  ),
};

export const Loading: Story = {
  args: { loading: true },
  render: (args) => <FloatingButton {...args}>Add item</FloatingButton>,
};
