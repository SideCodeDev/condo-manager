import type { Meta, StoryObj } from "@storybook/react-native-web-vite";

import { Checkbox } from "./checkbox";

const meta = {
  title: "UI/Selectors/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
    checked: { control: "boolean" },
    labelPosition: { control: "select", options: ["left", "right"] },
  },
  args: {
    id: "checkbox",
    disabled: false,
  },
} satisfies Meta<typeof Checkbox>;

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
    id: "checkbox-label",
    label: "Accept terms and conditions",
  },
};

export const LabelOnLeft: Story = {
  args: {
    id: "checkbox-label-left",
    label: "Accept terms and conditions",
    labelPosition: "left",
  },
};

export const CheckedWithLabel: Story = {
  args: {
    id: "checkbox-checked-label",
    label: "Accept terms and conditions",
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
    id: "checkbox-disabled-label",
    label: "Accept terms and conditions",
    disabled: true,
  },
};
