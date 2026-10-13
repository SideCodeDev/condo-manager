import * as React from "react";
import { createPortal } from "react-dom";
import { Pressable, View } from "react-native-css/components";

import type { DropdownPortalProps } from "./dropdown-portal";

function DropdownPortal({
  children,
  contentStyle,
  container,
  onDismiss,
}: DropdownPortalProps) {
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onDismiss();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onDismiss]);

  return createPortal(
    <View className="fixed inset-0 z-[1000]">
      <Pressable
        accessibilityLabel="Close dropdown"
        className="absolute inset-0 cursor-default"
        onPress={onDismiss}
      />
      <View style={contentStyle}>{children}</View>
    </View>,
    container ?? document.body,
  );
}

export { DropdownPortal };
