import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Home, Settings, User } from "lucide-react";

import { Tabs, TabItem } from "./tabs";

const meta = {
  title: "UI/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["chip", "line", "line-spaced"],
    },
    initialValue: { control: "text" },
  },
  args: {
    variant: "chip",
    initialValue: "tab1",
    children: null,
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Chip: Story = {
  render: (args) => (
    <Tabs {...args}>
      <TabItem value="tab1">Tab 1</TabItem>
      <TabItem value="tab2">Tab 2</TabItem>
      <TabItem value="tab3">Tab 3</TabItem>
    </Tabs>
  ),
};

export const ChipWithIcons: Story = {
  render: (args) => (
    <Tabs {...args}>
      <TabItem value="tab1">
        <Home />
        Home
      </TabItem>
      <TabItem value="tab2">
        <User />
        Profile
      </TabItem>
      <TabItem value="tab3">
        <Settings />
        Settings
      </TabItem>
    </Tabs>
  ),
};

export const ChipIconOnly: Story = {
  render: (args) => (
    <Tabs {...args}>
      <TabItem value="tab1" aria-label="Home">
        <Home />
      </TabItem>
      <TabItem value="tab2" aria-label="Profile">
        <User />
      </TabItem>
      <TabItem value="tab3" aria-label="Settings">
        <Settings />
      </TabItem>
    </Tabs>
  ),
};

export const Line: Story = {
  args: { variant: "line" },
  render: (args) => (
    <Tabs {...args}>
      <TabItem value="tab1">Tab 1</TabItem>
      <TabItem value="tab2">Tab 2</TabItem>
      <TabItem value="tab3">Tab 3</TabItem>
    </Tabs>
  ),
};

export const LineWithIcons: Story = {
  args: { variant: "line" },
  render: (args) => (
    <Tabs {...args}>
      <TabItem value="tab1">
        <Home />
        Home
      </TabItem>
      <TabItem value="tab2">
        <User />
        Profile
      </TabItem>
      <TabItem value="tab3">
        <Settings />
        Settings
      </TabItem>
    </Tabs>
  ),
};

export const LineIconOnly: Story = {
  args: { variant: "line" },
  render: (args) => (
    <Tabs {...args}>
      <TabItem value="tab1" aria-label="Home">
        <Home />
      </TabItem>
      <TabItem value="tab2" aria-label="Profile">
        <User />
      </TabItem>
      <TabItem value="tab3" aria-label="Settings">
        <Settings />
      </TabItem>
    </Tabs>
  ),
};

export const LineSpaced: Story = {
  args: { variant: "line-spaced" },
  render: (args) => (
    <Tabs {...args}>
      <TabItem value="tab1">Tab 1</TabItem>
      <TabItem value="tab2">Tab 2</TabItem>
      <TabItem value="tab3">Tab 3</TabItem>
    </Tabs>
  ),
};

export const LineSpacedWithIcons: Story = {
  args: { variant: "line-spaced" },
  render: (args) => (
    <Tabs {...args}>
      <TabItem value="tab1">
        <Home />
        Home
      </TabItem>
      <TabItem value="tab2">
        <User />
        Profile
      </TabItem>
      <TabItem value="tab3">
        <Settings />
        Settings
      </TabItem>
    </Tabs>
  ),
};

export const LineSpacedIconOnly: Story = {
  args: { variant: "line-spaced" },
  render: (args) => (
    <Tabs {...args}>
      <TabItem value="tab1" aria-label="Home">
        <Home />
      </TabItem>
      <TabItem value="tab2" aria-label="Profile">
        <User />
      </TabItem>
      <TabItem value="tab3" aria-label="Settings">
        <Settings />
      </TabItem>
    </Tabs>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(["chip", "line", "line-spaced", "line-spaced"] as const).map(
        (variant) => (
          <div key={variant} className="flex flex-col gap-2">
            <span className="text-sm font-medium capitalize">{variant}</span>
            <Tabs variant={variant} initialValue="tab1">
              <TabItem value="tab1">
                <Home />
                Home
              </TabItem>
              <TabItem value="tab2">
                <User />
                Profile
              </TabItem>
              <TabItem value="tab3">
                <Settings />
                Settings
              </TabItem>
            </Tabs>
          </div>
        ),
      )}
    </div>
  ),
};
