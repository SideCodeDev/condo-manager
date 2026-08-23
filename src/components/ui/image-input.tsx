/* eslint-disable @next/next/no-img-element */
import { useImageFallback } from "@/hooks/image-fallback";
import { cn, getValidFiles } from "@/lib/utils";
import { If } from "../if";
import { FileMimeType } from "@/lib/consts";
import { FileUpload } from "./file-upload";
import { useI18n } from "@/i18n/client";
import { Button } from "./button";
import { useRef } from "react";

const mimesForImageInput: FileMimeType[] = [
  "image/png",
  "image/jpeg",
  "image/gif",
];

type ImageInputProps = {
  id: string;
  value: string | File | null | undefined;
  onChange: (v: File | null) => void;
  className?: string;
  alt: string;
  maxFileSizeMB?: number;
};
export function ImageInput({
  className,
  value,
  alt,
  id,
  maxFileSizeMB = 10,
  onChange,
}: ImageInputProps) {
  const { t } = useI18n();
  const valueAsSrc = !value
    ? undefined
    : typeof value === "string"
      ? value
      : URL.createObjectURL(value);
  const { hasError, imgSrc, onError } = useImageFallback(valueAsSrc, undefined);
  const fileUploadRef = useRef<HTMLInputElement>(null);
  return (
    <div className={cn("size-89.75", className)}>
      <If condition={!value}>
        <FileUpload
          className="size-full"
          type="single"
          id={id}
          maxFileSizeMB={maxFileSizeMB}
          validTypes={mimesForImageInput}
          onFileSelect={onChange}
        />
      </If>
      <If condition={!!value}>
        <div
          className={cn(
            "relative isolate group size-full rounded border border-neutral-200 overflow-clip",
            className,
          )}
        >
          <input
            ref={fileUploadRef}
            aria-hidden
            className="sr-only w-full z-20 inset-0 absolute"
            type="file"
            accept={mimesForImageInput.join(",")}
            onChange={(ev) => {
              const files = ev.target.files;
              const [newFile] = getValidFiles(
                files,
                mimesForImageInput,
                maxFileSizeMB,
              );
              if (!newFile) return;
              onChange(newFile);
            }}
          />
          <If condition={!hasError && !!imgSrc}>
            <img
              data-error={hasError}
              src={imgSrc}
              alt={alt}
              className="size-full object-fill"
              onError={onError}
            />
          </If>
          <div className="absolute  -inset-2 bg-neutral-1000/80 z-10 opacity-0 focus:opacity-100 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-5 *:shrink-0 *:min-w-55">
            <Button
              variant="secondary"
              className="bg-neutral-0"
              type="button"
              onClick={() => fileUploadRef.current?.click()}
            >
              {t("common.imageUpload.replace")}
            </Button>
            <Button
              destructive
              type="button"
              onClick={() => {
                onChange(null);
              }}
            >
              {t("common.imageUpload.remove")}
            </Button>
          </div>
        </div>
      </If>
    </div>
  );
}
