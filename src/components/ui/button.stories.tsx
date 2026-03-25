import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Trash } from "lucide-react";

import { Button } from "./button";

const meta = {
  title: "UI/Buttons/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "link", "ghost"],
    },
    size: {
      control: "select",
      options: ["standard", "sm"],
    },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
    destructive: { control: "boolean" },
    asChild: { table: { disable: true } },
  },
  args: {
    variant: "primary",
    size: "standard",
    disabled: false,
    loading: false,
    destructive: false,
    children: "Button",
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: { variant: "secondary" },
};

export const Link: Story = {
  args: { variant: "link" },
};

export const Ghost: Story = {
  args: { variant: "ghost" },
};

export const Small: Story = {
  args: { size: "sm" },
};

export const SmallSecondary: Story = {
  args: { size: "sm", variant: "secondary" },
};

export const SmallGhost: Story = {
  args: { size: "sm", variant: "ghost" },
};

export const Destructive: Story = {
  args: { destructive: true },
};

export const DestructiveSecondary: Story = {
  args: { variant: "secondary", destructive: true },
};

export const DestructiveLink: Story = {
  args: { variant: "link", destructive: true },
};

export const DestructiveGhost: Story = {
  args: { variant: "ghost", destructive: true },
};

export const WithIcon: Story = {
  render: (args) => (
    <Button {...args}>
      <Trash />
      {args.children}
    </Button>
  ),
};

export const Loading: Story = {
  args: { loading: true },
};

export const LoadingSecondary: Story = {
  args: { variant: "secondary", loading: true },
};

export const LoadingLink: Story = {
  args: { variant: "link", loading: true },
};

export const LoadingDestructive: Story = {
  args: { loading: true, destructive: true },
};

export const AllLoadingStates: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        {(["primary", "secondary", "link", "ghost"] as const).map((variant) => (
          <Button key={variant} {...args} variant={variant} loading>
            {variant.charAt(0).toUpperCase() + variant.slice(1)}
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {(["primary", "secondary", "link", "ghost"] as const).map((variant) => (
          <Button key={variant} {...args} variant={variant} loading destructive>
            {variant.charAt(0).toUpperCase() + variant.slice(1)} Destructive
          </Button>
        ))}
      </div>
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const AllVariants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        {(["primary", "secondary", "link", "ghost"] as const).map((variant) => (
          <Button key={variant} {...args} variant={variant}>
            {variant.charAt(0).toUpperCase() + variant.slice(1)}
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {(["primary", "secondary", "link", "ghost"] as const).map((variant) => (
          <Button key={variant} {...args} variant={variant} destructive>
            {variant.charAt(0).toUpperCase() + variant.slice(1)} Destructive
          </Button>
        ))}
      </div>
    </div>
  ),
};

export const AllSizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      {(["standard", "sm"] as const).map((size) => (
        <div key={size} className="flex flex-wrap items-center gap-3">
          {(["primary", "secondary", "link", "ghost"] as const).map(
            (variant) => (
              <Button key={variant} {...args} size={size} variant={variant}>
                {variant.charAt(0).toUpperCase() + variant.slice(1)}
              </Button>
            ),
          )}
        </div>
      ))}
    </div>
  ),
};
