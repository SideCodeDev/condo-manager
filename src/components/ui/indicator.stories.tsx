import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Indicator } from "./indicator";

const meta = {
  title: "UI/Selectors/Indicator",
  component: Indicator,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["checkbox", "radio"],
    },
    checked: { control: "boolean" },
  },
  args: {
    variant: "checkbox",
    checked: false,
  },
} satisfies Meta<typeof Indicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Checkbox: Story = {};

export const CheckboxChecked: Story = {
  args: {
    checked: true,
  },
};

export const Radio: Story = {
  args: {
    variant: "radio",
  },
};

export const RadioChecked: Story = {
  args: {
    variant: "radio",
    checked: true,
  },
};
