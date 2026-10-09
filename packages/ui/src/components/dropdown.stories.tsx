import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type ComponentProps } from "react";

import { Dropdown } from "./dropdown";

const options = [
  { value: "option-1", label: "Option 1" },
  { value: "option-2", label: "Option 2" },
  { value: "option-3", label: "Option 3" },
];

type DropdownStoryProps = ComponentProps<typeof Dropdown<string>>;

function StatefulDropdown(args: DropdownStoryProps) {
  const [value, setValue] = useState(args.value);

  return (
    <Dropdown
      {...args}
      value={value}
      onChange={(nextValue) => {
        setValue(nextValue);
        args.onChange?.(nextValue);
      }}
    />
  );
}

const meta = {
  title: "UI/Inputs/Dropdown",
  component: Dropdown<string>,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
    search: { control: "boolean" },
    variant: {
      control: "select",
      options: ["outline", "ghost"],
    },
  },
  args: {
    id: "dropdown",
    label: "Label",
    popupLabel: "Select an option",
    options,
    value: "option-1",
    variant: "outline",
    disabled: false,
    search: false,
  },
  render: (args) => <StatefulDropdown {...args} />,
} satisfies Meta<typeof Dropdown<string>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Searchable: Story = {
  args: {
    search: true,
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
  },
};

export const WithHelper: Story = {
  args: {
    helper: ["Choose the option that best fits."],
  },
};

export const WithError: Story = {
  args: {
    errors: ["This field is required."],
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
