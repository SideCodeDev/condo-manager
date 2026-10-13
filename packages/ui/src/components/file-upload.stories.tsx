import type { Meta, StoryObj } from "@storybook/react-native-web-vite";

import { FileUpload, type FileUploadFile } from "./file-upload";

const meta = {
  title: "UI/Uploaded Files/FileUpload",
  component: FileUpload,
  tags: ["autodocs"],
  argTypes: {
    type: { control: "select", options: ["single", "multiple"] },
    maxFileSizeMB: { control: "number" },
  },
  args: {
    id: "file-upload",
    type: "single",
    maxFileSizeMB: 10,
    onFileSelect: (file: FileUploadFile | FileUploadFile[]) =>
      alert(
        Array.isArray(file)
          ? `Selected ${file.length} file(s): ${file.map((item) => item.name).join(", ")}`
          : `Selected: ${file.name}`,
      ),
  },
} satisfies Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Multiple: Story = { args: { type: "multiple" } };
export const ImagesOnly: Story = {
  args: { validTypes: ["image/png", "image/jpeg", "image/webp", "image/gif"] },
};
export const PDFOnly: Story = { args: { validTypes: ["application/pdf"] } };
export const DocumentTypes: Story = {
  args: {
    validTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ],
  },
};
export const SmallSizeLimit: Story = { args: { maxFileSizeMB: 2 } };
export const LargeSizeLimit: Story = { args: { maxFileSizeMB: 50 } };
export const MultipleImages: Story = {
  args: {
    type: "multiple",
    validTypes: ["image/png", "image/jpeg", "image/webp"],
    maxFileSizeMB: 5,
  },
};
