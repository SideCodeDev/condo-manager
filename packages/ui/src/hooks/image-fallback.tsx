"use client";

import { useEffect, useState } from "react";

export function useImageFallback(
  src: string | null | undefined,
  fallbackSrc: string | null | undefined,
) {
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setHasError(false);
  }, [src]);
  const onError = () => {
    setHasError(true);
  };
  const onLoad = () => {
    setLoading(false);
  };
  return {
    imgSrc: hasError ? (fallbackSrc ?? undefined) : (src ?? undefined),
    onError,
    hasError,
    onLoad,
    loading,
  };
}
