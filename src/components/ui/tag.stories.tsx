import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Home } from "lucide-react";

import { Tag } from "./tag";

const meta = {
  title: "UI/Selectors/Tag",
  component: Tag,
  tags: ["autodocs"],
  argTypes: {
    selected: { control: "boolean" },
  },
  args: {
    selected: false,
    children: "Tag label",
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selected: Story = {
  args: {
    selected: true,
  },
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Home />
        Tag label
      </>
    ),
  },
};

export const SelectedWithIcon: Story = {
  args: {
    selected: true,
    children: (
      <>
        <Home />
        Tag label
      </>
    ),
  },
};
