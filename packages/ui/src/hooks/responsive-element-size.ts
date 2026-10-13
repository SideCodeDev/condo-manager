import * as React from "react";
import type { LayoutChangeEvent } from "react-native";

type ElementLike = object;

export function useResponsiveElementSize<T extends ElementLike = ElementLike>(
  initialRef?: React.RefObject<T | null>,
  active = true,
) {
  const fallbackRef = React.useRef<T | null>(null);
  const triggerRef = initialRef ?? fallbackRef;
  const [triggerSize, setTriggerSize] = React.useState({
    width: 0,
    height: 0,
  });

  React.useEffect(() => {
    if (!active || typeof ResizeObserver === "undefined") return;

    const element = triggerRef.current;
    if (typeof Element === "undefined" || !(element instanceof Element)) {
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const box = entry.borderBoxSize?.[0];
      setTriggerSize({
        width: box?.inlineSize ?? entry.contentRect.width,
        height: box?.blockSize ?? entry.contentRect.height,
      });
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [active, triggerRef]);

  const onLayout = React.useCallback(
    (event: LayoutChangeEvent) => {
      if (!active) return;
      setTriggerSize({
        width: event.nativeEvent.layout.width,
        height: event.nativeEvent.layout.height,
      });
    },
    [active],
  );

  return {
    width: triggerSize.width,
    height: triggerSize.height,
    ref: triggerRef,
    onLayout,
  };
}
