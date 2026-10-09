"use client";

import { cn, formatFileSize } from "../lib/utils";
import { X, FileText } from "lucide-react";

export function UploadedFile({
  onRemove,
  file,
  className,
}: {
  file: File;
  className?: string;
  onRemove: () => void;
}) {
  const name = file.name;
  const sizeInBytes = file.size;
  const formattedSize = formatFileSize(sizeInBytes / (1024 * 1024));
  return (
    <div
      className={cn(
        "p-3 items-center flex gap-2 bg-neutral-50 border border-neutral-300 rounded-xl hover:bg-neutral-100 focus-within:bg-neutral-100 transition-colors",
        className,
      )}
    >
      <div className="text-primary bg-neutral-100 border border-neutral-200 grid place-items-center rounded size-10">
        <FileText size={24} />
      </div>
      <div className="grid w-full">
        <span className="font-p-3 text-neutral-1000">{name}</span>
        <span className="font-p-4 text-neutral-700">{formattedSize}</span>
      </div>
      <button
        type="button"
        className="text-neutral-1000"
        onClick={() => onRemove()}
      >
        <X size={20} />
      </button>
    </div>
  );
}
