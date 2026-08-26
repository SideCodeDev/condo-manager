import type { Meta, StoryObj } from "@storybook/react-vite";
import { Plus, Trash } from "lucide-react";

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
      <div
        className="p-6 rounded-xl inline-flex"
        style={{
          background: "linear-gradient(90deg, #103CE7 3.99%, #64E9FF 95.74%)",
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof GlassButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const IconOnly: Story = {
  render: (args) => (
    <GlassButton {...args}>
      <Trash aria-hidden="true" />
      <span className="sr-only">Delete</span>
    </GlassButton>
  ),
};

export const TextOnly: Story = {
  render: (args) => <GlassButton {...args}>Delete</GlassButton>,
};

export const IconAndText: Story = {
  render: (args) => (
    <GlassButton {...args}>
      <Plus aria-hidden="true" />
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
    <GlassButton {...args}>
      <Trash aria-hidden="true" />
      <span className="sr-only">Delete</span>
    </GlassButton>
  ),
};
