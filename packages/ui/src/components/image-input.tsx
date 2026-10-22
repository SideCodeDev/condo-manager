import * as React from "react";
import * as DocumentPicker from "expo-document-picker";
import { Platform } from "react-native";
import { Image, View } from "react-native-css/components";

import { cn, getValidFiles } from "../lib/utils";
import { useImageFallback } from "../hooks/image-fallback";
import { Button } from "./button";
import { FileUpload, type FileUploadFile } from "./file-upload";
import { InputFeedback } from "./input-feedback";

const imageMimeTypes = ["image/png", "image/jpeg", "image/gif"] as const;

type ImageInputLabels = {
  add?: string;
  dragAndDrop?: string;
  remove?: string;
  replace?: string;
  size?: (formattedSize: string) => string;
};

export type ImageInputProps = {
  id: string;
  value: string | FileUploadFile | null | undefined;
  onChange: (value: FileUploadFile | null) => void;
  className?: string;
  alt: string;
  errors?: string[];
  helper?: string[];
  maxFileSizeMB?: number;
  labels?: ImageInputLabels;
};

function getImageUri(value: ImageInputProps["value"]): string | undefined {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  if ("uri" in value) return value.uri;
  if (typeof File !== "undefined" && value instanceof File) {
    return URL.createObjectURL(value);
  }
  return undefined;
}

function ImageInput({
  alt,
  className,
  errors,
  helper,
  id,
  labels,
  maxFileSizeMB = 10,
  onChange,
  value,
}: ImageInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [imageUri, setImageUri] = React.useState<string>();
  const { hasError, imgSrc, onError } = useImageFallback(imageUri, undefined);

  React.useEffect(() => {
    const uri = getImageUri(value);
    setImageUri(uri);

    if (
      typeof value !== "string" &&
      value &&
      !("uri" in value) &&
      typeof File !== "undefined" &&
      value instanceof File &&
      uri
    ) {
      return () => URL.revokeObjectURL(uri);
    }
  }, [value]);

  const handleWebFiles = (files: FileList | null) => {
    const [file] = getValidFiles(files, [...imageMimeTypes], maxFileSizeMB);
    if (file) onChange(file);
  };

  const pickImage = async () => {
    if (Platform.OS === "web") {
      inputRef.current?.click();
      return;
    }

    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      multiple: false,
      type: [...imageMimeTypes],
    });
    if (result.canceled) return;

    const [asset] = result.assets.filter(
      (item) =>
        imageMimeTypes.includes(
          item.mimeType as (typeof imageMimeTypes)[number],
        ) &&
        (!maxFileSizeMB ||
          item.size === undefined ||
          item.size <= maxFileSizeMB * 1024 * 1024),
    );
    if (asset) onChange({ ...asset, size: asset.size ?? 0 });
  };

  return (
    <InputFeedback errors={errors} helper={helper} errorIcon>
      <View className={cn("size-89.75", className)}>
        {!value ? (
          <FileUpload
            className="size-full"
            id={id}
            labels={labels}
            maxFileSizeMB={maxFileSizeMB}
            onFileSelect={onChange}
            type="single"
            validTypes={[...imageMimeTypes]}
          />
        ) : (
          <View className="group relative isolate size-full overflow-clip rounded border border-neutral-200">
            {Platform.OS === "web" ? (
              <input
                ref={inputRef}
                accept={imageMimeTypes.join(",")}
                aria-hidden
                className="sr-only"
                onChange={(event) => handleWebFiles(event.target.files)}
                type="file"
              />
            ) : null}
            {!hasError && imgSrc ? (
              <Image
                accessibilityLabel={alt}
                className="size-full"
                onError={onError}
                source={{ uri: imgSrc }}
                resizeMode="cover"
              />
            ) : null}
            <View className="absolute inset-0 z-10 flex-col items-center justify-center gap-5 bg-black/80 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
              <Button
                className="min-w-55 bg-white"
                onPress={pickImage}
                variant="secondary"
              >
                {labels?.replace ?? "Change image"}
              </Button>
              <Button
                destructive
                className="min-w-55"
                onPress={() => onChange(null)}
              >
                {labels?.remove ?? "Remove"}
              </Button>
            </View>
          </View>
        )}
      </View>
    </InputFeedback>
  );
}

export { ImageInput };
