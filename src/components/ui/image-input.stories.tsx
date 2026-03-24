import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { ImageInput } from "./image-input";

const meta = {
  title: "UI/ImageInput",
  component: ImageInput,
  tags: ["autodocs"],
  args: {
    id: "image-input",
    alt: "Profile image",
    onChange: () => {},
    value: null,
  },
} satisfies Meta<typeof ImageInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | File | null>(null);
    return (
      <ImageInput
        {...args}
        value={value}
        onChange={(file) => {
          if (file) alert(`File selected: ${file.name}`);
          setValue(file);
        }}
      />
    );
  },
};

export const WithImage: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | File | null>(
      "https://i.pravatar.cc/360",
    );
    return (
      <ImageInput
        {...args}
        value={value}
        onChange={(file) => {
          if (file) alert(`File changed: ${file.name}`);
          setValue(file);
        }}
      />
    );
  },
};

export const WithBrokenUrl: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | File | null>(
      "https://broken-url.example.com/image.png",
    );
    return (
      <ImageInput
        {...args}
        value={value}
        onChange={(file) => {
          if (file) alert(`File changed: ${file.name}`);
          setValue(file);
        }}
      />
    );
  },
};
