import * as React from "react";
import { createPortal } from "react-dom";
import { View } from "react-native-css/components";

import type { DropdownPortalProps } from "./dropdown-portal";

function DropdownPortal({
  children,
  contentStyle,
  container,
  ignoreOutsideClickId,
  onDismiss,
}: DropdownPortalProps) {
  const contentRef = React.useRef<React.ElementRef<typeof View>>(null);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onDismiss();
    };
    const handleClick = (event: MouseEvent) => {
      const trigger = ignoreOutsideClickId
        ? document.getElementById(ignoreOutsideClickId)
        : null;
      if (
        event.target instanceof Node &&
        !trigger?.contains(event.target) &&
        !contentRef.current?.contains(event.target)
      ) {
        onDismiss();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleClick);
    };
  }, [ignoreOutsideClickId, onDismiss]);

  return createPortal(
    <View className="fixed inset-0 z-[1000]">
      <View className="absolute inset-0" />
      <View ref={contentRef} style={contentStyle}>
        {children}
      </View>
    </View>,
    container ?? document.body,
  );
}

export { DropdownPortal };
