import type { Meta, StoryObj } from "@storybook/nextjs-vite";

function TypographyShowcase() {
  return <></>;
}

const meta = {
  title: "UI/Typography",
  component: TypographyShowcase,
  tags: ["autodocs"],
  parameters: {
    controls: { disable: true },
  },
} satisfies Meta<typeof TypographyShowcase>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleText = "The quick brown fox jumps over the lazy dog";

const weights = [
  { label: "Extra Bold", className: "font-extrabold" },
  { label: "Bold", className: "font-bold" },
  { label: "Semi-bold", className: "font-semibold" },
  { label: "Medium", className: "font-medium" },
  { label: "Regular", className: "font-normal" },
  { label: "Light", className: "font-light" },
  { label: "Extra Light", className: "font-extralight" },
] as const;

function FontRow({
  cls,
  labelWidth = "w-28",
}: {
  cls: string;
  labelWidth?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className={`${labelWidth} font-p-4 text-neutral-500`}>{cls}</span>
      <div className="flex flex-col gap-0.5">
        {weights.map(({ label, className }) => (
          <div key={label} className="flex items-baseline gap-3">
            <span className="w-20 shrink-0 font-p-4 text-neutral-400">
              {label}
            </span>
            <span className={`${cls} ${className}`}>{sampleText}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export const UIElements: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {(
        [
          "font-ui-1",
          "font-ui-2",
          "font-ui-3",
          "font-ui-4",
          "font-ui-5",
          "font-ui-6",
          "font-ui-7",
          "font-ui-8",
          "font-ui-9",
          "font-ui-10",
        ] as const
      ).map((cls) => (
        <FontRow key={cls} cls={cls} />
      ))}
    </div>
  ),
};

export const Paragraphs: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {(["font-p-1", "font-p-2", "font-p-3", "font-p-4"] as const).map(
        (cls) => (
          <FontRow key={cls} cls={cls} />
        ),
      )}
    </div>
  ),
};

export const DesktopHeadings: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {(
        [
          "font-desktop-h1",
          "font-desktop-h2",
          "font-desktop-h3",
          "font-desktop-h4",
        ] as const
      ).map((cls) => (
        <FontRow key={cls} cls={cls} labelWidth="w-36" />
      ))}
    </div>
  ),
};

export const MobileHeadings: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {(
        [
          "font-mobile-d1",
          "font-mobile-d2",
          "font-mobile-h1",
          "font-mobile-h2",
        ] as const
      ).map((cls) => (
        <FontRow key={cls} cls={cls} labelWidth="w-36" />
      ))}
    </div>
  ),
};

export const AllFonts: Story = {
  render: () => (
    <div className="flex flex-col gap-10">
      {[
        {
          title: "UI Elements",
          items: [
            "font-ui-1",
            "font-ui-2",
            "font-ui-3",
            "font-ui-4",
            "font-ui-5",
            "font-ui-6",
            "font-ui-7",
            "font-ui-8",
            "font-ui-9",
            "font-ui-10",
          ],
          labelWidth: "w-28",
        },
        {
          title: "Paragraphs",
          items: ["font-p-1", "font-p-2", "font-p-3", "font-p-4"],
          labelWidth: "w-28",
        },
        {
          title: "Desktop Headings",
          items: [
            "font-desktop-h1",
            "font-desktop-h2",
            "font-desktop-h3",
            "font-desktop-h4",
          ],
          labelWidth: "w-36",
        },
        {
          title: "Mobile Headings",
          items: [
            "font-mobile-d1",
            "font-mobile-d2",
            "font-mobile-h1",
            "font-mobile-h2",
          ],
          labelWidth: "w-36",
        },
      ].map(({ title, items, labelWidth }) => (
        <section key={title} className="flex flex-col gap-4">
          <h2 className="font-desktop-h4 text-neutral-500 border-b border-neutral-200 pb-1">
            {title}
          </h2>
          <div className="flex flex-col gap-8">
            {items.map((cls) => (
              <FontRow key={cls} cls={cls} labelWidth={labelWidth} />
            ))}
          </div>
        </section>
      ))}
    </div>
  ),
};
