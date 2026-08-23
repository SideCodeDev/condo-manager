import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SelectorList } from "./selector-list";

const meta = {
  title: "UI/Selectors/SelectorList",
  component: SelectorList,
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
    label: "Option label",
    onChange: () => {},
  },
} satisfies Meta<typeof SelectorList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Checkbox: Story = {};

export const CheckboxChecked: Story = {
  args: {
    checked: true,
  },
};

export const CheckboxWithSubLabel: Story = {
  args: {
    subLabel: "Additional description for this option",
  },
};

export const CheckboxCheckedWithSubLabel: Story = {
  args: {
    checked: true,
    subLabel: "Additional description for this option",
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

export const RadioWithSubLabel: Story = {
  args: {
    variant: "radio",
    subLabel: "Additional description for this option",
  },
};

export const RadioCheckedWithSubLabel: Story = {
  args: {
    variant: "radio",
    checked: true,
    subLabel: "Additional description for this option",
  },
};
