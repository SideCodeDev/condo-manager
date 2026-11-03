import type { ReactNode } from "react";
import { Modal } from "react-native";
import { Pressable, View } from "react-native-css/components";

export type DropdownPortalProps = {
  children: ReactNode;
  contentStyle?: object;
  container?: Element | null;
  ignoreOutsideClickId?: string;
  shouldIgnoreOutsideClick?: () => boolean;
  isOpen?: boolean;
  onDismiss: () => void;
};

function DropdownPortal({
  children,
  contentStyle,
  onDismiss,
}: DropdownPortalProps) {
  return (
    <Modal
      animationType="none"
      transparent
      visible
      onRequestClose={onDismiss}
    >
      <View className="flex-1">
        <Pressable
          accessibilityLabel="Close dropdown"
          className="absolute inset-0 cursor-default"
          onPress={onDismiss}
        />
        <View style={contentStyle}>{children}</View>
      </View>
    </Modal>
  );
}

export { DropdownPortal };
