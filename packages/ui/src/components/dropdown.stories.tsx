import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { useState, type ReactNode } from "react";

import { Dropdown, type DropdownProps } from "./dropdown";

const options = [
  { value: "option-1", label: "Option 1" },
  { value: "option-2", label: "Option 2" },
  { value: "option-3", label: "Option 3" },
  { value: "option-4", label: "Option 4" },
];
const manyOptions = Array.from({ length: 10 }, (_, index) => ({
  value: `option-${index + 1}`,
  label: `Option ${index + 1}`,
}));

type SingleDropdownStoryProps = Omit<
  DropdownProps<string>,
  "onChange" | "value" | "valueMapper"
> & {
  onChange?: (value: string) => void;
  value: string;
  valueMapper?: (value: string) => ReactNode;
};
type MultiDropdownStoryProps = Omit<
  DropdownProps<string>,
  "onChange" | "value" | "valueMapper"
> & {
  onChange?: (value: string[]) => void;
  value: string[];
  valueMapper?: (value: string[]) => ReactNode;
};

function StatefulDropdown(args: SingleDropdownStoryProps) {
  const [value, setValue] = useState(args.value);

  return (
    <Dropdown
      {...args}
      value={value}
      onChange={(nextValue: string) => {
        setValue(nextValue);
        args.onChange?.(nextValue);
      }}
    />
  );
}

function StatefulMultiDropdown(args: MultiDropdownStoryProps) {
  const [value, setValue] = useState(args.value);

  return (
    <Dropdown
      {...args}
      value={value}
      onChange={(nextValue: string[]) => {
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
    size: {
      control: "select",
      options: ["default", "lg"],
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
  render: (args) =>
    Array.isArray(args.value) ? (
      <StatefulMultiDropdown {...(args as MultiDropdownStoryProps)} />
    ) : (
      <StatefulDropdown {...(args as SingleDropdownStoryProps)} />
    ),
} satisfies Meta<typeof Dropdown<string>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Searchable: Story = {
  args: {
    search: true,
    value: "option-3",
  },
};

export const ManyOptions: Story = {
  args: {
    options: manyOptions,
    value: "option-1",
  },
};

export const SelectedOption: Story = {
  args: {
    value: "option-3",
  },
};

export const NoSelection: Story = {
  args: {
    value: "",
  },
};

export const MultiSelect: Story = {
  args: {
    value: ["option-1", "option-3"],
  },
};

export const MultiSelectSearchable: Story = {
  args: {
    search: true,
    value: ["option-2", "option-4"],
  },
};

export const MultiSelectNoSelection: Story = {
  args: {
    value: [],
  },
};

export const Large: Story = {
  args: {
    size: "lg",
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
