import type { ViewProps } from "react-native";
import { Pressable, Text, View } from "react-native-css/components";
import { FileText, X } from "lucide-react-native";

import { cn, formatFileSize } from "../lib/utils";

export type UploadedFileData = {
  name: string;
  size: number;
};

export type UploadedFileProps = Omit<ViewProps, "children"> & {
  file: UploadedFileData;
  className?: string;
  onRemove: () => void;
};

function UploadedFile({
  className,
  file,
  onRemove,
  ...props
}: UploadedFileProps) {
  const formattedSize = formatFileSize(file.size / (1024 * 1024));

  return (
    <View
      {...props}
      className={cn(
        "flex-row items-center gap-2 rounded-xl border border-neutral-300 bg-neutral-50 p-3 transition-colors hover:bg-neutral-100 focus-within:bg-neutral-100",
        className,
      )}
    >
      <View className="h-10 w-10 shrink-0 items-center justify-center rounded border border-neutral-200 bg-neutral-100">
        <FileText className="text-primary" size={24} />
      </View>
      <View className="min-w-0 flex-1 gap-0">
        <Text className="font-p-3 text-black">
          {file.name}
        </Text>
        <Text className="font-p-3 text-neutral-700">{formattedSize}</Text>
      </View>
      <Pressable
        accessibilityLabel={`Remove ${file.name}`}
        accessibilityRole="button"
        className="shrink-0 text-black"
        onPress={onRemove}
      >
        <X className="text-black" size={20} />
      </Pressable>
    </View>
  );
}

export { UploadedFile };
