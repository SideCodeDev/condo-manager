import type { Meta, StoryObj } from "@storybook/react-native-web-vite";

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
    disabled: { control: "boolean" },
  },
  args: {
    variant: "checkbox",
    checked: false,
    disabled: false,
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

export const CheckboxDisabled: Story = {
  args: {
    variant: "checkbox",
    checked: false,
    disabled: true,
  },
};

export const CheckboxDisabledChecked: Story = {
  args: {
    variant: "checkbox",
    checked: true,
    disabled: true,
  },
};

export const RadioDisabled: Story = {
  args: {
    variant: "radio",
    checked: false,
    disabled: true,
  },
};

export const RadioDisabledChecked: Story = {
  args: {
    variant: "radio",
    checked: true,
    disabled: true,
  },
};
