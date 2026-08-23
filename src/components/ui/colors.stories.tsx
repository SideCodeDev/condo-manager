import type { Meta, StoryObj } from "@storybook/nextjs-vite";

function ColorsShowcase() {
  return <></>;
}

const meta = {
  title: "Design Tokens/Colors",
  component: ColorsShowcase,
  tags: ["autodocs"],
  parameters: {
    controls: { disable: true },
  },
} satisfies Meta<typeof ColorsShowcase>;

export default meta;
type Story = StoryObj<typeof meta>;

function ColorSwatch({ name, hex }: { name: string; hex: string }) {
  return (
    <div className="flex flex-col gap-1 w-24">
      <div
        className="w-full rounded-md border border-neutral-200"
        style={{ background: hex, height: "48px" }}
      />
      <span className="font-p-4 text-neutral-600">{name}</span>
      <span className="font-p-4 text-neutral-400 text-[10px]">{hex}</span>
    </div>
  );
}

function ColorGroup({
  title,
  colors,
}: {
  title: string;
  colors: { name: string; hex: string }[];
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-desktop-h4 text-neutral-500 border-b border-neutral-200 pb-1">
        {title}
      </h2>
      <div className="flex flex-wrap gap-4">
        {colors.map((c) => (
          <ColorSwatch key={c.name} {...c} />
        ))}
      </div>
    </section>
  );
}

const neutral = [
  { name: "neutral-0", hex: "#ffffff" },
  { name: "neutral-50", hex: "#f0f0f0" },
  { name: "neutral-100", hex: "#e2e2e2" },
  { name: "neutral-200", hex: "#cccccc" },
  { name: "neutral-300", hex: "#b3b3b3" },
  { name: "neutral-400", hex: "#999999" },
  { name: "neutral-500", hex: "#767676" },
  { name: "neutral-600", hex: "#5e5e5e" },
  { name: "neutral-700", hex: "#454545" },
  { name: "neutral-800", hex: "#2b2b30" },
  { name: "neutral-900", hex: "#1c1c21" },
  { name: "neutral-950", hex: "#121217" },
  { name: "neutral-1000", hex: "#000000" },
];

const functional = [
  { name: "green", hex: "#10b981" },
  { name: "green-600", hex: "#059669" },
  { name: "green-700", hex: "#059669" },
  { name: "yellow", hex: "#f59e0b" },
  { name: "yellow-600", hex: "#d97706" },
  { name: "yellow-900", hex: "#c84900" },
  { name: "red", hex: "#dc2626" },
  { name: "red-600", hex: "#b91c1c" },
];

const brand = [
  { name: "primary", hex: "#4f46e5" },
  { name: "primary-50", hex: "#eef2ff" },
  { name: "primary-100", hex: "#e0e7ff" },
  { name: "primary-200", hex: "#dcdafa" },
  { name: "primary-600", hex: "#4338ca" },
  { name: "primary-700", hex: "#3730a3" },
  { name: "primary-900", hex: "#312e81" },
  { name: "secondary", hex: "#f59e0b" },
];

export const Neutral: Story = {
  render: () => <ColorGroup title="Neutral" colors={neutral} />,
};

export const Functional: Story = {
  render: () => <ColorGroup title="Functional" colors={functional} />,
};

export const Brand: Story = {
  render: () => <ColorGroup title="Brand" colors={brand} />,
};

export const AllColors: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <ColorGroup title="Neutral" colors={neutral} />
      <ColorGroup title="Functional" colors={functional} />
      <ColorGroup title="Brand" colors={brand} />
    </div>
  ),
};
