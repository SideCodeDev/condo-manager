import type { Meta, StoryObj } from "@storybook/nextjs-vite";

function ShadowsShowcase() {
  return <></>;
}

const meta = {
  title: "Design Tokens/Shadows",
  component: ShadowsShowcase,
  tags: ["autodocs"],
  parameters: {
    controls: { disable: true },
  },
} satisfies Meta<typeof ShadowsShowcase>;

export default meta;
type Story = StoryObj<typeof meta>;

const shadows = [
  { name: "shadow-card", variable: "--shadow-card" },
  { name: "shadow-1", variable: "--shadow-1" },
  { name: "shadow-2", variable: "--shadow-2" },
  { name: "shadow-floating", variable: "--shadow-floating" },
];

function ShadowSwatch({ name, variable }: { name: string; variable: string }) {
  return (
    <div className="flex flex-col gap-3 items-start">
      <div
        className="h-24 w-48 rounded-xl bg-neutral-0"
        style={{ boxShadow: `var(${variable})` }}
      />
      <div className="flex flex-col gap-0.5">
        <span className="font-p-3 font-medium text-neutral-950">{name}</span>
        <span className="font-p-4 text-neutral-400">{variable}</span>
      </div>
    </div>
  );
}

export const AllShadows: Story = {
  render: () => (
    <div className="flex flex-wrap gap-10 p-8 bg-neutral-50 rounded-xl">
      {shadows.map((s) => (
        <ShadowSwatch key={s.variable} {...s} />
      ))}
    </div>
  ),
};

export const Card: Story = {
  render: () => <ShadowSwatch name="shadow-card" variable="--shadow-card" />,
};

export const Shadow1: Story = {
  render: () => <ShadowSwatch name="shadow-1" variable="--shadow-1" />,
};

export const Shadow2: Story = {
  render: () => <ShadowSwatch name="shadow-2" variable="--shadow-2" />,
};

export const Floating: Story = {
  render: () => (
    <ShadowSwatch name="shadow-floating" variable="--shadow-floating" />
  ),
};
