import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { Home, Settings } from "lucide-react-native";
import { View } from "react-native-css/components";

import { ListButton } from "./list-button";

const meta = {
  title: "UI/Buttons/ListButton",
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
    <ListButton {...args} accessibilityLabel="Home">
      <Home />
      Home
    </ListButton>
  ),
};

export const StandaloneIconOnly: Story = {
  render: (args) => (
    <ListButton {...args} accessibilityLabel="Home">
      <Home />
    </ListButton>
  ),
};

export const StandaloneTextOnly: Story = {
  render: (args) => <ListButton {...args}>Home</ListButton>,
};

export const Dropdown: Story = {
  args: { variant: "dropdown" },
  render: (args) => (
    <ListButton {...args} accessibilityLabel="Settings">
      <Settings />
      Settings
    </ListButton>
  ),
};

export const DropdownSelected: Story = {
  args: { variant: "dropdown", selected: true },
  render: (args) => (
    <ListButton {...args} accessibilityLabel="Settings">
      <Settings />
      Settings
    </ListButton>
  ),
};

export const DropdownList: Story = {
  args: { variant: "dropdown" },
  render: (args) => (
    <View className="w-48 gap-0">
      <ListButton {...args} selected accessibilityLabel="Home">
        <Home />
        Home
      </ListButton>
      <ListButton {...args} accessibilityLabel="Settings">
        <Settings />
        Settings
      </ListButton>
      <ListButton {...args} disabled accessibilityLabel="Disabled">
        <Settings />
        Disabled
      </ListButton>
    </View>
  ),
};
