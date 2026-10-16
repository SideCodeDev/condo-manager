import type { Meta, StoryObj } from "@storybook/react-native-web-vite";

import { Switch } from "./switch";

const meta = {
  title: "UI/Selectors/Switch",
  component: Switch,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
    checked: { control: "boolean" },
    labelPosition: { control: "select", options: ["left", "right"] },
  },
  args: {
    disabled: false,
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: { checked: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const DisabledChecked: Story = {
  args: { disabled: true, checked: true },
};

export const WithLabel: Story = {
  args: { label: "Notifications" },
};

export const LabelOnLeft: Story = {
  args: { label: "Notifications", labelPosition: "left" },
};

export const AllStates: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Switch {...args} />
      <Switch {...args} checked />
      <Switch {...args} disabled />
      <Switch {...args} disabled checked />
    </div>
  ),
};
