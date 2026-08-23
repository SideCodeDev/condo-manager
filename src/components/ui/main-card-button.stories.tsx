import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Home, Settings, Users } from "lucide-react";

import { MainCardButton } from "./main-card-button";

const meta = {
  title: "UI/Buttons/MainCardButton",
  component: MainCardButton,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
    asChild: { table: { disable: true } },
  },
  args: {
    disabled: false,
  },
} satisfies Meta<typeof MainCardButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <MainCardButton {...args}>
      <Home aria-hidden="true" />
      Home
    </MainCardButton>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <MainCardButton {...args}>
      <Home aria-hidden="true" />
      Home
    </MainCardButton>
  ),
};

export const Grid: Story = {
  render: (args) => (
    <div className="grid grid-cols-3 gap-3 w-96">
      <MainCardButton {...args}>
        <Home aria-hidden="true" />
        Home
      </MainCardButton>
      <MainCardButton {...args}>
        <Users aria-hidden="true" />
        Residents
      </MainCardButton>
      <MainCardButton {...args}>
        <Settings aria-hidden="true" />
        Settings
      </MainCardButton>
    </div>
  ),
};
