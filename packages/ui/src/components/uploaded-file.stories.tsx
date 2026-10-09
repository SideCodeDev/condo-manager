import type { Meta, StoryObj } from "@storybook/react-vite";

import { UploadedFile } from "./uploaded-file";

const pdfFile = new File(["content"], "document.pdf", {
  type: "application/pdf",
});
Object.defineProperty(pdfFile, "size", { value: 2.4 * 1024 * 1024 });

const imageFile = new File(["content"], "photo.png", { type: "image/png" });
Object.defineProperty(imageFile, "size", { value: 512 * 1024 });

const longNameFile = new File(
  ["content"],
  "very-long-document-name-that-might-overflow-the-container.docx",
  {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  },
);
Object.defineProperty(longNameFile, "size", { value: 1.1 * 1024 * 1024 });

const meta = {
  title: "UI/Uploaded Files/UploadedFile",
  component: UploadedFile,
  tags: ["autodocs"],
  args: {
    file: pdfFile,
    onRemove: () => alert("Remove clicked"),
  },
} satisfies Meta<typeof UploadedFile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Image: Story = {
  args: {
    file: imageFile,
  },
};

export const LongFileName: Story = {
  args: {
    file: longNameFile,
  },
};
