import * as React from "react";

export function useImageFallback(
  src: string | null | undefined,
  fallbackSrc: string | null | undefined,
) {
  const [hasError, setHasError] = React.useState(false);
  const [loading, setLoading] = React.useState(Boolean(src));

  React.useEffect(() => {
    setHasError(false);
    setLoading(Boolean(src));
  }, [src]);

  return {
    imgSrc: hasError ? (fallbackSrc ?? undefined) : (src ?? undefined),
    onError: () => setHasError(true),
    onLoad: () => setLoading(false),
    hasError,
    loading,
  };
}
