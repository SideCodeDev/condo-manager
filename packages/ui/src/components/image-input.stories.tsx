import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { useState } from "react";

import { ImageInput, type ImageInputProps } from "./image-input";

const meta = {
  title: "UI/Inputs/ImageInput",
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

function StatefulImageInput(args: ImageInputProps) {
  const [value, setValue] = useState<ImageInputProps["value"]>(args.value);

  return <ImageInput {...args} onChange={setValue} value={value} />;
}

export const Empty: Story = {
  render: (args) => <StatefulImageInput {...args} value={null} />,
};

export const WithImage: Story = {
  render: (args) => (
    <StatefulImageInput {...args} value="https://i.pravatar.cc/360" />
  ),
};

export const WithBrokenUrl: Story = {
  render: (args) => (
    <StatefulImageInput
      {...args}
      value="https://broken-url.example.com/image.png"
    />
  ),
};
