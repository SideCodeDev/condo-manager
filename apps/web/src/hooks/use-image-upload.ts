import { useCallback, useState } from "react";
import { api } from "@condo-manager/backend";
import type { FileUploadFile } from "@condo-manager/ui";
import { useMutation } from "convex/react";
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
      if (!(file instanceof File)) {
        throw new Error("Web image uploads require a browser File.");
      }
      if (!file.type.startsWith("image/")) {
        throw new Error("The selected file is not an image.");
      }

      setIsUploading(true);
      try {
        const uploadUrl = await generateUploadUrl();
        const response = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
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
