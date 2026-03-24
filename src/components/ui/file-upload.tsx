import { useI18n } from "@/i18n/client";
import { FileMimeType, MimeTypeDescriptions } from "@/lib/consts";
import { cn, formatFileSize, getValidFiles } from "@/lib/utils";
import { Upload } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "./button";

type FileUploadProps = {
  id: string;
  className?: string;
  validTypes?: FileMimeType[] | "*";
  maxFileSizeMB?: number;
} & (
  | { type: "multiple"; onFileSelect: (file: File[]) => void }
  | { type: "single"; onFileSelect: (file: File) => void }
);
export function FileUpload({
  id: inputId,
  onFileSelect,
  validTypes = "*",
  maxFileSizeMB = 10,
  type,
  className,
}: FileUploadProps) {
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const labelRef = useRef<HTMLLabelElement>(null);
  function handleFilesChosen(files: FileList | null) {
    const filesArray = getValidFiles(files, validTypes, maxFileSizeMB);
    if (!filesArray.length) return;
    if (type === "single") {
      if (filesArray.length > 1) {
        return;
      }
      onFileSelect(filesArray[0]);
    } else {
      onFileSelect(filesArray);
    }
  }
  const types =
    validTypes === "*"
      ? []
      : validTypes.map((type) => MimeTypeDescriptions[type]);
  return (
    <label
      ref={labelRef}
      htmlFor={inputId}
      className={cn(
        "border border-dashed p-6 flex flex-col rounded-lg gap-2 justify-center items-center *:shrink-0 transition-colors",
        isDragging ? "border-primary bg-primary-50" : "border-neutral-400",
        className,
      )}
      onClick={(ev) => {
        ev.preventDefault();
        ev.stopPropagation();
      }}
      onDragEnter={(ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        setIsDragging(true);
      }}
      onDragLeave={(ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        if (!labelRef.current?.contains(ev.relatedTarget as Node)) {
          setIsDragging(false);
        }
      }}
      onDragOver={(ev) => {
        ev.preventDefault();
        ev.stopPropagation();
      }}
      onDrop={(ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        setIsDragging(false);
        const files = ev.dataTransfer.files;
        handleFilesChosen(files);
      }}
    >
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        className="hidden"
        multiple={type === "multiple"}
        accept={validTypes === "*" ? undefined : validTypes.join(",")}
        onChange={(ev) => {
          const files = ev.target.files;
          handleFilesChosen(files);
        }}
      />
      <div className="grid gap-3 place-items-center text-neutral-600 w-fit">
        <Upload size={40} />
        <span className="font-ui-8 text-center">
          {types.join(", ")}
          {maxFileSizeMB
            ? t("common.fileUpload.size", {
                size: formatFileSize(maxFileSizeMB),
              })
            : null}
        </span>
      </div>
      <div className="grid justify-center w-fit">
        <Button
          variant="ghost"
          type="button"
          onClick={() => {
            inputRef.current?.dispatchEvent(
              new MouseEvent("click", { bubbles: true }),
            );
          }}
        >
          {t("common.fileUpload.button")}
        </Button>
        <span className="font-ui-8 text-neutral-600 text-center">
          {t("common.fileUpload.dragAndDrop")}
        </span>
      </div>
    </label>
  );
}
