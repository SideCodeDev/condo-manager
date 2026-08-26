"use client";

import { Ref, useEffect, useRef, useState } from "react";

export function useResponsiveElementSize<T extends HTMLElement>(
  initialRef?: Ref<T>,
  active = true,
) {
  const fallbackRef = useRef<T>(null);
  const [triggerSize, setTriggerSize] = useState({ width: 0, height: 0 });

  const triggerRef = (initialRef as React.RefObject<T>) ?? fallbackRef;

  useEffect(() => {
    if (!active) return;
    const observer = new ResizeObserver((entries) => {
      if (entries && entries.length > 0) {
        const { inlineSize, blockSize } = entries[0].borderBoxSize[0];
        setTriggerSize({ width: inlineSize, height: blockSize });
      }
    });

    if (triggerRef.current) {
      observer.observe(triggerRef.current);
    }

    return () => {
      if (triggerRef.current) {
        observer.unobserve(triggerRef.current);
      }
      observer.disconnect();
    };
  }, [triggerRef.current, active]);
  return {
    width: triggerSize.width,
    height: triggerSize.height,
    ref: triggerRef,
  };
}
