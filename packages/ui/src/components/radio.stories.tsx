import type { Meta, StoryObj } from "@storybook/react-vite";

import { Radio } from "./radio";

const meta = {
  title: "UI/Selectors/Radio",
  component: Radio,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
    checked: { control: "boolean" },
  },
  args: {
    id: "radio",
    disabled: false,
  },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const WithLabel: Story = {
  args: {
    id: "radio-label",
    label: "Option A",
  },
};

export const CheckedWithLabel: Story = {
  args: {
    id: "radio-checked-label",
    label: "Option A",
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    checked: true,
  },
};

export const DisabledWithLabel: Story = {
  args: {
    id: "radio-disabled-label",
    label: "Option A",
    disabled: true,
  },
};
