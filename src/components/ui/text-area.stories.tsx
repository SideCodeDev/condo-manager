import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Mail, Search } from "lucide-react";

import { TextArea } from "./text-area";

const meta = {
  title: "UI/Inputs/TextArea",
  component: TextArea,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["outline", "ghost"],
    },
    resize: {
      control: "select",
      options: ["none", "both", "horizontal", "vertical"],
    },
    disabled: { control: "boolean" },
  },
  args: {
    id: "textarea",
    label: "Label",
    variant: "outline",
    resize: "none",
    disabled: false,
    placeholder: "Placeholder",
  },
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Ghost: Story = {
  args: { variant: "ghost" },
};

export const ResizeVertical: Story = {
  args: { resize: "vertical" },
};

export const ResizeHorizontal: Story = {
  args: { resize: "horizontal" },
};

export const ResizeBoth: Story = {
  args: { resize: "both" },
};

export const WithValue: Story = {
  args: {
    defaultValue:
      "This is a longer text that spans multiple lines.\nLine two here.",
  },
};

export const WithLeadingIcon: Story = {
  args: { leadingIcon: <Mail /> },
};

export const WithTrailingIcon: Story = {
  args: { trailingIcon: <Search /> },
};

export const WithHelper: Story = {
  args: { helper: ["Maximum 500 characters."] },
};

export const WithError: Story = {
  args: { errors: ["This field is required."] },
};

export const WithMultipleErrors: Story = {
  args: {
    errors: ["This field is required.", "Must be at least 20 characters."],
  },
};

export const WithIconAndError: Story = {
  args: {
    leadingIcon: <Mail />,
    errors: ["Invalid input."],
  },
};

export const WithIconAndHelper: Story = {
  args: {
    leadingIcon: <Mail />,
    helper: ["Describe your issue in detail."],
  },
};

export const GhostWithError: Story = {
  args: { variant: "ghost", errors: ["This field is required."] },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const DisabledWithValue: Story = {
  args: { disabled: true, defaultValue: "This content is read-only." },
};
