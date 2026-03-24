import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Home, Settings } from "lucide-react";

import { ListButton } from "./list-button";

const meta = {
  title: "UI/ListButton",
  component: ListButton,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["standalone", "dropdown"],
    },
    disabled: { control: "boolean" },
    asChild: { table: { disable: true } },
    selected: { table: { disable: true } },
  },
  args: {
    variant: "standalone",
    disabled: false,
  },
} satisfies Meta<typeof ListButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standalone: Story = {
  render: (args) => (
    <ListButton {...args}>
      <Home aria-hidden="true" />
      Home
    </ListButton>
  ),
};

export const StandaloneIconOnly: Story = {
  render: (args) => (
    <ListButton {...args}>
      <Home aria-hidden="true" />
      <span className="sr-only">Home</span>
    </ListButton>
  ),
};

export const StandaloneTextOnly: Story = {
  render: (args) => <ListButton {...args}>Home</ListButton>,
};

export const Dropdown: Story = {
  args: { variant: "dropdown" },
  render: (args) => (
    <ListButton {...args}>
      <Settings aria-hidden="true" />
      Settings
    </ListButton>
  ),
};

export const DropdownSelected: Story = {
  args: { variant: "dropdown", selected: true },
  render: (args) => (
    <ListButton {...args}>
      <Settings aria-hidden="true" />
      Settings
    </ListButton>
  ),
};

export const DropdownList: Story = {
  args: { variant: "dropdown" },
  render: (args) => (
    <div className="flex flex-col w-48">
      <ListButton {...args} selected>
        <Home aria-hidden="true" />
        Home
      </ListButton>
      <ListButton {...args}>
        <Settings aria-hidden="true" />
        Settings
      </ListButton>
      <ListButton {...args} disabled>
        <Settings aria-hidden="true" />
        Disabled
      </ListButton>
    </div>
  ),
};
