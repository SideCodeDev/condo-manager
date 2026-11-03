import * as React from "react";
import { createPortal } from "react-dom";
import { View } from "react-native-css/components";

import type { DropdownPortalProps } from "./dropdown-portal";

function DropdownPortal({
  children,
  contentStyle,
  container,
  ignoreOutsideClickId,
  shouldIgnoreOutsideClick,
  isOpen = true,
  onDismiss,
}: DropdownPortalProps) {
  const contentId = React.useId();
  const dismissRef = React.useRef(onDismiss);
  const shouldIgnoreOutsideClickRef = React.useRef(shouldIgnoreOutsideClick);
  dismissRef.current = onDismiss;
  shouldIgnoreOutsideClickRef.current = shouldIgnoreOutsideClick;

  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismissRef.current();
    };
    const handleClick = (event: MouseEvent) => {
      if (shouldIgnoreOutsideClickRef.current?.()) return;

      const clickedInside = event.composedPath().some(
        (target) =>
          target instanceof Element &&
          (target.id === contentId || target.id === ignoreOutsideClickId),
      );
      if (!clickedInside) dismissRef.current();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleClick);
    };
  }, [contentId, ignoreOutsideClickId, isOpen]);

  return createPortal(
    <View
      className="fixed inset-0 z-[1000]"
      pointerEvents={isOpen ? "auto" : "none"}
    >
      <View className="absolute inset-0" />
      <View nativeID={contentId} style={contentStyle}>
        {children}
      </View>
    </View>,
    container ?? document.body,
  );
}

export { DropdownPortal };
