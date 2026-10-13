import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { Mail, Search } from "lucide-react-native";

import { Input } from "./input";

const meta = {
  title: "UI/Inputs/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["outline", "ghost"],
    },
    disabled: { control: "boolean" },
  },
  args: {
    id: "input",
    label: "Label",
    variant: "outline",
    disabled: false,
    placeholder: "Placeholder",
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Ghost: Story = {
  args: { variant: "ghost" },
};

export const WithLeadingIcon: Story = {
  args: { leadingIcon: <Mail /> },
};

export const WithTrailingIcon: Story = {
  args: { trailingIcon: <Search /> },
};

export const WithBothIcons: Story = {
  args: { leadingIcon: <Mail />, trailingIcon: <Search /> },
};

export const WithHelper: Story = {
  args: { helper: ["This is a helper message."] },
};

export const WithError: Story = {
  args: { errors: ["This field is required."] },
};

export const WithMultipleErrors: Story = {
  args: {
    errors: ["This field is required.", "Must be at least 8 characters."],
  },
};

export const WithValue: Story = {
  args: { defaultValue: "user@example.com" },
};

export const WithIconAndError: Story = {
  args: {
    leadingIcon: <Mail />,
    errors: ["Invalid email address."],
  },
};

export const WithIconAndHelper: Story = {
  args: {
    leadingIcon: <Mail />,
    helper: ["We'll never share your email."],
  },
};

export const GhostWithLeadingIcon: Story = {
  args: { variant: "ghost", leadingIcon: <Search /> },
};

export const GhostWithError: Story = {
  args: { variant: "ghost", errors: ["This field is required."] },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const DisabledWithValue: Story = {
  args: { disabled: true, defaultValue: "Readonly value" },
};

export const DisabledWithIcon: Story = {
  args: {
    disabled: true,
    leadingIcon: <Mail />,
    defaultValue: "user@example.com",
  },
};

export const AllVariants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      {(["outline", "ghost"] as const).map((variant) => (
        <Input
          key={variant}
          {...args}
          id={variant}
          label={variant.charAt(0).toUpperCase() + variant.slice(1)}
          variant={variant}
        />
      ))}
    </div>
  ),
};
