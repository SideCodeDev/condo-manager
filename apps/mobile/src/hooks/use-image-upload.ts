import { useCallback, useState } from "react";
import { api } from "@condo-manager/backend";
import type { FileUploadFile } from "@condo-manager/ui";
import { useMutation } from "convex/react";
import { fetch } from "expo/fetch";
import { File as ExpoFile } from "expo-file-system";
import type { GenericId } from "convex/values";

function parseStorageId(value: unknown): GenericId<"_storage"> {
  if (
    typeof value !== "object" ||
    value === null ||
    !("storageId" in value) ||
    typeof value.storageId !== "string"
  ) {
    throw new Error("Convex returned an invalid storage ID.");
  }

  return value.storageId as GenericId<"_storage">;
}

export function useImageUpload() {
  const generateUploadUrl = useMutation(
    api.modules.assets.mutations.generateUploadUrl,
  );
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = useCallback(
    async (file: FileUploadFile) => {
      let assetFile: File | ExpoFile;
      let mimeType: string | undefined;
      if ("uri" in file) {
        assetFile = new ExpoFile(file.uri);
        mimeType = file.mimeType ?? assetFile.type;
      } else {
        assetFile = file;
        mimeType = file.type;
      }

      if (!mimeType?.startsWith("image/")) {
        throw new Error("The selected file is not an image.");
      }

      setIsUploading(true);
      try {
        const uploadUrl = await generateUploadUrl();
        const response = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": mimeType },
          body: assetFile,
        });

        if (!response.ok) throw new Error("Image upload failed.");
        return parseStorageId(await response.json());
      } finally {
        setIsUploading(false);
      }
    },
    [generateUploadUrl],
  );

  return { uploadImage, isUploading };
}
