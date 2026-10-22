import * as React from "react";
import type { DragEvent } from "react";
import * as DocumentPicker from "expo-document-picker";
import { Platform } from "react-native";
import { Pressable, Text, View } from "react-native-css/components";
import { Upload } from "lucide-react-native";

import { type FileMimeType, MimeTypeDescriptions } from "../lib/consts";
import { cn, formatFileSize, getValidFiles } from "../lib/utils";
import { Button } from "./button";

type FileUploadLabels = {
  add?: string;
  dragAndDrop?: string;
  size?: (formattedSize: string) => string;
};

type FileUploadBaseProps = {
  id: string;
  className?: string;
  validTypes?: FileMimeType[] | "*";
  maxFileSizeMB?: number;
  labels?: FileUploadLabels;
};

export type FileUploadProps = FileUploadBaseProps &
  (
    | { type: "multiple"; onFileSelect: (file: FileUploadFile[]) => void }
    | { type: "single"; onFileSelect: (file: FileUploadFile) => void }
  );

export type FileUploadFile =
  | File
  | (Omit<DocumentPicker.DocumentPickerAsset, "size"> & { size: number });

function FileUploadContent({
  addLabel,
  dragAndDropLabel,
  maxFileSizeMB,
  onPick,
  sizeLabel,
  types,
}: {
  addLabel: string;
  dragAndDropLabel: string;
  maxFileSizeMB: number;
  onPick: () => void;
  sizeLabel?: (formattedSize: string) => string;
  types: string[];
}) {
  return (
    <>
      <View className="w-fit shrink-0 items-center gap-3">
        <Upload className="text-neutral-600" size={40} />
        <Text className="font-p-2 text-center text-neutral-600">
          {types.join(", ")}
          {maxFileSizeMB
            ? (sizeLabel?.(formatFileSize(maxFileSizeMB)) ??
              ` up to ${formatFileSize(maxFileSizeMB)}`)
            : null}
        </Text>
      </View>
      <View className="w-fit shrink-0 items-center">
        <Button variant="ghost" onPress={onPick}>
          {addLabel}
        </Button>
        <Text className="font-p-2 text-center text-neutral-600">
          {dragAndDropLabel}
        </Text>
      </View>
    </>
  );
}

function FileUpload({
  id: inputId,
  onFileSelect,
  validTypes = "*",
  maxFileSizeMB = 10,
  type,
  className,
  labels,
}: FileUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleFilesChosen = (files: FileList | null) => {
    const filesArray = getValidFiles(files, validTypes, maxFileSizeMB);
    if (!filesArray.length) return;
    if (type === "single") {
      if (filesArray.length > 1) return;
      onFileSelect(filesArray[0]);
    } else {
      onFileSelect(filesArray);
    }
  };

  const openPicker = () => inputRef.current?.click();
  const openNativePicker = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      multiple: type === "multiple",
      type: validTypes === "*" ? "*/*" : validTypes,
    });

    if (result.canceled) return;

    const validAssets = result.assets
      .filter(
        (asset) =>
          !maxFileSizeMB ||
          asset.size === undefined ||
          asset.size <= maxFileSizeMB * 1024 * 1024,
      )
      .map((asset) => ({ ...asset, size: asset.size ?? 0 }));
    if (!validAssets.length || (type === "single" && validAssets.length > 1)) {
      return;
    }

    if (type === "single") {
      onFileSelect(validAssets[0]);
    } else {
      onFileSelect(validAssets);
    }
  };
  const types =
    validTypes === "*"
      ? []
      : validTypes.map((item) => MimeTypeDescriptions[item]);
  const surfaceClassName = cn(
    "flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6 transition-colors",
    isDragging ? "border-primary bg-primary-100" : "border-neutral-400",
    className,
  );
  const content = (
    <FileUploadContent
      addLabel={labels?.add ?? "Click to add"}
      dragAndDropLabel={labels?.dragAndDrop ?? "or drag the file"}
      maxFileSizeMB={maxFileSizeMB}
      onPick={Platform.OS === "web" ? openPicker : openNativePicker}
      sizeLabel={labels?.size}
      types={types}
    />
  );

  if (Platform.OS === "web") {
    return (
      <div
        className={surfaceClassName}
        onDragEnter={(event: DragEvent<HTMLDivElement>) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(event: DragEvent<HTMLDivElement>) => {
          event.preventDefault();
          if (!event.currentTarget.contains(event.relatedTarget as Node)) {
            setIsDragging(false);
          }
        }}
        onDragOver={(event: DragEvent<HTMLDivElement>) => event.preventDefault()}
        onDrop={(event: DragEvent<HTMLDivElement>) => {
          event.preventDefault();
          setIsDragging(false);
          handleFilesChosen(event.dataTransfer.files);
        }}
      >
        <input
          ref={inputRef}
          accept={validTypes === "*" ? undefined : validTypes.join(",")}
          className="hidden"
          id={inputId}
          multiple={type === "multiple"}
          onChange={(event) => handleFilesChosen(event.target.files)}
          type="file"
        />
        {content}
      </div>
    );
  }

  return (
    <Pressable className={surfaceClassName} onPress={openNativePicker}>
      {content}
    </Pressable>
  );
}

export { FileUpload };
